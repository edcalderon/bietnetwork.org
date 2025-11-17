/**
 * @title Contract ABIs and Configurations
 * @dev ABI definitions for Biet Network contracts
 */

export const wagmiContractConfig = {
  BGT: {
    address: '0x26CFcA9fD1c0EF8c6345ab4Df07E28Af838B4d02', // BGT Token on Base Sepolia
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'initialOwner', type: 'address' },
          { internalType: 'address', name: 'treasury', type: 'address' },
          { internalType: 'address', name: 'communityFund', type: 'address' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
        name: 'delegate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getVotes',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ] as const
  },
  BGTDAO: {
    address: '0x...', // Will be set at runtime
    abi: [
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          { internalType: 'address[]', name: 'targets', type: 'address[]' },
          { internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
          { internalType: 'bytes[]', name: 'calldatas', type: 'bytes[]' },
          { internalType: 'string', name: 'description', type: 'string' }
        ],
        name: 'propose',
        outputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
          { internalType: 'uint8', name: 'support', type: 'uint8' }
        ],
        name: 'castVote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
        name: 'state',
        outputs: [{ internalType: 'enum Governor.ProposalState', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
        name: 'proposalVotes',
        outputs: [
          { internalType: 'uint256', name: 'againstVotes', type: 'uint256' },
          { internalType: 'uint256', name: 'forVotes', type: 'uint256' },
          { internalType: 'uint256', name: 'abstainVotes', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ] as const
  },
  BGTTreasury: {
    address: '0x...', // Will be set at runtime
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
        name: 'getBalance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'getTotalValue',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ] as const
  },
  BietIdentity: {
    address: '0x...', // Will be set at runtime
    abi: [
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'hasVerifiedIdentity',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getVerificationLevel',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
      },
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
              { internalType: 'bytes32', name: 'identityHash', type: 'bytes32' }
            ],
            internalType: 'struct BietIdentity.Identity',
            name: '',
            type: 'tuple'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ] as const
  },
  ProductiveUnit: {
    address: '0x...', // Will be set at runtime
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'category', type: 'string' },
          { internalType: 'uint256', name: 'royaltyPercentage', type: 'uint256' },
          { internalType: 'string', name: 'tokenURI', type: 'string' },
          { internalType: 'string', name: 'location', type: 'string' },
          { internalType: 'string[]', name: 'tags', type: 'string[]' }
        ],
        name: 'createBiet',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getBiet',
        outputs: [
          {
            components: [
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
              { internalType: 'string[]', name: 'tags', type: 'string[]' }
            ],
            internalType: 'struct ProductiveUnit.Biet',
            name: '',
            type: 'tuple'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ] as const
  },
  RevenueShare: {
    address: '0x...', // Will be set at runtime
    abi: [
      {
        inputs: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'address[]', name: 'participants', type: 'address[]' },
          { internalType: 'uint256[]', name: 'shares', type: 'uint256[]' },
          { internalType: 'address', name: 'token', type: 'address' }
        ],
        name: 'createRevenuePool',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [{ internalType: 'uint256', name: 'poolId', type: 'uint256' }],
        name: 'distributeRevenue',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ] as const
  }
};
