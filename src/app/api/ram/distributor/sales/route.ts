import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { distributorId, customerName, customerPhone, items } = body;
    if (!distributorId || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const p: any = prisma;
    const sale = await p.Sale_Z.create({
      data: {
        distributorId,
        customerName,
        customerPhone,
        items,
      },
    });
    // TODO: Update Inventory_Z quantities
    return NextResponse.json({ ok: true, id: sale.id });
  } catch (err) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
