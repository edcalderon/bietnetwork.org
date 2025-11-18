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
                  {hasUpdates && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markVersionAsSeen(versionDisplay)}
                      className="text-xs h-7 px-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('version.markAsRead')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <GitBranch className="h-4 w-4" />
                  {t('version.changelog')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {changelog.map((entry: ChangelogEntry, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                          {entry.version}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {entry.description}
                      </p>
                      {entry.features.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Features</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {entry.features.map((feature: string, featureIndex: number) => (
                              <li key={featureIndex} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.improvements.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Improvements</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {entry.improvements.map((improvement: string, improvementIndex: number) => (
                              <li key={improvementIndex} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.fixes.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Fixes</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {entry.fixes.map((fix: string, fixIndex: number) => (
                              <li key={fixIndex} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{fix}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
