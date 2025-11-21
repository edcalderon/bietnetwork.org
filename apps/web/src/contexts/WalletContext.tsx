'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// Admin addresses (these should come from environment or config)
const ADMIN_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b8D4C0F8c23e4c4e4e', // Demo admin address
  // Add more admin addresses as needed
] as const;

// Optional deployer/admin address from env so it always has admin view
const DEPLOYER_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS
  ? process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS.toLowerCase()
  : undefined;

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  isAdmin: boolean;
  chainId: number | undefined;
  isCorrectChain: boolean;
  disconnect: () => void;
  switchToBase: () => void;
  switchToBaseSepolia: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCorrectChain, setIsCorrectChain] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (address) {
      const normalized = address.toLowerCase();
      const isInStaticList = ADMIN_ADDRESSES.includes(normalized as typeof ADMIN_ADDRESSES[0]);
      const isDeployer = DEPLOYER_ADDRESS ? normalized === DEPLOYER_ADDRESS : false;
      setIsAdmin(isInStaticList || isDeployer);
    } else {
      setIsAdmin(false);
    }
  }, [address]);

  // Check if connected to correct chain (Base or Base Sepolia)
  useEffect(() => {
    setIsCorrectChain(chainId === base.id || chainId === baseSepolia.id);
  }, [chainId]);

  const switchToBase = () => {
    switchChain({ chainId: base.id });
  };

  const switchToBaseSepolia = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  const value: WalletContextType = {
    isConnected,
    address,
    isAdmin,
    chainId,
    isCorrectChain,
    disconnect,
    switchToBase,
    switchToBaseSepolia,
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
