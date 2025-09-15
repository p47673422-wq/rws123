import { NextResponse } from 'next/server';
import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { coordinatorId, placeType, placeName, date, time, strength, duration, resources, comment } = body;
  if (!coordinatorId || !placeType || !placeName || !date || !time || !strength || !duration || !resources) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  // Convert duration to Int if it's a string like "30 min"
  let durationInt = typeof duration === 'string' ? parseInt(duration) : duration;
  if (isNaN(durationInt)) durationInt = 0;
  try {
    const booking = await prisma.booking.create({
      data: {
        cordinatorId: coordinatorId,
        placeType,
        placeName,
        date: new Date(date),
        time,
        strength,
        duration: durationInt,
        resources,
        comment,
      },
    });
    // Update RewardProgress
    await prisma.rewardProgress.upsert({
      where: { cordinatorId: coordinatorId },
      update: {
        totalBookings: { increment: 1 },
        totalStrength: { increment: strength },
      },
      create: {
        cordinatorId: coordinatorId,
        totalBookings: 1,
        totalStrength: strength,
      },
    });
    return NextResponse.json({ success: true, booking });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { cordinator: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ bookings });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
