import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const regs = await prisma.bhagavadGitaRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ registrations: regs });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
