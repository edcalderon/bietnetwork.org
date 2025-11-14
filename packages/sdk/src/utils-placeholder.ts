/**
 * Placeholder utils for when ethers is not available
 */

// Mock ethers utilities
export const mockEthers = {
  utils: {
    formatEther: (value: any) => '0',
    parseEther: (value: string) => ({ toString: () => '0' }),
    isAddress: (address: string) => true,
    keccak256: (data: any) => '0x',
    toUtf8Bytes: (data: string) => new Uint8Array(),
    hexlify: (data: any) => '0x',
    randomBytes: (length: number) => new Uint8Array(length),
  },
  providers: {
    Provider: class {},
    TransactionReceipt: class {},
  },
  BigNumber: {
    from: (value: any) => ({ 
      toString: () => '0',
      mul: (other: any) => ({ toString: () => '0' }),
      div: (other: any) => ({ toString: () => '0' }),
      add: (other: any) => ({ toString: () => '0' }),
      sub: (other: any) => ({ toString: () => '0' }),
    }),
  },
};

// Try to import real ethers, fallback to mock
let ethers: any;
try {
  ethers = require('ethers');
} catch {
  ethers = mockEthers;
}

/**
 * Format ether value to human readable string
 */
export function formatEther(value: any, decimals: number = 4): string {
  try {
    return parseFloat(ethers.utils.formatEther(value)).toFixed(decimals);
  } catch {
    return '0';
  }
}

/**
 * Parse ether string to BigNumber
 */
export function parseEther(value: string): any {
  try {
    return ethers.utils.parseEther(value);
  } catch {
    return ethers.BigNumber.from(0);
  }
}

/**
 * Format address to short format
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Generate random bytes32
 */
export function generateRandomBytes32(): string {
  try {
    return ethers.utils.hexlify(ethers.utils.randomBytes(32));
  } catch {
    return '0x' + '0'.repeat(64);
  }
}

/**
 * Hash string with keccak256
 */
export function keccak256(data: string): string {
  try {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
  } catch {
    return '0x' + '0'.repeat(64);
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
