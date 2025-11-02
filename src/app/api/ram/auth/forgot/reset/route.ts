import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, newPassword } = body || {};
  if (!email || !newPassword) return NextResponse.json({ error: 'missing' }, { status: 400 });
  const users: any[] = await prisma.$queryRaw`SELECT * FROM "User_Z" WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.$executeRaw`UPDATE "User_Z" SET password_hash = ${hash}, "updatedAt" = now() WHERE id = ${user.id}`;
  return NextResponse.json({ success: true });
}
