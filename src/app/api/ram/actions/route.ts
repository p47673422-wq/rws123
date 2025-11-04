import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { action, payload } = await req.json();
    const userId = decoded.id;

    if (!action) return NextResponse.json({ error: 'action_required' }, { status: 400 });

    switch (action) {
      case 'create_order': {
        const { storeOwnerId, items } = payload || {};
        if (!storeOwnerId || !items) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

        const created = await prisma.preOrder_Z.create({
          data: {
            distributorId: userId,
            storeOwnerId,
            items: items,
          }
        });

        return NextResponse.json({ success: true, id: created.id, message: 'Pre-order created' });
      }

      case 'return_request': {
        const { storeOwnerId, items } = payload || {};
        if (!storeOwnerId || !items) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

        const created = await prisma.returnRequest_Z.create({
          data: {
            distributorId: userId,
            storeOwnerId,
            items: items,
          }
        });

        return NextResponse.json({ success: true, id: created.id, message: 'Return request created' });
      }

      case 'payment_verification': {
        const { amount, items } = payload || {};
        if (amount == null) return NextResponse.json({ error: 'missing_amount' }, { status: 400 });

        const created = await prisma.payment_Z.create({
          data: {
            distributorId: userId,
            amount: amount,
            items: items || {},
            status: 'PENDING'
          }
        });

        return NextResponse.json({ success: true, id: created.id, message: 'Payment recorded' });
      }

      case 'add_venue': {
        const { place, date, startTime, durationMins } = payload || {};
        if (!place || !date || !startTime || !durationMins) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

        const start = new Date(`${date}T${startTime}`);
        const created = await prisma.venueBooking_Z.create({
          data: {
            distributorId: userId,
            place,
            date: new Date(date),
            startTime: start,
            durationMins: Number(durationMins)
          }
        });

        return NextResponse.json({ success: true, id: created.id, message: 'Venue booked' });
      }

      default:
        return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
    }
  } catch (err) {
    console.error('actions route error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}