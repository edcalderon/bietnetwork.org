/**
 * Placeholder types for when ethers is not available
 */

export interface ethers {
  providers: {
    Provider: any;
    TransactionReceipt: any;
  };
  Contract: any;
  BigNumber: any;
  utils: {
    formatEther: (value: any) => string;
    parseEther: (value: string) => any;
    isAddress: (address: string) => boolean;
    keccak256: (data: any) => string;
    toUtf8Bytes: (data: string) => any;
  };
}

export const mockEthers = {
  providers: {
    Provider: class {},
    TransactionReceipt: class {},
  },
  Contract: class {},
  BigNumber: class {},
  utils: {
    formatEther: (value: any) => '0',
    parseEther: (value: string) => ({ toString: () => '0' }),
    isAddress: (address: string) => true,
    keccak256: (data: any) => '0x',
    toUtf8Bytes: (data: string) => new Uint8Array(),
  },
};
