import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, oldPassword, newPassword } = body || {};
  if (!email || !oldPassword || !newPassword) return NextResponse.json({ error: 'missing' }, { status: 400 });

  const users: any[] = await prisma.$queryRaw`SELECT * FROM "User_Z" WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const ok = await bcrypt.compare(oldPassword, user.password_hash);
  if (!ok) return NextResponse.json({ error: 'invalid_old' }, { status: 401 });

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.$executeRaw`UPDATE "User_Z" SET password_hash = ${hash}, "updatedAt" = now() WHERE id = ${user.id}`;
  return NextResponse.json({ success: true });
}
