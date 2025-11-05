import { NextResponse } from 'next/server';
import { PrismaClient, PreOrderStatus_Z, InventoryType, BookLanguage } from '@prisma/client';

const prisma = new PrismaClient();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { orderId, status, otp } = await request.json();

    // Start a transaction since we need to update multiple tables
    const result = await prisma.$transaction(async (tx) => {
      // Get the order with its items
      const order = await tx.preOrder_Z.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const items = order.items as Array<{
        bookId: string;
        quantity: number;
      }>;

      // Validate OTP if status is COLLECTED
      if (status === PreOrderStatus_Z.COLLECTED) {
        if (!otp || otp !== order.otp) {
          throw new Error('Invalid OTP');
        }

        // Handle inventory transfer from warehouse to distributor
        for (const item of items) {
          // First, check and update warehouse inventory
          const warehouseStock = await tx.inventory_Z.findFirst({
            where: {
              bookId: item.bookId,
              inventoryType: InventoryType.WAREHOUSE
            }
          });

          if (!warehouseStock || warehouseStock.quantity < item.quantity) {
            // Get book details for error message
            const book = await tx.book_Z.findUnique({
              where: { id: item.bookId }
            });
            throw new Error(`Insufficient warehouse stock for ${book?.name} (${book?.language})`);
          }

          // Update warehouse inventory
          await tx.inventory_Z.update({
            where: {
              id: warehouseStock.id
            },
            data: {
              quantity: warehouseStock.quantity - item.quantity
            }
          });

          // Update or create distributor inventory
          const distributorStock = await tx.inventory_Z.findFirst({
            where: {
              userId: order.distributorId,
              bookId: item.bookId,
              inventoryType: InventoryType.DISTRIBUTOR
            }
          });

          if (distributorStock) {
            await tx.inventory_Z.update({
              where: {
                id: distributorStock.id
              },
              data: {
                quantity: distributorStock.quantity + item.quantity
              }
            });
          } else {
            await tx.inventory_Z.create({
              data: {
                userId: order.distributorId,
                bookId: item.bookId,
                quantity: item.quantity,
                inventoryType: InventoryType.DISTRIBUTOR
              }
            });
          }
        }
      }

      // Generate OTP if status is being set to PACKED
      const updateData: any = {
        status: status as PreOrderStatus_Z
      };
      
      if (status === PreOrderStatus_Z.PACKED) {
        updateData.otp = generateOTP();
      }

      // Update order status (and OTP if PACKED)
      return await tx.preOrder_Z.update({
        where: { id: orderId },
        data: updateData
      });
    });

    return NextResponse.json({ success: true, order: result });

  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}