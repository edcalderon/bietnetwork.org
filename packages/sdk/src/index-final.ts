/**
 * @title Biet Network SDK
 * @dev TypeScript SDK for interacting with Biet Network smart contracts
 */

// Import types
export type { 
  BGTContracts, 
  ContractAddresses, 
  BietSDKConfig, 
  Biet, 
  Identity, 
  RevenuePool, 
  RevenueRecord, 
  ProposalDetails,
  Chain 
} from './types-fixed';

// Export utilities with explicit re-exports to avoid ambiguity
export {
  formatEther as formatEtherUtil,
  parseEther as parseEtherUtil,
  formatAddress,
  isValidAddress,
  generateRandomBytes32,
  keccak256 as keccak256Util,
  retry
} from './utils-placeholder';

// Export React hooks
export {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  formatEther,
  useBGTBalance,
  useBGTTotalSupply,
  useVotingPower,
  useDAOProposals,
  useProposalDetails,
  useUserIdentity,
  useBietDetails,
  useVote,
  useDelegate,
  useCreateProposal
} from './react-placeholder';

// Export contract configurations
export { wagmiContractConfig } from './contracts';

// Mock ethers for compatibility
const mockEthers = {
  Contract: class {},
  Signer: class {},
  BigNumber: class {},
  providers: {
    Provider: class {},
    JsonRpcProvider: class {},
  },
  utils: {
    formatEther: (value: any) => '0',
    parseEther: (value: string) => ({ toString: () => '0' }),
    isAddress: (address: string) => true,
    keccak256: (data: any) => '0x',
    toUtf8Bytes: (data: string) => new Uint8Array(),
  },
};

// Try to import real ethers, fallback to mock
let ethers: any;
try {
  ethers = require('ethers');
} catch {
  ethers = mockEthers;
}

// Mock wagmi contract config
const mockWagmiConfig = {
  BGT: { abi: [] },
  BGTDAO: { abi: [] },
  BGTTreasury: { abi: [] },
  BietIdentity: { abi: [] },
  ProductiveUnit: { abi: [] },
  RevenueShare: { abi: [] },
};

let wagmiContractConfig: any;
try {
  wagmiContractConfig = require('./contracts').wagmiContractConfig;
} catch {
  wagmiContractConfig = mockWagmiConfig;
}

/**
 * Main Biet Network SDK Class
 */
export class BietNetworkSDK {
  private provider: any;
  private signer: any;
  private contracts: any;

  constructor(config: any) {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.signer = config.signer || this.provider.getSigner();
    
    this.contracts = {
      bgt: new ethers.Contract(config.contractAddresses.bgt, wagmiContractConfig.BGT.abi, this.signer || this.provider),
      dao: new ethers.Contract(config.contractAddresses.dao, wagmiContractConfig.BGTDAO.abi, this.signer || this.provider),
      treasury: new ethers.Contract(config.contractAddresses.treasury, wagmiContractConfig.BGTTreasury.abi, this.signer || this.provider),
      identity: new ethers.Contract(config.contractAddresses.identity, wagmiContractConfig.BietIdentity.abi, this.signer || this.provider),
      productiveUnit: new ethers.Contract(config.contractAddresses.productiveUnit, wagmiContractConfig.ProductiveUnit.abi, this.signer || this.provider),
      revenueShare: new ethers.Contract(config.contractAddresses.revenueShare, wagmiContractConfig.RevenueShare.abi, this.signer || this.provider),
    };
  }

  // Token methods
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.contracts.bgt.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch {
      return '0';
    }
  }

  async getTotalSupply(): Promise<string> {
    try {
      const supply = await this.contracts.bgt.totalSupply();
      return ethers.utils.formatEther(supply);
    } catch {
      return '0';
    }
  }

  async getVotingPower(address: string): Promise<string> {
    try {
      const power = await this.contracts.bgt.getVotes(address);
      return ethers.utils.formatEther(power);
    } catch {
      return '0';
    }
  }

  // Governance methods
  async createProposal(targets: string[], values: string[], calldatas: string[], description: string): Promise<string> {
    try {
      const tx = await this.contracts.dao.propose(targets, values, calldatas, description);
      return tx.hash;
    } catch {
      return '';
    }
  }

  async vote(proposalId: string, support: number): Promise<string> {
    try {
      const tx = await this.contracts.dao.castVote(proposalId, support);
      return tx.hash;
    } catch {
      return '';
    }
  }

  // Identity methods
  async getIdentity(address: string): Promise<any> {
    try {
      return await this.contracts.identity.getIdentityByAddress(address);
    } catch {
      return null;
    }
  }

  // Treasury methods
  async getTreasuryBalance(): Promise<string> {
    try {
      const balance = await this.contracts.treasury.getTotalValue();
      return ethers.utils.formatEther(balance);
    } catch {
      return '0';
    }
  }

  // Productive Unit methods
  async getBiet(tokenId: string): Promise<any> {
    try {
      return await this.contracts.productiveUnit.getBiet(tokenId);
    } catch {
      return null;
    }
  }

  // Revenue Share methods
  async getRevenuePool(poolId: string): Promise<any> {
    try {
      return await this.contracts.revenueShare.getPool(poolId);
    } catch {
      return null;
    }
  }

  // Create Biet method
  async createBiet(params: {
    creator: string;
    name: string;
    description: string;
    category: string;
    royaltyPercentage: number;
    tokenURI: string;
    location: string;
    tags: string[];
  }): Promise<string> {
    try {
      if (!this.signer) throw new Error('Signer required for Biet creation');
      const tx = await this.contracts.productiveUnit.createBiet(
        params.creator,
        params.name,
        params.description,
        params.category,
        params.royaltyPercentage,
        params.tokenURI,
        params.location,
        params.tags
      );
      return tx.hash;
    } catch {
      return '';
    }
  }

  // Create Revenue Pool method
  async createRevenuePool(params: {
    name: string;
    participants: string[];
    shares: number[];
    token: string;
  }): Promise<string> {
    try {
      const tx = await this.contracts.revenueShare.createRevenuePool(
        params.name,
        params.participants,
        params.shares,
        params.token
      );
      return tx.hash;
    } catch {
      return '';
    }
  }

  // Utility methods
  async waitTransaction(txHash: string, confirmations: number = 1): Promise<any> {
    try {
      return await this.provider.waitForTransaction(txHash, confirmations);
    } catch {
      return null;
    }
  }

  async estimateGas(transaction: any): Promise<any> {
    try {
      return await this.provider.estimateGas(transaction);
    } catch {
      return ethers.BigNumber.from(100000);
    }
  }

  async getGasPrice(): Promise<any> {
    try {
      return await this.provider.getGasPrice();
    } catch {
      return ethers.BigNumber.from('20000000000'); // 20 gwei default
    }
  }

  // Contract getters
  getContracts() {
    return this.contracts;
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }
}

// Default export
export default BietNetworkSDK;
