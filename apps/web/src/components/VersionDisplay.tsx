'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVersion } from '@/contexts/VersionContext';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Info, 
  Code, 
  GitBranch, 
  CheckCircle, 
  ChevronDown
} from 'lucide-react';
import { ChangelogEntry } from '@/lib/changelog';

export function VersionDisplay() {
  const { versionDisplay, hasUpdates, fullVersionString, markVersionAsSeen, changelog = [] } = useVersion();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-6 px-2 flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-200 dark:border-gray-600"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Info className="h-3 w-3" />
        {versionDisplay}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
        )}
      </Button>

      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('version.title')}
              </h3>
            </div>

            {/* Current Version Info */}
            <Card className="mb-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4" />
                  {t('version.current')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{fullVersionString}</span>
