import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get('mobile');
  const language = searchParams.get('language');
  if (!mobile || !language) {
    return NextResponse.json({ error: 'Missing mobile or language' }, { status: 400 });
  }
  const exists = await prisma.bhagavadGitaRegistration.findUnique({
    where: { mobile_language: { mobile, language } },
  });
  return NextResponse.json({ exists: !!exists });
}
