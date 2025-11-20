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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
                <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('whitepaper.title')}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-emerald-50/90 max-w-4xl mx-auto leading-relaxed">
              {t('whitepaper.subtitle')}
            </p>
            <p className="text-sm sm:text-lg text-emerald-100/90">
              {t('whitepaper.team')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-800 hover:bg-emerald-50 shadow-md hover:shadow-lg transition-shadow font-semibold"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('whitepaper.downloadPDF')}
              </Button>
              <Button
                size="lg"
                className="bg-emerald-900/90 text-white hover:bg-white hover:text-emerald-800 border border-white/80 shadow-md hover:shadow-lg transition-shadow font-semibold"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {t('whitepaper.viewOnline')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Card className="mb-12 bg-white/95 dark:bg-slate-900/95 border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="h-8 w-8 text-emerald-600" />
              {t('whitepaper.executiveSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-100 leading-relaxed">
              {t('whitepaper.executiveSummaryDesc')}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Introduction */}
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.contextDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2">
                  {t('whitepaper.purpose')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.purposeDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Problem */}
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.whyCriticalDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  Descripción del Problema
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.problemDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conceptual Framework */}
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.bietDefinitionDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.theoreticalReferences')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.theoreticalReferencesDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Proposal */}
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.technicalProposalDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">
                  {t('whitepaper.components')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.componentsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.tokenFunctionsDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">
                  {t('whitepaper.supply')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.operationalFlowDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.financialFlow')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.financialFlowDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Phases */}
        <Card className="mb-16 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              {t('whitepaper.implementation')}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Plan estructurado para el despliegue y escalamiento de Red Biet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/40 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-2">0-3</div>
                <div className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                  {t('whitepaper.phase0')}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Definición de pilotos, acuerdos con aliados, diseño técnico y legal
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">3-12</div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {t('whitepaper.phase1')}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Despliegue en 3 comunidades, capacitación, medición de impacto
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/40 rounded-xl">
                <div className="text-3xl font-bold text-cyan-600 mb-2">12-36</div>
                <div className="text-sm font-semibold text-cyan-800 dark:text-cyan-200 mb-2">
                  {t('whitepaper.phase2')}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Plantillas DAO, alianzas con gobiernos locales, red regional
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/40 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">36-60</div>
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  {t('whitepaper.phase3')}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Replicación nacional, integración con políticas públicas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security and Impact */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.risksDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  {t('whitepaper.mitigations')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.mitigationsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.indicatorsDesc')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">
                  {t('whitepaper.methodology')}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {t('whitepaper.methodologyDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg">
          <CardContent className="text-center py-10 sm:py-12">
            <div className="flex justify-center mb-6">
              <Lock className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {t('whitepaper.fullDocument')}
            </h3>
            <p className="text-emerald-50/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Explora el documento completo con todos los detalles técnicos, análisis financieros, 
              estudios de caso y referencias bibliográficas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 shadow-md hover:shadow-lg font-semibold">
                <Download className="h-5 w-5 mr-2" />
                {t('whitepaper.downloadPDF')}
              </Button>
              <Button
                size="lg"
                className="bg-emerald-900/90 text-white hover:bg-white hover:text-emerald-800 border border-white/80 shadow-md hover:shadow-lg font-semibold"
              >
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
