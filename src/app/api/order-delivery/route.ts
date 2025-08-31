import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    // Find if a delivery status already exists for this orderId
    const existing = await prisma.orderDeliveryStatus.findFirst({ where: { orderId } });
    let status;
    if (existing) {
      status = await prisma.orderDeliveryStatus.update({
        where: { id: existing.id },
        data: { delivered: true, deliveredAt: new Date() },
      });
    } else {
      status = await prisma.orderDeliveryStatus.create({
        data: { orderId, delivered: true, deliveredAt: new Date() },
      });
    }
    return NextResponse.json({ success: true, status });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
