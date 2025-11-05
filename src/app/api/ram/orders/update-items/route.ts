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

    const { orderId, items } = await req.json();

    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 });

    // Basic validation of items
    for (const it of items) {
      if (!it.bookId) return NextResponse.json({ error: 'Each item must include bookId' }, { status: 400 });
      const qty = Number(it.quantity);
      if (!Number.isInteger(qty) || qty < 1) return NextResponse.json({ error: 'Each item must include an integer quantity >= 1' }, { status: 400 });
      it.quantity = qty;
    }

    // Fetch order
    const order = await prisma.preOrder_Z.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Permission checks:
    // - Distributor can edit only when status is PENDING and they own the order
    // - Store owner can edit only when status is ACCEPTED and they own the order
    const userId = decoded.id;
    const status = order.status as string;

    const canDistributorEdit = order.distributorId === userId && status === 'PENDING';
    const canStoreEdit = order.storeOwnerId === userId && status === 'ACCEPTED';

    if (!canDistributorEdit && !canStoreEdit) {
      return NextResponse.json({ error: 'Unauthorized to edit this order or wrong order status' }, { status: 403 });
    }

    // Update the order items
    const updated = await prisma.preOrder_Z.update({
      where: { id: orderId },
      data: { items }
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error('update-items error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update order items' }, { status: 500 });
  }
}
