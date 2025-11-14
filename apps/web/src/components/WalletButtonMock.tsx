'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

export function WalletButtonMock() {
  const { isAdmin, address, isConnected, setAdminStatus } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      // Mock address - in production this would come from the actual wallet
      const mockAddress = '0x742d35Cc6634C0532925a3b8D4C0F8c23e4c4e4e';
      setAdminStatus(mockAddress);
      setIsConnecting(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setAdminStatus(undefined);
    setIsOpen(false);
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Connect Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet to access Biet Network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  MetaMask / Injected Wallet
                  {isConnecting && ' (connecting...)'}
                </Button>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ℹ️ Demo Mode: This simulates wallet connection for UI testing
                  </p>
                </div>
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
                Wallet Connected
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
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Connected to Base Sepolia (Demo)
                  </span>
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

              {/* Demo Notice */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  ℹ️ Demo Mode: Showing UI mockup for demonstration
                </p>
              </div>

              {/* Disconnect Button */}
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
