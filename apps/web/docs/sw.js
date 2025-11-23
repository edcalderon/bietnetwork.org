// Enhanced Service Worker for Biet Network with Workbox Integration
// Caches static assets, checks package.json version, and auto-clears cache on updates

// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.0/workbox-sw.js');

// Build ID will be injected at build time
self.__BUILD_ID__ = process.env.NEXT_PUBLIC_BUILD_ID || 'dev';
self.__APP_VERSION__ = process.env.NEXT_PUBLIC_APP_VERSION || '0.3.20';

const CACHE_NAME = `biet-network-${self.__BUILD_ID__}`;
const CURRENT_VERSION = self.__APP_VERSION__;

// Cache strategy configuration
const CACHE_STRATEGIES = {
  STATIC: 'static-cache',
  DYNAMIC: 'dynamic-cache',
  API: 'api-cache'
};

// Files to cache on install
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
  '/logo/apple-touch-icon.png',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/_next/static/media/',
  '/fonts/'
];

// Install event - Cache static assets and skip waiting
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CURRENT_VERSION, 'Build ID:', self.__BUILD_ID__);
  
  event.waitUntil(
    caches.open(CACHE_STRATEGIES.STATIC)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CURRENT_VERSION, 'Build ID:', self.__BUILD_ID__);
  
  event.waitUntil(
    Promise.all([
      // Clean old caches that don't match current build ID
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that don't include current build ID
            if (!cacheName.includes(self.__BUILD_ID__)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Check for version updates on activation
      checkForVersionUpdate()
    ]).then(() => self.clients.claim())
  );
});

// Workbox professional caching strategies
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.NetworkFirst({
    cacheName: `assets-${self.__BUILD_ID__}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache first for images and fonts
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new workbox.strategies.CacheFirst({
    cacheName: `images-fonts-${self.__BUILD_ID__}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
      }),
    ],
  })
);

// Network first for API calls
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') || url.host.includes('github.com/api'),
  new workbox.strategies.NetworkFirst({
    cacheName: `api-${self.__BUILD_ID__}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Fetch event - Handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and let Workbox handle the rest
  if (request.method !== 'GET') return;

  // Network-first strategy for CSS/JS to prevent stale assets (backup for Workbox)
  if (url.endsWith('.css') || url.endsWith('.js')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Let Workbox handle other requests
  event.respondWith(workbox.strategies.networkFirst({
    cacheName: `dynamic-${self.__BUILD_ID__}`,
  }).handle({ request }));
});

// Check package.json version for updates
async function checkForVersionUpdate() {
  try {
    console.log('[SW] Checking package.json for version updates...');
    
    // Fetch the package.json from the server
    const response = await fetch('/package.json', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.log('[SW] Failed to fetch package.json:', response.status);
      return false;
    }

    const packageData = await response.json();
    const latestVersion = packageData.version;
    
    console.log('[SW] Current version:', CURRENT_VERSION, 'Latest version:', latestVersion);

    // Compare versions
    if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
      console.log('[SW] New version detected! Clearing caches and triggering update...');
      await clearAllCaches();
      
      // Notify all clients about the update
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'VERSION_UPDATE',
          currentVersion: CURRENT_VERSION,
          latestVersion: latestVersion,
          message: 'New version available. Page will refresh automatically.'
        });
      });

      // Force service worker update by skipping waiting
      self.skipWaiting();
      
      return true; // Update triggered
    }
    
    return false; // No update needed
  } catch (error) {
    console.error('[SW] Error checking version updates:', error);
    return false;
  }
}

// Version comparison function
function isNewerVersion(latest, current) {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);
  
  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const latestPart = latestParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    
    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }
  
  return false;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

// Cache strategies
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STRATEGIES.STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    throw error;
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STRATEGIES.API);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache...');
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_STRATEGIES.DYNAMIC);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/fonts/') || 
         url.includes('/images/') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url.endsWith('.woff') ||
         url.endsWith('.woff2');
}

function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('github.com/api');
}

// Handle background sync for version checks
self.addEventListener('sync', (event) => {
  if (event.tag === 'version-check') {
    event.waitUntil(checkForVersionUpdate());
  }
});

// Periodic version check (every 30 minutes)
setInterval(async () => {
  console.log('[SW] Performing periodic version check...');
  try {
    await checkForVersionUpdate();
  } catch (error) {
    console.error('[SW] Periodic version check failed:', error);
  }
}, 30 * 60 * 1000); // 30 minutes

// Handle push notifications for updates
self.addEventListener('push', (event) => {
  const options = {
    body: 'A new version is available. Click to update.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'version-update',
    requireInteraction: true,
    actions: [
      {
        action: 'update',
        title: 'Update Now'
      },
      {
        action: 'dismiss',
        title: 'Later'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Biet Network Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'update') {
    event.waitUntil(
      self.clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});

console.log('[SW] Service Worker loaded - Version:', CURRENT_VERSION, 'Build ID:', self.__BUILD_ID__);

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { type } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('[SW] Skip waiting requested');
      self.skipWaiting();
      break;
    case 'CHECK_VERSION':
      console.log('[SW] Manual version check requested');
      checkForVersionUpdate();
      break;
    default:
      console.log('[SW] Unknown message type:', type);
  }
});
