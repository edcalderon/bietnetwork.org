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
import { useTranslations } from '@/hooks/useTranslations';

export function HeroSection() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const { t } = useTranslations();

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        router.push('/dashboard?tab=identity');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, router]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-indigo-900/20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-indigo-400/10 animate-pulse" />
      </div>
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float-slow" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">
                {t('hero.activeUnits')}
              </span>
            </div>
            
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in-up-delayed">
                {t('hero.title')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 animate-gradient-shift">
                  {t('hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl animate-fade-in-up-delayed-2 mt-6">
                {t('hero.description')}
              </p>
            </div>

            <div className="animate-fade-in-up-delayed-3">
              {!isConnected ? (
                <div className="text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {t('hero.connectWallet')}
                  </p>
                  <div className="inline-flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {t('hero.ready')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{t('hero.walletConnected')}</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                    {t('hero.redirecting')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 animate-fade-in-up-delayed-4">
              {[
                {
                  icon: CheckCircle,
                  title: t('hero.decentralized'),
                  description: t('hero.noIntermediaries'),
                },
                {
                  icon: Shield,
                  title: t('hero.daoGovernance'),
                  description: t('hero.democraticParticipation'),
                },
                {
                  icon: TrendingUp,
                  title: t('hero.realImpact'),
                  description: t('hero.generatingValue'),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block animate-slide-in-right">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-slow shadow-xl">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {isConnected ? 'Welcome to Biet Network!' : 'Start Your Journey'}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {isConnected 
                        ? 'Your wallet is connected. Setting up your identity and dashboard...'
                        : 'Connect your wallet to access the decentralized network of productive units and start creating impact.'
                      }
                    </p>

                    {isConnected && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Initializing your identity...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                          Create Identity
                        </h4>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          Register your digital identity on the blockchain
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                      <Globe className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300">
                          Mint BGT Tokens
                        </h4>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400">
                          Get governance tokens for participation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
                          Join Biets
                        </h4>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                          Participate in productive units
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
