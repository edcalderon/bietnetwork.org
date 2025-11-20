export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  description: string;
  features: string[];
  improvements: string[];
  fixes: string[];
}

export const CHANGELOG: ChangelogEntry[];

export function getChangelog(): ChangelogEntry[];

export function getLatestVersion(): string;

export function getChangelogByVersion(version: string): ChangelogEntry | undefined;

export function getUnreadVersions(lastSeenVersion: string): ChangelogEntry[];
