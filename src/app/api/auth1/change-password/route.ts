import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_REC || 'super_secret_jwt_key_20251609';

export async function POST(req: Request) {
  const { userId, oldPassword, newPassword, token } = await req.json();
  if (!newPassword || (!userId && !token)) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  let user;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      user = await prisma.user_a.findUnique({ where: { id: decoded.userId } });
    } catch {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }
  } else if (userId) {
    user = await prisma.user_a.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    if (oldPassword) {
      const valid = await bcrypt.compare(oldPassword, user.password);
      if (!valid) return NextResponse.json({ error: 'Old password incorrect.' }, { status: 401 });
    }
  }
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user_a.update({
    where: { id: user.id },
    data: { password: hashed, tempPasswordUsed: false },
  });
  return NextResponse.json({ success: true, message: 'Password changed successfully.' });
}
