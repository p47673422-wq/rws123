import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const userId = req.url.split("?userId=")[1];
  if (!userId) {
    return NextResponse.json({ error: "Missing userId." }, { status: 400 });
  }
  try {
    const user = await prisma.user_x.findUnique({
      where: { id: userId },
      include: {
        quizAnswers: true,
        commitments: true,
        japaProgress: true,
        gifts: true,
        badges: true,
      },
    });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
