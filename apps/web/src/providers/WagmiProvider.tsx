'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Get WalletConnect project ID from env with safe fallback
const getWalletConnectProjectId = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }

  // As a last resort, use a dummy value to avoid crashing,
  // but this will not work with WalletConnect until env is set correctly.
  if (typeof window !== 'undefined') {
    console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set; WalletConnect will not work correctly.');
  }

  return 'missing-walletconnect-project-id';
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
