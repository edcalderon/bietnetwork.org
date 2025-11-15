'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Zap, 
  Sparkles,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroSection() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        router.push('/dashboard?tab=identity');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, router]);

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('hero.decentralized'),
      description: t('hero.noIntermediaries')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('hero.daoGovernance'),
      description: t('hero.democraticParticipation')
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('hero.realImpact'),
      description: t('hero.generatingValue')
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-indigo-900/20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('hero.activeUnits')}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('hero.title')}
              </h1>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-emerald-600 dark:text-emerald-400">
                {t('hero.subtitle')}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('hero.description')}
              </p>
            </div>

            {!isConnected && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {t('hero.connectWallet')}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isConnected ? (
                  <>
                    {t('hero.ready')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  t('hero.connectWallet')
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-medium rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              >
                {t('landing.learnMore')}
              </Button>
            </div>

            {isConnected && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>{t('hero.walletConnected')}</span>
              </div>
            )}
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-slide-in-right">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.decentralized')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('hero.noIntermediaries')}
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.daoGovernance')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('hero.democraticParticipation')}
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.realImpact')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('hero.generatingValue')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
