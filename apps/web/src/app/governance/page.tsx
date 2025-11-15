'use client';

import { FaVoteYea, FaUsers, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GovernancePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            🏛️ {t('governance.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
            {t('governance.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaVoteYea className="text-white" />}
            title={t('governance.vote')}
            description={t('governance.participationRequired')}
            gradient="bg-blue-500"
          />
          <FeatureCard
            icon={<FaUsers className="text-white" />}
            title={t('landing.stats.members')}
            description={t('landing.cta.description')}
            gradient="bg-green-500"
          />
          <FeatureCard
            icon={<FaChartLine className="text-white" />}
            title={t('landing.features.transparent')}
            description={t('landing.features.transparentDesc')}
            gradient="bg-purple-500"
          />
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('governance.createProposal')}</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              {t('governance.subtitle')}
            </p>
            <ul className="mt-4 space-y-2">
              <li>{t('governance.viewProposal')}</li>
              <li>{t('governance.vote')}</li>
              <li>{t('governance.votingPower')}</li>
              <li>{t('token.governance')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
