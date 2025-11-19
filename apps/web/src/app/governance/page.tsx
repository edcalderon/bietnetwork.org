'use client';

import { FaVoteYea, FaUsers, FaChartLine } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';
import { BackgroundPaths } from '../../components/BackgroundPaths';

export default function GovernancePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative">
      {/* Global Background Paths Animation */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white dark:bg-neutral-950">
          <div className="absolute inset-0">
            <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
              <title>Background Paths</title>
              {Array.from({ length: 36 }, (_, i) => ({
                id: i,
                d: `M-${380 - i * 5} -${189 + i * 6}C-${380 - i * 5} -${189 + i * 6} -${312 - i * 5} ${216 - i * 6} ${152 - i * 5} ${343 - i * 6}C${616 - i * 5} ${470 - i * 6} ${684 - i * 5} ${875 - i * 6} ${684 - i * 5} ${875 - i * 6}`,
                color: `rgba(15,23,42,${0.1 + i * 0.03})`,
                width: 0.5 + i * 0.03,
              })).map((path) => (
                <path
                  key={path.id}
                  d={path.d}
                  stroke="currentColor"
                  strokeWidth={path.width}
                  strokeOpacity={0.1 + path.id * 0.03}
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
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
