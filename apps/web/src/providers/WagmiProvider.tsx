'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Get WalletConnect project ID with fallback
const getWalletConnectProjectId = (): string => {
  // In browser environment, return fallback
  if (typeof window !== 'undefined') {
    return 'default-project-id';
  }
  
  // In server environment, check safely
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      return (globalThis as any).process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    }
  } catch {
    // Ignore errors and return fallback
  }
  return 'default-project-id';
};

// Create wagmi config with connectors
const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: getWalletConnectProjectId(),
    }),
  ],
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface WagmiProviderProps {
  children: ReactNode;
}

export function WagmiProviders({ children }: WagmiProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
