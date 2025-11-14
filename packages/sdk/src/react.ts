/**
 * @title React Hooks for Biet Network
 * @dev React hooks for interacting with Biet Network contracts
 */

import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { useMemo } from 'react';
import type { Biet, Identity, RevenuePool, ProposalDetails } from './types';

// Contract addresses (these should come from environment or config
const CONTRACT_ADDRESSES = {
  bgt: '0x...', // Replace with actual deployed address
  dao: '0x...',
  treasury: '0x...',
  identity: '0x...',
  productiveUnit: '0x...',
  revenueShare: '0x...'
} as const;

/**
 * Hook for BGT token balance
 */
export function useBGTBalance(address?: string) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;
  
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.bgt as `0x${string}`,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
  });

  const formattedBalance = useMemo(() => {
    if (!data) return '0';
    return formatEther(data as bigint);
  }, [data]);

  return {
    balance: data as bigint | undefined,
    formattedBalance,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook for BGT total supply
 */
export function useBGTTotalSupply() {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.bgt as `0x${string}`,
    abi: [
      {
        name: 'totalSupply',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'totalSupply',
  });

  const formattedSupply = useMemo(() => {
    if (!data) return '0';
    return formatEther(data as bigint);
  }, [data]);

  return {
    totalSupply: data as bigint | undefined,
    formattedSupply,
    error,
    isLoading,
  };
}

/**
 * Hook for voting power
 */
export function useVotingPower(address?: string) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;
  
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.bgt as `0x${string}`,
    abi: [
      {
        name: 'getVotes',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'getVotes',
    args: targetAddress ? [targetAddress] : undefined,
  });

  const formattedPower = useMemo(() => {
    if (!data) return '0';
    return formatEther(data as bigint);
  }, [data]);

  return {
    votingPower: data as bigint | undefined,
    formattedPower,
    error,
    isLoading,
  };
}

/**
 * Hook for DAO proposals
 */
export function useDAOProposals() {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.dao as `0x${string}`,
    abi: [
      {
        name: 'getAllProposals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256[]' }],
      },
    ],
    functionName: 'getAllProposals',
  });

  return {
    proposals: data as bigint[] | undefined,
    error,
    isLoading,
  };
}

/**
 * Hook for proposal details
 */
export function useProposalDetails(proposalId: bigint) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.dao as `0x${string}`,
    abi: [
      {
        name: 'getProposalDetails',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'proposalId', type: 'uint256' }],
        outputs: [
          { name: 'status', type: 'uint8' },
          { name: 'forVotes', type: 'uint256' },
          { name: 'againstVotes', type: 'uint256' },
          { name: 'abstainVotes', type: 'uint256' },
          { name: 'quorumReached', type: 'bool' },
        ],
      },
    ],
    functionName: 'getProposalDetails',
    args: [proposalId],
  });

  const details = useMemo((): ProposalDetails | undefined => {
    if (!data) return undefined;
    
    const [status, forVotes, againstVotes, abstainVotes, quorumReached] = data as [
      number,
      bigint,
      bigint,
      bigint,
      boolean
    ];
    
    return {
      status,
      forVotes: formatEther(forVotes),
      againstVotes: formatEther(againstVotes),
      abstainVotes: formatEther(abstainVotes),
      quorumReached,
    };
  }, [data]);

  return {
    details,
    error,
    isLoading,
  };
}

/**
 * Hook for user identity
 */
export function useUserIdentity(address?: string) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;
  
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.identity as `0x${string}`,
    abi: [
      {
        name: 'getIdentityByAddress',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [
          {
            components: [
              { name: 'name', type: 'string' },
              { name: 'did', type: 'string' },
              { name: 'country', type: 'string' },
              { name: 'verificationLevel', type: 'string' },
              { name: 'createdAt', type: 'uint256' },
              { name: 'isActive', type: 'bool' },
              { name: 'identityHash', type: 'bytes32' },
            ],
            name: '',
            type: 'tuple',
          },
        ],
      },
    ],
    functionName: 'getIdentityByAddress',
    args: targetAddress ? [targetAddress] : undefined,
  });

  const identity = useMemo((): Identity | undefined => {
    if (!data) return undefined;
    
    const [name, did, country, verificationLevel, createdAt, isActive, identityHash] = data as [
      string,
      string,
      string,
      string,
      bigint,
      boolean,
      string
    ];
    
    return {
      name,
      did,
      country,
      verificationLevel,
      createdAt: Number(createdAt),
      isActive,
      identityHash,
    };
  }, [data]);

  return {
    identity,
    error,
    isLoading,
  };
}

/**
 * Hook for Biet (productive unit) details
 */
export function useBietDetails(tokenId: bigint) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.productiveUnit as `0x${string}`,
    abi: [
      {
        name: 'getBiet',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [
          {
            components: [
              { name: 'name', type: 'string' },
              { name: 'description', type: 'string' },
              { name: 'category', type: 'string' },
              { name: 'creator', type: 'address' },
              { name: 'createdAt', type: 'uint256' },
              { name: 'royaltyPercentage', type: 'uint256' },
              { name: 'isActive', type: 'bool' },
              { name: 'totalRevenue', type: 'uint256' },
              { name: 'totalDistributed', type: 'uint256' },
              { name: 'location', type: 'string' },
              { name: 'tags', type: 'string[]' },
            ],
            name: '',
            type: 'tuple',
          },
        ],
      },
    ],
    functionName: 'getBiet',
    args: [tokenId],
  });

  const biet = useMemo((): Biet | undefined => {
    if (!data) return undefined;
    
    const [
      name,
      description,
      category,
      creator,
      createdAt,
      royaltyPercentage,
      isActive,
      totalRevenue,
      totalDistributed,
      location,
      tags,
    ] = data as [
      string,
      string,
      string,
      string,
      bigint,
      number,
      boolean,
      bigint,
      bigint,
      string,
      string[],
    ];
    
    return {
      name,
      description,
      category,
      creator,
      createdAt: Number(createdAt),
      royaltyPercentage,
      isActive,
      totalRevenue: formatEther(totalRevenue),
      totalDistributed: formatEther(totalDistributed),
      location,
      tags,
    };
  }, [data]);

  return {
    biet,
    error,
    isLoading,
  };
}

/**
 * Hook for voting on proposals
 */
export function useVote() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const vote = (proposalId: bigint, support: number) => {
    writeContract({
      address: CONTRACT_ADDRESSES.dao as `0x${string}`,
      abi: [
        {
          name: 'castVote',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'proposalId', type: 'uint256' },
            { name: 'support', type: 'uint8' },
          ],
          outputs: [],
        },
      ],
      functionName: 'castVote',
      args: [proposalId, support],
    });
  };

  return {
    vote,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

/**
 * Hook for delegating votes
 */
export function useDelegate() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const delegate = (delegatee: string) => {
    writeContract({
      address: CONTRACT_ADDRESSES.bgt as `0x${string}`,
      abi: [
        {
          name: 'delegate',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [{ name: 'delegatee', type: 'address' }],
          outputs: [],
        },
      ],
      functionName: 'delegate',
      args: [delegatee as `0x${string}`],
    });
  };

  return {
    delegate,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

/**
 * Hook for creating proposals
 */
export function useCreateProposal() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const createProposal = (
    targets: string[],
    values: bigint[],
    calldatas: string[],
    description: string
  ) => {
    writeContract({
      address: CONTRACT_ADDRESSES.dao as `0x${string}`,
      abi: [
        {
          name: 'propose',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'targets', type: 'address[]' },
            { name: 'values', type: 'uint256[]' },
            { name: 'calldatas', type: 'bytes[]' },
            { name: 'description', type: 'string' },
          ],
          outputs: [{ name: 'proposalId', type: 'uint256' }],
        },
      ],
      functionName: 'propose',
      args: [targets as `0x${string}`[], values, calldatas as `0x${string}`[], description],
    });
  };

  return {
    createProposal,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
