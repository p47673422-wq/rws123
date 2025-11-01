import { NextResponse } from "next/server";
// Dummy API for store payments
export async function GET() {
  // Return list of payments
  return NextResponse.json([
    {
      id: 1,
      distributor: "Amit",
      avatar: "/public/iskcon-logo.png",
      amount: 1200,
      image: "/public/iskcon-logo.png",
      books: [{ name: "BG", qty: 5 }, { name: "SSR", qty: 5 }],
      date: "2025-10-25",
      status: "Pending",
    },
    {
      id: 2,
      distributor: "Sita",
      avatar: "/public/iskcon-logo.png",
      amount: 600,
      image: "/public/iskcon-logo.png",
      books: [{ name: "TTM", qty: 5 }],
      date: "2025-10-24",
      status: "Pending",
    },
  ]);
}

export async function PATCH(request: Request) {
  // Update payment status, verification, rejection
  return NextResponse.json({ success: true });
}
