import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { distributorId, place, date, startTime, duration } = body;
    if (!distributorId || !place || !date || !startTime || !duration) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const p: any = prisma;
    const booking = await p.VenueBooking_Z.create({
      data: {
        distributorId,
        place,
        date,
        startTime,
        duration,
      },
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (err) {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const p: any = prisma;
    const bookings = await p.VenueBooking_Z.findMany({ orderBy: { date: 'asc' } });
    return NextResponse.json({ bookings });
  } catch (err) {
    return NextResponse.json({ bookings: [] }, { status: 500 });
  }
}
