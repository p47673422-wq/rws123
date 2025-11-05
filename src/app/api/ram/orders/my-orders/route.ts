import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

// Helper: Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get current user's orders
    const orders = await prisma.preOrder_Z.findMany({
      where: {
        distributorId: decoded.id
      },
      include: {
        distributor: {
          select: {
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
    console.error('my orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get current user to determine store type
    const user = await prisma.user_Z.findUnique({
      where: { id: decoded.id },
      select: { storeType: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Find store owner based on store type
    const storeOwner = await prisma.user_Z.findFirst({
      where: {
        storeType: user.storeType,
        userType: user.storeType === 'NORMAL' ? 'STORE_OWNER' : 'VEC_STORE_OWNER'
      },
      select: { id: true }
    });

    if (!storeOwner) return NextResponse.json({ error: 'No store owner found for your type' }, { status: 400 });

    const { items } = await req.json();
    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    // Create the pre-order
    const order = await prisma.preOrder_Z.create({
      data: {
        distributorId: decoded.id,
        storeOwnerId: storeOwner.id,
        items: items,
        status: 'PENDING'
      }
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error('create order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}