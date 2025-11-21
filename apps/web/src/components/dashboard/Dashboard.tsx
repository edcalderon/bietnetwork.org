'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSignMessage, usePublicClient, useWalletClient } from 'wagmi';
import { 
  User, 
  Plus, 
  Coins, 
  FileText, 
  TrendingUp,
  Award,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { parseEther, keccak256, encodePacked, hexToBytes } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import {
  BIET_IDENTITY_ADDRESS,
  BGT_TOKEN_ADDRESS,
  BGT_SALE_ADDRESS,
  BIET_IDENTITY_ABI,
  BGT_SALE_ABI,
  BGT_TOKEN_ABI,
  PRODUCTIVE_UNIT_ADDRESS,
  PRODUCTIVE_UNIT_ABI,
} from '@/config/contracts';
import { IdentityTab } from '@/components/dashboard/IdentityTab';

export function UserDashboard() {
  const { isConnected, address, isAdmin } = useWallet();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'identity' | 'tokens' | 'biets' | 'all-biets'>('overview');
  const searchParams = useSearchParams();
  const { writeContract } = useWriteContract();
  
  // Get tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab') as any;
    if (tab && ['overview', 'identity', 'tokens', 'biets', 'all-biets'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>{t('dashboard.connectWallet')}</CardTitle>
            <CardDescription>
              {t('dashboard.connectDescription')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('dashboard.overview'), icon: User },
    { id: 'identity', label: t('dashboard.identity'), icon: FileText },
    { id: 'tokens', label: t('dashboard.bgtTokens'), icon: Coins },
    { id: 'biets', label: t('dashboard.myBiets'), icon: Award },
    { id: 'all-biets', label: 'All Biets', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'identity':
        return <IdentityTab />;
      case 'tokens':
        return <TokensTab />;
      case 'biets':
        return <BietsTab />;
      case 'all-biets':
        return <AllBietsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  User Dashboard
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your Biet Network identity and assets
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function AllBietsTab() {
  const publicClient = usePublicClient();

  const [allBiets, setAllBiets] = useState<
    { 
      tokenId: bigint; 
      creator: string; 
      name: string; 
      category: string; 
      royaltyPercentage: bigint;
      location: string;
      description: string;
      metadataURI: string;
      tags: string[];
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  useEffect(() => {
    if (!publicClient || !PRODUCTIVE_UNIT_ADDRESS) return;

    const loadAllBiets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsUsingSampleData(false);

        console.log('[Dashboard] Loading all biets...');
        const latestBlock = await publicClient.getBlockNumber();
        const RANGE = 50_000n; // Increased range to match biets page
        const fromBlock = latestBlock > RANGE ? latestBlock - RANGE : 0n;

        console.log('[Dashboard] Getting logs from block', fromBlock.toString(), 'to', latestBlock.toString());
        console.log('[Dashboard] Contract address:', PRODUCTIVE_UNIT_ADDRESS);

        const logs = await publicClient.getLogs({
          address: PRODUCTIVE_UNIT_ADDRESS,
          event: {
            type: 'event',
            name: 'BietCreated',
            inputs: [
              { indexed: true, type: 'uint256', name: 'tokenId', internalType: 'uint256' },
              { indexed: true, type: 'address', name: 'creator', internalType: 'address' },
              { indexed: false, type: 'string', name: 'name', internalType: 'string' },
              { indexed: false, type: 'string', name: 'category', internalType: 'string' },
              { indexed: false, type: 'uint256', name: 'royaltyPercentage', internalType: 'uint256' },
            ],
          } as any,
          fromBlock,
          toBlock: latestBlock,
        });

        console.log('[Dashboard] Found', logs.length, 'BietCreated events');

        const parsed = logs
          .map((log: any) => log.args)
          .filter((args: any): args is {
            tokenId: bigint;
            creator: string;
            name: string;
            category: string;
            royaltyPercentage: bigint;
          } => !!args)
          .sort((a: any, b: any) => Number(a.tokenId - b.tokenId));

        console.log('[Dashboard] Parsed', parsed.length, 'biets from events');

        // Fetch full Biet details including location
        const bietDetails = [];
        for (const biet of parsed) {
          try {
            const fullBiet = await publicClient.readContract({
              address: PRODUCTIVE_UNIT_ADDRESS,
              abi: PRODUCTIVE_UNIT_ABI,
              functionName: 'biets',
              args: [biet.tokenId],
            }) as any;
            
            // Data is returned as array according to ABI order:
            // 0: name, 1: description, 2: category, 3: creator, 4: createdAt, 
            // 5: royaltyPercentage, 6: isActive, 7: totalRevenue, 8: totalDistributed,
            // 9: location, 10: tags
            
            const bietArray = fullBiet as any[];
            const location = bietArray[9] || '';
            
            bietDetails.push({
              ...biet,
              location: location,
              description: bietArray[1] || '',
              metadataURI: '', // metadataURI is stored separately, not in this struct
              tags: bietArray[10] || [],
            });
          } catch (err) {
            console.error('[Dashboard] Failed to fetch biet details for', biet.tokenId.toString(), ':', err);
            // If we can't fetch full details, use the event data
            bietDetails.push({
              ...biet,
              location: '',
              description: '',
              metadataURI: '',
              tags: [],
            });
          }
        }

        console.log('[Dashboard] Loaded', bietDetails.length, 'biet details');

        // Add sample data if no biets found
        if (bietDetails.length === 0) {
          console.log('[Dashboard] No biets found, adding sample data for testing...');
          setIsUsingSampleData(true);
          const sampleBiets = [
            {
              tokenId: 1n,
              creator: '0x1234567890123456789012345678901234567890',
              name: 'Biet Sample - Farm Colombia',
              category: 'agricultura',
              royaltyPercentage: 5n,
              location: 'Colombia',
              description: 'Sample agricultural Biet for testing purposes',
              metadataURI: '',
              tags: ['sustainable', 'organic', 'community'],
            },
            {
              tokenId: 2n,
              creator: '0x0987654321098765432109876543210987654321',
              name: 'Biet Sample - Tech Education',
              category: 'educacion',
              royaltyPercentage: 3n,
              location: 'Mexico',
              description: 'Sample education Biet for technology training',
              metadataURI: '',
              tags: ['education', 'technology', 'skills'],
            },
          ];
          setAllBiets(sampleBiets);
          setSelectedTokenId(1n);
        } else {
          setAllBiets(bietDetails);
          if (!selectedTokenId && parsed.length > 0) {
            setSelectedTokenId(parsed[0].tokenId);
          }
        }
      } catch (err: any) {
        console.error('[Dashboard] Error loading biets:', err);
        setError(err?.message ?? 'Failed to load Biets.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllBiets();
  }, [publicClient, selectedTokenId]);

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            All Biets
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Browse Biets created on the ProductiveUnit contract and inspect their details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <p className="text-sm text-muted-foreground">Loading Biets from chain…</p>
            </div>
          )}
          {error && (
            <div className="p-3 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Error loading Biets</span>
              </div>
              {error}
            </div>
          )}
          {!isLoading && !error && allBiets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Biets have been created yet.</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mb-4">
                Be the first to create a Biet and start your journey in sustainable agriculture.
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard?tab=biets'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Create First Biet
              </button>
            </div>
          )}
          {!isLoading && !error && allBiets.length > 0 && (
            <div>
              {isUsingSampleData && (
                <div className="mb-4 inline-flex items-center px-3 py-2 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-full">
                  <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Using Sample Data - No real Biets found on contract
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 max-h-[420px] overflow-auto space-y-2 text-[11px]">
                {allBiets.map((b: any) => {
                  const isSelected = selectedTokenId === b.tokenId;
                  return (
                    <button
                      key={b.tokenId.toString()}
                      type="button"
                      onClick={() => setSelectedTokenId(b.tokenId)}
                      className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                      } hover:border-blue-400 dark:hover:border-blue-300`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-50">
                            #{b.tokenId.toString()} · {b.name}
                          </div>
                          <div className="text-[10px] text-gray-600 dark:text-gray-300">
                            Category: {b.category} · Royalty: {Number(b.royaltyPercentage)}%
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400">
                          View details
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 h-full">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    Biet details
                  </h4>
                  {selectedTokenId === null && (
                    <p className="text-[11px] text-muted-foreground">
                      Select a Biet from the list to see its details.
                    </p>
                  )}
                  {selectedTokenId !== null && (
                    (() => {
                      const b = allBiets.find((x: any) => x.tokenId === selectedTokenId);
                      if (!b) {
                        return (
                          <p className="text-[11px] text-muted-foreground">
                            Select a Biet from the list to see its details.
                          </p>
                        );
                      }
                      return (
                        <div className="space-y-2 text-[11px]">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-50">
                              #{b.tokenId.toString()} · {b.name}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-300">
                              Category: {b.category}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-700 dark:text-gray-200">
                            <span>Royalty</span>
                            <span>{Number(b.royaltyPercentage)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-700 dark:text-gray-200">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                              </svg>
                              Location
                            </span>
                            <span>{b.location || 'Not specified'}</span>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
                            <div className="text-[10px] font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Creator
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 break-all">
                              {b.creator}
                            </div>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <a
                              href={`https://sepolia.basescan.org/token/${PRODUCTIVE_UNIT_ADDRESS}?a=${b.tokenId.toString()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-400/10 px-2 py-1 rounded hover:bg-blue-400/20 transition-colors"
                              title="View on Base Sepolia Explorer"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                              </svg>
                              View on Explorer
                            </a>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                            Future: members, revenue stats, and globe location markers will appear here.
                          </p>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatBgtHuman(amount?: bigint, decimals: number = 18): string {
  if (!amount || amount === 0n) return '0';

  const value = Number(amount) / Math.pow(10, decimals);
  if (!Number.isFinite(value)) {
    return amount.toString();
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function OverviewTab() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: bgtBalance } = useReadContract({
    address: BGT_TOKEN_ADDRESS,
    abi: BGT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: identity } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: BIET_IDENTITY_ABI,
    functionName: 'getIdentityByAddress',
    args: address ? [address] : undefined,
  });

  const createdAtRaw = identity
    ? (BigInt(((identity as any).createdAt ?? (identity as any)[4] ?? 0n)))
    : 0n;

  const createdAtFormatted =
    createdAtRaw && createdAtRaw !== 0n
      ? new Date(Number(createdAtRaw) * 1000).toLocaleDateString()
      : null;


  

  const { data: identityBalance } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ] as const,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BGT Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bgtBalance ? formatBgtHuman(bgtBalance as bigint) : '0'}</div>
          <p className="text-xs text-muted-foreground">
            Governance tokens
          </p>
          {address && (
            <button
              type="button"
              onClick={() => window.open(`https://sepolia.basescan.org/token/${BGT_TOKEN_ADDRESS}?a=${address}`, '_blank')}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-2 hover:underline"
            >
              View balance on explorer
            </button>
          )}
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Identity Status</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {mounted && identityBalance && identityBalance > 0n && identity ? (
            <>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Identity created{createdAtFormatted ? ` on ${createdAtFormatted}` : ''}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">Not Set</div>
              <p className="text-xs text-muted-foreground">Create your identity</p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Joined Biets</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Active participations
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bgtBalance ? formatBgtHuman(bgtBalance as bigint) : '0'}</div>
          <p className="text-xs text-muted-foreground">
            DAO influence
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TokensTab() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  const { data: bgtBalance } = useReadContract({
    address: BGT_TOKEN_ADDRESS,
    abi: BGT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const handleBuyTokens = () => {
    if (!address) return;

    // Example fixed purchase amount: 0.1 ETH. In a real UI this should be user input.
    const ethToSpend = parseEther('0.1');
    const minBgtOut = 0n; // No slippage protection for now

    writeContract({
      address: BGT_SALE_ADDRESS,
      abi: BGT_SALE_ABI,
      functionName: 'buy',
      args: [minBgtOut],
      value: ethToSpend,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            BGT Token Management
          </CardTitle>
          <CardDescription>
            Mint and manage your BGT (Biet Coin Genética) tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleBuyTokens}
              disabled={isPending || isConfirming}
              className="h-20 flex-col"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-6 w-6 mb-2 animate-spin" />
              ) : (
                <Coins className="h-6 w-6 mb-2" />
              )}
              Buy BGT Tokens
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              View Token Stats
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Award className="h-6 w-6 mb-2" />
              Governance Voting
            </Button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current BGT Balance
            </p>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bgtBalance ? Number(bgtBalance) : '0'} BGT
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-700 dark:text-red-300">
                  Error Minting Tokens
                </h4>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error.message}
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-700 dark:text-green-300">
                  Tokens Minted Successfully!
                </h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                1000 BGT tokens have been minted to your address.
              </p>
            </div>
          )}
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
              💰 About BGT Tokens
            </h4>
            <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
              <p>• BGT is the governance token of Biet Network</p>
              <p>• Used for voting on DAO proposals</p>
              <p>• Earn rewards by participating in Biets</p>
              <p>• Stake tokens to increase voting power</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Token Contract</CardTitle>
          <CardDescription>
            Interact with the deployed BGT token contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BGT Token Address
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded font-mono">
                {BGT_TOKEN_ADDRESS}
              </code>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(`https://sepolia.basescan.org/token/${BGT_TOKEN_ADDRESS}`,'_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BaseScan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BietsTab() {
  const { address } = useAccount();
  const { isAdmin } = useWallet();
  const publicClient = usePublicClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('agricultura');
  const [description, setDescription] = useState('');
  const [royalty, setRoyalty] = useState('5');
  const [metadataURI, setMetadataURI] = useState('');
  const [location, setLocation] = useState('Colombia');
  const [tagsInput, setTagsInput] = useState('');

  const [joinTokenId, setJoinTokenId] = useState('');
  const [joinAmountEth, setJoinAmountEth] = useState('0.1');

  const [localError, setLocalError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [availableBiets, setAvailableBiets] = useState<
    { tokenId: bigint; creator: string; name: string; category: string; royaltyPercentage: bigint }[]
  >([]);
  const [isLoadingBiets, setIsLoadingBiets] = useState(false);
  const [loadBietsError, setLoadBietsError] = useState<string | null>(null);

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const {
    writeContract: writeJoin,
    data: joinHash,
    isPending: isJoinPending,
    error: joinWagmiError,
  } = useWriteContract();
  const { isLoading: isJoinConfirming, isSuccess: isJoinSuccess } = useWaitForTransactionReceipt({ hash: joinHash });

  useEffect(() => {
    if (!publicClient || !PRODUCTIVE_UNIT_ADDRESS) return;

    const loadBiets = async () => {
      try {
        setIsLoadingBiets(true);
        setLoadBietsError(null);

        const latestBlock = await publicClient.getBlockNumber();
        const RANGE = 100_000n;
        const fromBlock = latestBlock > RANGE ? latestBlock - RANGE : 0n;

        const logs = await publicClient.getLogs({
          address: PRODUCTIVE_UNIT_ADDRESS,
          event: {
            type: 'event',
            name: 'BietCreated',
            inputs: [
              { indexed: true, type: 'uint256', name: 'tokenId', internalType: 'uint256' },
              { indexed: true, type: 'address', name: 'creator', internalType: 'address' },
              { indexed: false, type: 'string', name: 'name', internalType: 'string' },
              { indexed: false, type: 'string', name: 'category', internalType: 'string' },
              { indexed: false, type: 'uint256', name: 'royaltyPercentage', internalType: 'uint256' },
            ],
          } as any,
          fromBlock,
        });

        const parsed = logs
          .map((log: any) => log.args)
          .filter((args: any): args is {
            tokenId: bigint;
            creator: string;
            name: string;
            category: string;
            royaltyPercentage: bigint;
          } => !!args)
          .sort((a: any, b: any) => Number(a.tokenId - b.tokenId));

        setAvailableBiets(parsed);

        // If there is at least one Biet and no join token selected, default to the first one
        if (parsed.length > 0 && !joinTokenId) {
          setJoinTokenId(parsed[0].tokenId.toString());
        }
      } catch (err: any) {
        setLoadBietsError(err?.message ?? 'Failed to load existing Biets.');
      } finally {
        setIsLoadingBiets(false);
      }
    };

    loadBiets();
  }, [publicClient, joinTokenId]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const randomId = Math.floor(1000 + Math.random() * 9000);

    // Auto-suggest name, description, and a safe royalty (0-10) based on category
    switch (value) {
      case 'agricultura':
        setName(`Biet#${randomId}-agriculturaFarm`);
        setDescription('Biet agrícola enfocado en producción sostenible y restauración de suelos.');
        setRoyalty('5');
        break;
      case 'tecnologia':
        setName(`Biet#${randomId}-tecnologiaNode`);
        setDescription('Soluciones de software y hardware para monitoreo y gobernanza de Biets.');
        setRoyalty('7');
        break;
      case 'educacion':
        setName(`Biet#${randomId}-educacionHub`);
        setDescription('Programa educativo que conecta estudiantes con proyectos Biet reales.');
        setRoyalty('4');
        break;
      case 'salud':
        setName(`Biet#${randomId}-saludCenter`);
        setDescription('Biet de servicios de salud primaria financiado por contribuciones locales.');
        setRoyalty('6');
        break;
      case 'energia':
        setName(`Biet#${randomId}-energiaGrid`);
        setDescription('Infraestructura de generación de energía limpia para comunidades Biet.');
        setRoyalty('8');
        break;
      case 'manufactura':
        setName(`Biet#${randomId}-manufacturaLab`);
        setDescription('Unidad productiva que reutiliza materiales y minimiza residuos.');
        setRoyalty('5');
        break;
      case 'servicios':
        setName(`Biet#${randomId}-serviciosHub`);
        setDescription('Plataforma de servicios profesionales y operativos asociados a Biets.');
        setRoyalty('3');
        break;
      case 'turismo':
        setName(`Biet#${randomId}-turismoRoute`);
        setDescription('Itinerario turístico centrado en experiencias en Biets rurales y urbanos.');
        setRoyalty('9');
        break;
      default:
        break;
    }
  };

  const handleCreateBiet = () => {
    setLocalError(null);

    if (!address) {
      setLocalError('Connect your wallet to create a Biet.');
      return;
    }

    if (!isAdmin) {
      setLocalError('Only creator/admin wallets can mint new Biets.');
      return;
    }

    if (!name || !category || !metadataURI) {
      setLocalError('Name, category, and metadata URI are required.');
      return;
    }

    const royaltyNumber = Number(royalty);
    if (!Number.isFinite(royaltyNumber) || royaltyNumber < 0 || royaltyNumber > 100) {
      setLocalError('Royalty must be between 0 and 100.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    console.log('Creating Biet with data:', {
      address,
      name,
      description,
      category,
      royalty: BigInt(royaltyNumber),
      metadataURI,
      location,
      tags
    });

    try {
      writeContract({
        address: PRODUCTIVE_UNIT_ADDRESS,
        abi: PRODUCTIVE_UNIT_ABI,
        functionName: 'createBiet',
        args: [
          address as `0x${string}`,
          name,
          description,
          category,
          BigInt(royaltyNumber),
          metadataURI,
          location,
          tags,
        ],
      });
    } catch (e: any) {
      setLocalError(e?.message ?? 'Failed to submit transaction.');
    }
  };

  const handleJoinBiet = () => {
    setJoinError(null);

    if (!address) {
      setJoinError('Connect your wallet to join a Biet.');
      return;
    }

    const tokenIdNumber = Number(joinTokenId);
    if (!Number.isInteger(tokenIdNumber) || tokenIdNumber < 0) {
      setJoinError('Select a valid Biet to join.');
      return;
    }

    if (!joinAmountEth || Number(joinAmountEth) <= 0) {
      setJoinError('Enter a positive ETH amount.');
      return;
    }

    try {
      writeJoin({
        address: PRODUCTIVE_UNIT_ADDRESS,
        abi: [
          {
            inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
            name: 'receivePayment',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
        ] as const,
        functionName: 'receivePayment',
        args: [BigInt(tokenIdNumber)],
        value: parseEther(joinAmountEth as `${number}`),
      });
    } catch (e: any) {
      setJoinError(e?.message ?? 'Failed to submit join transaction.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            My Biets Participation
          </CardTitle>
          <CardDescription>
            Create new Biets (for creators) or join existing Biets by contributing funds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create New Biet */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/40">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Biet
            </h4>
            <p className="text-xs text-muted-foreground">
              Only wallets with creator/admin permissions can mint new Biets on the ProductiveUnit contract.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Biet name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Category</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={category}
                  onChange={(e: any) => handleCategoryChange(e.target.value)}
                >
                  <option value="agricultura">agricultura</option>
                  <option value="tecnologia">tecnologia</option>
                  <option value="educacion">educacion</option>
                  <option value="salud">salud</option>
                  <option value="energia">energia</option>
                  <option value="manufactura">manufactura</option>
                  <option value="servicios">servicios</option>
                  <option value="turismo">turismo</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  rows={2}
                  placeholder="Short description of the productive unit and its impact"
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Royalty %</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={royalty}
                  onChange={(e: any) => setRoyalty(e.target.value)}
                >
                  <option value="0">0%</option>
                  <option value="1">1%</option>
                  <option value="2">2%</option>
                  <option value="3">3%</option>
                  <option value="4">4%</option>
                  <option value="5">5%</option>
                  <option value="6">6%</option>
                  <option value="7">7%</option>
                  <option value="8">8%</option>
                  <option value="9">9%</option>
                  <option value="10">10%</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Metadata URI</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="ipfs://... or https://..."
                  value={metadataURI}
                  onChange={(e: any) => setMetadataURI(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Location (country)</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={location}
                  onChange={(e: any) => setLocation(e.target.value)}
                >
                  <option value="Colombia">Colombia</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United States">United States</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Peru">Peru</option>
                  <option value="Spain">Spain</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Tags (optional)</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Comma-separated, e.g. cattle,grassfed,carbon"
                  value={tagsInput}
                  onChange={(e: any) => setTagsInput(e.target.value)}
                />
              </div>
            </div>
            {localError && (
              <div className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200">
                {localError}
              </div>
            )}
            {error && (
              <div className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200">
                {error.message}
              </div>
            )}
            {isSuccess && (
              <div className="p-2 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-[11px] text-emerald-700 dark:text-emerald-200">
                Biet created successfully. Transaction confirmed on-chain.
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleCreateBiet}
                disabled={isPending || isConfirming}
                className="flex items-center gap-2"
              >
                {isPending || isConfirming ? 'Creating Biet…' : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create Biet</span>
                  </>
                )}
              </Button>
              {txHash && (
                <p className="text-[11px] text-muted-foreground break-all">
                  Tx: {txHash}
                </p>
              )}
            </div>
          </div>

          {/* Join Existing Biet */}
          <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Join Existing Biet
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Send ETH directly to a Biet via the ProductiveUnit contract. The platform fee and revenue tracking
              will be handled automatically.
            </p>
            {loadBietsError && (
              <div className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200">
                {loadBietsError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Biet to Join</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  value={joinTokenId}
                  onChange={(e) => setJoinTokenId(e.target.value)}
                  disabled={isLoadingBiets || availableBiets.length === 0}
                >
                  {isLoadingBiets && <option>Loading Biets…</option>}
                  {!isLoadingBiets && availableBiets.length === 0 && <option>No Biets available yet</option>}
                  {!isLoadingBiets &&
                    availableBiets.map((b) => (
                      <option key={b.tokenId.toString()} value={b.tokenId.toString()}>
                        #{b.tokenId.toString()}  b7 {b.name} ({b.category})
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Amount (ETH)</label>
                <input
                  className="w-full rounded border px-3 py-2 text-sm bg-background"
                  placeholder="0.1"
                  value={joinAmountEth}
                  onChange={(e) => setJoinAmountEth(e.target.value)}
                />
              </div>
            </div>
            {joinError && (
              <div className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200">
                {joinError}
              </div>
            )}
            {joinWagmiError && (
              <div className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-[11px] text-red-700 dark:text-red-200">
                {joinWagmiError.message}
              </div>
            )}
            {isJoinSuccess && (
              <div className="p-2 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-[11px] text-emerald-700 dark:text-emerald-200">
                Contribution sent successfully. Revenue recorded for this Biet.
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleJoinBiet}
                disabled={isJoinPending || isJoinConfirming}
                className="flex items-center gap-2"
              >
                {isJoinPending || isJoinConfirming ? 'Joining…' : 'Join Biet'}
              </Button>
              {joinHash && (
                <p className="text-[11px] text-muted-foreground break-all">
                  Tx: {joinHash}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
              🌱 About Biets
            </h4>
            <div className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
              <p>• Biets are productive units generating real value</p>
              <p>• Join as contributor, investor, or validator</p>
              <p>• Your ETH contributions are tracked for revenue distribution</p>
              <p>• Contribute to social, economic, and ecological impact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
