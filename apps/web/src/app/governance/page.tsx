'use client';

import { FaVoteYea, FaUsers, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';

export default function GovernancePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="relative z-10">
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="relative inline-block">
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-r from-emerald-400/60 via-cyan-400/60 to-indigo-400/60 blur-xl opacity-80 animate-pulse" />
                <h1 className="relative text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  🏛️ {t('governance.title')}
                </h1>
              </div>
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

            <div className="mt-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('governance.createProposal')}</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-center">
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
      </div>
    </div>
  );
}
