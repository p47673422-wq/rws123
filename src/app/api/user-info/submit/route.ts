import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  const { name, mobile, gender, address, maritalStatus } = data;
  try {
    const user = await prisma.user.upsert({
      where: { mobile },
      update: { name, gender, address, maritalStatus },
      create: { name, mobile, gender, address, maritalStatus },
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
