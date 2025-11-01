import { NextResponse } from "next/server";
// Save push subscription
export async function POST(request: Request) {
  // Save subscription to DB (dummy)
  return NextResponse.json({ success: true });
}
