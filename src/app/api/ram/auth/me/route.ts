import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/marathonAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    // console.log('Token:', token);
    if (!token) return NextResponse.json({ user: null }, { status: 200 });
    const payload: any = verifyToken(token);
    // console.log('Payload:', payload);
    if (!payload) return NextResponse.json({ user: null }, { status: 200 });
    const users: any[] = await prisma.$queryRaw`SELECT id, email, name, phone, "userType", "storeType" FROM "User_Z" WHERE id = ${payload.id} LIMIT 1`;
    const user = users[0] || null;
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
