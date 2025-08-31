import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderItem } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get user info from query (mobile is unique)
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get('mobile');
    if (!mobile) return NextResponse.json({ error: 'Missing mobile' }, { status: 400 });

    // Cart items (OrderItems for this user, only for orders not delivered)
    const user = await prisma.user.findUnique({ where: { mobile } });
    let cartItems: OrderItem[] = [];
    if (user) {
      const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { items: true } });
      // Get delivered orderIds
      const deliveredStatuses = await prisma.orderDeliveryStatus.findMany({ where: { delivered: true }, select: { orderId: true } });
      const deliveredOrderIds = new Set(deliveredStatuses.map(s => s.orderId));
      cartItems = orders.filter(order => !deliveredOrderIds.has(order.id)).flatMap(order => order.items.map(item => ({ ...item, orderId: order.id })));
    }

    // Bhagavad Gita registration
    const gitaRegs = await prisma.bhagavadGitaRegistration.findMany({ where: { mobile } });

    // Quiz progress and scores
    const progresses = await prisma.progress.findMany({ where: { userId: user?.id } });
    const attempts = await prisma.quizAttempt.findMany({ where: { userId: user?.id } });
    const quiz = await prisma.quiz.findMany();

    return NextResponse.json({
      cartItems,
      gitaRegs,
      progresses,
      attempts,
      quiz,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
