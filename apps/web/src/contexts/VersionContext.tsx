'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { VERSION_INFO, getVersionDisplay, getFullVersionString } from '@/lib/version';
import { getChangelog, getLatestVersion, getUnreadVersions } from '@/lib/changelog';
import type { ChangelogEntry } from '@/types/changelog';

interface VersionContextType {
  currentVersion: string;
  versionDisplay: string;
  fullVersionString: string;
  changelog: ChangelogEntry[];
  latestVersion: string;
  hasUpdates: boolean;
  unreadVersions: ChangelogEntry[];
  lastSeenVersion: string | null;
  markVersionAsSeen: (version: string) => void;
  checkForUpdates: () => Promise<boolean>;
}

const VersionContext = createContext<VersionContextType | undefined>(undefined);

interface VersionProviderProps {
  children: ReactNode;
}

export function VersionProvider({ children }: VersionProviderProps) {
  const [lastSeenVersion, setLastSeenVersion] = useState<string | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [unreadVersions, setUnreadVersions] = useState<ChangelogEntry[]>([]);

  const currentVersion = VERSION_INFO.version;
  const versionDisplay = getVersionDisplay();
  const fullVersionString = getFullVersionString();
  const changelog = getChangelog();
  const latestVersion = currentVersion; // Use current version as source of truth

  // Load last seen version from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('biet-last-seen-version');
    if (stored) {
      setLastSeenVersion(stored);
    }
  }, []);

  // Check for updates when lastSeenVersion changes
  useEffect(() => {
    if (lastSeenVersion) {
      const unread = getUnreadVersions(lastSeenVersion);
      setUnreadVersions(unread);
      setHasUpdates(unread.length > 0);
    } else {
      // First time user - mark current version as seen
      markVersionAsSeen(currentVersion);
    }
  }, [lastSeenVersion, currentVersion]);

  const markVersionAsSeen = (version: string) => {
    localStorage.setItem('biet-last-seen-version', version);
    setLastSeenVersion(version);
    setHasUpdates(false);
    setUnreadVersions([]);
  };

  const checkForUpdates = async (): Promise<boolean> => {
    try {
      // In a real app, this would check an API for the latest version
      // For now, we'll just compare with the changelog
      const hasNewerVersion = currentVersion !== latestVersion;
      setHasUpdates(hasNewerVersion);
      return hasNewerVersion;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  };

  return (
    <VersionContext.Provider value={{
      currentVersion,
      versionDisplay,
      fullVersionString,
      changelog,
      latestVersion,
      hasUpdates,
      unreadVersions,
      lastSeenVersion,
      markVersionAsSeen,
      checkForUpdates,
    }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
}
