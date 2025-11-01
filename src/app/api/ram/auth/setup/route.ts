import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

const QUESTIONS = [
  "Which Krishna pastime inspires you most?",
  "Name of your first distributed book",
  "Your spiritual guide's name",
  "City where you serve",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, security, captainId, storeType, password } = body as any;
    if (!email || !password) return NextResponse.json({ ok: false, message: 'Missing email or password' }, { status: 400 });

    const prismaAny = prisma as any;
    // find user by email across possible model names
    let user = await prismaAny.userz?.findUnique({ where: { email: email.toLowerCase() } }) || await prismaAny.user_Z?.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });

    const hashed = await bcrypt.hash(password, 10);

    const dataToUpdate: any = {
      name: name || user.name,
      phone: phone || user.phone,
      isFirstLogin: false,
      updatedAt: new Date(),
    };

    if (security && Array.isArray(security)) {
      // expect two items
      if (security[0]) {
        dataToUpdate.securityQuestion1 = Number(security[0].questionIdx ?? 0);
        dataToUpdate.securityAnswer1 = String((security[0].answer || '')).trim();
      }
      if (security[1]) {
        dataToUpdate.securityQuestion2 = Number(security[1].questionIdx ?? 0);
        dataToUpdate.securityAnswer2 = String((security[1].answer || '')).trim();
      }
    }

    if (captainId) dataToUpdate.captainId = captainId;
    if (storeType) dataToUpdate.storeType = storeType;
    // store hashed password
    dataToUpdate.password_hash = hashed;

    // update using the detected model
    if (prismaAny.userz) {
      await prismaAny.userz.update({ where: { email: email.toLowerCase() }, data: dataToUpdate });
    } else if (prismaAny.user_Z) {
      await prismaAny.user_Z.update({ where: { email: email.toLowerCase() }, data: dataToUpdate });
    } else {
      return NextResponse.json({ ok: false, message: 'Prisma user model not found' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('setup error', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
