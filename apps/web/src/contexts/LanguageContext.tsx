'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
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

  // Language Switcher
  'language.english': {
    en: 'English',
    es: 'English',
  },
  'language.spanish': {
    en: 'Spanish',
    es: 'Español',
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
  'wallet.adminPanel': {
    en: 'Admin Panel',
    es: 'Panel de Admin',
  },
  'wallet.installMetaMask': {
    en: 'Please install MetaMask or another Web3 wallet',
    es: 'Por favor instala MetaMask u otra billetera Web3',
  },
  'wallet.connectionFailed': {
    en: 'Failed to connect wallet:',
    es: 'Error al conectar billetera:',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get saved language or browser preference
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const defaultLanguage = savedLanguage || (browserLanguage === 'es' ? 'es' : 'en');
    
    setLanguageState(defaultLanguage);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
