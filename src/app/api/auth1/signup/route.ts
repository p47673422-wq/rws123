import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const TEMP_PASSWORD = process.env.TEMP_PASSWORD || 'iskcon20251608';

export async function POST(req: Request) {
  const { name, email, password, mobile } = await req.json();
  if (!name || !password || !mobile) {
    return NextResponse.json({ error: 'All fields required.' }, { status: 400 });
  }
  if (password !== TEMP_PASSWORD) {
    return NextResponse.json({ error: 'Invalid temp password.' }, { status: 401 });
  }
  const existing = await prisma.user_a.findUnique({ where: { mobile } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user_a.create({
    data: {
      name,
      email,
      mobile,
      password: hashed,
      tempPasswordUsed: true,
    },
  });
  return NextResponse.json({ success: true, message: 'Signup successful.' });
}
