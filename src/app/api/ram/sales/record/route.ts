import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

// Single route that supports two modes via `mode` in request body:
// - mode: 'customer' => creates Sale_Z record only (no inventory change)
// - mode: 'daily' => creates DailySales_Z records and decrements inventory
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const mode = body?.mode || 'customer';

    if (mode === 'customer') {
      const { customerName, customerPhone, items } = body;
      if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const sale = await prisma.sale_Z.create({
        data: {
          distributorId: decoded.id,
          customerName,
          customerPhone,
          items: items
        }
      });

      return NextResponse.json(sale);
    }

    if (mode === 'daily') {
      const { items } = body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      // Use transaction to ensure inventory and daily sales consistency
      const result = await prisma.$transaction(async (tx) => {
        // Fetch inventory for checks
        const inventoryItems = await tx.inventory_Z.findMany({
          where: {
            userId: decoded.id,
            inventoryType: 'DISTRIBUTOR'
          }
        });

        for (const item of items) {
          const inv = inventoryItems.find(i => i.bookId === item.bookId);
          if (!inv || inv.quantity < item.quantity) {
            throw new Error(`Insufficient inventory for bookId: ${item.bookId}`);
          }
        }

        // create daily sales entries
        const daily = await Promise.all(items.map((item: any) =>
          tx.dailySales_Z.create({
            data: {
              distributorId: decoded.id,
              bookId: item.bookId,
              quantity: item.quantity,
              date: new Date()
            }
          })
        ));

        // decrement inventory
        await Promise.all(items.map((item: any) =>
          tx.inventory_Z.updateMany({
            where: {
              userId: decoded.id,
              bookId: item.bookId,
              inventoryType: 'DISTRIBUTOR'
            },
            data: {
              quantity: {
                decrement: item.quantity
              }
            }
          })
        ));

        return daily;
      });

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error: any) {
    console.error('Sales record error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record sale' },
      { status: 500 }
    );
  }
}