// Enhanced Service Worker for Biet Network with Version Management
// Caches static assets, checks GitHub releases, and auto-clears cache on updates

const CACHE_NAME = 'biet-network-v0.3.19';
const GITHUB_RELEASES_URL = 'https://api.github.com/repos/edcalderon/bietnetwork.org/releases/latest';
const CURRENT_VERSION = '0.3.19';

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

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CURRENT_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_STRATEGIES.STATIC)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean old caches and check for updates
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CURRENT_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_STRATEGIES.STATIC && 
                cacheName !== CACHE_STRATEGIES.DYNAMIC && 
                cacheName !== CACHE_STRATEGIES.API) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Check for version updates
      checkForVersionUpdate()
    ]).then(() => self.clients.claim())
  );
});

// Fetch event - Handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different request types
  if (isStaticAsset(request.url)) {
    // Cache first for static assets
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request.url)) {
    // Network first for API requests
    event.respondWith(networkFirst(request));
  } else {
    // Stale while revalidate for dynamic content
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Check for version updates from GitHub releases
async function checkForVersionUpdate() {
  try {
    console.log('[SW] Checking for version updates...');
    
    const response = await fetch(GITHUB_RELEASES_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Biet-Network-SW'
      }
    });

    if (!response.ok) {
      console.log('[SW] Failed to fetch releases:', response.status);
      return;
    }

    const release = await response.json();
    const latestVersion = release.tag_name.replace('v', '');
    
    console.log('[SW] Current version:', CURRENT_VERSION);
    console.log('[SW] Latest version:', latestVersion);

    if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
      console.log('[SW] New version detected! Clearing caches...');
      await clearAllCaches();
      
      // Notify all clients about the update
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'VERSION_UPDATE',
          currentVersion: CURRENT_VERSION,
          latestVersion: latestVersion,
          releaseNotes: release.body
        });
      });
    }
  } catch (error) {
    console.error('[SW] Error checking version updates:', error);
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

console.log('[SW] Service Worker loaded - Version:', CURRENT_VERSION);

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
