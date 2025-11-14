/**
 * @title Biet Network SDK Types
 * @dev TypeScript types for Biet Network contracts
 */

import { ethers } from 'ethers';

export interface BGTContracts {
  bgt: ethers.Contract;
  dao: ethers.Contract;
  treasury: ethers.Contract;
  identity: ethers.Contract;
  productiveUnit: ethers.Contract;
  revenueShare: ethers.Contract;
}

export interface ContractAddresses {
  bgt: string;
  dao: string;
  treasury: string;
  identity: string;
  productiveUnit: string;
  revenueShare: string;
}

export interface BietSDKConfig {
  rpcUrl: string;
  contractAddresses: ContractAddresses;
  signer?: ethers.Signer;
}

export interface Biet {
  name: string;
  description: string;
  category: string;
  creator: string;
  createdAt: number;
  royaltyPercentage: number;
  isActive: boolean;
  totalRevenue: string;
  totalDistributed: string;
  location: string;
  tags: string[];
}

export interface Identity {
  name: string;
  did: string;
  country: string;
  verificationLevel: string;
  createdAt: number;
  isActive: boolean;
  identityHash: string;
}

export interface RevenuePool {
  name: string;
  participants: string[];
  shares: string[];
  totalShares: string;
  totalRevenue: string;
  totalDistributed: string;
  isActive: boolean;
  createdAt: number;
  token: string;
}

export interface RevenueRecord {
  poolId: string;
  recipient: string;
  amount: string;
  timestamp: number;
  tokenSymbol: string;
}

export interface ProposalDetails {
  status: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  quorumReached: boolean;
}

export type Chain = {
  id: number;
  name: string;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers?: {
    default: { name: string; url: string };
  };
  testnet?: boolean;
};
