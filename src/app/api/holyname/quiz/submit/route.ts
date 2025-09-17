import { NextResponse } from "next/server";
import { PrismaClient, GiftType_x } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, level, questionKey, answer, isComplete } = await req.json();
  if (!userId || !level || !questionKey || !answer) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const quizAnswer = await prisma.quizAnswer_x.create({
      data: { userId, level, questionKey, answer },
    });
    let gift = null;
    if (isComplete) {
      gift = await prisma.gift_x.upsert({
        where: { userId_level_type: { userId, level, type: GiftType_x.QUIZ } },
        update: { unlocked: true },
        create: { userId, level, type: GiftType_x.QUIZ, name: `Quiz Level ${level} Gift`, unlocked: true },
      });
    }
    return NextResponse.json({ quizAnswer, gift });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
