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

    // upload image if provided (base64)
    let imageUrl = null;
    if (paymentImage) {
      const uploadResponse = await imagekit.upload({ file: paymentImage, fileName: `payment_${distributorId}_${Date.now()}.jpg`, folder: '/payments' });
      imageUrl = uploadResponse.url;
    }

    const paymentRecord = await prisma.payment_Z.create({
      data: {
        distributorId,
        amount: totalAmount,
        receiptImageUrl: imageUrl,
        items,
        status: 'PENDING'
      }
    });

    const paymentRequest = await prisma.paymentRequest_Z.create({
      data: {
        distributorId,
        dates: (dates || []).map((d: string) => new Date(d)),
        items,
        totalAmount,
        paymentImageUrl: imageUrl,
        notes,
        paymentId: paymentRecord.id
      }
    });

    return NextResponse.json({ success: true, id: paymentRequest.id });
  } catch (err) {
    console.error('record payment (store) error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
