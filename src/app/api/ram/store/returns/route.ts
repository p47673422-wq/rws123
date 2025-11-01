import { NextResponse } from "next/server";
// Dummy API for store returns
export async function GET() {
  // Return list of returns
  return NextResponse.json([
    { id: "RET001", distributor: "Amit", books: [{ name: "BG", qty: 2 }], reason: "Damaged", status: "Pending" },
    { id: "RET002", distributor: "Sita", books: [{ name: "SSR", qty: 1 }], reason: "Wrong item", status: "Accepted" },
  ]);
}

export async function PATCH(request: Request) {
  // Update return status, reason, etc.
  return NextResponse.json({ success: true });
}
