import { NextResponse } from "next/server";
// API for editing items in a return request
export async function PATCH(request: Request) {
  // Edit items/quantities in return
  return NextResponse.json({ success: true });
}
