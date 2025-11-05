import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { returnId, items } = await req.json();
    if (!returnId) return NextResponse.json({ error: 'returnId is required' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 });

    // validate items
    for (const it of items) {
      if (!it.bookId) return NextResponse.json({ error: 'Each item must include bookId' }, { status: 400 });
      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1) return NextResponse.json({ error: 'Each item must include an integer quantity >= 1' }, { status: 400 });
      it.quantity = qty;
    }

    const ret = await prisma.returnRequest_Z.findUnique({ where: { id: returnId } });
    if (!ret) return NextResponse.json({ error: 'Return request not found' }, { status: 404 });

    if (ret.distributorId !== decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    if (ret.status !== 'PENDING') return NextResponse.json({ error: 'Can only edit pending return requests' }, { status: 400 });

    // ensure distributor has required quantities for updated items
    for (const it of items) {
      const inv = await prisma.inventory_Z.findFirst({ where: { userId: decoded.id, bookId: it.bookId, inventoryType: 'DISTRIBUTOR' } });
      if (!inv || inv.quantity < it.quantity) {
        const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
        return NextResponse.json({ error: `Insufficient distributor stock for ${book?.name} (${book?.language})` }, { status: 400 });
      }
    }

    const updated = await prisma.returnRequest_Z.update({ where: { id: returnId }, data: { items } as any });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('update return items error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update return items' }, { status: 500 });
  }
}
