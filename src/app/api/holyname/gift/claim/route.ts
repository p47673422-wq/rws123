import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, level, type } = await req.json();
  if (!userId || !level || !type) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const gift = await prisma.gift_x.upsert({
      where: { userId_level_type: { userId, level, type } },
      update: { unlocked: true },
      create: { userId, level, type, name: `${type} Level ${level} Gift`, unlocked: true },
    });
    const answers = await prisma.quizAnswer_x.findMany({ where: { userId } });
    const commitments = await prisma.commitment_x.findMany({ where: { userId } });
    const japa = await prisma.japaProgress_x.findMany({ where: { userId } });
    const gifts = await prisma.gift_x.findMany({ where: { userId } });
    return NextResponse.json({ gift, answers, commitments, japa, gifts });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
