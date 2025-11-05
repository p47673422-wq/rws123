import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const paymentRequests = await prisma.paymentRequest_Z.findMany({
      where: {
        distributorId: decoded.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(paymentRequests);

  } catch (err) {
    console.error('Error fetching payment requests:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}