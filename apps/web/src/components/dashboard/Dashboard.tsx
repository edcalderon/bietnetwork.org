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
} from '@/config/contracts';
import { IdentityTab } from '@/components/dashboard/IdentityTab';

export function UserDashboard() {
  const { isConnected, address, isAdmin } = useWallet();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'identity' | 'tokens' | 'biets'>('overview');
  const searchParams = useSearchParams();
  const { writeContract } = useWriteContract();
  
  // Get tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab') as any;
    if (tab && ['overview', 'identity', 'tokens', 'biets'].includes(tab)) {
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            My Biets Participation
          </CardTitle>
          <CardDescription>
            Join and manage your participation in productive units
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Join New Biet
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              View My Participations
            </Button>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
              🌱 About Biets
            </h4>
            <div className="space-y-2 text-sm text-purple-600 dark:text-purple-400">
              <p>• Biets are productive units generating real value</p>
              <p>• Join as contributor, investor, or validator</p>
              <p>• Earn revenue share based on your participation</p>
              <p>• Contribute to social, economic, and ecological impact</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Biets</CardTitle>
          <CardDescription>
            Discover productive units to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">Agricultural Biet #{i}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sustainable farming project • 15% APR
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
