import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { quizDefinition } from "@/lib/quizDefinition";

const prisma = new PrismaClient();
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;

  const attempts = await prisma.attemptb.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(attempts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, profile, quizId, answers } = body;

  if (!userId || !quizId || !answers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 1) Ensure user exists in UserProfileb
  let user = await prisma.userProfileb.findUnique({
    where: { id: userId }
  });

  if (!user) {
    // Auto-create profile
    user = await prisma.userProfileb.create({
      data: {
        id: userId,
        name: profile?.name || "Unknown",
        mobile: profile?.mobile || "",
        gender: profile?.gender || null,
        marital: profile?.marital || null,
        meta: profile || {}
      }
    });
  }

  // 2) Compute score
  const score = computeScore(quizDefinition, answers);

  // 3) Save attempt
  const saved = await prisma.attemptb.create({
    data: {
      userId: userId,
      profile: profile,
      quizId,
      answers,
      score
    }
  });

  return NextResponse.json(saved);
}

function computeScore(quiz: any, answers: any) {
  let total = 0;
  let max = 0;

  quiz.sections.forEach((sec: any) => {
    sec.items.forEach((q: any) => {
      if (!q.graded) return;
      max += 1;
      const user = answers[q.id];

      let ok = false;

      if (q.type === "single-choice" || q.type === "true-false") {
        ok = user === q.answerIndex;
      } else if (q.type === "multi-choice") {
        const correct = q.answerIndexes.slice().sort().join(",");
        const userAns = (user || []).slice().sort().join(",");
        ok = correct === userAns;
      } else if (q.type === "match") {
        ok = JSON.stringify(user) === JSON.stringify(q.correctMap);
      }

      if (ok) total += 1;
    });
  });

  return { total, max };
}
