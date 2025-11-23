'use client';

import { useEffect } from 'react';
import { registerSW } from '@/utils/registerSW';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Auto-register service worker with Gmail-level reliability
    registerSW();
  }, []);

  return null;
}
