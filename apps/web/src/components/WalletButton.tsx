'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { base, baseSepolia } from 'wagmi/chains';

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { isAdmin, isCorrectChain } = useWallet();
  const { t } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = async () => {
    try {
      // Request wallet access directly
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setIsOpen(false);
      } else {
        alert(t('wallet.installMetaMask'));
      }
    } catch (error) {
      console.error(t('wallet.connectionFailed'), error);
    }
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
        >
          <Wallet className="h-4 w-4" />
          {t('wallet.connect')}
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('wallet.connect')}</CardTitle>
                <CardDescription>
                  {t('dashboard.connectDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleConnect}
                  disabled={isPending}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  MetaMask / Injected Wallet
                  {isPending && ' (connecting...)'}
                </Button>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={isAdmin ? "default" : "outline"}
        className={`flex items-center gap-2 ${
          isAdmin 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
            : ''
        }`}
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <span className="sm:hidden">
          {address?.slice(0, 4)}...{address?.slice(-3)}
        </span>
        {isAdmin && (
          <span className="hidden sm:inline bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
            ADMIN
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {t('wallet.connected')}
                {isAdmin && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                    ADMIN
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? "You have admin privileges for Biet Network"
                  : "Connected to Biet Network"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address Display */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {address}
                </p>
              </div>

              {/* Chain Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isCorrectChain ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Connected to {chainId === base.id ? 'Base Mainnet' : 'Base Sepolia'}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        {t('wallet.wrongNetwork')}
                      </span>
                    </>
                  )}
                </div>

                {!isCorrectChain && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => switchChain({ chainId: base.id })}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {t('wallet.switchToBase')} Mainnet
                    </Button>
                    <Button
                      onClick={() => switchChain({ chainId: baseSepolia.id })}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {t('wallet.switchToBase')} Sepolia
                    </Button>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                    Admin Actions
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      • Manage Biets (Productive Units)
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      • Configure DAO parameters
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      • Mint BGT tokens
                    </p>
                  </div>
                </div>
              )}

              {/* Disconnect Button */}
              <Button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('wallet.disconnect')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
