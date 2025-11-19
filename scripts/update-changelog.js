#!/usr/bin/env node

const { execSync } = require('child_process');

// Get current version from package.json
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

log('📝 Updating changelog commit...', 'cyan');
log(`Version: ${version}`, 'green');

try {
  // Stage all changes
  execSync('git add -A', { stdio: 'inherit' });
  
  // Create semantic commit for changelog update
  execSync(`git commit -m "chore: update changelog for v${version}"`, { stdio: 'inherit' });
  
  log(`✅ Changelog update committed for v${version}`, 'green');
  log(`🚀 Run 'git push' to deploy the changes`, 'cyan');
  
} catch (error) {
  log(`❌ Failed to commit changelog: ${error.message}`, 'red');
  process.exit(1);
}
