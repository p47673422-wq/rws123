import { NextResponse } from "next/server";
// import webpush from "web-push";

// Send push notification
export async function POST(request: Request) {
  // Use web-push to send notification (dummy)
  return NextResponse.json({ success: true });
}
