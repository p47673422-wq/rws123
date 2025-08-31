import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/purchase/checkout
export async function POST(request: Request) {
  const data = await request.json();
  const { user, items, total } = data;
  if (!user || !user.mobile || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: false, error: "Missing user or items" }, { status: 400 });
  }
  try {
    // 1. Find or create user
    const dbUser = await prisma.user.upsert({
      where: { mobile: user.mobile },
      update: {
        name: user.name,
        gender: user.gender,
        address: user.address,
        ...(user.maritalStatus !== undefined ? { maritalStatus: user.maritalStatus } : {})
      },
      create: {
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        address: user.address,
        ...(user.maritalStatus !== undefined ? { maritalStatus: user.maritalStatus } : {})
      },
    });
    // 2. Create order
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        total,
        items: {
          create: items.map((item: any) => ({
            title: item.title,
            price: item.price,
            qty: item.qty,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
