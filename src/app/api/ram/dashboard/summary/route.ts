import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = decoded.id;

    // score = number of sales recorded (fallback metric)
    const score = await prisma.sale_Z.count({ where: { distributorId: userId } });

    // pending payments count
    const pendingPayments = await prisma.payment_Z.count({ where: { distributorId: userId, status: 'PENDING' } });

    // inventory total quantity
    const inventoryAgg: any = await prisma.inventory_Z.aggregate({
      _sum: { quantity: true },
      where: { userId }
    });
    const inventoryCount = inventoryAgg?._sum?.quantity ?? 0;

    return NextResponse.json({ score, pendingPayments, inventoryCount });
  } catch (err) {
    console.error('dashboard summary error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}