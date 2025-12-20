const CACHE_NAME = 'mykrishna-cache-1765436280087';

const PRECACHE_URLS = [
  '/',
  '/favicon.ico',
  '/icon.png',
  '/icon4.png',
  '/manifest.json'
];

/* ---------------- INSTALL ---------------- */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

/* ---------------- ACTIVATE ---------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
      );
      await self.clients.claim();
    })()
  );
});

/* ---------------- FETCH ---------------- */
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

/* ---------------- PUSH (REMOTE PUSH SUPPORT – KEPT AS IS) ---------------- */
self.addEventListener('push', event => {
  let data = { title: 'New Notification', body: '', url: '/' };

  try {
    data = event.data ? event.data.json() : data;
  } catch (e) {
    data.body = event.data ? event.data.text() : data.body;
  }

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/icon4.png',
    data: { url: data.url }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* ---------------- NOTIFICATION CLICK ---------------- */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

/* ---------------- MESSAGE CHANNEL ---------------- */
/* Used for:
   1. Applying updates (SKIP_WAITING)
   2. One-time install thank-you notification (THANK_INSTALL)
*/
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'THANK_INSTALL') {
    self.registration.showNotification('Thanks for installing 🙏', {
      body: 'SitaRam 🌸 Welcome to MyKrishnaTouch',
      icon: '/icon.png',
      badge: '/icon4.png',
      vibrate: [200, 100, 200],
      data: { url: '/' }
    });
  }
});
