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

    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true, storeType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { distributorId, items, reason } = await req.json();
    if (!distributorId || !Array.isArray(items) || !items.length) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    try {
      const result = await prisma.$transaction(async (tx) => {
        const storeOwner = await tx.user_Z.findUnique({ where: { id: decoded.id }, select: { id: true, storeType: true } });
        if (!storeOwner) throw new Error('Store owner not found');
        // For warehouse lookup we'll use bookId + inventoryType only

        // For each item: ensure distributor has enough stock, decrease distributor, increase warehouse
        for (const it of items) {
          const bookId = it.bookId;
          const qty = Number(it.quantity) || 0;
          if (qty <= 0) throw new Error('Invalid quantity');

          // check distributor stock
          const distStock = await tx.inventory_Z.findFirst({ where: { userId: distributorId, bookId, inventoryType: 'DISTRIBUTOR' } });
          const book = await tx.book_Z.findUnique({ where: { id: bookId } });
          if (!distStock || distStock.quantity < qty) {
            throw new Error(`Insufficient distributor stock for ${book?.name} (${book?.language})`);
          }

          // decrease distributor
          await tx.inventory_Z.update({ where: { id: distStock.id }, data: { quantity: distStock.quantity - qty } });

          // increase warehouse inventory - FAIL if no warehouse entry exists (per spec)
          const warehouseStock = await tx.inventory_Z.findFirst({ where: { bookId, inventoryType: 'WAREHOUSE', warehouseType: storeOwner.storeType } });
          if (!warehouseStock) {
            throw new Error(`No warehouse inventory entry found for ${book?.name} (${book?.language})`);
          }
          await tx.inventory_Z.update({ where: { id: warehouseStock.id }, data: { quantity: warehouseStock.quantity + qty } });
        }

        // create return request with status COMPLETED
        const created = await tx.returnRequest_Z.create({
          data: {
            distributorId,
            storeOwnerId: storeOwner.id,
            items,
            reason: reason || null,
            status: 'COMPLETED'
          }
        });

        return created;
      });

      return NextResponse.json({ success: true, id: result.id, return: result });
    } catch (e: any) {
      const msg = e?.message || 'failed';
      if (msg.toLowerCase().includes('insufficient')) {
        return NextResponse.json({ error: msg }, { status: 400 });
      }
      console.error('create return (store) transaction error:', e);
      return NextResponse.json({ error: 'failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('create return (store) error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
