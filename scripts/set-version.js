#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Get git info
const { execSync } = require('child_process');
let commitHash = 'unknown';
let buildDate = new Date().toISOString();

try {
  commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Could not get git commit hash');
}

// Create .env.local file with version info
const envContent = `# Auto-generated version info
NEXT_PUBLIC_APP_VERSION=${version}
NEXT_PUBLIC_BUILD_NUMBER=${process.env.BUILD_NUMBER || 'local'}
NEXT_PUBLIC_COMMIT_HASH=${commitHash}
NEXT_PUBLIC_BUILD_DATE=${buildDate}
`;

const envPath = path.join(__dirname, '../apps/web/.env.local');
fs.writeFileSync(envPath, envContent);

console.log(`✅ Version set to ${version} (${commitHash.slice(0, 8)})`);
console.log(`📝 Environment variables written to ${envPath}`);
