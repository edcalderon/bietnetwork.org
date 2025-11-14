'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContractsInfo } from '@/components/ContractsInfo';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Shield,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const { isConnected, isAdmin } = useWallet();

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-indigo-900/20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-indigo-400/10 animate-pulse" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-xl animate-float-slow" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 animate-fade-in-up">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Red Descentralizada
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in-up-delayed">
                  Biet Network
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 animate-gradient-shift">
                    Unidades Vivas
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl animate-fade-in-up-delayed-2">
                  Una red descentralizada de unidades productivas que generan valor social, económico y ecológico a través de la tecnología blockchain.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delayed-3">
                {!isConnected ? (
                  <div className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 animate-fade-in-up-delayed-3">
                      Connect your wallet to get started with Biet Network
                    </p>
                    <div className="inline-flex items-center justify-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Ready when you are
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 hover:from-emerald-700 hover:via-cyan-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 shadow-xl">
                      <Globe className="mr-2 h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 animate-fade-in-up-delayed-4">
                {[
                  {
                    icon: CheckCircle,
                    title: "100% Descentralizado",
                    description: "Sin intermediarios, control total de la comunidad",
                    color: "emerald"
                  },
                  {
                    icon: Users,
                    title: "Gobernanza DAO",
                    description: "Participa activamente en las decisiones",
                    color: "cyan"
                  },
                  {
                    icon: TrendingUp,
                    title: "Impacto Real",
                    description: "Genera valor social y económico tangible",
                    color: "indigo"
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center space-y-4 group hover:scale-105 transition-all duration-300">
                      <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-${feature.color}-200 dark:group-hover:bg-${feature.color}-900/40 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                        <Icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="hidden lg:block animate-slide-in-right">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-slow shadow-xl">
                        <Sprout className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Comienza tu Viaje
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Conecta tu wallet para acceder a todas las funcionalidades de Biet Network
                      </p>
                    </div>

                    {!isConnected ? (
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                              <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              Connect your wallet in the navbar to get started
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-green-700 dark:text-green-300 font-medium">
                              Wallet connected successfully
                            </p>
                          </div>
                        </div>
                        
                        {isAdmin && (
                          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <p className="text-purple-700 dark:text-purple-300 font-medium">
                                You have admin privileges
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Link href="/dashboard">
                            <Button variant="outline" className="w-full h-12 hover:scale-105 transition-all duration-300 border-2 border-emerald-200 dark:border-emerald-800">
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/biets">
                            <Button variant="outline" className="w-full h-12 hover:scale-105 transition-all duration-300 border-2 border-cyan-200 dark:border-cyan-800">
                              View Biets
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contracts Information Section */}
      <ContractsInfo />
    </>
  );
}
