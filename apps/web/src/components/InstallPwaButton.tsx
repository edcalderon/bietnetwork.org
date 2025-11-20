'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Minimal type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('PWA install prompt failed', err);
    }
  };

  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleInstallClick}
      className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base xl:text-lg font-medium rounded-full border-emerald-600 text-emerald-700 dark:text-emerald-300 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center justify-center gap-2"
    >
      <Download className="w-4 h-4" />
      <span>Install Red Biet App</span>
    </Button>
  );
}
