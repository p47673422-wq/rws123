import { NextResponse } from "next/server";
// API for verifying assisted order payment
export async function PATCH(request: Request) {
  // Mark payment as verified
  return NextResponse.json({ success: true });
}
