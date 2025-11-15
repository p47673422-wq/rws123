import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Ensure requester is a store owner
    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { userType: true, storeType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) return NextResponse.json({ error: 'phone_required' }, { status: 400 });

    const normalizedPhone = phone.replace(/\D/g, '');

    const user = await prisma.user_Z.findFirst({ where: { phone: normalizedPhone } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const distributorId = user.id;

    // Get captain info if available
    let captainInfo: any = null;
    if (user.captainId) {
      captainInfo = await prisma.user_Z.findUnique({
        where: { id: user.captainId },
        select: { id: true, name: true, phone: true }
      });
    }

    // Fetch orders for this distributor
    const ordersRaw = await prisma.preOrder_Z.findMany({ where: { distributorId }, orderBy: { createdAt: 'desc' } });

    // Map order items to include book details
    const orders = await Promise.all(ordersRaw.map(async (o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      const enriched = await Promise.all(items.map(async (it: any) => {
        const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
        return {
          bookId: it.bookId,
          title: book?.name || null,
          language: book?.language || null,
          quantity: it.quantity,
          price: book?.price ?? it.price ?? null
        };
      }));
      // include store owner (who created the order) if available
      let storeOwner: any = null;
      if ((o as any).storeOwnerId) {
        const so = await prisma.user_Z.findUnique({ where: { id: (o as any).storeOwnerId }, select: { id: true, name: true, phone: true } });
        if (so) storeOwner = so;
      }
      return { id: o.id, status: o.status, createdAt: o.createdAt, items: enriched, storeOwner };
    }));

    // Fetch returns for this distributor
    const returnsRaw = await prisma.returnRequest_Z.findMany({ where: { distributorId }, orderBy: { createdAt: 'desc' } });
    const returns = await Promise.all(returnsRaw.map(async (r) => {
      const items = Array.isArray(r.items) ? r.items : [];
      const enriched = await Promise.all(items.map(async (it: any) => {
        const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
        return {
          bookId: it.bookId,
          title: book?.name || null,
          language: book?.language || null,
          quantity: it.quantity
        };
      }));
      let storeOwner: any = null;
      if ((r as any).storeOwnerId) {
        const so = await prisma.user_Z.findUnique({ where: { id: (r as any).storeOwnerId }, select: { id: true, name: true, phone: true } });
        if (so) storeOwner = so;
      }
      return { id: r.id, status: r.status, createdAt: r.createdAt, reason: r.reason, items: enriched, storeOwner };
    }));

    // Fetch payments for this distributor
    const paymentsRaw = await prisma.paymentRequest_Z.findMany({ where: { distributorId }, orderBy: { createdAt: 'desc' } });
    const payments = await Promise.all(paymentsRaw.map(async (p) => {
      const items = Array.isArray(p.items) ? p.items : [];
      const enriched = await Promise.all(items.map(async (it: any) => {
        const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
        return {
          bookId: it.bookId,
          title: book?.name || null,
          language: book?.language || null,
          quantity: it.quantity,
          price: it.price ?? book?.price ?? null
        };
      }));
      // payment may have been verified by a store owner; include that user
      let storeOwner: any = null;
      if ((p as any).verifiedById) {
        const so = await prisma.user_Z.findUnique({ where: { id: (p as any).verifiedById }, select: { id: true, name: true, phone: true } });
        if (so) storeOwner = so;
      }
      return { id: p.id, status: p.status, createdAt: p.createdAt, totalAmount: p.totalAmount, items: enriched, storeOwner };
    }));

    // Calculate order summary
    const orderSummary = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      accepted: orders.filter(o => o.status === 'ACCEPTED').length,
      rejected: orders.filter(o => o.status === 'REJECTED').length
    };

    return NextResponse.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      userType: user.userType,
      storeType: user.storeType,
      captainId: user.captainId,
      captainName: captainInfo?.name,
      captainPhone: captainInfo?.phone,
      createdAt: user.createdAt,
      isPartialUser: !user.email && !user.password_hash,
      orderSummary,
      orders,
      returns,
      payments
    });
  } catch (err) {
    console.error('team-member details error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
