import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const endpoint = body.endpoint;
    if (!endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });

    // upsert subscription (cast prisma to any to avoid generated-type issues)
    await (prisma as any).pushSubscription.upsert({
      where: { endpoint },
      update: { keys: body.keys },
      create: { endpoint, keys: body.keys }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}