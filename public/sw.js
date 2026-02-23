const CACHE_NAME = 'vaultpass-static-v1';
const OFFLINE_URL = '/pages/offline.html';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pages/login.html',
  '/pages/offline.html',
  '/styles/landing-apple.css',
  '/styles/login-apple.css',
  '/script/api.js',
  '/script/main.js',
  '/script/auth.js',
  '/script/pwa-init.js',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        if (url.pathname.startsWith('/dashboard/')) {
          const fallback = await caches.match(OFFLINE_URL);
          return fallback || Response.error();
        }
        const cached = await caches.match(request);
        return cached || caches.match(OFFLINE_URL) || Response.error();
      })
    );
    return;
  }

  if (!STATIC_ASSETS.includes(url.pathname)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || network;
    })
  );
});
