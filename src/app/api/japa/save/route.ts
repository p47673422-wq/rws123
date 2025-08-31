import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { mobile, chantCount } = data;
    if (!mobile || typeof chantCount !== 'number') {
      return NextResponse.json({ success: false, error: 'Missing mobile or chantCount' }, { status: 400 });
    }
    // Find user by mobile
    const user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    // Upsert JapaChant record (one per user)
    await prisma.japaChant.upsert({
      where: { userId: user.id },
      update: { chantCount },
      create: {
        userId: user.id,
        chantCount,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
