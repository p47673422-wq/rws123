import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET() {
  const cookieStore = await cookies();
const cookie = cookieStore.get('session');
  if (!cookie) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  let userId;
  try {
    const decoded: any = jwt.verify(cookie.value, JWT_SECRET);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: { cordinatorId: userId },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ bookings });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
