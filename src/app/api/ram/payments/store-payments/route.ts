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

    if (!['VEC_STORE_OWNER', 'STORE_OWNER'].includes(user.userType)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all users of the same store type
    const usersOfSameType = await prisma.user_Z.findMany({
      where: { userType: user.userType },
      select: { id: true },
    });

    const userIds = usersOfSameType.map(u => u.id);

    // Get payment requests for all users of the same type
    const payments = await prisma.paymentRequest_Z.findMany({
      where: {
        distributorId: { in: userIds },
      },
      include: {
        distributor: {
          select: {
            id: true,
            email: true,
            name: true,
            userType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error in store-payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch store payments" },
      { status: 500 }
    );
  }
}