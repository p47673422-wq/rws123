import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, answers } = await req.json() as any;
    if (!email || !answers) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    const p: any = prisma;
    let user = await p.userz?.findUnique({ where: { email: email.toLowerCase() } }) || await p.user_Z?.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ ok: false, message: 'User not found' }, { status: 404 });

    // answers: [{ idx, answer }]
    const aMap: Record<number, string> = {};
    for (const a of answers) {
      const idx = Number(a.idx);
      aMap[idx] = String(a.answer || '').trim().toLowerCase();
    }

    const sa1 = (user.securityAnswer1 || '') + '';
    const sa2 = (user.securityAnswer2 || '') + '';
    const ok1 = !user.securityQuestion1 || (String(sa1).trim().toLowerCase() === (aMap[Number(user.securityQuestion1)] || '').trim().toLowerCase());
    const ok2 = !user.securityQuestion2 || (String(sa2).trim().toLowerCase() === (aMap[Number(user.securityQuestion2)] || '').trim().toLowerCase());

    if (!ok1 || !ok2) return NextResponse.json({ ok: false, message: 'Answers do not match' }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('forgot-verify', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
