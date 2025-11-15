'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Landing Page
  'landing.welcome': {
    en: 'Welcome to the Future of Decentralized Production',
    es: 'Bienvenido al Futuro de la Producción Descentralizada',
  },
  'landing.subtitle': {
    en: 'Join a network where your contributions create real impact',
    es: 'Únete a una red donde tus contribuciones crean impacto real',
  },
  'landing.getStarted': {
    en: 'Get Started',
    es: 'Comenzar',
  },
  'landing.learnMore': {
    en: 'Learn More',
    es: 'Saber Más',
  },
  'landing.features.title': {
    en: 'Why Choose Biet Network?',
    es: '¿Por Qué Elegir Biet Network?',
  },
  'landing.features.decentralized': {
    en: 'Fully Decentralized',
    es: 'Totalmente Descentralizado',
  },
  'landing.features.decentralizedDesc': {
    en: 'No central authority, community-governed ecosystem',
    es: 'Sin autoridad central, ecosistema gobernado por la comunidad',
  },
  'landing.features.transparent': {
    en: 'Complete Transparency',
    es: 'Transparencia Completa',
  },
  'landing.features.transparentDesc': {
    en: 'All transactions and decisions visible on blockchain',
    es: 'Todas las transacciones y decisiones visibles en la blockchain',
  },
  'landing.features.rewarding': {
    en: 'Fair Rewards',
    es: 'Recompensas Justas',
  },
  'landing.features.rewardingDesc': {
    en: 'Earn based on your actual contributions and participation',
    es: 'Gana basado en tus contribuciones y participación reales',
  },
  'landing.stats.members': {
    en: 'Active Members',
    es: 'Miembros Activos',
  },
  'landing.stats.biets': {
    en: 'Productive Units',
    es: 'Unidades Productivas',
  },
  'landing.stats.value': {
    en: 'Value Generated',
    es: 'Valor Generado',
  },
  'landing.cta.title': {
    en: 'Ready to Make an Impact?',
    es: '¿Listo para Causar Impacto?',
  },
  'landing.cta.description': {
    en: 'Join thousands of contributors building a better future through decentralized production',
    es: 'Únete a miles de contribuidores construyendo un mejor futuro a través de la producción descentralizada',
  },
  'landing.cta.button': {
    en: 'Join Biet Network',
    es: 'Unirse a Biet Network',
  },

  // Biets Page
  'biets.title': {
    en: 'Productive Units (Biets)',
    es: 'Unidades Productivas (Biets)',
  },
  'biets.subtitle': {
    en: 'Discover and join decentralized production units',
    es: 'Descubre y únete a unidades de producción descentralizadas',
  },
  'biets.available': {
    en: 'Available Biets',
    es: 'Biets Disponibles',
  },
  'biets.myParticipations': {
    en: 'My Participations',
    es: 'Mis Participaciones',
  },
  'biets.join': {
    en: 'Join',
    es: 'Unirse',
  },
  'biets.viewDetails': {
    en: 'View Details',
    es: 'Ver Detalles',
  },
  'biets.agricultural': {
    en: 'Agricultural',
    es: 'Agrícola',
  },
  'biets.renewable': {
    en: 'Renewable Energy',
    es: 'Energía Renovable',
  },
  'biets.manufacturing': {
    en: 'Manufacturing',
    es: 'Manufactura',
  },
  'biets.education': {
    en: 'Education',
    es: 'Educación',
  },
  'biets.healthcare': {
    en: 'Healthcare',
    es: 'Salud',
  },
  'biets.technology': {
    en: 'Technology',
    es: 'Tecnología',
  },
  'biets.noBiets': {
    en: 'No biets available at the moment',
    es: 'No hay biets disponibles en este momento',
  },
  'biets.noParticipations': {
    en: 'You haven\'t joined any biets yet',
    es: 'No te has unido a ningún biets aún',
  },
  'biets.connectWallet': {
    en: 'Connect your wallet to view and join biets',
    es: 'Conecta tu billetera para ver y unirte a biets',
  },

  // Governance Page
  'governance.title': {
    en: 'DAO Governance',
    es: 'Gobernanza DAO',
  },
  'governance.subtitle': {
    en: 'Participate in shaping the future of Biet Network',
    es: 'Participa en dar forma al futuro de Biet Network',
  },
  'governance.proposals': {
    en: 'Active Proposals',
    es: 'Propuestas Activas',
  },
  'governance.votingPower': {
    en: 'Your Voting Power',
    es: 'Tu Poder de Voto',
  },
  'governance.vote': {
    en: 'Vote',
    es: 'Votar',
  },
  'governance.for': {
    en: 'For',
    es: 'A Favor',
  },
  'governance.against': {
    en: 'Against',
    es: 'En Contra',
  },
  'governance.abstain': {
    en: 'Abstain',
    es: 'Abstenerse',
  },
  'governance.endsIn': {
    en: 'Ends in',
    es: 'Termina en',
  },
  'governance.days': {
    en: 'days',
    es: 'días',
  },
  'governance.hours': {
    en: 'hours',
    es: 'horas',
  },
  'governance.minutes': {
    en: 'minutes',
    es: 'minutos',
  },
  'governance.createProposal': {
    en: 'Create Proposal',
    es: 'Crear Propuesta',
  },
  'governance.viewProposal': {
    en: 'View Proposal',
    es: 'Ver Propuesta',
  },
  'governance.noProposals': {
    en: 'No active proposals at the moment',
    es: 'No hay propuestas activas en este momento',
  },
  'governance.connectToVote': {
    en: 'Connect your wallet to participate in governance',
    es: 'Conecta tu billetera para participar en la gobernanza',
  },
  'governance.participationRequired': {
    en: 'BGT tokens required for voting power',
    es: 'Tokens BGT requeridos para poder de voto',
  },

  // Token Page
  'token.title': {
    en: 'BGT Token',
    es: 'Token BGT',
  },
  'token.subtitle': {
    en: 'The governance token powering the Biet Network ecosystem',
    es: 'El token de gobernanza que impulsa el ecosistema Biet Network',
  },
  'token.totalSupply': {
    en: 'Total Supply',
    es: 'Suministro Total',
  },
  'token.circulatingSupply': {
    en: 'Circulating Supply',
    es: 'Suministro Circulante',
  },
  'token.holders': {
    en: 'Holders',
    es: 'Titulares',
  },
  'token.price': {
    en: 'Price',
    es: 'Precio',
  },
  'token.marketCap': {
    en: 'Market Cap',
    es: 'Capitalización de Mercado',
  },
  'token.volume24h': {
    en: '24h Volume',
    es: 'Volumen 24h',
  },
  'token.about': {
    en: 'About BGT Token',
    es: 'Acerca del Token BGT',
  },
  'token.aboutDescription': {
    en: 'BGT is the native governance token of Biet Network. It enables holders to participate in decision-making, vote on proposals, and shape the future of the decentralized ecosystem.',
    es: 'BGT es el token de gobernanza nativo de Biet Network. Permite a los titulares participar en la toma de decisiones, votar propuestas y dar forma al futuro del ecosistema descentralizado.',
  },
  'token.utilities': {
    en: 'Token Utilities',
    es: 'Utilidades del Token',
  },
  'token.governance': {
    en: 'Governance Rights',
    es: 'Derechos de Gobernanza',
  },
  'token.governanceDesc': {
    en: 'Vote on network proposals and ecosystem changes',
    es: 'Vota propuestas de red y cambios del ecosistema',
  },
  'token.staking': {
    en: 'Staking Rewards',
    es: 'Recompensas de Staking',
  },
  'token.stakingDesc': {
    en: 'Earn rewards by staking your BGT tokens',
    es: 'Gana recompensas haciendo staking de tus tokens BGT',
  },
  'token.participation': {
    en: 'Enhanced Participation',
    es: 'Participación Mejorada',
  },
  'token.participationDesc': {
    en: 'Access exclusive opportunities in productive units',
    es: 'Accede a oportunidades exclusivas en unidades productivas',
  },
  'token.getStarted': {
    en: 'Get BGT Tokens',
    es: 'Obtener Tokens BGT',
  },
  'token.buyOnExchange': {
    en: 'Buy on Exchange',
    es: 'Comprar en Exchange',
  },
  'token.earnThrough': {
    en: 'Earn through participation in Biets',
    es: 'Gana a través de la participación en Biets',
  },
  'token.stakeAndEarn': {
    en: 'Stake and earn rewards',
    es: 'Haz staking y gana recompensas',
  },
  'token.viewOnExplorer': {
    en: 'View on Explorer',
    es: 'Ver en Explorador',
  },
  'token.viewChart': {
    en: 'View Price Chart',
    es: 'Ver Gráfico de Precios',
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
    return translation[language as Language] || translation.en || key;
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
