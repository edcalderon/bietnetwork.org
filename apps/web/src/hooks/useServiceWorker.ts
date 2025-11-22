import { useEffect, useState, useCallback } from 'react';

interface VersionUpdate {
  type: 'VERSION_UPDATE';
  currentVersion: string;
  latestVersion: string;
  releaseNotes?: string;
}

interface ServiceWorkerStatus {
  isSupported: boolean;
  isInstalled: boolean;
  isActivated: boolean;
  currentVersion: string;
  updateAvailable: boolean;
  updateInfo?: VersionUpdate;
}

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isInstalled: false,
    isActivated: false,
    currentVersion: '0.3.19',
    updateAvailable: false,
  });

  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  // Check for service worker support (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setStatus((prev: ServiceWorkerStatus) => ({ ...prev, isSupported: true }));
      registerServiceWorker();
    }
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[SW] Service worker registered:', registration);

      // Check if service worker is already activated
      if (registration.active) {
        setStatus((prev: ServiceWorkerStatus) => ({ 
          ...prev, 
          isInstalled: true, 
          isActivated: true 
        }));
      }

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[SW] New service worker installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New service worker installed and waiting');
              setStatus((prev: ServiceWorkerStatus) => ({ 
                ...prev, 
                isInstalled: true,
                updateAvailable: true 
              }));
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const message = event.data as VersionUpdate;
        
        if (message.type === 'VERSION_UPDATE') {
          console.log('[SW] Version update received:', message);
          setStatus((prev: ServiceWorkerStatus) => ({
            ...prev,
            updateAvailable: true,
            updateInfo: message
          }));
          setShowUpdatePrompt(true);
        }
      });

    } catch (error) {
      console.error('[SW] Service worker registration failed:', error);
    }
  }, []);

  // Trigger manual version check
  const checkForUpdates = useCallback(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    navigator.serviceWorker.ready.then((registration) => {
      // Try background sync first, fallback to direct message
      const reg = registration as any;
      if (reg && reg.sync && typeof reg.sync.register === 'function') {
        reg.sync.register('version-check').catch(() => {
          // Fallback: directly call the check function
          navigator.serviceWorker.controller?.postMessage({
            type: 'CHECK_VERSION'
          });
        });
      } else {
        // Fallback: directly call the check function
        navigator.serviceWorker.controller?.postMessage({
          type: 'CHECK_VERSION'
        });
      }
    });
  }, []);

  // Apply update by refreshing the page
  const applyUpdate = useCallback(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
  }, []);

  // Dismiss update prompt
  const dismissUpdate = useCallback(() => {
    setShowUpdatePrompt(false);
  }, []);

  // Clear all caches manually
  const clearCache = useCallback(async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return false;
    
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[SW] All caches cleared manually');
      return true;
    } catch (error) {
      console.error('[SW] Failed to clear caches:', error);
      return false;
    }
  }, []);

  // Unregister service worker
  const unregisterServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log('[SW] Service worker unregistered');
      setStatus((prev: ServiceWorkerStatus) => ({
        ...prev,
        isInstalled: false,
        isActivated: false,
        updateAvailable: false
      }));
      return true;
    } catch (error) {
      console.error('[SW] Failed to unregister service worker:', error);
      return false;
    }
  }, []);

  return {
    status,
    showUpdatePrompt,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
    clearCache,
    unregisterServiceWorker,
  };
}
