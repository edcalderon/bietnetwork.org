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
  Hash,
  Globe,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { parseEther, keccak256, encodePacked, hexToBytes } from 'viem';
import { Client, type Signer, type Identifier, ConsentState } from '@xmtp/browser-sdk';
import { baseSepolia } from 'wagmi/chains';

// Contract addresses (Base Sepolia) - loaded from env so we can redeploy easily
const BIET_IDENTITY_ADDRESS = process.env
  .NEXT_PUBLIC_BIET_IDENTITY_ADDRESS as `0x${string}`;

const BGT_TOKEN_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_TOKEN_ADDRESS as `0x${string}`;

const BGT_SALE_ADDRESS = process.env
  .NEXT_PUBLIC_BGT_SALE_ADDRESS as `0x${string}`;

// Contract ABIs (simplified for demo)
// Real BietIdentity ABI subset: getIdentityByAddress returning the Identity struct
const BIET_IDENTITY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "getIdentityByAddress",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "did", "type": "string" },
      { "internalType": "string", "name": "country", "type": "string" },
      { "internalType": "string", "name": "verificationLevel", "type": "string" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "bytes32", "name": "identityHash", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// BGT sale contract ABI (simplified)
const BGT_SALE_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "minBgtOut", "type": "uint256" }
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

const BGT_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

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
          <div className="flex items-center justify-between">
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
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected Address</p>
              <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
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

function OverviewTab() {
  const { address } = useAccount();
  const { data: bgtBalance } = useReadContract({
    address: BGT_TOKEN_ADDRESS,
    abi: BGT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: verificationFee } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        "inputs": [],
        "name": "verificationFee",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ] as const,
    functionName: 'verificationFee',
  });

  const { data: identity } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: BIET_IDENTITY_ABI,
    functionName: 'getIdentityByAddress',
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
          <div className="text-2xl font-bold">{bgtBalance ? Number(bgtBalance) : '0'}</div>
          <p className="text-xs text-muted-foreground">
            Governance tokens
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Identity Status</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {identity && identity[5] ? 'Active' : 'Not Set'}
          </div>
          <p className="text-xs text-muted-foreground">
            {identity && identity[5] ? 'Identity created' : 'Create your identity'}
          </p>
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
          <div className="text-2xl font-bold">{bgtBalance ? Number(bgtBalance) : '0'}</div>
          <p className="text-xs text-muted-foreground">
            DAO influence
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function IdentityTab() {
  const { address } = useAccount();
  const { isAdmin } = useWallet();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [adminTarget, setAdminTarget] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminDid, setAdminDid] = useState('');
  const [adminCountry, setAdminCountry] = useState('');
  const [adminLevel, setAdminLevel] = useState('basic');
  const [adminSignature, setAdminSignature] = useState<string | null>(null);

  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userDid, setUserDid] = useState('');
  const [didTouched, setDidTouched] = useState(false);
  const [userCountry, setUserCountry] = useState('');
  const [userLevel, setUserLevel] = useState('basic');
  const [userSignature, setUserSignature] = useState('');

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [xmtpStatus, setXmtpStatus] = useState<
    'idle' | 'connecting' | 'listening' | 'signature_received' | 'unreachable' | 'error'
  >('idle');
  const [xmtpError, setXmtpError] = useState<string | null>(null);

  const fullUserName = `${userFirstName} ${userLastName}`.trim();

  const computeDid = () => {
    if (userDid) return userDid;
    if (!address || !fullUserName) return '';
    const didBase = fullUserName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `did:biet:${didBase}:${address.toLowerCase()}`;
  };

  useEffect(() => {
    if (didTouched) return;
    if (!address || !fullUserName) return;
    const didBase = fullUserName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setUserDid(`did:biet:${didBase}:${address.toLowerCase()}`);
  }, [address, fullUserName, didTouched]);

  const isIdentityFormComplete = !!(fullUserName && userCountry && userLevel);

  const verifiers = [
    {
      id: 'biet-deployer',
      name: 'Biet Deployer Verifier',
      address: '0xdd070e6123c718FD63bf298DF8041889BFcB8b50',
    },
  ];

  const [selectedVerifierId, setSelectedVerifierId] = useState(
    verifiers.length > 0 ? verifiers[0].id : ''
  );

  const selectedVerifier = verifiers.find((v) => v.id === selectedVerifierId) || verifiers[0];

  const { data: identity } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: BIET_IDENTITY_ABI,
    functionName: 'getIdentityByAddress',
    args: address ? [address] : undefined,
  });

  const { data: verificationFee } = useReadContract({
    address: BIET_IDENTITY_ADDRESS,
    abi: [
      {
        "inputs": [],
        "name": "verificationFee",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ] as const,
    functionName: 'verificationFee',
  });

  const handleCopyRequestForVerifier = async () => {
    if (!address || !isIdentityFormComplete) return;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) return;

    const params = new URLSearchParams({
      address,
      name: fullUserName,
      did: computeDid(),
      country: userCountry,
      level: userLevel,
    });

    const url = `${origin}/verify?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      // Silent success; UI already explains usage.
    } catch {
      // If clipboard is not available, fail silently.
    }
  };

  const buildXmtpSigner = (): Signer | null => {
    if (!address || !walletClient) return null;

    const accountIdentifier: Identifier = {
      identifier: address.toLowerCase(),
      identifierKind: 'Ethereum',
    };

    const signer: Signer = {
      type: 'EOA',
      getIdentifier: () => accountIdentifier,
      signMessage: async (message: string): Promise<Uint8Array> => {
        const signature = await walletClient.signMessage({ account: address, message });
        // signature is a 0x-prefixed hex string; convert to bytes
        return hexToBytes(signature as `0x${string}`);
      },
    };

    return signer;
  };

  const handleStartXmtpListener = async () => {
    try {
      setXmtpError(null);
      setXmtpStatus('connecting');

      if (!address || !walletClient || !selectedVerifier || !isIdentityFormComplete) {
        setXmtpStatus('error');
        setXmtpError('Connect wallet, complete the form, and select a verifier first.');
        return;
      }

      const signer = buildXmtpSigner();
      if (!signer) {
        setXmtpStatus('error');
        setXmtpError('Unable to build XMTP signer for this wallet.');
        return;
      }

      let client = xmtpClient;
      if (!client) {
        client = await Client.create(signer, { env: 'dev' });
        setXmtpClient(client);
      }

      const identifiers: Identifier[] = [
        { identifier: selectedVerifier.address.toLowerCase(), identifierKind: 'Ethereum' },
      ];

      const canMsgMap = await Client.canMessage(identifiers);
      const canMessageVerifier = canMsgMap.get(selectedVerifier.address.toLowerCase());

      if (!canMessageVerifier) {
        setXmtpStatus('unreachable');
        setXmtpError('Verifier is not reachable on XMTP dev network.');
        return;
      }

      setXmtpStatus('listening');

      const stream = await client.conversations.streamAllMessages({
        consentStates: [ConsentState.Allowed],
        onValue: (message: any) => {
          try {
            if (xmtpStatus === 'signature_received') return;
            const raw = (message && (message.content ?? message)) as unknown;
            const text = typeof raw === 'string' ? raw : String(raw ?? '');
            const trimmed = text.trim();
            if (trimmed.startsWith('0x') && trimmed.length > 100) {
              setUserSignature(trimmed as `0x${string}`);
              setXmtpStatus('signature_received');
            }
          } catch {
            // ignore parsing errors
          }
        },
        onError: (err: any) => {
          setXmtpStatus('error');
          setXmtpError(err?.message ?? 'XMTP stream error');
        },
      });

      // Fire-and-forget stream; we don't need to await it here.
      void stream;
    } catch (e: any) {
      setXmtpStatus('error');
      setXmtpError(e?.message ?? 'Failed to start XMTP listener.');
    }
  };

  const handleAdminGenerateSignature = async () => {
    if (!adminTarget) return;

    const nonce = await publicClient.readContract({
      address: BIET_IDENTITY_ADDRESS,
      abi: [
        {
          "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
          "name": "mintNonces",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const,
      functionName: 'mintNonces',
      args: [adminTarget as `0x${string}`],
    });

    const identityHash = keccak256(encodePacked(
      ['address', 'string', 'string', 'string', 'string', 'uint256'],
      [adminTarget, adminName, adminDid, adminCountry, adminLevel, nonce as bigint]
    ));

    const signature = await signMessageAsync({
      message: { raw: identityHash },
    });

    setAdminSignature(signature);
  };

  const handleUserMintWithSignature = () => {
    if (!address || !userSignature || !isIdentityFormComplete) return;

    writeContract({
      address: BIET_IDENTITY_ADDRESS,
      abi: [
        {
          "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "did", "type": "string" },
            { "internalType": "string", "name": "country", "type": "string" },
            { "internalType": "string", "name": "verificationLevel", "type": "string" },
            { "internalType": "bytes", "name": "signature", "type": "bytes" }
          ],
          "name": "mintIdentity",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ] as const,
      functionName: 'mintIdentity',
      args: [
        address,
        fullUserName,
        computeDid(),
        userCountry,
        userLevel,
        userSignature as `0x${string}`,
      ],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Identity
          </CardTitle>
          <CardDescription>
            Create and manage your decentralized identity on Biet Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {identity && identity[0] ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200/60 dark:border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-700 dark:text-green-300">
                  Identity Created Successfully
                </h4>
              </div>
              <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
                <p><strong>Full Name:</strong> {identity[0]}</p>
                <p><strong>DID:</strong> {identity[1]}</p>
                <p><strong>Country:</strong> {identity[2]}</p>
                <p><strong>Verification Level:</strong> {identity[3]}</p>
                <p><strong>Created At (timestamp):</strong> {Number(identity[4])}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200/60 dark:border-yellow-500/40 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-100">
                No identity found for this address yet. Use the verifier attestation flow
                below to mint your verified identity on-chain.
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-700 dark:text-red-300">
                  Error Creating Identity
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
                  Transaction Confirmed!
                </h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your identity has been created on the blockchain.
              </p>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              📋 Identity Information
            </h4>
            <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
              <p>• Your identity is stored on-chain and cryptographically secure</p>
              <p>• Includes verification levels and country information</p>
              <p>• Required for full participation in Biets</p>
              <p>• Can be updated but never deleted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Identity Fields</CardTitle>
          <CardDescription>
            Information stored in your on-chain identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">DID (Decentralized ID)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Country</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Verification Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Reputation Score</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Verifier Tools (Admin / Biet)</CardTitle>
            <CardDescription>
              Generate attestation signatures for user identities (client-side only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Only wallets with the on-chain VERIFIER_ROLE should use this. Make sure the
              fields you enter here match exactly what the user will enter in the mint
              form; otherwise the signature will be rejected.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="User address (0x...)"
                value={adminTarget}
                onChange={(e) => setAdminTarget(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Full name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="DID (optional)"
                value={adminDid}
                onChange={(e) => setAdminDid(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Country"
                value={adminCountry}
                onChange={(e) => setAdminCountry(e.target.value)}
              />
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Verification level (basic/verified/premium)"
                value={adminLevel}
                onChange={(e) => setAdminLevel(e.target.value)}
              />
            </div>
            <Button onClick={handleAdminGenerateSignature} disabled={isPending || isConfirming}>
              Generate Attestation Signature
            </Button>
            {adminSignature && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Signature (share with user or use directly to mint):</p>
                <textarea
                  className="w-full rounded border px-3 py-2 text-xs bg-background font-mono"
                  rows={3}
                  value={adminSignature}
                  readOnly
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border border-emerald-200/70 dark:border-emerald-700/60 bg-white dark:bg-gray-900/60">
        <CardHeader>
          <CardTitle>Mint Identity with Attestation</CardTitle>
          <CardDescription>
            Use a verifier-provided signature to mint your identity on-chain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            The values below must be identical to what your verifier used when
            generating the signature (address, name, DID, country, verification
            level). If any field differs, the contract will treat the signature as
            invalid.
          </p>
          <p className="text-xs text-muted-foreground">
            Share these fields with a trusted verifier (with VERIFIER_ROLE). They will
            paste them into the Verifier Tools card above, generate a signature, and
            send it back to you to paste here.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200">
            First name, last name, country, and verification level are required before
            you can generate links or mint your identity.
          </p>
          {verifiers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
              <span className="text-muted-foreground">Select verifier:</span>
              <select
                className="rounded border bg-background px-2 py-1 text-xs"
                value={selectedVerifierId}
                onChange={(e) => setSelectedVerifierId(e.target.value)}
              >
                {verifiers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.address.slice(0, 6)}...{v.address.slice(-4)})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                First name
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="First name"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                Last name (apellidos)
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="Last name"
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                DID (optional)
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="did:... (leave blank to auto-generate)"
                value={userDid}
                onChange={(e) => {
                  setUserDid(e.target.value);
                  setDidTouched(true);
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                Country
              </label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                value={userCountry}
                onChange={(e) => setUserCountry(e.target.value)}
              >
                <option value="">Select country</option>
                <option value="MX">Mexico</option>
                <option value="US">United States</option>
                <option value="CO">Colombia</option>
                <option value="AR">Argentina</option>
                <option value="ES">Spain</option>
                <option value="BR">Brazil</option>
                <option value="CL">Chile</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                Verification level
              </label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                value={userLevel}
                onChange={(e) => setUserLevel(e.target.value)}
              >
                <option value="">Select level</option>
                <option value="basic">basic</option>
                <option value="verified">verified</option>
                <option value="premium">premium</option>
              </select>
            </div>
          </div>
          <textarea
            className="w-full rounded border px-3 py-2 text-xs bg-background font-mono"
            rows={3}
            placeholder="Verifier signature (0x...)"
            value={userSignature}
            onChange={(e) => setUserSignature(e.target.value)}
          />
          {xmtpStatus !== 'idle' && (
            <p className="text-[11px] text-muted-foreground">
              {xmtpStatus === 'connecting' && 'Connecting to XMTP dev network…'}
              {xmtpStatus === 'listening' &&
                'Listening for verifier messages on XMTP. Ask them to reply with the signature.'}
              {xmtpStatus === 'signature_received' &&
                'Signature received via XMTP and applied. You can now mint your identity.'}
              {xmtpStatus === 'unreachable' &&
                'Verifier is not reachable on XMTP dev network. Use copy link or email instead.'}
              {xmtpStatus === 'error' && xmtpError && `XMTP error: ${xmtpError}`}
            </p>
          )}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <Button
              onClick={handleUserMintWithSignature}
              disabled={isPending || isConfirming || !isIdentityFormComplete || !userSignature}
              className="flex items-center gap-2 flex-1"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              Mint My Verified Identity
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto text-xs"
              onClick={handleCopyRequestForVerifier}
              disabled={!isIdentityFormComplete || !address}
            >
              Copy verification link
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto text-xs"
              onClick={() => {
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                if (!origin || !address || !isIdentityFormComplete) return;
                const params = new URLSearchParams({
                  address,
                  name: fullUserName,
                  did: computeDid(),
                  country: userCountry,
                  level: userLevel,
                });
                const url = `${origin}/verify?${params.toString()}`;
                const mailto = `mailto:?subject=Biet%20Identity%20Verification&body=${encodeURIComponent(
                  `Please open this link with your verifier wallet to sign my identity attestation:\n\n${url}`,
                )}`;
                window.location.href = mailto;
              }}
            >
              Send link via email
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto text-xs"
              onClick={handleStartXmtpListener}
              disabled={
                !isIdentityFormComplete ||
                !address ||
                xmtpStatus === 'connecting' ||
                xmtpStatus === 'listening'
              }
            >
              {xmtpStatus === 'listening' || xmtpStatus === 'connecting'
                ? 'Listening on XMTP…'
                : 'Listen for XMTP signature'}
            </Button>
          </div>
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
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Agricultural Biet #{i}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sustainable farming project • 15% APR
                  </p>
                </div>
                <Button variant="outline" size="sm">
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
