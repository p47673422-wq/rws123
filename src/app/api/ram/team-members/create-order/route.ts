import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { distributorId, items } = await req.json();
    if (!distributorId || !Array.isArray(items) || !items.length) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    // create pre-order on behalf of distributor
    const storeOwner = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { id: true } });
    const order = await prisma.preOrder_Z.create({
      data: {
        distributorId,
        storeOwnerId: storeOwner!.id,
        items,
        status: 'PENDING'
      }
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error('create order (store) error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
