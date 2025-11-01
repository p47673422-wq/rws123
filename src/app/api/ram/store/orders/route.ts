import { NextResponse } from "next/server";
// Dummy API for store orders
export async function GET() {
  // Return list of orders
  return NextResponse.json([
    { id: "ORD001", distributor: "Amit", books: [{ name: "BG", qty: 5 }, { name: "SSR", qty: 5 }], amount: 1200, status: "Pending", otp: "" },
    { id: "ORD002", distributor: "Sita", books: [{ name: "TTM", qty: 5 }], amount: 600, status: "Packed", otp: "123456" },
  ]);
}

export async function PATCH(request: Request) {
  // Update order status, OTP, or inline edit
  return NextResponse.json({ success: true });
}
