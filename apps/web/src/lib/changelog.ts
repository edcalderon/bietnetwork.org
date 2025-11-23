import type { ChangelogEntry } from '@/types/changelog';

export const CHANGELOG = [
  {
    version: '0.3.20',
    date: '2025-11-23',
    type: 'patch',
    description: 'Script version integration with service worker auto-update',
    features: [
      'Package.json version as single source of truth',
      'Automatic service worker updates on version changes',
      'Simplified version checking without GitHub API dependency',
    ],
    improvements: [
      'Integrated script version with service worker versioning',
      'Enhanced React hook to handle version update messages',
      'Added periodic version checks every 15-30 minutes',
    ],
    fixes: [
      'Fixed version display using hardcoded changelog instead of current version',
    ],
  },
  {
    version: '0.3.17',
    date: '2025-11-21',
    type: 'patch',
    description: 'Version 0.3.17 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.17',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.12',
    date: '2025-11-20',
    type: 'patch',
    description: 'Red Biet hero animation, PWA install, and mobile UX improvements',
    features: [
      'Animated particle hero title for Red Biet / BGT',
      'Install Red Biet App PWA button with custom beforeinstallprompt handling',
      'Full PWA support with manifest, icons, and service worker',
    ],
    improvements: [
      'Optimized particle animation for better performance and no stale trails',
      'Improved hero title contrast and alignment across light and dark themes',
      'Disabled mobile zoom for a more native-like app experience',
    ],
    fixes: [
      'Resolved hydration mismatch in version display dates',
    ],
  },
  {
    version: '0.3.10',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.10 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.10',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.9',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.9 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.9',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.8',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.8 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.8',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.7',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.7 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.7',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.6',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.6 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.6',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.5',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.5 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.5',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.4',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.4 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.4',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.3',
    date: '2025-11-20',
    type: 'patch',
    description: 'Version 0.3.3 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.3',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.2',
    date: '2025-11-20',
    type: 'minor',
    description: 'Version 0.3.2 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.1',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.3.1',
    date: '2025-11-20',
    type: 'minor',
    description: 'Version 0.3.1 release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version 0.3.0',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },
  {
    version: '0.2.13',
    date: '2025-11-18',
    type: 'patch',
    description: 'Version management system and GitHub changelog integration',
    features: [
      'Comprehensive automated version management system',
      'GitHub changelog links in version display',
      'Automated package synchronization across workspace',
    ],
    improvements: [
      'Removed Mark as Read button, replaced with GitHub releases link',
      'Enhanced version display with external changelog access',
      'Updated all workspace packages to consistent versioning',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
      'Resolved TypeScript compilation errors in VersionDisplay',
    ],
  },
  {
    version: '0.2.0',
    date: '2025-11-15',
    type: 'minor',
    description: 'Major translation system reorganization with full internationalization support',
    features: [
      'Complete translation system with 200+ translation keys',
      'English and Spanish language support',
      'Language switcher component in navigation',
      'Persistent language preferences in localStorage',
      'Browser auto-detection of language',
      'Proper file structure with hooks, locales, and utilities',
      'Type-safe translation system with TypeScript support',
    ],
    improvements: [
      'Moved useLanguage hook to proper /src/hooks/ directory',
      'Separated translations into JSON files for better maintainability',
      'Added nested translation structure for better organization',
      'Fixed all TypeScript lint errors',
      'Improved developer experience with better type safety',
    ],
    fixes: [
      'Fixed type indexing issues in translation utilities',
      'Resolved TypeScript errors in LanguageContext',
      'Fixed language switching functionality',
    ],
  },
  {
    version: '0.1.0',
    date: '2025-11-15',
    type: 'major',
    description: 'Initial release of Biet Network platform',
    features: [
      'Next.js 14 application with TypeScript',
      'Web3 wallet integration with Wagmi v2',
      'Base blockchain support',
      'Dashboard with user identity management',
      'BGT token integration',
      'Governance interface',
      'Biets (productive units) management',
      'Admin panel for network management',
      'Responsive design with Tailwind CSS',
      'Monorepo structure with Turbo',
    ],
    improvements: [
      'Set up development environment',
      'Configured GitHub Actions for CI/CD',
      'Implemented smart contract integration',
      'Added comprehensive error handling',
    ],
    fixes: [
      'Initial deployment setup',
      'Dependency management with Yarn workspaces',
    ],
  },
] satisfies ChangelogEntry[];

export function getChangelog(): ChangelogEntry[] {
  return CHANGELOG.slice().sort((a, b) => {
    const versionA = a.version.replace(/^v/, '').split('.').map(Number);
    const versionB = b.version.replace(/^v/, '').split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (versionA[i] !== versionB[i]) {
        return versionB[i] - versionA[i];
      }
    }
    return 0;
  });
}

export function getLatestVersion(): string {
  // Use environment variable as source of truth, fallback to changelog
  return process.env.NEXT_PUBLIC_APP_VERSION || getChangelog()[0]?.version || '0.1.0';
}

export function getChangelogByVersion(version: string): ChangelogEntry | undefined {
  return getChangelog().find(entry => entry.version === version);
}

export function getUnreadVersions(lastSeenVersion: string): ChangelogEntry[] {
  const changelog = getChangelog();
  const currentIndex = changelog.findIndex(entry => entry.version === lastSeenVersion);

  if (currentIndex === -1) {
    return changelog; // All versions are unread
  }

  return changelog.slice(0, currentIndex);
}
