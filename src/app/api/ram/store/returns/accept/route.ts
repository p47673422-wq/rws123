import { NextResponse } from "next/server";
// API for accepting a return request
export async function PATCH(request: Request) {
  // Accept return, update inventories, notify
  return NextResponse.json({ success: true });
}
