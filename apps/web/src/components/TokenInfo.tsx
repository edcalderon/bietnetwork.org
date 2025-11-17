'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, ArrowUpRight, BarChart2, Coins, Hash, Repeat2 } from 'lucide-react';
import Link from 'next/link';

const BGT_CONTRACT = '0x26CFcA9fD1c0EF8c6345ab4Df07E28Af838B4d02';
const MAX_SUPPLY = '300000000'; // 300M BGT
const HOLDERS = 2;
const TOTAL_TRANSFERS = 3;

export function TokenInfo() {
  // TODO: Add wallet integration when SDK is properly configured
  const address = undefined;
  const balance = undefined;

  return (
    <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            BGT Token
          </CardTitle>
          <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            ERC-20
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contract Address */}
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Hash className="w-4 h-4 mr-1.5" />
            <span>Contract</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate">
              {BGT_CONTRACT}
            </code>
            <Link 
              href={`https://sepolia.basescan.org/token/${BGT_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Token Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400">Max Supply</div>
            <div className="font-medium">{parseInt(MAX_SUPPLY).toLocaleString()} BGT</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Holders
            </div>
            <div className="font-medium">{HOLDERS.toLocaleString()}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Repeat2 className="w-3.5 h-3.5 mr-1.5" />
              Transfers
            </div>
            <div className="font-medium">{TOTAL_TRANSFERS.toLocaleString()}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
            <div className="font-medium">$0.00 <span className="text-gray-500">@ 0 ETH</span></div>
          </div>
        </div>

        {/* User Balance */}
        {address && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Balance</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                {balance ? `${balance} BGT` : '...'}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                $0.00
              </div>
            </div>
          </div>
        )}

        {/* Market Data */}
        <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
            <div className="font-medium">-</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 dark:text-gray-400">Circulating</div>
            <div className="font-medium">-</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/swap">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Trade
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/token/${BGT_CONTRACT}`}>
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
