import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get current user's storeType so we can return warehouse inventory matching that type
    const currentUser = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { storeType: true } });
    const storeType = currentUser?.storeType;

    // Get inventory entries from Inventory_Z that represent warehouse stock
    const inventory = await prisma.inventory_Z.findMany({
      where: {
        inventoryType: 'WAREHOUSE',
        warehouseType: storeType ?? undefined,
        quantity: { gt: 0 }
      },
      include: {
        book: {
          select: {
            id: true,
            name: true,
            language: true
          }
        }
      },
      orderBy: [{ book: { name: 'asc' } }, { book: { language: 'asc' } }]
    });

    // Group by book for easier frontend handling
    const books = inventory.reduce((acc: any, item) => {
      const b = item.book;
      if (!acc[b.id]) {
        acc[b.id] = {
          id: b.id,
          title: b.name,
          languages: []
        };
      }
      acc[b.id].languages.push({
        code: b.language,
        quantity: item.quantity
      });
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(Object.values(books));
  } catch (err) {
    console.error('warehouse inventory error:', err);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}