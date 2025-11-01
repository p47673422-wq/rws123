import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, storeOwnerId, distributorId } = body || {};
    if (!items || !Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 });

    let distId = distributorId as string | undefined | null;
    // try to infer from token if missing
    if (!distId) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (token && (token as any).userId) distId = String((token as any).userId);
    }

    // storeOwnerId may be omitted for now

    // create preorder record
    const po = await (prisma as any).preOrder_Z.create({
      data: {
        distributorId,
        storeOwnerId,
        items: items as any,
      },
    });

    return NextResponse.json({ ok: true, id: po.id });
  } catch (err) {
    console.error('POST /api/ram/distributor/preorder', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
