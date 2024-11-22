const VERSION = 8;
const CACHE_NAME = `Sirunchat-${VERSION}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  console.log(`Service Worker (v${VERSION}) installed`);
  self.skipWaiting();
  event.waitUntil(cacheAppShell());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(handleActivation());
});

async function handleActivation() {
  await clearCaches();
  await clients.claim();
  console.log(`Service Worker (v${VERSION}) activated`);
}

async function clearCaches() {
  const cacheNames = await caches.keys();
  const oldCacheNames = cacheNames.filter(name => name !== CACHE_NAME);
  await Promise.all(oldCacheNames.map(name => caches.delete(name)));
}

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(APP_SHELL);
}

self.addEventListener('fetch', (event) => {
  // Ignore requests to chrome-extension or unsupported schemes
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      }).catch((error) => {
        console.error('Fetch failed; returning offline page instead.', error);
        return caches.match('/index.html');
      });
    })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    icon: '/assets/icons/icon-192x192.png',
    body: data.body,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' }
    ]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = self.location.origin;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((client) => client.url === url);
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(url);
    })
  );
});
