'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        {hasUpdates && (
          <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">
            New
          </Badge>
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

            {/* Changelog */}
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
                    <div key={index} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                          {entry.version}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Features */}
                      {entry.features && entry.features.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                            ✨ Features
                          </h5>
                          <ul className="ml-4 list-disc text-sm text-gray-600 dark:text-gray-400">
                            {entry.features.map((feature: string, featureIndex: number) => (
                              <li key={featureIndex}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {entry.improvements && entry.improvements.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                            🚀 Improvements
                          </h5>
                          <ul className="ml-4 list-disc text-sm text-gray-600 dark:text-gray-400">
                            {entry.improvements.map((improvement: string, improvementIndex: number) => (
                              <li key={improvementIndex}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fixes */}
                      {entry.fixes && entry.fixes.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                            🐛 Fixes
                          </h5>
                          <ul className="ml-4 list-disc text-sm text-gray-600 dark:text-gray-400">
                            {entry.fixes.map((fix: string, fixIndex: number) => (
                              <li key={fixIndex}>{fix}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Breaking Changes */}
                      {entry.breaking && entry.breaking.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                            💥 Breaking Changes
                          </h5>
                          <ul className="ml-4 list-disc text-sm text-gray-600 dark:text-gray-400">
                            {entry.breaking.map((breaking: string, breakingIndex: number) => (
                              <li key={breakingIndex}>{breaking}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Show if no changes */}
                      {(!entry.features?.length && !entry.improvements?.length && !entry.fixes?.length && !entry.breaking?.length) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No changes recorded for this version</p>
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

export default VersionDisplay;
