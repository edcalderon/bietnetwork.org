'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVersion } from '@/contexts/VersionContext';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Info, 
  Code, 
  Calendar, 
  GitBranch, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Wrench,
  Bug,
  X
} from 'lucide-react';

export function VersionDisplay() {
  const { versionDisplay, fullVersionString, hasUpdates, markVersionAsSeen } = useVersion();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Info className="h-3 w-3 mr-1" />
        {versionDisplay}
        {hasUpdates && (
          <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">
            New
          </Badge>
        )}
      </Button>

      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetails(false)}>
          <div className="bg-background rounded-lg shadow-lg max-w-2xl max-h-[80vh] w-full mx-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t('version.title')}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Current Version Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {t('version.current')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{fullVersionString}</span>
                      {hasUpdates && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markVersionAsSeen(versionDisplay)}
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('version.markAsRead')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Changelog */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      {t('version.changelog')}
                    </CardTitle>
                    <CardDescription>
                      {t('version.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChangelogContent />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangelogContent() {
  const { changelog, hasUpdates, unreadVersions } = useVersion();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {changelog.map((entry, index) => {
        const isUnread = unreadVersions.some(unread => unread.version === entry.version);
        const isNew = index === 0 && hasUpdates;
        
        return (
          <div key={entry.version} className={`relative ${isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800' : ''}`}>
            {isNew && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                {t('version.new')}
              </Badge>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">v{entry.version}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {entry.date}
                  <Badge variant={entry.type === 'major' ? 'destructive' : entry.type === 'minor' ? 'default' : 'secondary'}>
                    {entry.type}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{entry.description}</p>
              
              {entry.features.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Zap className="h-4 w-4" />
                    {t('version.features')}
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                    {entry.features.map((feature, idx) => (
                      <li key={idx} className="text-muted-foreground">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.improvements.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Wrench className="h-4 w-4" />
                    {t('version.improvements')}
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                    {entry.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-muted-foreground">{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.fixes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Bug className="h-4 w-4" />
                    {t('version.fixes')}
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                    {entry.fixes.map((fix, idx) => (
                      <li key={idx} className="text-muted-foreground">{fix}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.breaking && entry.breaking.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    {t('version.breaking')}
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-6">
                    {entry.breaking.map((breaking, idx) => (
                      <li key={idx} className="text-muted-foreground">{breaking}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
