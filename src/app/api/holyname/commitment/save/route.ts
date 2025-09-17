import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, roundsPerDay, friendsToInspire, joinJapa } = await req.json();
  if (!userId || roundsPerDay == null || friendsToInspire == null || joinJapa == null) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const commitment = await prisma.commitment_x.create({
      data: { userId, roundsPerDay, friendsToInspire, joinJapa },
    });
    return NextResponse.json({ commitment });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
