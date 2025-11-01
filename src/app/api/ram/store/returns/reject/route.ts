import { NextResponse } from "next/server";
// API for rejecting a return request
export async function PATCH(request: Request) {
  // Reject return, notify distributor
  return NextResponse.json({ success: true });
}
