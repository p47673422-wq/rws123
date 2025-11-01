import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone, name, amount, orderId } = await request.json();
  const message = `🙏 Hare Krishna! Dear ${name}, this is a reminder to submit payment of ₹${amount} for books received. Order ID: ${orderId}. Please submit at your earliest. 📚`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  // Log reminder sent in notifications (dummy)
  return NextResponse.json({ url });
}
