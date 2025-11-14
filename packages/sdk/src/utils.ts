/**
 * @title Utility Functions
 * @dev Helper utilities for Biet Network SDK
 */

import { ethers, formatEther, parseEther, isAddress, hexlify, randomBytes, keccak256, toUtf8Bytes } from 'ethers';
import type { Chain } from './types';

/**
 * Format ether value to human readable string
 */
export function formatEtherValue(value: ethers.BigNumberish, decimals: number = 4): string {
  return parseFloat(formatEther(value)).toFixed(decimals);
}

/**
 * Parse ether string to BigInt
 */
export function parseEtherValue(value: string): bigint {
  return parseEther(value);
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
  return isAddress(address);
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
  provider: ethers.Provider,
  txHash: string,
  confirmations: number = 1,
  timeout: number = 60000
): Promise<ethers.TransactionReceipt> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt && (await receipt.confirmations()) >= confirmations) {
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
  transaction: ethers.TransactionRequest,
  provider: ethers.Provider
): Promise<bigint> {
  try {
    return await provider.estimateGas(transaction);
  } catch (error) {
    console.warn('Gas estimation failed:', error);
    return BigInt(100000); // Default gas limit
  }
}

/**
 * Get gas price
 */
export async function getGasPrice(provider: ethers.Provider): Promise<bigint> {
  try {
    const feeData = await provider.getFeeData();
    return feeData.gasPrice || BigInt('20000000000'); // 20 gwei default
  } catch (error) {
    console.warn('Failed to get gas price:', error);
    return BigInt('20000000000'); // 20 gwei default
  }
}

/**
 * Calculate transaction cost in ETH
 */
export function calculateTransactionCost(gasLimit: bigint, gasPrice: bigint): bigint {
  return gasLimit * gasPrice;
}

/**
 * Convert wei to USD (approximate)
 */
export function weiToUsd(weiAmount: ethers.BigNumberish, ethPrice: number): number {
  const ethAmount = parseFloat(formatEther(weiAmount));
  return ethAmount * ethPrice;
}

/**
 * Generate random bytes32
 */
export function generateRandomBytes32(): string {
  return hexlify(randomBytes(32));
}

/**
 * Hash string with keccak256
 */
export function keccak256Hash(data: string): string {
  return keccak256(toUtf8Bytes(data));
}

/**
 * Check if contract exists at address
 */
export async function isContract(address: string, provider: ethers.Provider): Promise<boolean> {
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
export async function getBlockTimestamp(provider: ethers.Provider): Promise<number> {
  const block = await provider.getBlock('latest');
  return block?.timestamp || 0;
}

/**
 * Add buffer to gas limit
 */
export function addGasBuffer(gasLimit: bigint, bufferPercent: number = 20): bigint {
  const buffer = (gasLimit * BigInt(bufferPercent)) / BigInt(100);
  return gasLimit + buffer;
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
