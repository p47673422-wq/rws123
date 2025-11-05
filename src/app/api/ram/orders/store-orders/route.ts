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

    // Get current user type
    const user = await prisma.user_Z.findUnique({
      where: { id: decoded.id },
      select: { userType: true }
    });

    if (!user || (user.userType !== 'STORE_OWNER' && user.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Get orders for this store owner
    const orders = await prisma.preOrder_Z.findMany({
      where: {
        storeOwnerId: decoded.id
      },
      include: {
        distributor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            captain: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error('store orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Handle order status updates
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { orderId, status, otp } = await req.json();

    // Verify this store owner owns this order
    const order = await prisma.preOrder_Z.findFirst({
      where: {
        id: orderId,
        storeOwnerId: decoded.id
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // OTP verification for COLLECTED status (schema uses COLLECTED)
    if (status === 'COLLECTED') {
      if (order.status !== 'PACKED') {
        return NextResponse.json({ error: 'Order must be PACKED before collecting' }, { status: 400 });
      }
      if (!otp || order.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
      }

      // Transfer inventory using Inventory_Z (warehouse -> distributor)
      const items = order.items as any[];

      // Get storeOwner's storeType to find the correct warehouse entries
      const storeOwner = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { storeType: true } });
      const warehouseType = storeOwner?.storeType;

      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          // Ensure warehouse inventory exists for the given book
          const warehouseEntry = await tx.inventory_Z.findFirst({
            where: {
              bookId: item.bookId,
              inventoryType: 'WAREHOUSE',
              warehouseType: warehouseType ?? undefined
            }
          });

          const book = await tx.book_Z.findUnique({ where: { id: item.bookId } });

          if (!warehouseEntry || warehouseEntry.quantity < item.quantity) {
            throw new Error(`Insufficient warehouse stock for ${book?.name} (${book?.language})`);
          }

          // Decrease warehouse quantity
          await tx.inventory_Z.update({
            where: { id: warehouseEntry.id },
            data: { quantity: warehouseEntry.quantity - item.quantity }
          });

          // Increase or create distributor inventory
          const distEntry = await tx.inventory_Z.findFirst({
            where: {
              userId: order.distributorId,
              bookId: item.bookId,
              inventoryType: 'DISTRIBUTOR'
            }
          });

          if (distEntry) {
            await tx.inventory_Z.update({ where: { id: distEntry.id }, data: { quantity: distEntry.quantity + item.quantity } });
          } else {
            await tx.inventory_Z.create({
              data: {
                userId: order.distributorId,
                bookId: item.bookId,
                quantity: item.quantity,
                inventoryType: 'DISTRIBUTOR'
              }
            });
          }
        }

        // Update order status to COLLECTED
        await tx.preOrder_Z.update({ where: { id: orderId }, data: { status } });
      });

      return NextResponse.json({ success: true });
    }

    // Normal status updates
    const updated = await prisma.preOrder_Z.update({
      where: { id: orderId },
      data: {
        status,
        // Generate OTP when marking as PACKED
        ...(status === 'PACKED' ? {
          otp: Math.floor(100000 + Math.random() * 900000).toString()
        } : {})
      }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('update order error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}