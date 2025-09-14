import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaders = await prisma.rewardProgress.findMany({
      orderBy: { totalStrength: 'desc' },
      take: 50,
      include: { user: true },
    });
    return NextResponse.json({ leaders });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
