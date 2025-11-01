import { NextResponse } from "next/server";
// Dummy API for store inventory
export async function GET() {
  // Return inventory and history
  return NextResponse.json({
    inventory: [
      { id: 1, book: "BG", language: "EN", quantity: 8, lastUpdated: "2025-10-25" },
      { id: 2, book: "SSR", language: "EN", quantity: 25, lastUpdated: "2025-10-24" },
    ],
    history: [
      { date: "2025-10-25", book: "BG", change: "+8", reason: "New Stock Arrival", updatedBy: "Amit" },
      { date: "2025-10-24", book: "SSR", change: "-2", reason: "Return", updatedBy: "Sita" },
    ]
  });
}

export async function PATCH(request: Request) {
  // Update inventory, log transaction
  return NextResponse.json({ success: true });
}
