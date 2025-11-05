import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { returnId, status, otp } = await req.json();
    if (!returnId || !status) return NextResponse.json({ error: 'returnId and status are required' }, { status: 400 });

    const ret = await prisma.returnRequest_Z.findUnique({ where: { id: returnId } });
    if (!ret) return NextResponse.json({ error: 'Return request not found' }, { status: 404 });

    // Only store owner can accept/reject/complete
    const storeOwner = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true, storeType: true } });
    if (!storeOwner || (storeOwner.userType !== 'STORE_OWNER' && storeOwner.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (ret.storeOwnerId !== decoded.id) return NextResponse.json({ error: 'Not your return request' }, { status: 403 });

    // Handle ACCEPTED => generate OTP and persist
    if (status === 'ACCEPTED') {
      const generated = generateOTP();
      // cast to any because Prisma client types may need regeneration after schema change
      const updated = await prisma.returnRequest_Z.update({ where: { id: returnId }, data: { status: 'ACCEPTED' as any, otp: generated as any } as any });
      return NextResponse.json(updated);
    }

    // Handle REJECTED
    if (status === 'REJECTED') {
      const updated = await prisma.returnRequest_Z.update({ where: { id: returnId }, data: { status: 'REJECTED' } });
      return NextResponse.json(updated);
    }

    // Handle COMPLETED - must provide OTP and perform inventory transfer
    if (status === 'COMPLETED') {
      if (!otp) return NextResponse.json({ error: 'OTP required to complete return' }, { status: 400 });
  if ((ret as any).otp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

      // perform transfer: distributor inventory decrease, warehouse increase (warehouseType based on storeOwner.storeType)
      const items = ret.items as Array<{ bookId: string; quantity: number }>;

      await prisma.$transaction(async (tx) => {
        // re-fetch storeOwner to get storeType
        const so = await tx.user_Z.findUnique({ where: { id: decoded.id }, select: { storeType: true } });
        const warehouseType = so?.storeType;

        for (const it of items) {
          // distributor inventory
          const distInv = await tx.inventory_Z.findFirst({ where: { userId: ret.distributorId, bookId: it.bookId, inventoryType: 'DISTRIBUTOR' } });
          const book = await tx.book_Z.findUnique({ where: { id: it.bookId } });
          if (!distInv || distInv.quantity < it.quantity) {
            throw new Error(`Insufficient distributor stock for ${book?.name} (${book?.language})`);
          }

          // decrease distributor
          await tx.inventory_Z.update({ where: { id: distInv.id }, data: { quantity: distInv.quantity - it.quantity } });

          // increase or create warehouse entry for storeOwner
          const wh = await tx.inventory_Z.findFirst({ where: { bookId: it.bookId, inventoryType: 'WAREHOUSE', warehouseType: warehouseType ?? undefined } });
          if (wh) {
            await tx.inventory_Z.update({ where: { id: wh.id }, data: { quantity: wh.quantity + it.quantity } });
          } else {
            await tx.inventory_Z.create({ data: { userId: decoded.id, bookId: it.bookId, quantity: it.quantity, inventoryType: 'WAREHOUSE', warehouseType: warehouseType ?? undefined } });
          }
        }

        // finalize return request
  await tx.returnRequest_Z.update({ where: { id: returnId }, data: { status: 'COMPLETED' as any } as any });
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported status' }, { status: 400 });
  } catch (err: any) {
    console.error('update return status error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update return status' }, { status: 500 });
  }
}
