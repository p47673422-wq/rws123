import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    // optional: accept json { email } to clear remember token server-side
    let email: string | null = null;
    try {
      const body = await req.json();
      email = body?.email || null;
    } catch (e) {
      // ignore
    }

    if (email) {
      const p: any = prisma;
      await p.user_Z.updateMany({ where: { email: email.toLowerCase() }, data: { rememberMeToken: null, rememberMeExpiry: null } });
    }

    const res = NextResponse.json({ ok: true });
    // clear cookie
    res.cookies.set('ram_remember', '', { maxAge: 0 });
    return res;
  } catch (err) {
    console.error('POST /api/ram/auth/logout', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
