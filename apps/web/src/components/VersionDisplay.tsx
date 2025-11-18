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
  Bug
} from 'lucide-react';
import { DraggableDrawer } from '@/components/ui/draggable-drawer';
import { ChangelogEntry } from '@/lib/changelog';

export function VersionDisplay() {
  const { versionDisplay, hasUpdates, fullVersionString, markVersionAsSeen, changelog = [], unreadVersions = [] } = useVersion();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
        onClick={() => setShowDetails(true)}
      >
        <Info className="h-3 w-3 mr-1" />
        {versionDisplay}
        {hasUpdates && (
          <Badge variant="destructive" className="ml-1 h-4 px-1 text-xs">
            New
          </Badge>
        )}
      </Button>

      <DraggableDrawer open={showDetails} setOpen={setShowDetails}>
        <div className="mx-auto max-w-2xl space-y-6 text-neutral-400">
          <div className="flex items-center gap-2 mb-6">
            <Info className="h-5 w-5 text-neutral-400" />
            <h2 className="text-xl font-bold text-neutral-200">
              {t('version.title')}
            </h2>
          </div>

          {/* Current Version Info */}
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neutral-200">
                <Code className="h-4 w-4" />
                {t('version.current')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-neutral-300">{fullVersionString}</span>
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
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neutral-200">
                <GitBranch className="h-4 w-4" />
                {t('version.changelog')}
              </CardTitle>
              <CardDescription className="text-neutral-400">
                {t('version.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangelogContent changelog={changelog} hasUpdates={hasUpdates} unreadVersions={unreadVersions} />
            </CardContent>
          </Card>
        </div>
      </DraggableDrawer>
    </div>
  );
}

interface UnreadVersion {
  version: string;
}

function ChangelogContent({ changelog, hasUpdates, unreadVersions }: { 
  changelog: ChangelogEntry[], 
  hasUpdates: boolean, 
  unreadVersions: UnreadVersion[] 
}) {
  const { t } = useLanguage();

  if (!changelog || changelog.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No changelog available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {changelog.map((entry: ChangelogEntry, index: number) => {
        const isUnread = unreadVersions.some((unread: UnreadVersion) => unread.version === entry.version);
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
                <h4 className="font-semibold text-lg text-neutral-200">v{entry.version}</h4>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  {entry.date}
                  <Badge variant={entry.type === 'major' ? 'destructive' : entry.type === 'minor' ? 'default' : 'secondary'}>
                    {entry.type}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-300">{entry.description}</p>
              
              {/* Features */}
              {entry.features && entry.features.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-green-600">
                    <Zap className="h-4 w-4" />
                    Features
                  </h5>
                  <ul className="ml-6 list-disc text-neutral-300">
                    {entry.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {entry.improvements && entry.improvements.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-blue-600">
                    <Wrench className="h-4 w-4" />
                    Improvements
                  </h5>
                  <ul className="ml-6 list-disc text-neutral-300">
                    {entry.improvements.map((improvement: string, improvementIndex: number) => (
                      <li key={improvementIndex}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fixes */}
              {entry.fixes && entry.fixes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-red-600">
                    <Bug className="h-4 w-4" />
                    Fixes
                  </h5>
                  <ul className="ml-6 list-disc text-neutral-300">
                    {entry.fixes.map((fix: string, fixIndex: number) => (
                      <li key={fixIndex}>{fix}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Breaking Changes */}
              {entry.breaking && entry.breaking.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    Breaking Changes
                  </h5>
                  <ul className="ml-6 list-disc text-neutral-300">
                    {entry.breaking.map((breaking: string, breakingIndex: number) => (
                      <li key={breakingIndex}>{breaking}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Show if no changes */}
              {(!entry.features?.length && !entry.improvements?.length && !entry.fixes?.length && !entry.breaking?.length) && (
                <p className="text-sm text-neutral-500">No changes recorded for this version</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VersionDisplay;
