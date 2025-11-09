import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, payload } = body || {};

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    // Normalize VAPID contact/subject. It must be a mailto: or a URL.
    let subject = process.env.VAPID_CONTACT || 'mailto:admin@example.com';
    if (subject && !subject.includes(':')) {
      // if user provided just an email like `me@domain.com`, convert to mailto:
      subject = `mailto:${subject}`;
    }

    if (!publicKey || !privateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const message = JSON.stringify(payload || { title: 'Hello', body: 'Test' });

    if (subscription) {
      await webpush.sendNotification(subscription, message);
      return NextResponse.json({ success: true });
    }

    // broadcast to all saved subscriptions
  const subs = await (prisma as any).pushSubscription.findMany();
    const results: any[] = [];
    for (const s of subs) {
      try {
        const subObj = { endpoint: s.endpoint, keys: s.keys };
        await webpush.sendNotification(subObj as any, message);
        results.push({ endpoint: s.endpoint, ok: true });
      } catch (e: any) {
        console.warn('Failed to send to', s.endpoint, e?.message || e);
        // Remove subscription if it's gone or invalid
        const statusCode = e?.statusCode || e?.status || null;
        if (statusCode === 410 || statusCode === 404) {
          try {
            await (prisma as any).pushSubscription.delete({ where: { endpoint: s.endpoint } });
            results.push({ endpoint: s.endpoint, ok: false, removed: true });
            continue;
          } catch (removeErr) {
            console.warn('Failed to remove subscription', s.endpoint, removeErr);
          }
        }
        results.push({ endpoint: s.endpoint, ok: false, error: e?.message || String(e) });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('web-push error', err);
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 });
  }
}