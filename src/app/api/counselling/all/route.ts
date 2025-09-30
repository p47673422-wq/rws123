import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  let where = {};
  if (date) {
    // Filter by preferredDate (date only)
    where = {
      preferredDate: {
        gte: new Date(date + "T00:00:00.000Z"),
        lt: new Date(date + "T23:59:59.999Z")
      }
    };
  }
  const data = await prisma.counsellingRequest.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ data });
}
