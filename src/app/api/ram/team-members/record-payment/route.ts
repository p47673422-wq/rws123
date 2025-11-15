import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';
import { imagekit } from '@/lib/imagekit';

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

    const { distributorId, dates, items, totalAmount, paymentImage, notes } = await req.json();
    if (!distributorId || !Array.isArray(items) || !items.length || !totalAmount) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    // upload image (if provided) outside transaction
    let imageUrl: string | null = null;
    if (paymentImage) {
      try {
        const uploadResponse = await imagekit.upload({ file: paymentImage, fileName: `payment_${distributorId}_${Date.now()}.jpg`, folder: '/payments' });
        imageUrl = uploadResponse.url;
      } catch (uploadErr) {
        console.error('Image upload failed:', uploadErr);
        // continue without image
      }
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const storeOwner = await tx.user_Z.findUnique({ where: { id: decoded.id }, select: { id: true } });
        if (!storeOwner) throw new Error('Store owner not found');

        // create payment record VERIFIED (no inventory transfer per spec)
        const paymentRecord = await tx.payment_Z.create({
          data: {
            distributorId,
            amount: totalAmount,
            receiptImageUrl: imageUrl,
            items,
            status: 'VERIFIED',
            verifiedById: storeOwner.id,
            verifiedAt: new Date()
          }
        });

        // create payment request and mark VERIFIED
        const paymentRequest = await tx.paymentRequest_Z.create({
          data: {
            distributorId,
            dates: (dates || []).map((d: string) => new Date(d)),
            items,
            totalAmount,
            paymentImageUrl: imageUrl,
            notes,
            status: 'VERIFIED',
            verifiedById: storeOwner.id,
            verifiedAt: new Date(),
            paymentId: paymentRecord.id
          }
        });

        return { paymentId: paymentRecord.id, requestId: paymentRequest.id };
      });

      return NextResponse.json({ success: true, id: result.requestId, paymentId: result.paymentId });
    } catch (e: any) {
      console.error('record payment (store) transaction error:', e);
      return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('record payment (store) error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
