'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function ServiceWorkerRegister() {
  const { status, checkForUpdates } = useServiceWorker();

  useEffect(() => {
    if (typeof window === 'undefined' || !status.isSupported) return;

    console.log('[SW] Service worker is supported');
    
    // Check for updates on page load (but not on every navigation)
    const hasCheckedThisSession = sessionStorage.getItem('sw-version-checked');
    if (!hasCheckedThisSession) {
      console.log('[SW] Checking for updates on page load...');
      checkForUpdates();
      sessionStorage.setItem('sw-version-checked', 'true');
    }
  }, [status.isSupported, checkForUpdates]);

  return null;
}
