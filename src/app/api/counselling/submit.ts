import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, mobile, maritalStatus, gender, preferredDate, preferredTime } = data;
    if (!name || !mobile || !maritalStatus || !gender || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const counselling = await prisma.counsellingRequest.create({
      data: {
        name,
        mobile,
        maritalStatus,
        gender,
        preferredDate: new Date(preferredDate),
        preferredTime
      }
    });
    return NextResponse.json({ success: true, id: counselling.id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save counselling request" }, { status: 500 });
  }
}
