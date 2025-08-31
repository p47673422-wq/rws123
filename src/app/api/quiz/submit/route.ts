import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  const { name, mobile, gender, address, maritalStatus, answers, score, quizType, quizTitle, maxScore, pName, percent } = data;
  try {
    // 1. Find or create user
    const user = await prisma.user.upsert({
      where: { mobile },
      update: {
        name,
        gender,
        address,
        ...(maritalStatus !== undefined ? { maritalStatus } : {})
      },
      create: {
        name,
        mobile,
        gender,
        address,
        ...(maritalStatus !== undefined ? { maritalStatus } : {})
      },
    });
    // 2. Find or create quiz
    const quiz = await prisma.quiz.upsert({
      where: { type: quizType },
      update: { title: quizTitle, maxScore },
      create: { title: quizTitle, type: quizType, maxScore },
    });
    // 3. Calculate reward points (example: 10 per correct answer)
    const reward = score * 10;
    // 4. Create attempt
    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        answers,
        score,
        reward,
      },
    });
    // 5. Update or create progress for this P
    if (pName && percent !== undefined) {
      await prisma.progress.upsert({
        where: { userId_pName: { userId: user.id, pName } },
        update: { completed: percent >= 12.5, percent },
        create: { userId: user.id, pName, completed: percent >= 12.5, percent },
      });
    }
  return NextResponse.json({ success: true, reward, userId: user.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
