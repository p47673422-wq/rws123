import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = body || {};
  if (!email) return NextResponse.json({ error: 'missing' }, { status: 400 });
  const users: any[] = await prisma.$queryRaw`SELECT * FROM "User_Z" WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (Number(user.securityQuestion1) === Number(securityQuestion1) && String(user.securityAnswer1) === String(securityAnswer1) && Number(user.securityQuestion2) === Number(securityQuestion2) && String(user.securityAnswer2) === String(securityAnswer2)) {
    return NextResponse.json({ verified: true });
  }
  return NextResponse.json({ verified: false }, { status: 401 });
}
