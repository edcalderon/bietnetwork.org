'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Users, 
  Zap,
  BarChart3,
  Globe,
  Lock,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Award,
  PieChart,
  Activity
} from 'lucide-react';

export default function TokenPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Coins className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('token.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-4xl mx-auto">
              {t('token.subtitle')}
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white/20 text-white px-4 py-2 rounded-full">
                ERC-20
              </div>
              <div className="bg-white/20 text-white px-4 py-2 rounded-full">
                300,000,000 BGT Supply
              </div>
              <div className="bg-white/20 text-white px-4 py-2 rounded-full">
                Governance Token
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Specifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Activity className="h-8 w-8 text-orange-600" />
              {t('token.specifications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-sm font-semibold text-orange-600 mb-1">
                  {t('token.name')}
                </div>
                <div className="text-lg font-bold">Biet Governance Token</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                <div className="text-sm font-semibold text-amber-600 mb-1">
                  {t('token.symbol')}
                </div>
                <div className="text-lg font-bold">BGT</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                <div className="text-sm font-semibold text-yellow-600 mb-1">
                  {t('token.type')}
                </div>
                <div className="text-lg font-bold">ERC-20</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-sm font-semibold text-orange-600 mb-1">
                  {t('token.blockchain')}
                </div>
                <div className="text-lg font-bold">Ethereum (L2)</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                <div className="text-sm font-semibold text-amber-600 mb-1">
                  {t('token.maxSupply')}
                </div>
                <div className="text-lg font-bold">300,000,000 BGT</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                <div className="text-sm font-semibold text-yellow-600 mb-1">
                  {t('token.decimals')}
                </div>
                <div className="text-lg font-bold">18</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              {t('token.currentStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-2">300M</div>
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {t('token.totalSupply')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Maximum supply
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                  {t('token.holders')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Current holders
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  {t('token.totalTransfers')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total transfers
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 mb-2">$0.00</div>
                <div className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  {t('token.currentPrice')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Development phase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-6">
              <Coins className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Get Started with BGT Token
            </h3>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Join the Red Biet ecosystem and participate in governance, 
              earn rewards, and help build a more equitable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                <Download className="h-5 w-5 mr-2" />
                Download Whitepaper
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <ExternalLink className="h-5 w-5 mr-2" />
                View on Explorer
              </Button>
            </div>
            <div className="mt-8 text-sm text-orange-200">
              {t('token.lastUpdated')} • {t('token.version')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
