'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, getNestedValue, getTranslation, Language } from '@/lib/translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
    const translation = getTranslation(language, key);
    if (translation === key) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      // Fallback to English if key not found in current language
      const fallbackTranslation = getTranslation('en', key);
      return fallbackTranslation === key ? key : fallbackTranslation;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export the context for the hook
export { LanguageContext };
