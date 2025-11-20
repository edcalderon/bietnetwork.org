export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  description: string;
  features: string[];
  improvements: string[];
  fixes: string[];
}
