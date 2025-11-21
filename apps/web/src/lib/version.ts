import { getLatestVersion } from '@/lib/changelog';

export interface VersionInfo {
  version: string;
  buildNumber: string;
  commitHash: string;
  buildDate: string;
  environment: 'development' | 'staging' | 'production';
}

const getEnvVar = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const VERSION_INFO: VersionInfo = {
  version: getEnvVar('NEXT_PUBLIC_APP_VERSION', getLatestVersion()),
  buildNumber: getEnvVar('NEXT_PUBLIC_BUILD_NUMBER', 'beta'),
  commitHash: getEnvVar('NEXT_PUBLIC_COMMIT_HASH', 'dev'),
  buildDate: getEnvVar('NEXT_PUBLIC_BUILD_DATE', new Date().toISOString()),
  environment: (getEnvVar('NODE_ENV', 'development') as 'development' | 'staging' | 'production'),
};

export function getVersionDisplay(): string {
  const { version, buildNumber, environment } = VERSION_INFO;
  
  if (environment === 'production') {
    return `v${version}`;
  }
  
  return `v${version}-${buildNumber}`;
}

export function getFullVersionString(): string {
  const { version, buildNumber, commitHash, buildDate, environment } = VERSION_INFO;
  // Use the raw ISO buildDate (or a stable slice) directly to avoid locale-dependent
  // formatting differences between server and client that can cause hydration errors.
  const dateDisplay = buildDate.split('T')[0];
  return `Biet Network v${version} (${buildNumber}) - ${commitHash.slice(0, 8)} - ${dateDisplay}`;
}

export function isVersionNewer(currentVersion: string, latestVersion: string): boolean {
  const parseVersion = (version: string) => {
    const cleanVersion = version.replace(/^v/, '');
    return cleanVersion.split('.').map(Number);
  };
  
  const [currentMajor, currentMinor, currentPatch] = parseVersion(currentVersion);
  const [latestMajor, latestMinor, latestPatch] = parseVersion(latestVersion);
  
  if (latestMajor > currentMajor) return true;
  if (latestMajor < currentMajor) return false;
  
  if (latestMinor > currentMinor) return true;
  if (latestMinor < currentMinor) return false;
  
  return latestPatch > currentPatch;
}
