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

    // Get daily sales with book details
    const dailySales = await prisma.dailySales_Z.findMany({
      where: {
        distributorId: decoded.id,
      },
      include: {
        book: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Group sales by date
    const salesByDate = dailySales.reduce((acc: any, sale: any) => {
      const dateKey = sale.date.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          id: `daily-${dateKey}`,
          date: dateKey,
          items: [],
          totalBooks: 0
        };
      }

      // Add book to items
      const existingItem = acc[dateKey].items.find((item: any) => 
        item.bookId === sale.bookId
      );

      if (existingItem) {
        existingItem.quantity += sale.quantity;
      } else {
        acc[dateKey].items.push({
          bookId: sale.bookId,
          title: sale.book.name,
          language: sale.book.language,
          quantity: sale.quantity
        });
      }

      // Update total books
      acc[dateKey].totalBooks += sale.quantity;

      return acc;
    }, {});

    // Convert to array and sort by date
    const formattedSales = Object.values(salesByDate)
      .sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    return NextResponse.json(formattedSales);
  } catch (error: any) {
    console.error('Sales fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}