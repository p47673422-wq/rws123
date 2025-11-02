import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const users: any[] = await prisma.$queryRaw`SELECT id, name, "storeType" FROM "User_Z" WHERE "userType" = 'CAPTAIN' ORDER BY name`;
  return NextResponse.json({ captains: users });
}
