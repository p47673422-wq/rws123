import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../lib/prisma';

// Return minimal current-user info for client pages
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ ok: false, error: 'NOT_AUTHENTICATED' }, { status: 401 });

    const userId = (token as any).userId || (token as any).sub || null;
    if (!userId) return NextResponse.json({ ok: false, error: 'INVALID_TOKEN' }, { status: 401 });

    // runtime-safe lookup: try different possible model names
    let user: any = null;
    if ((prisma as any).userz) {
      user = await (prisma as any).userz.findUnique({ where: { id: String(userId) } });
    } else if ((prisma as any).user_Z) {
      user = await (prisma as any).user_Z.findUnique({ where: { id: String(userId) } });
    } else if ((prisma as any).user) {
      user = await (prisma as any).user.findUnique({ where: { id: String(userId) } });
    }

    if (!user) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });

    const out = {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role || user.userType || null,
        isFirstLogin: !!(user.isFirstLogin || user.is_first_login),
        tempPasswordType: user.tempPasswordType || user.temp_password_type || null,
        storeType: user.storeType || user.store_type || user.storeTypeAccess || null,
        captainId: user.captainId || null,
      },
    };

    return NextResponse.json(out);
  } catch (err) {
    console.error('me route error', err);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}
