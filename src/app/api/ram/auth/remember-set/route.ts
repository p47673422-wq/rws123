import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, expiry } = body as { email?: string; token?: string; expiry?: number };
    if (!email || !token || !expiry) return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    const p: any = prisma;
    // Hash token before storing
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await p.userz.updateMany({ where: { email: email.toLowerCase() }, data: { rememberMeToken: tokenHash, rememberMeExpiry: new Date(expiry) } });

    // set HttpOnly cookie with raw token (server sets it); 30 minutes
    const resp = NextResponse.json({ ok: true });
    resp.headers.append('Set-Cookie', `ram_rem=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 60}`);
    return resp;
  } catch (err) {
    console.error('remember-set error', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
