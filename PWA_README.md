PWA + Push Setup

Files added:
- `public/manifest.json` - Web App Manifest
- `public/sw.js` - Simple service worker for caching and push display
- `src/components/PWARegister.tsx` - Client-side installer & SW registration
- `src/app/api/push/subscribe/route.ts` - Endpoint to receive subscription (needs persisting)
- `src/app/api/push/send/route.ts` - Endpoint to send push notifications (uses web-push)

Steps to enable push notifications:

1. Install optional dependency (or add to dependencies):

   npm install web-push

2. Generate VAPID keys (one-time):

   node -e "const webpush=require('web-push');console.log(JSON.stringify(webpush.generateVAPIDKeys()));"

   Save the resulting public/private keys and set them in env:

   VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   VAPID_CONTACT=mailto:you@example.com

Vercel notes:
- You can generate VAPID keys locally (see command above) and then add them to your Vercel project's Environment Variables (Dashboard → Settings → Environment Variables) as `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` (set for Production). `VAPID_CONTACT` can be your admin email.
- Vercel will set `VERCEL_GIT_COMMIT_SHA` automatically; `/api/version` uses that to let client detect new deploys.

3. Start the app and subscribe from the browser:
   - The service worker will be registered automatically.
   - Use the browser devtools Application -> Service Workers to inspect.

4. Persist subscription returned by the client to your DB (in `subscribe` handler).

5. To send push notifications, POST to `/api/push/send` with body { subscription, payload }.

Database migration:
- I added a `PushSubscription` Prisma model. Run the migration:

   npx prisma generate
   npx prisma migrate dev --name add_push_subscription

Build-time SW versioning:
- The build script now calls `node ./scripts/write-sw-version.js` to write `public/sw.js` from `public/sw.template.js`, embedding the current `VERCEL_GIT_COMMIT_SHA` (or a timestamp). This ensures cache names change after each deploy and the SW lifecycle detects updates.

Broadcast sending:
- `POST /api/push/send` without a `subscription` will broadcast to all saved subscriptions in the DB.

Send a "Thanks for installing" broadcast (local):

1. Ensure your app is running locally (or set BASE_URL to your deployed URL).
2. Run the helper script:

```powershell
BASE_URL=http://localhost:3000 node ./scripts/send-thanks.js
```

This will POST to `/api/push/send` with a small payload and the server will broadcast to all saved subscriptions. The route removes invalid subscriptions automatically.

Notes:
- For production-grade caching and automatic update-on-deploy, consider using `next-pwa` or Workbox.
- Browser push requires HTTPS in production.
- For immediate SW takeover after deploy, bump `CACHE_NAME` in `sw.js` (can be automated at build time).
