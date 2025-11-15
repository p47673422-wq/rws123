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

    const requester = await prisma.user_Z.findUnique({ where: { id: decoded.id }, select: { id: true, storeType: true, userType: true } });
    if (!requester || (requester.userType !== 'STORE_OWNER' && requester.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Find users that match the storeType of the requester (exclude the requester themselves)
    const users = await prisma.user_Z.findMany({ where: { storeType: requester.storeType, id: { not: requester.id } }, orderBy: { createdAt: 'desc' } });

    const results = await Promise.all(users.map(async (u) => {
      // Fetch preorders, returns, payments for this distributor
      const [preOrders, returnReqs, payments] = await Promise.all([
        prisma.preOrder_Z.findMany({ where: { distributorId: u.id } }),
        prisma.returnRequest_Z.findMany({ where: { distributorId: u.id } }),
        prisma.paymentRequest_Z.findMany({ where: { distributorId: u.id } })
      ]);

      // Helper to aggregate items into map { bookId: { qty, amount, title, language } }
      const aggItems = async (rows: any[], usePriceFromBook = true) => {
        const map: Record<string, any> = {};
        for (const r of rows) {
          const items = Array.isArray(r.items) ? r.items : [];
          for (const it of items) {
            const book = await prisma.book_Z.findUnique({ where: { id: it.bookId } });
            const title = book?.name || it.title || it.bookName || '';
            const language = book?.language || it.language || '';
            const price = (it.price ?? book?.price) || 0;
            if (!map[it.bookId]) map[it.bookId] = { bookId: it.bookId, title, language, qty: 0, amount: 0, price };
            const qty = Number(it.quantity) || 0;
            map[it.bookId].qty += qty;
            map[it.bookId].amount += qty * price;
          }
        }
        return Object.values(map);
      };

      const preAgg = await aggItems(preOrders);
      const returnAgg = await aggItems(returnReqs);
      const paymentAgg = await aggItems(payments);

      const sum = (arr: any[]) => arr.reduce((s, a) => s + (a.amount || 0), 0);

      const preAmount = sum(preAgg);
      const returnAmount = sum(returnAgg);
      // paidAmount should be taken from the payment requests' totalAmount
      const paidAmount = payments.reduce((s, p) => s + (Number(p.totalAmount) || 0), 0);

      // build maps by bookId for qty calculations
      const mapFromArr = (arr: any[]) => arr.reduce((m: Record<string, any>, a) => { m[a.bookId] = a; return m; }, {} as Record<string, any>);
      const preMap = mapFromArr(preAgg);
      const returnMap = mapFromArr(returnAgg);
      const paymentMap = mapFromArr(paymentAgg);

      // pending items = preorder qty - return qty - payment qty (per book)
      const pendingItems: any[] = [];
      for (const bookId in preMap) {
        const pre = preMap[bookId];
        const ret = returnMap[bookId];
        const pay = paymentMap[bookId];
        const pendingQty = (pre.qty || 0) - (ret?.qty || 0) - (pay?.qty || 0);
        if (pendingQty > 0) {
          pendingItems.push({ bookId, title: pre.title, language: pre.language, qty: pendingQty, price: pre.price });
        }
      }

      // paid items = items from payment requests (paymentAgg)
      const paidItems = paymentAgg;

      const pendingAmount = Math.max(0, preAmount - returnAmount - paidAmount);

      return {
        id: u.id,
        name: u.name,
        phone: u.phone,
        createdAt: u.createdAt,
        preAmount,
        returnAmount,
        paidAmount,
        pendingAmount,
        preItems: preAgg,
        returnItems: returnAgg,
        paymentItems: paymentAgg,
        paidItems,
        pendingItems
      };
    }));

    return NextResponse.json(results);
  } catch (err) {
    console.error('store-users error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
