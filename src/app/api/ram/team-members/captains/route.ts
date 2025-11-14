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

    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true, storeType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Captains are users with userType = CAPTAIN and same storeType as requester
    const captains = await prisma.user_Z.findMany({
      where: { userType: 'CAPTAIN', storeType: requester.storeType },
      select: { id: true, name: true, phone: true }
    });

    return NextResponse.json(captains);
  } catch (err) {
    console.error('captains error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
