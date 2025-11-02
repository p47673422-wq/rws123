import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/ram/inventory
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const bookId = url.searchParams.get('bookId');
    const lowStock = url.searchParams.get('lowStock') === 'true';
    const warehouseType = url.searchParams.get('warehouseType') as 'NORMAL' | 'VEC' | null;
    const inventoryType = url.searchParams.get('inventoryType') as 'WAREHOUSE' | 'DISTRIBUTOR';

    let where: any = {
      inventoryType: inventoryType || 'DISTRIBUTOR'
    };
    
    if (userId) {
      where.userId = userId;
    }
    if (bookId) {
      where.bookId = bookId;
    }
    if (warehouseType && inventoryType === 'WAREHOUSE') {
      where.warehouseType = warehouseType;
    }

    const inventory = await prisma.inventory_Z.findMany({
      where,
      include: {
        book: true,
        user: {
          select: {
            id: true,
            name: true,
            userType: true,
            storeType: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // If low stock filter is applied, only return items with quantity < 10
    if (lowStock) {
      return NextResponse.json(inventory.filter(item => item.quantity < 10));
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST /api/ram/inventory
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bookId, quantity, inventoryType, warehouseType } = body;

    // Check if inventory entry exists
    const existingInventory = await prisma.inventory_Z.findFirst({
      where: {
        userId,
        bookId
      }
    });

    if (existingInventory) {
      // Update existing inventory
      const updatedInventory = await prisma.inventory_Z.update({
        where: {
          id: existingInventory.id
        },
        data: {
          quantity: existingInventory.quantity + quantity
        },
        include: {
          book: true
        }
      });
      return NextResponse.json(updatedInventory);
    }

    // Create new inventory entry
    const newInventory = await prisma.inventory_Z.create({
      data: {
        userId,
        bookId,
        quantity,
        inventoryType: inventoryType || 'DISTRIBUTOR',
        warehouseType: inventoryType === 'WAREHOUSE' ? warehouseType : null
      },
      include: {
        book: true
      }
    });

    return NextResponse.json(newInventory);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}