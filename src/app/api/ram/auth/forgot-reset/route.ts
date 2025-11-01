import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as any;
    if (!email || !password) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    const p: any = prisma;
    let user = await p.userz?.findUnique({ where: { email: email.toLowerCase() } }) || await p.user_Z?.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });

    const hashed = await bcrypt.hash(password, 10);
    const data: any = { password_hash: hashed, isFirstLogin: false, updatedAt: new Date() };

    if (p.userz) {
      await p.userz.update({ where: { email: email.toLowerCase() }, data });
    } else if (p.user_Z) {
      await p.user_Z.update({ where: { email: email.toLowerCase() }, data });
    } else {
      return NextResponse.json({ ok: false, message: 'Prisma user model not found' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('forgot-reset', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
