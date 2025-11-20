// Shared contract configuration: addresses and ABIs

export const BIET_IDENTITY_ADDRESS = process.env
  .NEXT_PUBLIC_BIET_IDENTITY_ADDRESS as `0x${string}`;

export const BGT_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_TOKEN_ADDRESS as `0x${string}`;

export const BGT_SALE_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_SALE_ADDRESS as `0x${string}`;

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
