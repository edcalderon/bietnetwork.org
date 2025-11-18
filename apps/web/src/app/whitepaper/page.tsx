'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  Shield, 
  Zap,
  Globe,
  Heart,
  Target,
  Award,
  BarChart3,
  Lock,
  TreePine
} from 'lucide-react';

export default function WhitepaperPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('whitepaper.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100 max-w-4xl mx-auto">
              {t('whitepaper.subtitle')}
            </p>
            <p className="text-lg text-emerald-200 mb-8">
              {t('whitepaper.team')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Download className="h-5 w-5 mr-2" />
                {t('whitepaper.downloadPDF')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                <ExternalLink className="h-5 w-5 mr-2" />
                {t('whitepaper.viewOnline')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="h-8 w-8 text-emerald-600" />
              {t('whitepaper.executiveSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('whitepaper.executiveSummaryDesc')}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Introduction */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-emerald-600" />
                {t('whitepaper.introduction')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2">
                  {t('whitepaper.context')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.contextDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2">
                  {t('whitepaper.purpose')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.purposeDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Problem */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-600" />
                {t('whitepaper.problem')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  {t('whitepaper.whyCritical')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.whyCriticalDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  Descripción del Problema
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.problemDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conceptual Framework */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TreePine className="h-6 w-6 text-green-600" />
                {t('whitepaper.conceptualFramework')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.bietDefinition')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.bietDefinitionDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.theoreticalReferences')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.theoreticalReferencesDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Proposal */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-purple-600" />
                {t('whitepaper.technicalProposal')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">
                  Visión General
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.technicalProposalDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">
                  {t('whitepaper.components')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.componentsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                {t('whitepaper.tokenomics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">
                  {t('whitepaper.tokenFunctions')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.tokenFunctionsDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">
                  {t('whitepaper.supply')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.supplyDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Architecture */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-600" />
                {t('whitepaper.architecture')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.operationalFlow')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.operationalFlowDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.financialFlow')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.financialFlowDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Phases */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              {t('whitepaper.implementation')}
            </CardTitle>
            <CardDescription>
              Plan estructurado para el despliegue y escalamiento de Red Biet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-2">0-3</div>
                <div className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                  {t('whitepaper.phase0')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Definición de pilotos, acuerdos con aliados, diseño técnico y legal
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">3-12</div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {t('whitepaper.phase1')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Despliegue en 3 comunidades, capacitación, medición de impacto
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl">
                <div className="text-3xl font-bold text-cyan-600 mb-2">12-36</div>
                <div className="text-sm font-semibold text-cyan-800 dark:text-cyan-200 mb-2">
                  {t('whitepaper.phase2')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Plantillas DAO, alianzas con gobiernos locales, red regional
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">36-60</div>
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  {t('whitepaper.phase3')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Replicación nacional, integración con políticas públicas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security and Impact */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                {t('whitepaper.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.risks')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.risksDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.mitigations')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.mitigationsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-blue-600" />
                {t('whitepaper.impact')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.indicators')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.indicatorsDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.methodology')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('whitepaper.methodologyDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-6">
              <Lock className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {t('whitepaper.fullDocument')}
            </h3>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Explora el documento completo con todos los detalles técnicos, análisis financieros, 
              estudios de caso y referencias bibliográficas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Download className="h-5 w-5 mr-2" />
                {t('whitepaper.downloadPDF')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                <ExternalLink className="h-5 w-5 mr-2" />
                {t('whitepaper.viewOnline')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
