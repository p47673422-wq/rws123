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

    const returns = await prisma.returnRequest_Z.findMany({
      where: { distributorId: decoded.id },
      include: {
        storeOwner: { select: { id: true, name: true, phone: true, storeType: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(returns);
  } catch (err) {
    console.error('my returns error:', err);
    return NextResponse.json({ error: 'Failed to fetch return requests' }, { status: 500 });
  }
}
