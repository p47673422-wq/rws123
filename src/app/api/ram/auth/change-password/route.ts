import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { userId, oldPassword, newPassword } = await req.json() as any;
    if (!userId || !newPassword) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    const p: any = prisma;

    let user = await p.userz?.findUnique({ where: { id: userId } }) || await p.user_Z?.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ ok: false, message: "Your account doesn't exist. Please login via temp password." }, { status: 404 });

    const hashed = user.password_hash || user.password || '';
    if (!oldPassword) return NextResponse.json({ ok: false, message: 'Old password required' }, { status: 400 });
    const valid = await bcrypt.compare(oldPassword, hashed).catch(() => false);
    if (!valid) return NextResponse.json({ ok: false, message: 'Old password incorrect.' }, { status: 401 });

    const newHashed = await bcrypt.hash(newPassword, 10);
    const data: any = { password_hash: newHashed, isFirstLogin: false, updatedAt: new Date() };
    if (p.userz) {
      await p.userz.update({ where: { id: userId }, data });
    } else if (p.user_Z) {
      await p.user_Z.update({ where: { id: userId }, data });
    } else {
      return NextResponse.json({ ok: false, message: 'Prisma user model not found' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('ram change-password', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
