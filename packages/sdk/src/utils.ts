/**
 * @title Utility Functions
 * @dev Helper utilities for Biet Network SDK
 */

import { ethers } from 'ethers';
import type { Chain } from './types';

/**
 * Format ether value to human readable string
 */
export function formatEther(value: ethers.BigNumberish, decimals: number = 4): string {
  return parseFloat(ethers.utils.formatEther(value)).toFixed(decimals);
}

/**
 * Parse ether string to BigNumber
 */
export function parseEther(value: string): ethers.BigNumber {
  return ethers.utils.parseEther(value);
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
  return ethers.utils.isAddress(address);
}

/**
 * Get transaction explorer URL
 */
export function getExplorerUrl(txHash: string, chain: Chain): string {
  return `${chain.blockExplorers?.default.url}/tx/${txHash}`;
}

/**
 * Get address explorer URL
 */
export function getAddressExplorerUrl(address: string, chain: Chain): string {
  return `${chain.blockExplorers?.default.url}/address/${address}`;
}

/**
 * Wait for transaction with timeout
 */
export async function waitForTransaction(
  provider: ethers.providers.Provider,
  txHash: string,
  confirmations: number = 1,
  timeout: number = 60000
): Promise<ethers.providers.TransactionReceipt> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt && receipt.confirmations >= confirmations) {
      return receipt;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Transaction ${txHash} timed out after ${timeout}ms`);
}

/**
 * Estimate gas for transaction
 */
export async function estimateGas(
  transaction: ethers.providers.TransactionRequest,
  provider: ethers.providers.Provider
): Promise<ethers.BigNumber> {
  try {
    return await provider.estimateGas(transaction);
  } catch (error) {
    console.warn('Gas estimation failed:', error);
    return ethers.BigNumber.from(100000); // Default gas limit
  }
}

/**
 * Get gas price
 */
export async function getGasPrice(provider: ethers.providers.Provider): Promise<ethers.BigNumber> {
  try {
    return await provider.getGasPrice();
  } catch (error) {
    console.warn('Failed to get gas price:', error);
    return ethers.BigNumber.from('20000000000'); // 20 gwei default
  }
}

/**
 * Calculate transaction cost in ETH
 */
export function calculateTransactionCost(gasLimit: ethers.BigNumber, gasPrice: ethers.BigNumber): ethers.BigNumber {
  return gasLimit.mul(gasPrice);
}

/**
 * Convert wei to USD (approximate)
 */
export function weiToUsd(weiAmount: ethers.BigNumber, ethPrice: number): number {
  const ethAmount = parseFloat(ethers.utils.formatEther(weiAmount));
  return ethAmount * ethPrice;
}

/**
 * Generate random bytes32
 */
export function generateRandomBytes32(): string {
  return ethers.utils.hexlify(ethers.utils.randomBytes(32));
}

/**
 * Hash string with keccak256
 */
export function keccak256(data: string): string {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
}

/**
 * Check if contract exists at address
 */
export async function isContract(address: string, provider: ethers.providers.Provider): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch {
    return false;
  }
}

/**
 * Get block timestamp
 */
export async function getBlockTimestamp(provider: ethers.providers.Provider): Promise<number> {
  const block = await provider.getBlock('latest');
  return block?.timestamp || 0;
}

/**
 * Add buffer to gas limit
 */
export function addGasBuffer(gasLimit: ethers.BigNumber, bufferPercent: number = 20): ethers.BigNumber {
  const buffer = gasLimit.mul(bufferPercent).div(100);
  return gasLimit.add(buffer);
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
