'use client';

import { FaCoins, FaExchangeAlt, FaChartPie } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TokenPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            💎 {t('token.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            {t('token.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FaCoins className="text-white" />}
            title={t('token.utilities')}
            description={t('token.stakingDesc')}
            gradient="bg-yellow-500"
          />
          <FeatureCard
            icon={<FaExchangeAlt className="text-white" />}
            title={t('token.buyOnExchange')}
            description={t('token.earnThrough')}
            gradient="bg-blue-500"
          />
          <FeatureCard
            icon={<FaChartPie className="text-white" />}
            title={t('token.governance')}
            description={t('token.governanceDesc')}
            gradient="bg-purple-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('token.about')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('token.totalSupply')}</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('token.price')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">BGT</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('landing.stats.members')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Ethereum (ERC-20)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('token.totalSupply')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">1,000,000,000 BGT</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('token.circulatingSupply')}</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">40% {t('landing.features.decentralized')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">25% {t('governance.title')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">20% {t('token.buyOnExchange')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">15% {t('token.staking')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
