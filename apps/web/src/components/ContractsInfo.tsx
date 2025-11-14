'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Contract {
  name: string;
  address: string;
  description: string;
}

const contracts: Contract[] = [
  {
    name: 'TimelockController',
    address: '0x2F073d291c743CB956322254eD1e3996B29a72f8',
    description: 'Controls time-locked operations for governance security'
  },
  {
    name: 'ProductiveUnit',
    address: '0x49921d374E31a622eFE4faF6ac7fC9fC08B76695',
    description: 'Manages productive units (Biets) in the network'
  },
  {
    name: 'BietIdentity',
    address: '0x996c1025cbE7bd3Fb87feb47f94b84521E8Bb0b4',
    description: 'Handles digital identity management for participants'
  },
  {
    name: 'BGT Token',
    address: '0x26CFcA9fD1c0EF8c6345ab4Df07E28Af838B4d02',
    description: 'Biet Coin Genética - Governance and utility token'
  },
  {
    name: 'RevenueShare',
    address: '0x126CbCc5Bd9B959b62d590133f426c070F796DD7',
    description: 'Distributes revenue among stakeholders'
  },
  {
    name: 'BGTDAO',
    address: '0x7dF7c8616f01127E5f19F138F2a9A2b8Ec1f9dC3',
    description: 'Decentralized Autonomous Organization governance'
  },
  {
    name: 'BGTTreasury',
    address: '0xAC8E543d617925C2d6f817580b87106CdCe7E24C',
    description: 'Manages treasury assets and funds'
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

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            📋 Deployed Contracts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Base Sepolia Testnet Deployment
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Deployment Successful!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{contract.name}</CardTitle>
                <CardDescription>{contract.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contract Address:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono break-all">
                      {contract.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(contract.address)}
                      className="flex-shrink-0"
                    >
                      {copiedAddress === contract.address ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => openExplorer(contract.address)}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on BaseScan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">🚀 Next Steps</CardTitle>
              <CardDescription>
                Connect your wallet to start interacting with the deployed contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    🆔 Create Identity
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Register your digital identity on the blockchain
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    💰 Mint BGT Tokens
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Get governance tokens for participating in the DAO
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                    🌱 Join Biets
                  </h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Participate in productive units and earn rewards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
