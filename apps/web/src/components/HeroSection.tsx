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
  Shield
} from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const { isConnected, isAdmin } = useWallet();

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Sprout className="h-6 w-6" />
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Red Descentralizada
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Biet Network
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    Unidades Vivas
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Una red descentralizada de unidades productivas que generan valor social, económico y ecológico a través de la tecnología blockchain.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!isConnected ? (
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                        User Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/biets">
                      <Button variant="outline" size="lg">
                        Explorar Biets
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" size="lg">
                          <Shield className="mr-2 h-5 w-5" />
                          Panel de Administración
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
                
                <Link href="/governance">
                  <Button variant="outline" size="lg">
                    Gobernanza DAO
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                {[
                  {
                    icon: CheckCircle,
                    title: "100% Descentralizado",
                    description: "Sin intermediarios, control total de la comunidad"
                  },
                  {
                    icon: Users,
                    title: "Gobernanza DAO",
                    description: "Participa activamente en las decisiones"
                  },
                  {
                    icon: TrendingUp,
                    title: "Impacto Real",
                    description: "Genera valor social y económico tangible"
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center space-y-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
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
            <div className="hidden lg:block">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sprout className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Comienza tu Viaje
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Conecta tu wallet para acceder a todas las funcionalidades de Biet Network
                      </p>
                    </div>

                    {!isConnected ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            🔒 Connect your wallet in the navbar to get started
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✅ Wallet connected successfully
                          </p>
                        </div>
                        
                        {isAdmin && (
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              👑 You have admin privileges
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/biets">
                            <Button variant="outline" className="w-full">
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
