import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { distributorId, storeOwnerId, items, reason } = body;
    if (!distributorId || !storeOwnerId || !items || !Array.isArray(items) || !reason) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const p: any = prisma;
    const ret = await p.ReturnRequest_Z.create({
      data: {
        distributorId,
        storeOwnerId,
        items,
        reason,
        status: 'PENDING',
      },
    });
    // TODO: Update Inventory_Z quantities
    return NextResponse.json({ ok: true, id: ret.id });
  } catch (err) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
