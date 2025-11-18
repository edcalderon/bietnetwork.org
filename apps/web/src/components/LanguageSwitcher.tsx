'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/lib/translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const localeNames: Record<Language, string> = {
    en: 'English',
    es: 'Español',
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Globe className="h-4 w-4" />
          {localeNames[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={`text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
        >
          {localeNames.en}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('es')}
          className={`text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'es' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
        >
          {localeNames.es}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
