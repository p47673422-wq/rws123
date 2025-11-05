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

    const { items, reason } = await req.json();
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 });

    // Basic validation
    for (const it of items) {
      if (!it.bookId) return NextResponse.json({ error: 'Each item must include bookId' }, { status: 400 });
      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1) return NextResponse.json({ error: 'Each item must include an integer quantity >= 1' }, { status: 400 });
      it.quantity = qty;
    }

    // Verify distributor inventory has required quantities
    for (const it of items) {
      const inv = await prisma.inventory_Z.findFirst({
        where: { userId: decoded.id, bookId: it.bookId, inventoryType: 'DISTRIBUTOR' }
      });
      if (!inv || inv.quantity < it.quantity) {
        const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
        return NextResponse.json({ error: `Insufficient distributor stock for ${book?.name} (${book?.language})` }, { status: 400 });
      }
    }

    // Find storeOwner for this distributor based on their storeType
    const user = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { storeType: true } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const storeOwner = await prisma.user_Z.findFirst({
      where: {
        storeType: user.storeType,
        userType: user.storeType === 'NORMAL' ? 'STORE_OWNER' : 'VEC_STORE_OWNER'
      },
      select: { id: true }
    });
    if (!storeOwner) return NextResponse.json({ error: 'No store owner found for your type' }, { status: 400 });

    const created = await prisma.returnRequest_Z.create({
      data: {
        distributorId: decoded.id,
        storeOwnerId: storeOwner.id,
        items,
        reason: reason || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json(created);
  } catch (err: any) {
    console.error('create return error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create return request' }, { status: 500 });
  }
}
