import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, day, rounds } = await req.json();
  if (!userId || !day || !rounds) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const japa = await prisma.japaProgress_x.upsert({
      where: { userId_day: { userId, day } },
      update: { rounds },
      create: { userId, day, rounds },
    });
    return NextResponse.json({ japa });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
