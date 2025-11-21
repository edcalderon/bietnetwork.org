'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, toBytes } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Shield, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Coins, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { PRODUCTIVE_UNIT_ADDRESS, PRODUCTIVE_UNIT_ABI } from '@/config/contracts';

export function AdminDashboard() {
  const { isAdmin, address } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'biets' | 'tokens' | 'governance'>('overview');

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have admin privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Connected address: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'biets', label: 'Biets Management', icon: Plus },
    { id: 'tokens', label: 'Token Operations', icon: Coins },
    { id: 'governance', label: 'Governance', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'biets':
        return <BietsManagementTab />;
      case 'tokens':
        return <TokenOperationsTab />;
      case 'governance':
        return <GovernanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Biet Network operations and configurations
          </p>
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
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Biets</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BGT Supply</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.2M</div>
          <p className="text-xs text-muted-foreground">
            +10% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground">
            +18% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proposals</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            3 active, 5 completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function BietsManagementTab() {
  const { address } = useWallet();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('agricultura');
  const [royalty, setRoyalty] = useState('5');
  const [metadataURI, setMetadataURI] = useState('');
  const [location, setLocation] = useState('Colombia');
  const [tagsInput, setTagsInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const randomId = Math.floor(1000 + Math.random() * 9000);

    // Auto-suggest name, description, and a safe royalty (0-10) based on category
    switch (value) {
      case 'agricultura':
        setName(`Biet#${randomId}-agriculturaFarm`);
        setDescription('Unidad productiva agrícola enfocada en prácticas regenerativas y captura de carbono.');
        setRoyalty('5');
        break;
      case 'tecnologia':
        setName(`Biet#${randomId}-tecnologiaNode`);
        setDescription('Infraestructura tecnológica para monitorear en tiempo real la producción e impacto de los Biets.');
        setRoyalty('7');
        break;
      case 'educacion':
        setName(`Biet#${randomId}-educacionHub`);
        setDescription('Programa educativo híbrido para formación técnica en territorios rurales conectados a la red Biet.');
        setRoyalty('4');
        break;
      case 'salud':
        setName(`Biet#${randomId}-saludCenter`);
        setDescription('Centro de salud de proximidad financiado por contribuciones a Biets locales.');
        setRoyalty('6');
        break;
      case 'energia':
        setName(`Biet#${randomId}-energiaGrid`);
        setDescription('Proyecto de energía renovable distribuida para comunidades conectadas a la red Biet.');
        setRoyalty('8');
        break;
      case 'manufactura':
        setName(`Biet#${randomId}-manufacturaLab`);
        setDescription('Unidad productiva de transformación local con enfoque circular y bajo impacto ambiental.');
        setRoyalty('5');
        break;
      case 'servicios':
        setName(`Biet#${randomId}-serviciosHub`);
        setDescription('Red de servicios profesionales y logísticos alineados con proyectos Biet.');
        setRoyalty('3');
        break;
      case 'turismo':
        setName(`Biet#${randomId}-turismoRoute`);
        setDescription('Experiencia turística que conecta Biets rurales con visitantes de impacto.');
        setRoyalty('9');
        break;
      default:
        break;
    }
  };

  const handleCreateBiet = () => {
    setLocalError(null);

    if (!address) {
      setLocalError('Connect an admin wallet to create a Biet.');
      return;
    }

    if (!name || !description || !category || !metadataURI || !location) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    const royaltyNumber = Number(royalty);
    if (!Number.isFinite(royaltyNumber) || royaltyNumber < 0 || royaltyNumber > 100) {
      setLocalError('Royalty must be between 0 and 100.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

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

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-50">Biets Management</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Create and manage productive units (Biets) on the ProductiveUnit contract
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Name</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Biet name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Category</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Description</label>
              <textarea
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                rows={3}
                placeholder="Describe the productive unit, impact, and purpose"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Royalty %</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                value={royalty}
                onChange={(e) => setRoyalty(e.target.value)}
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
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Metadata URI</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="ipfs://... or https://..."
                value={metadataURI}
                onChange={(e) => setMetadataURI(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Location (country)</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-800 dark:text-gray-100">Tags</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Comma-separated, e.g. cattle,grassfed,carbon"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {localError && (
            <div className="p-3 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-xs text-red-700 dark:text-red-200">
              {localError}
            </div>
          )}
          {error && (
            <div className="p-3 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-xs text-red-700 dark:text-red-200">
              {error.message}
            </div>
          )}
          {isSuccess && (
            <div className="p-3 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-xs text-emerald-700 dark:text-emerald-200">
              Biet created successfully on-chain. Transaction confirmed.
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
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
            {hash && (
              <p className="text-xs text-muted-foreground break-all">
                Tx Hash: {hash}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TokenOperationsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Operations</CardTitle>
          <CardDescription>
            Manage BGT token supply and distributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex-col">
              <Coins className="h-6 w-6 mb-2" />
              Mint BGT Tokens
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              View Token Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GovernanceTab() {
  const { address } = useWallet();

  const [targetAddress, setTargetAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState<'CREATOR_ROLE' | 'ADMIN_ROLE' | 'OPERATOR_ROLE'>('CREATOR_ROLE');
  const [localError, setLocalError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleGrantRole = () => {
    setLocalError(null);

    if (!address) {
      setLocalError('Connect the deployer/admin wallet to manage roles.');
      return;
    }

    if (!targetAddress || !targetAddress.startsWith('0x') || targetAddress.length !== 42) {
      setLocalError('Enter a valid Ethereum address (0x...).');
      return;
    }

    let roleLabel: string;
    switch (selectedRole) {
      case 'ADMIN_ROLE':
        roleLabel = 'ADMIN_ROLE';
        break;
      case 'OPERATOR_ROLE':
        roleLabel = 'OPERATOR_ROLE';
        break;
      case 'CREATOR_ROLE':
      default:
        roleLabel = 'CREATOR_ROLE';
        break;
    }

    const roleBytes32 = keccak256(toBytes(roleLabel));

    try {
      writeContract({
        address: PRODUCTIVE_UNIT_ADDRESS,
        abi: PRODUCTIVE_UNIT_ABI,
        functionName: 'grantRole',
        args: [roleBytes32, targetAddress as `0x${string}`],
      });
    } catch (e: any) {
      setLocalError(e?.message ?? 'Failed to submit role transaction.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Grant creator/admin/operator roles on the ProductiveUnit contract. Only admin/deployer wallets can
            successfully execute these transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Role</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
              >
                <option value="CREATOR_ROLE">Creator (can create new Biets)</option>
                <option value="ADMIN_ROLE">Admin</option>
                <option value="OPERATOR_ROLE">Operator</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Target address</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                placeholder="0x... wallet to grant the role to"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
              />
            </div>
          </div>

          {localError && (
            <div className="p-3 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-xs text-red-700 dark:text-red-200">
              {localError}
            </div>
          )}
          {error && (
            <div className="p-3 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-xs text-red-700 dark:text-red-200">
              {error.message}
            </div>
          )}
          {isSuccess && (
            <div className="p-3 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-xs text-emerald-700 dark:text-emerald-200">
              Role granted successfully on-chain. Transaction confirmed.
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleGrantRole}
              disabled={isPending || isConfirming}
              className="flex items-center gap-2"
            >
              {isPending || isConfirming ? 'Granting role…' : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Grant Role</span>
                </>
              )}
            </Button>
            {hash && (
              <p className="text-xs text-muted-foreground break-all">
                Tx Hash: {hash}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governance Settings</CardTitle>
          <CardDescription>
            Configure DAO parameters and voting mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Voting Period</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: 7 days
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Quorum Requirement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: 4% of total supply
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
