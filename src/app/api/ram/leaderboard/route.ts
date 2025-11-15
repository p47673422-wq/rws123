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

    // Parse date range from query params
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate = new Date();
    let endDate = new Date();

    if (startDateParam) {
      startDate = new Date(startDateParam);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // default: last 30 days
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // default: today
      endDate.setHours(23, 59, 59, 999);
    }

    // Get current user
    const user = await prisma.user_Z.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all distributors with their total payments (VERIFIED only, within date range)
    const distributorScores = await prisma.paymentRequest_Z.groupBy({
      by: ['distributorId'],
      where: {
        status: 'VERIFIED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
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
    const leaderboard = await Promise.all(
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

        // Get all payment requests for this distributor (VERIFIED, within date range)
        const paymentRequests = await prisma.paymentRequest_Z.findMany({
          where: {
            distributorId: score.distributorId,
            status: 'VERIFIED',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
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

        // Get books with their categories, names, and languages
        const books = await prisma.book_Z.findMany({
          where: {
            id: {
              in: Array.from(bookIds) as string[]
            }
          },
          select: {
            id: true,
            category: true,
            name: true,
            language: true
          }
        });

        // Create a map of bookId to book details
        const bookMap = new Map(books.map(book => [book.id, book]));

        // Calculate category-wise breakdown with book details
        const categoryMap = new Map<string, { items: any[], totalAmount: number }>();
        paymentRequests.forEach(request => {
          const items = request.items as any[];
          items.forEach(item => {
            const book = bookMap.get(item.bookId);
            const category = book?.category || 'Unknown';
            const amount = (item.price * item.quantity) || 0;

            if (!categoryMap.has(category)) {
              categoryMap.set(category, { items: [], totalAmount: 0 });
            }
            const cat = categoryMap.get(category)!;
            cat.items.push({
              bookId: item.bookId,
              title: book?.name || 'Unknown',
              language: book?.language || 'Unknown',
              quantity: item.quantity,
              price: item.price
            });
            cat.totalAmount += amount;
          });
        });

        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          amount: data.totalAmount,
          books: data.items
        }));

        return {
          distributor,
          totalScore: Number(score._sum.totalAmount || 0),
          categoryBreakdown
        };
      })
    );

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}