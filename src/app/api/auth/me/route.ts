import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_20251608';

export async function GET() {
  const cookieStore = await cookies();
const cookie = cookieStore.get('session');
  if (!cookie) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  let userId;
  try {
    const decoded: any = jwt.verify(cookie.value, JWT_SECRET);
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
  }
  const user = await prisma.cordinatorUser.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, type: user.type } });
}
