// PWA Service Worker Registration with Auto-Update
// Gmail-level reliability for automatic updates

export function registerSW() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker not supported');
    return;
  }

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('[SW] Service Worker registered with auto-update');

    // Detect new service worker and auto-refresh
    reg.onupdatefound = () => {
      const installing = reg.installing;
      if (!installing) return;

      installing.onstatechange = () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[SW] New version available, auto-refreshing...');
          // Auto-refresh to get latest CSS/JS
          window.location.reload();
        }
      };
    };

    // Force update check on page load
    reg.update();
  }).catch((error) => {
    console.error('[SW] Registration failed:', error);
  });
}

// Auto-register on import
if (typeof window !== 'undefined') {
  registerSW();
}
