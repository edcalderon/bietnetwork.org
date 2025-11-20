// Basic PWA service worker for Biet Network
// Caches static assets and enables offline fallback for shell.

const CACHE_NAME = 'biet-network-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/biets',
  '/governance',
  '/token',
  '/whitepaper',
  '/favicon.ico',
  '/logo/android-chrome-192x192.png',
  '/logo/android-chrome-512x512.png',
  '/logo/favicon-32x32.png',
  '/logo/favicon-16x16.png',
  '/logo/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => caches.match('/'));
    })
  );
});
