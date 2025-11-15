'use client';

import { FaLeaf, FaHandsHelping, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';

export default function BietsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            🌱 {t('biets.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            {t('biets.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FaLeaf className="text-white" />}
            title={t('biets.agricultural')}
            description={t('landing.features.decentralizedDesc')}
            gradient="bg-green-500"
          />
          <FeatureCard
            icon={<FaHandsHelping className="text-white" />}
            title={t('biets.renewable')}
            description={t('landing.features.transparentDesc')}
            gradient="bg-teal-500"
          />
          <FeatureCard
            icon={<FaChartLine className="text-white" />}
            title={t('biets.manufacturing')}
            description={t('landing.features.rewardingDesc')}
            gradient="bg-emerald-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('biets.available')}</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              {t('biets.subtitle')}. 
              {t('landing.features.transparentDesc')}
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">{t('biets.education')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>{t('biets.healthcare')}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>{t('biets.technology')}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>{t('biets.join')}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                <span>{t('biets.viewDetails')}</span>
              </li>
            </ul>

            <div className="mt-8 bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-100 dark:border-green-900">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">{t('landing.cta.title')}</h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                {t('landing.cta.description')}
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                {t('biets.join')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
