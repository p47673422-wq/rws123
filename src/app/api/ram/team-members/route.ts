import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the current user to check their type and store type
    const currentUser = await prisma.user_Z.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser || (currentUser.userType !== 'STORE_OWNER' && currentUser.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Fetch team members based on store type
    const teamMembers = await prisma.user_Z.findMany({
      where: {
        storeType: currentUser.storeType,
        userType: currentUser.userType
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        userType: true
      }
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}