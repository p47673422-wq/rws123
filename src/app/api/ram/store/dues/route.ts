import { NextResponse } from "next/server";
// Dummy API for store dues
export async function GET() {
  // Return list of dues
  return NextResponse.json([
    { name: "Amit", pendingAmount: 8000, lastPaymentDate: "2025-10-10", daysOverdue: 10 },
    { name: "Sita", pendingAmount: 3000, lastPaymentDate: "2025-10-20", daysOverdue: 2 },
    { name: "Ram", pendingAmount: 0, lastPaymentDate: "2025-10-25", daysOverdue: 0 },
  ]);
}

export async function PATCH(request: Request) {
  // Update dues, record payment, send reminder
  return NextResponse.json({ success: true });
}
