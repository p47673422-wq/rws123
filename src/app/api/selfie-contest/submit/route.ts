import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { instagram } = await req.json();
    if (!instagram || typeof instagram !== "string") {
      return NextResponse.json({ error: "Instagram handle is required." }, { status: 400 });
    }
    const submission = await prisma.selfieSubmission.create({
      data: { instagram },
    });
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
  }
}
