import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/marathonAuth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get current user
    const user = await prisma.user_Z.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all distributors with their total payments
    const distributorScores = await prisma.paymentRequest_Z.groupBy({
      by: ['distributorId'],
      _sum: {
        totalAmount: true
      },
      orderBy: {
        _sum: {
          totalAmount: 'desc'
        }
      }
    });

    // Get distributor details and category-wise breakdown
    const enrichedScores = await Promise.all(
      distributorScores.map(async (score) => {
        const distributor = await prisma.user_Z.findUnique({
          where: { id: score.distributorId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        });

        // Get all payment requests for this distributor
        const paymentRequests = await prisma.paymentRequest_Z.findMany({
          where: {
            distributorId: score.distributorId,
            status: 'VERIFIED'
          },
          select: {
            items: true,
          }
        });

        // Get all book IDs from the items
        const bookIds = new Set();
        paymentRequests.forEach(request => {
          const items = request.items as any[];
          items.forEach(item => bookIds.add(item.bookId));
        });

        // Get books with their categories
        const books = await prisma.book_Z.findMany({
          where: {
            id: {
              in: Array.from(bookIds) as string[]
            }
          },
          select: {
            id: true,
            category: true
          }
        });

        // Create a map of bookId to category
        const bookCategories = new Map(books.map(book => [book.id, book.category]));

        // Calculate category-wise breakdown
        const categoryAmounts = new Map<string, number>();
        paymentRequests.forEach(request => {
          const items = request.items as any[];
          items.forEach(item => {
            const category = bookCategories.get(item.bookId) || 'Unknown';
            const amount = (item.price * item.quantity) || 0;
            categoryAmounts.set(
              category, 
              (categoryAmounts.get(category) || 0) + amount
            );
          });
        });

        const categoryBreakdown = Array.from(categoryAmounts.entries()).map(([category, amount]) => ({
          bookCategory: category,
          _sum: { amount }
        }));

        // Get yesterday's payments
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterdayRequests = await prisma.paymentRequest_Z.findMany({
          where: {
            distributorId: score.distributorId,
            status: 'VERIFIED',
            createdAt: {
              gte: yesterday,
              lt: today
            }
          },
          select: {
            items: true,
          }
        });

        // Calculate yesterday's category-wise breakdown
        const yesterdayCategoryAmounts = new Map<string, number>();
        yesterdayRequests.forEach(request => {
          const items = request.items as any[];
          items.forEach(item => {
            const category = bookCategories.get(item.bookId) || 'Unknown';
            const amount = (item.price * item.quantity) || 0;
            yesterdayCategoryAmounts.set(
              category,
              (yesterdayCategoryAmounts.get(category) || 0) + amount
            );
          });
        });

        const yesterdayPayments = Array.from(yesterdayCategoryAmounts.entries()).map(([category, amount]) => ({
          bookCategory: category,
          _sum: { amount }
        }));

        const totalYesterdayAmount = yesterdayPayments.reduce(
          (acc, curr) => acc + (curr._sum.amount || 0),
          0
        );

        return {
          distributor,
          totalScore: score._sum.totalAmount || 0,
          categoryBreakdown: categoryBreakdown.map(cat => ({
            category: cat.bookCategory,
            amount: cat._sum.amount || 0
          })),
          yesterdayPayments: {
            total: totalYesterdayAmount,
            breakdown: yesterdayPayments.map(pay => ({
              category: pay.bookCategory,
              amount: pay._sum.amount || 0
            }))
          }
        };
      })
    );

    return NextResponse.json(enrichedScores);
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}