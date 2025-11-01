import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

const QUESTIONS = [
  "Which Krishna pastime inspires you most?",
  "Name of your first distributed book",
  "Your spiritual guide's name",
  "City where you serve",
];

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as any;
    if (!email) return NextResponse.json({ ok: false, message: 'Missing email' }, { status: 400 });
    const p: any = prisma;
    let user = await p.userz?.findUnique({ where: { email: email.toLowerCase() } }) || await p.user_Z?.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ ok: false, code: 'NOT_FOUND', message: "Account doesn't exist. Please use your temp password to create an account." }, { status: 404 });

    // attempt to read question indexes
    const q1 = user.securityQuestion1 ?? null;
    const q2 = user.securityQuestion2 ?? null;
    const questions = [] as any[];
    if (q1 !== null && q1 !== undefined) questions.push({ idx: Number(q1), text: QUESTIONS[Number(q1)] || QUESTIONS[0] });
    if (q2 !== null && q2 !== undefined) questions.push({ idx: Number(q2), text: QUESTIONS[Number(q2)] || QUESTIONS[1] });

    return NextResponse.json({ ok: true, questions });
  } catch (err) {
    console.error('forgot-start', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
