'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, CheckCircle, Shield, Coins, FileText, Building, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface Contract {
  name: string;
  address: string;
  description: string;
  icon: any;
  category: string;
  color: string;
}

const contracts: Contract[] = [
  {
    name: 'TimelockController',
    address: '0x2F073d291c743CB956322254eD1e3996B29a72f8',
    description: 'Controls time-locked operations for governance security',
    icon: Shield,
    category: 'Governance',
    color: 'purple'
  },
  {
    name: 'ProductiveUnit',
    address: '0x49921d374E31a622eFE4faF6ac7fC9fC08B76695',
    description: 'Manages productive units (Biets) in the network',
    icon: Building,
    category: 'Core',
    color: 'emerald'
  },
  {
    name: 'BietIdentity',
    address: '0x996c1025cbE7bd3Fb87feb47f94b84521E8Bb0b4',
    description: 'Handles digital identity management for participants',
    icon: FileText,
    category: 'Identity',
    color: 'cyan'
  },
  {
    name: 'BGT Token',
    address: '0x26CFcA9fD1c0EF8c6345ab4Df07E28Af838B4d02',
    description: 'Biet Coin Genética - Governance and utility token',
    icon: Coins,
    category: 'Token',
    color: 'amber'
  },
  {
    name: 'RevenueShare',
    address: '0x126CbCc5Bd9B959b62d590133f426c070F796DD7',
    description: 'Distributes revenue among stakeholders',
    icon: TrendingUp,
    category: 'Finance',
    color: 'green'
  },
  {
    name: 'BGTDAO',
    address: '0x7dF7c8616f01127E5f19F138F2a9A2b8Ec1f9dC3',
    description: 'Decentralized Autonomous Organization governance',
    icon: Users,
    category: 'Governance',
    color: 'indigo'
  },
  {
    name: 'BGTTreasury',
    address: '0xAC8E543d617925C2d6f817580b87106CdCe7E24C',
    description: 'Manages treasury assets and funds',
    icon: Shield,
    category: 'Finance',
    color: 'rose'
  }
];

export function ContractsInfo() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const openExplorer = (address: string) => {
    window.open(`https://sepolia.basescan.org/address/${address}`, '_blank');
  };

  const categoryColors: Record<string, string> = {
    'Governance': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Core': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Identity': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    'Token': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'Finance': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-gray-100/[0.1] dark:bg-grid-gray-800/[0.1]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl mb-6 shadow-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            📋 Deployed Contracts
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Smart contracts successfully deployed on Base Sepolia testnet
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Deployment Successful!</span>
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {contracts.map((contract, index) => {
            const Icon = contract.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${contract.color}-400 to-${contract.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[contract.category]}`}>
                      {contract.category}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-cyan-600 transition-all duration-300">
                      {contract.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                      {contract.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Contract Address
                    </p>
                    <div className="flex items-center space-x-3">
                      <code className="flex-1 text-xs bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg font-mono break-all border border-gray-200 dark:border-gray-700">
                        {contract.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(contract.address)}
                        className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        {copiedAddress === contract.address ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => openExplorer(contract.address)}
                    variant="outline"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-emerald-50 group-hover:to-cyan-50 dark:group-hover:from-emerald-900/20 dark:group-hover:to-cyan-900/20 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on BaseScan
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <div className="mt-20 animate-fade-in-up-delayed">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:from-gray-800 dark:via-emerald-900/20 dark:to-indigo-900/20 border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-2xl mb-6 shadow-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                🚀 Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Connect your wallet and start interacting with the Biet Network ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-3 text-lg">
                    🆔 Create Identity
                  </h4>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm leading-relaxed">
                    Register your decentralized identity on the blockchain and unlock full network participation
                  </p>
                </div>
                
                <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-cyan-200 dark:border-cyan-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-cyan-700 dark:text-cyan-300 mb-3 text-lg">
                    💰 Mint BGT Tokens
                  </h4>
                  <p className="text-cyan-600 dark:text-cyan-400 text-sm leading-relaxed">
                    Get governance tokens and start participating in DAO decisions and earning rewards
                  </p>
                </div>
                
                <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-indigo-200 dark:border-indigo-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-3 text-lg">
                    🌱 Join Biets
                  </h4>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm leading-relaxed">
                    Participate in productive units and contribute to social, economic, and ecological impact
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  All contracts are verified and ready for interaction on Base Sepolia testnet
                </p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Network Status: Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
