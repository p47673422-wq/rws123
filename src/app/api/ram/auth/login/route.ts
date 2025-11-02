import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

const TEMP_PASSWORDS: Record<string, string> = {
  VEC_STORE_OWNER: 'RAM@SITA108',
  STORE_OWNER: 'RAGHAV@JANKI108',
  CAPTAIN: 'RADHA@DAMODAR108',
  DISTRIBUTOR: 'RAM@HANUMAN108',
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body || {};
  if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });

  // find user in User_Z table using raw query (schema has mixed generated names)
  const users: any[] = await prisma.$queryRaw`SELECT * FROM "User_Z" WHERE email = ${email} LIMIT 1`;
  const user = users[0];
  

  // check temp passwords first
  const matchedTemp = Object.entries(TEMP_PASSWORDS).find(([, v]) => v === password);
  if (matchedTemp && !user) {
    const userType = matchedTemp[0];
    const storeType = userType === 'STORE_OWNER' ? 'NORMAL' : userType === 'VEC_STORE_OWNER' ? 'VEC' : null;
    return NextResponse.json({ needsRegistration: true, userType, prepopulated: { storeType: storeType || null } });
  } else if (!user) {
    return NextResponse.json({ error: 'not_registered' }, { status: 404 });
  }

  // normal password check
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  // create token and set cookie
  const token = createToken({ id: user.id, userType: user.userType });
  const res = NextResponse.json({ success: true });
  res.cookies.set('marathon_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
