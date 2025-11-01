import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET() {
  try {
  const p: any = prisma;
  const preorders = await p.preOrder_Z.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });
  const payments = await p.payment_Z.findMany({ orderBy: { createdAt: 'desc' }, take: 6 });

    const items = [
      ...preorders.map((p: any) => ({ id: p.id, type: 'order', title: `PreOrder ${String(p.id).slice(0,6)}`, time: p.createdAt.toISOString(), status: p.status })),
      ...payments.map((p: any) => ({ id: p.id, type: 'payment', title: `Payment ${String(p.id).slice(0,6)}`, time: p.createdAt.toISOString(), status: p.status, amount: Number(p.amount) })),
    ].sort((a: any, b: any) => (a.time < b.time ? 1 : -1)).slice(0, 8);

    return NextResponse.json(items);
  } catch (err) {
    console.error('GET /api/ram/distributor/recent', err);
    return NextResponse.json([]);
  }
}
