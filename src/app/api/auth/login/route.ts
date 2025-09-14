import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_20251608';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
  }
  const user = await prisma.cordinatorUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const responsePayload: any = { token };
  if (user.tempPasswordUsed) {
    responsePayload.requireChangePassword = true;
    responsePayload.userId = user.id;
  } else {
    responsePayload.user = { id: user.id, name: user.name, type: user.type, email: user.email };
  }
  const res = NextResponse.json(responsePayload);
  res.cookies.set('session', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  return res;
}
