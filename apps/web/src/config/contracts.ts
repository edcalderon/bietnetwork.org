// Shared contract configuration: addresses and ABIs

export const BIET_IDENTITY_ADDRESS = process.env
  .NEXT_PUBLIC_BIET_IDENTITY_ADDRESS as `0x${string}`;

export const BGT_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_TOKEN_ADDRESS as `0x${string}`;

export const BGT_SALE_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_SALE_ADDRESS as `0x${string}`;

export const PRODUCTIVE_UNIT_ADDRESS = process.env
  .NEXT_PUBLIC_PRODUCTIVE_UNIT_ADDRESS as `0x${string}`;

// Real BietIdentity ABI subset: getIdentityByAddress returning the Identity struct
export const BIET_IDENTITY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getIdentityByAddress',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'did', type: 'string' },
          { internalType: 'string', name: 'country', type: 'string' },
          { internalType: 'string', name: 'verificationLevel', type: 'string' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'bool', name: 'isActive', type: 'bool' },
          { internalType: 'bytes32', name: 'identityHash', type: 'bytes32' },
        ],
        internalType: 'struct BietIdentity.Identity',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const PRODUCTIVE_UNIT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'category', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
    ],
    name: 'BietCreated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
      { internalType: 'string', name: 'metadataURI', type: 'string' },
      { internalType: 'string', name: 'location', type: 'string' },
      { internalType: 'string[]', name: 'tags', type: 'string[]' },
    ],
    name: 'createBiet',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'biets',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
      { internalType: 'uint256', name: 'totalRevenue', type: 'uint256' },
      { internalType: 'uint256', name: 'totalDistributed', type: 'uint256' },
      { internalType: 'string', name: 'location', type: 'string' },
      { internalType: 'string[]', name: 'tags', type: 'string[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const BGT_SALE_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'minBgtOut', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const BGT_TOKEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
