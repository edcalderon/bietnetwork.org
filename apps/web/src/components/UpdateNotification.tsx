'use client';

import { useState, useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  X, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Settings
} from 'lucide-react';

export function UpdateNotification() {
  const { 
    showUpdatePrompt, 
    status, 
    applyUpdate, 
    dismissUpdate, 
    checkForUpdates,
    clearCache,
    unregisterServiceWorker
  } = useServiceWorker();
  
  const [showDebug, setShowDebug] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);

  // Auto-check for updates on first login
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasCheckedToday = localStorage.getItem('version-check-today');
    const lastCheck = localStorage.getItem('last-version-check');
    const now = new Date().toISOString();
    
    // Check if it's been more than 24 hours since last check
    if (!lastCheck || new Date(now).getTime() - new Date(lastCheck).getTime() > 24 * 60 * 60 * 1000) {
      console.log('[Update] Checking for updates on first login...');
      checkForUpdates();
      localStorage.setItem('last-version-check', now);
    }
  }, [checkForUpdates]);

  const handleClearCache = async () => {
    setIsClearingCache(true);
    const success = await clearCache();
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setIsClearingCache(false);
  };

  const handleUnregister = async () => {
    setIsUnregistering(true);
    const success = await unregisterServiceWorker();
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setIsUnregistering(false);
  };

  if (!showUpdatePrompt && !showDebug) {
    return null;
  }

  return (
    <>
      {/* Update Available Notification */}
      {showUpdatePrompt && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-emerald-200 dark:border-emerald-700 p-4 animate-slide-in-right">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Update Available
              </h3>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Version {status.updateInfo?.latestVersion} is available (you have {status.updateInfo?.currentVersion})
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {status.updateInfo?.message}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={applyUpdate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Update Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={dismissUpdate}
                  className="text-xs px-3 py-1.5"
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={dismissUpdate}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Debug Panel - Toggle with Ctrl+Shift+U */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Service Worker Debug
            </h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Supported:</span>
              <span className={status.isSupported ? 'text-green-600' : 'text-red-600'}>
                {status.isSupported ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Installed:</span>
              <span className={status.isInstalled ? 'text-green-600' : 'text-red-600'}>
                {status.isInstalled ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Activated:</span>
              <span className={status.isActivated ? 'text-green-600' : 'text-red-600'}>
                {status.isActivated ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Update Available:</span>
              <span className={status.updateAvailable ? 'text-yellow-600' : 'text-green-600'}>
                {status.updateAvailable ? '⚠' : '✓'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version:</span>
              <span className="text-gray-900 dark:text-white">{status.currentVersion}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Button
              size="sm"
              onClick={checkForUpdates}
              className="w-full text-xs"
              variant="outline"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Check for Updates
            </Button>
            
            <Button
              size="sm"
              onClick={handleClearCache}
              disabled={isClearingCache}
              className="w-full text-xs"
              variant="outline"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              {isClearingCache ? 'Clearing...' : 'Clear Cache'}
            </Button>
            
            <Button
              size="sm"
              onClick={handleUnregister}
              disabled={isUnregistering}
              className="w-full text-xs"
              variant="destructive"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {isUnregistering ? 'Unregistering...' : 'Unregister SW'}
            </Button>
          </div>
        </div>
      )}

      {/* Debug Toggle - Press Ctrl+Shift+U */}
      <div
        className="fixed bottom-4 left-4 z-40 opacity-0 pointer-events-none"
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.ctrlKey && e.shiftKey && e.key === 'U') {
            e.preventDefault();
            setShowDebug(!showDebug);
          }
        }}
        tabIndex={-1}
      />
    </>
  );
}
