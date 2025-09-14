import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const TEMP_PASSWORD = process.env.TEMP_PASSWORD || 'iskcon20251608';

export async function POST(req: Request) {
  const { name, type, email, password } = await req.json();
  if (!name || !type || !email || !password) {
    return NextResponse.json({ error: 'All fields required.' }, { status: 400 });
  }
  if (password !== TEMP_PASSWORD) {
    return NextResponse.json({ error: 'Invalid temp password.' }, { status: 401 });
  }
  const existing = await prisma.cordinatorUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.cordinatorUser.create({
    data: {
      name,
      type,
      email,
      password: hashed,
      tempPasswordUsed: true,
    },
  });
  return NextResponse.json({ success: true, message: 'Signup successful.' });
}
