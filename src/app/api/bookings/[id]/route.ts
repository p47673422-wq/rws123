import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { placeType, placeName, date, time, strength, duration, resources, comment } = body;
  // Convert duration to Int if it's a string like "30 min"
  let durationInt = typeof duration === 'string' ? parseInt(duration) : duration;
  if (isNaN(durationInt)) durationInt = 0;
  try {
    const oldBooking = await prisma.booking.findUnique({ where: { id } });
    if (!oldBooking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        placeType,
        placeName,
        date: date ? new Date(date) : undefined,
        time,
        strength,
        duration: durationInt,
        resources,
        comment,
      },
    });
    // If strength changed, update RewardProgress
    if (strength && strength !== oldBooking.strength) {
      const diff = strength - oldBooking.strength;
      await prisma.rewardProgress.update({
        where: { cordinatorId: oldBooking.cordinatorId },
        data: { totalStrength: { increment: diff } },
      });
    }
    return NextResponse.json({ success: true, booking });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
