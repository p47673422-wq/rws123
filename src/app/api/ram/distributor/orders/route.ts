import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: any) {
  // TODO: Add authentication and distributor filtering
  try {
    // Fetch orders for distributor
    const p: any = prisma;
    const orders = await p.preOrder_Z.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        storeOwner: true,
      },
    });
    // Map to expected format for frontend
    const mapped = orders.map((order: any) => ({
      id: order.id,
      storeOwnerName: order.storeOwner?.name || '',
      items: Array.isArray(order.items) ? order.items : [],
      status: order.status,
      createdAt: order.createdAt,
      otp: order.otp || null,
    }));
    return NextResponse.json({ orders: mapped });
  } catch (err) {
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
