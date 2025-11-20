'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Sparkles,
  Users,
  TrendingUp,
  ArrowUpRight,
  BarChart2,
  Coins,
  CheckCircle
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { TokenInfo } from './TokenInfo';
import GeometricSphere from '@/components/ui/geometric-sphere';
import { ParticleTextEffect } from '@/components/ParticleTextEffect';
import { InstallPwaButton } from '@/components/InstallPwaButton';

export function HeroSection() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const { t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: t('hero.step1Title'),
      description: t('hero.step1Desc')
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: t('hero.step2Title'),
      description: t('hero.step2Desc')
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: t('hero.step3Title'),
      description: t('hero.step3Desc')
    }
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100 via-cyan-100 to-indigo-100 dark:from-gray-900 dark:via-emerald-900/20 dark:to-indigo-900/20 overflow-hidden">
      {/* Geometric Sphere Background Layer */}
      <GeometricSphere />
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Mobile Layout: Title/CTAs first, then 3 steps card */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-center">
          {/* Hero Content - First on mobile, left on desktop */}
          <div className="w-full xl:w-1/2 space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-in-left order-1 xl:order-1 text-center xl:text-left">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                {t('hero.activeUnits')}
              </div>
              {/* Static title on small screens */}
              <h1 className="md:hidden text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight drop-shadow-sm">
                {t('hero.title')}
              </h1>
              {/* Particle animation title on md+ screens */}
              <div className="hidden md:flex justify-center">
                <ParticleTextEffect words={[t('hero.title'), '$BGT']} />
              </div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold bg-gradient-to-r from-emerald-700 to-cyan-700 dark:from-emerald-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                {t('hero.subtitle')}
              </h2>
              
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl drop-shadow-sm">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center xl:justify-start w-full sm:w-auto">
              <Button
                onClick={() => router.push('/dashboard')}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-3 sm:px-4 lg:px-6 xl:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base xl:text-lg font-medium rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-500/20"
              >
                {isConnected ? (
                  <span className="flex items-center justify-center">
                    <span className="hidden sm:inline">Explore the Network</span>
                    <span className="sm:hidden">Explore</span>
                    <ArrowUpRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="hidden sm:inline">{t('hero.connectWallet')}</span>
                    <span className="sm:hidden">Connect</span>
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                )}
              </Button>
              <InstallPwaButton />
            </div>

            {isConnected && (
              <div className="flex items-center justify-center xl:justify-start gap-1.5 sm:gap-2 text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">{t('hero.walletConnected')}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center xl:justify-start w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/documentation')}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base xl:text-lg font-medium rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20 transition-all duration-200"
              >
                <span className="hidden sm:inline">{t('landing.learnMore')}</span>
                <span className="sm:hidden">Learn</span>
              </Button>
            </div>
          </div>

          {/* 3 Steps Card - Second on mobile, right on desktop */}
          <div className="w-full xl:w-1/2 flex justify-center animate-slide-in-right order-2 xl:order-2">
            <Card className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-white via-emerald-50/70 to-cyan-50/70 dark:from-gray-800 dark:via-emerald-900/30 dark:to-cyan-900/30 backdrop-blur-md border border-emerald-300/70 dark:border-emerald-400/30 shadow-2xl rounded-2xl lg:rounded-3xl ring-2 lg:ring-4 ring-emerald-500/30 dark:ring-emerald-400/20 transition-all duration-500 hover:shadow-3xl hover:ring-emerald-500/40 dark:hover:ring-emerald-400/30 hover:-translate-y-2 transform-gpu">
              <CardContent className="p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* 3D Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-indigo-500/5 opacity-50 rounded-2xl lg:rounded-3xl"></div>
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-400/20 rounded-full filter blur-2xl sm:blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-cyan-400/20 rounded-full filter blur-2xl sm:blur-3xl"></div>
                
                <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-700 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent mb-2">
                      {t('hero.getStarted')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {t('hero.getStartedDescription')}
                    </p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="group relative p-3 sm:p-4 lg:p-6 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-emerald-300/60 dark:border-emerald-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
                      >
                        {/* Step Number */}
                        <div className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 z-20">
                          {index + 1}
                        </div>
                        
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/50 dark:to-cyan-900/50 text-emerald-600 dark:text-emerald-400 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                            {feature.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-700/30">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.decentralized')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t('hero.noIntermediaries')}
            </p>
          </div>

          <div className="text-center p-6 bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-700/30">
            <div className="text-3xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.daoGovernance')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t('hero.democraticParticipation')}
            </p>
          </div>

          <div className="text-center p-6 bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-700/30">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('hero.realImpact')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t('hero.generatingValue')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
