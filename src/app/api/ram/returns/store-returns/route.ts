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

    // Ensure user is a store owner
    const user = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true } });
    if (!user || (user.userType !== 'STORE_OWNER' && user.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const storeOwner = await prisma.user_Z.findFirst({
      where: {
        storeType: user.userType === 'STORE_OWNER' ? 'NORMAL' : 'VEC',
      },
      select: { id: true }
    });

    const returns = await prisma.returnRequest_Z.findMany({
      where: { storeOwnerId: storeOwner?.id },
      include: {
        distributor: { select: { id: true, name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(returns);
  } catch (err) {
    console.error('store returns error:', err);
    return NextResponse.json({ error: 'Failed to fetch store return requests' }, { status: 500 });
  }
}
