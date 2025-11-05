import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || undefined;
    const place = url.searchParams.get('place') || undefined;
    const dateFrom = url.searchParams.get('dateFrom') || undefined;
    const dateTo = url.searchParams.get('dateTo') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'date';
    const sortDir = (url.searchParams.get('sortDir') || 'desc').toLowerCase();
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '100');

    const where: any = {};

    if (search) {
      where.OR = [
        { place: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (place) {
      where.place = { equals: place };
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) {
        // include the full dateTo day by setting end of day
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.date.lte = toDate;
      }
    }

    // build orderBy
    const orderBy: any = {};
    if (sortBy === 'place') orderBy.place = sortDir === 'asc' ? 'asc' : 'desc';
    else if (sortBy === 'distributor') orderBy.distributor = { name: sortDir === 'asc' ? 'asc' : 'desc' };
    else orderBy.date = sortDir === 'asc' ? 'asc' : 'desc';

    const skip = (Math.max(page, 1) - 1) * limit;

    const [total, rows] = await Promise.all([
      prisma.venueBooking_Z.count({ where }),
      prisma.venueBooking_Z.findMany({
        where,
        include: { distributor: { select: { id: true, name: true, phone: true } } },
        orderBy,
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('venues GET error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
