import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { distributorId, amount, receiptImageUrl, items } = body;
    if (!distributorId || !amount || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const p: any = prisma;
    const payment = await p.Payment_Z.create({
      data: {
        distributorId,
        amount,
        receiptImageUrl,
        items,
        status: 'PENDING',
      },
    });
    return NextResponse.json({ ok: true, id: payment.id });
  } catch (err) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
