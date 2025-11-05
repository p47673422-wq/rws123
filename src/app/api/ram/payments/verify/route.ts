import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';
import { imagekit } from '@/lib/imagekit';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { dates, items, totalAmount, paymentImage, notes } = await req.json();
    const userId = decoded.id;

    if (!dates?.length || !items?.length || !totalAmount || !paymentImage) {
      return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 });
    }

    // Verify total amount matches items
    const calculatedTotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    if (calculatedTotal !== totalAmount) {
      return NextResponse.json({ 
        error: 'amount_mismatch',
        message: 'Total amount does not match items total'
      }, { status: 400 });
    }

    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: paymentImage,
      fileName: `payment_${userId}_${Date.now()}.jpg`,
      folder: '/payments'
    });

    // Create payment request and payment record
    const paymentRecord = await prisma.payment_Z.create({
      data: {
        distributorId: userId,
        amount: totalAmount,
        receiptImageUrl: uploadResponse.url,
        items: items,
        status: 'PENDING'
      }
    });

    const paymentRequest = await prisma.paymentRequest_Z.create({
      data: {
        distributorId: userId,
        dates: dates.map((d: string) => new Date(d)),
        items: items,
        totalAmount,
        paymentImageUrl: uploadResponse.url,
        notes,
        paymentId: paymentRecord.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: paymentRequest.id,
      message: 'Payment request submitted for verification'
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}