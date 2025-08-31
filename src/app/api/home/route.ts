import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Welcome to ISKCON Radha Madan Mohan Home API" });
}
