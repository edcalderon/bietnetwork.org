'use client';

import { useState, useEffect } from 'react';

// Define translation types
type Translations = {
  [key: string]: {
    en: string;
    es: string;
  };
};

// Translation data
const translations: Translations = {
  // Hero Section
  'hero.activeUnits': {
    en: '🌱 Living Active Units',
    es: '🌱 Unidades Vivas Activas',
  },
  'hero.title': {
    en: 'Biet Network',
    es: 'Biet Network',
  },
  'hero.subtitle': {
    en: 'Living Units',
    es: 'Unidades Vivas',
  },
  'hero.description': {
    en: 'A decentralized network of productive units that generate social, economic, and ecological value through blockchain technology.',
    es: 'Una red descentralizada de unidades productivas que generan valor social, económico y ecológico a través de la tecnología blockchain.',
  },
  'hero.connectWallet': {
    en: 'Connect your wallet to get started with Biet Network',
    es: 'Conecta tu billetera para comenzar con Biet Network',
  },
  'hero.ready': {
    en: 'Ready when you are',
    es: 'Listo cuando tú lo estés',
  },
  'hero.walletConnected': {
    en: 'Wallet Connected!',
    es: '¡Billetera Conectada!',
  },
  'hero.redirecting': {
    en: 'Redirecting to dashboard...',
    es: 'Redirigiendo al panel...',
  },
  'hero.decentralized': {
    en: '100% Decentralized',
    es: '100% Descentralizado',
  },
  'hero.noIntermediaries': {
    en: 'No intermediaries, full community control',
    es: 'Sin intermediarios, control total de la comunidad',
  },
  'hero.daoGovernance': {
    en: 'DAO Governance',
    es: 'Gobernanza DAO',
  },
  'hero.democraticParticipation': {
    en: 'Democratic participation in key decisions',
    es: 'Participación democrática en decisiones clave',
  },
  'hero.realImpact': {
    en: 'Real Impact',
    es: 'Impacto Real',
  },
  'hero.generatingValue': {
    en: 'Generating social, economic, and ecological value',
    es: 'Generando valor social, económico y ecológico',
  },
  'hero.welcome': {
    en: 'Welcome to Biet Network!',
    es: '¡Bienvenido a Biet Network!',
  },
  'hero.startJourney': {
    en: 'Start Your Journey',
    es: 'Comienza tu Viaje',
  },
  'hero.walletSetup': {
    en: 'Your wallet is connected. Setting up your identity and dashboard...',
    es: 'Tu billetera está conectada. Configurando tu identidad y panel...',
  },
  'hero.connectDescription': {
    en: 'Connect your wallet to access the decentralized network of productive units and start creating impact.',
    es: 'Conecta tu billetera para acceder a la red descentralizada de unidades productivas y comenzar a crear impacto.',
  },
  'hero.initializing': {
    en: 'Initializing your identity...',
    es: 'Inicializando tu identidad...',
  },
  'hero.createIdentity': {
    en: 'Create Identity',
    es: 'Crear Identidad',
  },
  'hero.registerIdentity': {
    en: 'Register your digital identity on the blockchain',
    es: 'Registra tu identidad digital en la blockchain',
  },
  'hero.mintTokens': {
    en: 'Mint BGT Tokens',
    es: 'Acuñar Tokens BGT',
  },
  'hero.getGovernance': {
    en: 'Get governance tokens for participation',
    es: 'Obtén tokens de gobernanza para participación',
  },
  'hero.joinBiets': {
    en: 'Join Biets',
    es: 'Unirse a Biets',
  },
  'hero.participateUnits': {
    en: 'Participate in productive units',
    es: 'Participa en unidades productivas',
  },

  // Navigation
  'nav.home': {
    en: 'Home',
    es: 'Inicio',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    es: 'Panel',
  },
  'nav.biets': {
    en: 'Biets',
    es: 'Biets',
  },
  'nav.governance': {
    en: 'Governance',
    es: 'Gobernanza',
  },
  'nav.token': {
    en: 'Token',
    es: 'Token',
  },
  'nav.adminPanel': {
    en: 'Admin Panel',
    es: 'Panel de Admin',
  },
  'nav.settings': {
    en: 'Settings',
    es: 'Configuración',
  },

  // Dashboard
  'dashboard.title': {
    en: 'User Dashboard',
    es: 'Panel de Usuario',
  },
  'dashboard.description': {
    en: 'Manage your Biet Network identity and assets',
    es: 'Gestiona tu identidad y activos de Biet Network',
  },
  'dashboard.connectWallet': {
    en: 'Connect Your Wallet',
    es: 'Conecta tu Billetera',
  },
  'dashboard.connectDescription': {
    en: 'Please connect your wallet to access your dashboard',
    es: 'Por favor conecta tu billetera para acceder a tu panel',
  },
  'dashboard.overview': {
    en: 'Overview',
    es: 'Resumen',
  },
  'dashboard.identity': {
    en: 'Identity',
    es: 'Identidad',
  },
  'dashboard.bgtTokens': {
    en: 'BGT Tokens',
    es: 'Tokens BGT',
  },
  'dashboard.myBiets': {
    en: 'My Biets',
    es: 'Mis Biets',
  },
  'dashboard.connectedAddress': {
    en: 'Connected Address',
    es: 'Dirección Conectada',
  },
  'dashboard.bgtBalance': {
    en: 'BGT Balance',
    es: 'Saldo BGT',
  },
  'dashboard.governanceTokens': {
    en: 'Governance tokens',
    es: 'Tokens de gobernanza',
  },
  'dashboard.identityStatus': {
    en: 'Identity Status',
    es: 'Estado de Identidad',
  },
  'dashboard.createIdentity': {
    en: 'Create your identity',
    es: 'Crea tu identidad',
  },
  'dashboard.joinedBiets': {
    en: 'Joined Biets',
    es: 'Biets Unidos',
  },
  'dashboard.activeParticipations': {
    en: 'Active participations',
    es: 'Participaciones activas',
  },
  'dashboard.votingPower': {
    en: 'Voting Power',
    es: 'Poder de Voto',
  },
  'dashboard.daoInfluence': {
    en: 'DAO influence',
    es: 'Influencia en DAO',
  },

  // Wallet Button
  'wallet.connect': {
    en: 'Connect Wallet',
    es: 'Conectar Billetera',
  },
  'wallet.wrongNetwork': {
    en: 'Wrong Network',
    es: 'Red Incorrecta',
  },
  'wallet.switchToBase': {
    en: 'Switch to Base',
    es: 'Cambiar a Base',
  },
  'wallet.connected': {
    en: 'Connected',
    es: 'Conectado',
  },
  'wallet.disconnect': {
    en: 'Disconnect',
    es: 'Desconectar',
  },
  'wallet.copyAddress': {
    en: 'Copy Address',
    es: 'Copiar Dirección',
  },
  'wallet.switchNetwork': {
    en: 'Switch Network',
    es: 'Cambiar Red',
  },
  'wallet.installMetaMask': {
    en: 'Please install MetaMask or another Web3 wallet',
    es: 'Por favor instala MetaMask u otra billetera Web3',
  },
  'wallet.connectionFailed': {
    en: 'Failed to connect wallet:',
    es: 'Error al conectar billetera:',
  },

  // Language Switcher
  'language.english': {
    en: 'English',
    es: 'English',
  },
  'language.spanish': {
    en: 'Spanish',
    es: 'Español',
  },
};

export function useTranslations() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  useEffect(() => {
    // Get locale from localStorage or browser preference
    const savedLocale = localStorage.getItem('locale') as 'en' | 'es' | null;
    const browserLocale = navigator.language.split('-')[0] as 'en' | 'es';
    const defaultLocale = savedLocale || (browserLocale in translations ? browserLocale : 'en');
    setLocale(defaultLocale);
  }, []);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[locale] || translation.en || key;
  };

  const changeLanguage = (newLocale: 'en' | 'es') => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return {
    t,
    locale,
    changeLanguage,
    availableLocales: ['en', 'es'] as const,
  };
}
