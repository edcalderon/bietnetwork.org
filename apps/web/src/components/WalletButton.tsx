'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, AlertTriangle, CheckCircle, ChevronDown, Wallet2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/hooks/useLanguage';
import { base, baseSepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

function formatAddressMiddle(address?: string | null, start: number = 6, end: number = 4) {
  if (!address) return '';
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, error, isPending, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { isAdmin, isCorrectChain } = useWallet();
  const { t } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleConnect = async (connectorType: 'injected' | 'walletConnect' = 'injected') => {
    try {
      if (connectorType === 'injected') {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          // Get the injected connector
          const injectedConnector = connectors.find((c: any) => c.id === 'injected');
          if (injectedConnector) {
            connect({ connector: injectedConnector });
          }
          setIsOpen(false);
        } else {
          alert(t('wallet.installMetaMask'));
        }
      } else if (connectorType === 'walletConnect') {
        // Get the WalletConnect connector
        const walletConnectConnector = connectors.find((c: any) => c.id === 'walletConnect');
        if (walletConnectConnector) {
          connect({ connector: walletConnectConnector });
        }
        setIsOpen(false);
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
          <span className="hidden sm:inline">{t('wallet.connect')}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div 
            ref={dropdownRef} 
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-50">{t('wallet.connect')}</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  {t('dashboard.connectDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleConnect('injected')}
                  disabled={isPending}
                  variant="outline"
                  className="w-full justify-start h-12"
                >
                  <Wallet className="h-5 w-5 mr-3 text-amber-500" />
                  <div className="text-left">
                    <div className="font-medium">Browser Wallet</div>
                    <div className="text-xs text-muted-foreground">
                      {typeof window !== 'undefined' && (window as any).ethereum 
                        ? 'MetaMask, Rabby, etc.' 
                        : 'MetaMask not detected'}
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleConnect('walletConnect')}
                  disabled={isPending}
                  variant="outline"
                  className="w-full justify-start h-12"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 96 96" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path d="M21.5 21.5h53v53h-53v-53z" fill="#3B99FC"/>
                    <path d="M53.9 48.4c0-10.8-8.7-19.5-19.5-19.5s-19.5 8.7-19.5 19.5 8.7 19.5 19.5 19.5h19.5v-5.5c0-3-2.5-5.5-5.5-5.5 3 0 5.5-2.5 5.5-5.5v-.5z" fill="#3B99FC"/>
                    <path d="M74.5 29c-3 0-5.5 2.5-5.5 5.5v23c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5v-23c0-3-2.5-5.5-5.5-5.5z" fill="#3B99FC"/>
                    <path d="M66.5 48.4c0 10.8-8.7 19.5-19.5 19.5h-19.5v5.5c0 3 2.5 5.5 5.5 5.5h39c3 0 5.5-2.5 5.5-5.5v-24c0-3-2.5-5.5-5.5-5.5 3 0 5.5-2.5 5.5-5.5v-.5c0-10.8-8.7-19.5-19.5-19.5s-19.5 8.7-19.5 19.5 8.7 19.5 19.5 19.5c10.8 0 19.5-8.7 19.5-19.5z" fill="#3B99FC"/>
                  </svg>
                  <div className="text-left">
                    <div className="font-medium">WalletConnect</div>
                    <div className="text-xs text-muted-foreground">Mobile, Ledger, etc.</div>
                  </div>
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
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 ${
          isAdmin 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
            : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="relative">
          <Wallet2 className="h-4 w-4 sm:h-4 sm:w-4" />
          {!isCorrectChain && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-500"></span>
          )}
        </div>
        <span className="hidden sm:inline text-sm font-medium font-mono max-w-[140px] truncate">
          {formatAddressMiddle(address, 6, 4)}
        </span>
        <span className="sm:hidden text-sm font-medium font-mono max-w-[100px] truncate">
          {formatAddressMiddle(address, 4, 3)}
        </span>
        {isAdmin && (
          <span className="hidden sm:inline bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
            ADMIN
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-50">
                <Wallet className="h-5 w-5" />
                {t('wallet.connected')}
                {isAdmin && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                    ADMIN
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {isAdmin 
                  ? "You have admin privileges for Biet Network"
                  : "Connected to Biet Network"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address Display */}
              <div className="p-3 rounded-xl bg-gray-50/90 dark:bg-gray-900/90 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Wallet address
                  </span>
                  <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all sm:break-normal sm:truncate max-w-[220px]">
                    {formatAddressMiddle(address, 8, 6)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!address) return;
                    try {
                      await navigator.clipboard.writeText(address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    } catch (err) {
                      console.error('Failed to copy address', err);
                    }
                  }}
                  className="inline-flex items-center px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-[10px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Chain Status & Network Switch */}
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
