import { NextResponse } from "next/server";
import { PrismaClient, GiftType_x } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, level, answers, isComplete } = await req.json();
  if (!userId || !level || !answers || !Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    // Upsert all answers, saving null for unattempted
    const quizAnswers = await Promise.all(
      answers.map((ans, idx) =>
        prisma.quizAnswer_x.upsert({
          where: {
            userId_level_questionKey: {
              userId,
              level,
              questionKey: `q${idx+1}`,
            },
          },
          update: { answer: ans },
          create: { userId, level, questionKey: `q${idx+1}`, answer: ans },
        })
      )
    );
    let gift = null;
    if (isComplete) {
      gift = await prisma.gift_x.upsert({
        where: { userId_level_type: { userId, level, type: GiftType_x.QUIZ } },
        update: { unlocked: true },
        create: { userId, level, type: GiftType_x.QUIZ, name: `Quiz Level ${level} Gift`, unlocked: true },
      });
    }
    return NextResponse.json({ quizAnswers, gift });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
