'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Coins, 
  BarChart3,
  Download,
  ExternalLink,
  Activity
} from 'lucide-react';
import { DottedSurface } from '../../components/DottedSurface';

export default function TokenPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900">
      {/* Dotted Surface Animation Background */}
      <DottedSurface />
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-700 to-emerald-700 text-white">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/40 backdrop-blur-sm rounded-2xl ring-2 ring-white/60 shadow-lg">
                  <Coins className="h-12 w-12 text-gray-900 dark:text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-lg">
                Token BGT
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-900 dark:text-white max-w-4xl mx-auto drop-shadow">
                Biet Governance Token - Detalles técnicos y tokenómica
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-white/40 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full border border-white/60 shadow-lg">
                  ERC-20
                </div>
                <div className="bg-white/40 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full border border-white/60 shadow-lg">
                  300,000,000 BGT Supply
                </div>
                <div className="bg-white/40 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full border border-white/60 shadow-lg">
                  Governance Token
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Specifications */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="mb-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Activity className="h-6 w-6 text-green-800 dark:text-green-400" />
                </div>
                {t('token.specifications')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 rounded-lg border border-green-300 dark:border-green-700">
                  <div className="text-sm font-semibold text-green-900 dark:text-green-400 mb-1">
                    {t('token.name')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Biet Governance Token</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-800/20 rounded-lg border border-emerald-300 dark:border-emerald-700">
                  <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-400 mb-1">
                    {t('token.symbol')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">BGT</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 rounded-lg border border-teal-300 dark:border-teal-700">
                  <div className="text-sm font-semibold text-teal-900 dark:text-teal-400 mb-1">
                    {t('token.type')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">ERC-20</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 rounded-lg border border-green-300 dark:border-green-700">
                  <div className="text-sm font-semibold text-green-900 dark:text-green-400 mb-1">
                    {t('token.blockchain')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Ethereum (L2)</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-800/20 rounded-lg border border-emerald-300 dark:border-emerald-700">
                  <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-400 mb-1">
                    {t('token.maxSupply')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">300,000,000 BGT</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 rounded-lg border border-teal-300 dark:border-teal-700">
                  <div className="text-sm font-semibold text-teal-900 dark:text-teal-400 mb-1">
                    {t('token.decimals')}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">18</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="mb-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-800 dark:text-blue-400" />
                </div>
                {t('token.currentStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl border border-green-300 dark:border-green-700">
                  <div className="text-2xl font-bold text-green-900 dark:text-green-400 mb-2">300M</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {t('token.totalSupply')}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Maximum supply
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-800/20 rounded-xl border border-emerald-300 dark:border-emerald-700">
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">2</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {t('token.holders')}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Current holders
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 rounded-xl border border-teal-300 dark:border-teal-700">
                  <div className="text-2xl font-bold text-teal-900 dark:text-teal-400 mb-2">3</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {t('token.totalTransfers')}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Total transfers
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-800/20 rounded-xl border border-cyan-300 dark:border-cyan-700">
                  <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-400 mb-2">$0.00</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {t('token.currentPrice')}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Development phase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-700 to-emerald-700 text-white border border-green-600 shadow-xl">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl ring-2 ring-white/40">
                  <Coins className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Get Started with BGT Token
              </h3>
              <p className="text-white mb-8 max-w-2xl mx-auto">
                Join the Biet Network ecosystem and participate in governance, 
                earn rewards, and help build a more equitable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 border border-green-200 shadow-lg">
                  <Download className="h-5 w-5 mr-2" />
                  Download Whitepaper
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 backdrop-blur-sm">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View on Explorer
                </Button>
              </div>
              <div className="mt-8 text-sm text-white">
                {t('token.lastUpdated')} • {t('token.version')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
