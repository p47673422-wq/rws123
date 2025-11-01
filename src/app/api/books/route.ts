import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('search') || '';
    const p: any = prisma;
    const items = await p.book_Z.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });

    // map Decimal price to number
  const mapped = items.map((b: any) => ({ id: b.id, title: b.name, price: Number(b.price), languages: b.languages }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error('GET /api/books', err);
    return NextResponse.json([], { status: 500 });
  }
}
