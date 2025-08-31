import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, mobile, gender, address, maritalStatus, language, isOffline } = data;
  if (!name || !mobile || !gender || !address || !language || typeof isOffline === 'undefined') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          mobile,
          gender,
          address,
          maritalStatus,
        },
      });
    }

    // Create registration (if not exists)
    const reg = await prisma.bhagavadGitaRegistration.upsert({
      where: { mobile_language: { mobile, language } },
      update: {},
      create: {
        name,
        mobile,
        gender,
        address,
        maritalStatus,
        language,
    isOffline,
      },
    });

    return NextResponse.json({ success: true, reg });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
