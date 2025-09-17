import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, mobile, gender, address } = await req.json();
  if (!name || !mobile || !gender || !address) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const user = await prisma.user_x.upsert({
      where: { mobile },
      update: { name, gender, address },
      create: { name, mobile, gender, address },
    });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
