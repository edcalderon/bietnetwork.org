/**
 * @title Biet Network SDK Types
 * @dev TypeScript types for Biet Network contracts
 */

// Placeholder for ethers when not available
interface MockContract {
  address: string;
  [key: string]: any;
}

interface MockSigner {
  address: string;
  [key: string]: any;
}

// Try to import ethers, fallback to mock
let ethers: any;
try {
  ethers = require('ethers');
} catch {
  ethers = {
    Contract: class {},
    Signer: class {},
    BigNumber: class {},
    utils: {
      formatEther: (value: any) => '0',
      parseEther: (value: string) => ({ toString: () => '0' }),
      isAddress: (address: string) => true,
    },
  };
}

export interface BGTContracts {
  bgt: MockContract;
  dao: MockContract;
  treasury: MockContract;
  identity: MockContract;
  productiveUnit: MockContract;
  revenueShare: MockContract;
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
  signer?: MockSigner;
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
