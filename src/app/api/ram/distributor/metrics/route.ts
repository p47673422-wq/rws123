import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET() {
  try {
    // simple aggregated metrics for distributor dashboard
  const p: any = prisma;
  const pendingOrders = await p.preOrder_Z.count({ where: { status: 'PENDING' } });
  const pendingPayments = await p.payment_Z.aggregate({ _sum: { amount: true }, where: { status: 'PENDING' } });
  const inventoryCountRaw = await p.inventory_Z.aggregate({ _sum: { quantity: true } });

    const metrics = {
      pendingOrders,
      pendingPayments: Number((pendingPayments._sum.amount ?? 0)),
      inventoryCount: Number(inventoryCountRaw._sum.quantity ?? 0),
      score: { value: 0, rank: 0 },
    };

    return NextResponse.json(metrics);
  } catch (err) {
    console.error('GET /api/ram/distributor/metrics', err);
    return NextResponse.json({ pendingOrders: 0, pendingPayments: 0, inventoryCount: 0, score: { value: 0, rank: 0 } });
  }
}
