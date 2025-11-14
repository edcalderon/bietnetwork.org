'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Admin addresses (these should come from environment or config)
const ADMIN_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b8D4C0F8c23e4c4e4e', // Demo admin address
  // Add more admin addresses as needed
] as const;

interface WalletContextType {
  isAdmin: boolean;
  address: string | undefined;
  isConnected: boolean;
  setAdminStatus: (address: string | undefined) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [address, setAddress] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  // Check if user is admin based on address
  const setAdminStatus = (walletAddress: string | undefined) => {
    setAddress(walletAddress);
    setIsConnected(!!walletAddress);
    
    if (walletAddress) {
      setIsAdmin(ADMIN_ADDRESSES.includes(walletAddress.toLowerCase() as typeof ADMIN_ADDRESSES[0]));
    } else {
      setIsAdmin(false);
    }
  };

  const value: WalletContextType = {
    isAdmin,
    address,
    isConnected,
    setAdminStatus,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
