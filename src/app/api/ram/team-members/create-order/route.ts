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

    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { distributorId, items } = await req.json();
    if (!distributorId || !Array.isArray(items) || !items.length) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    // We'll run the inventory transfer and preOrder creation inside a transaction
    try {
      const result = await prisma.$transaction(async (tx) => {
        // get storeOwner and their storeType
        const storeOwner = await tx.user_Z.findUnique({ where: { id: decoded.id }, select: { id: true, storeType: true } });
        if (!storeOwner) throw new Error('Store owner not found');
        // For warehouse lookup we'll use bookId + inventoryType only (per spec)

        // For each item: decrease warehouse and increase distributor inventory
        for (const it of items) {
          const bookId = it.bookId;
          const qty = Number(it.quantity) || 0;
          if (qty <= 0) throw new Error('Invalid quantity');

        
          const warehouseStock = await tx.inventory_Z.findFirst({
            where: {
              bookId,
              inventoryType: 'WAREHOUSE',
              warehouseType: storeOwner.storeType
            }
          });

          const book = await tx.book_Z.findUnique({ where: { id: bookId } });
          if (!warehouseStock || warehouseStock.quantity < qty) {
            throw new Error(`Insufficient warehouse stock for ${book?.name} (${book?.language})`);
          }

          // decrease warehouse
          await tx.inventory_Z.update({ where: { id: warehouseStock.id }, data: { quantity: warehouseStock.quantity - qty } });

          // increase or create distributor inventory
          const distStock = await tx.inventory_Z.findFirst({ where: { userId: distributorId, bookId, inventoryType: 'DISTRIBUTOR' } });
          if (distStock) {
            await tx.inventory_Z.update({ where: { id: distStock.id }, data: { quantity: distStock.quantity + qty } });
          } else {
            await tx.inventory_Z.create({ data: { userId: distributorId, bookId, quantity: qty, inventoryType: 'DISTRIBUTOR' } });
          }
        }

        // create pre-order with status COLLECTED
        const preOrder = await tx.preOrder_Z.create({
          data: {
            distributorId,
            storeOwnerId: decoded.id,
            items,
            status: 'COLLECTED'
          }
        });

        return preOrder;
      });

      return NextResponse.json({ success: true, id: result.id, order: result });
    } catch (e: any) {
      const msg = e?.message || 'failed';
      if (msg.toLowerCase().includes('insufficient')) {
        return NextResponse.json({ error: msg }, { status: 400 });
      }
      console.error('create order (store) transaction error:', e);
      return NextResponse.json({ error: 'failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('create order (store) error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
