import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const p: any = prisma;
    const inventory = await p.Inventory_Z.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        book: true,
      },
    });
    const mapped = inventory.map((inv: any) => ({
      id: inv.id,
      bookId: inv.bookId,
      name: inv.book?.name || '',
      language: inv.book?.languages?.[0] || '',
      qty: inv.quantity,
      price: Number(inv.book?.price || 0),
    }));
    return NextResponse.json({ inventory: mapped });
  } catch (err) {
    return NextResponse.json({ inventory: [] }, { status: 500 });
  }
}
