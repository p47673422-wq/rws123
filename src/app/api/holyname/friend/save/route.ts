import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, name, mobile, address, gender, maritalStatus } = await req.json();
  if (!userId || !name || !mobile || !address || !gender || !maritalStatus) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  try {
    const friend = await prisma.friend_x.create({
      data: { userId, name, mobile, address, gender, maritalStatus },
    });
    return NextResponse.json({ friend });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
