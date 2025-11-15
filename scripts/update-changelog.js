#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`📝 Committing changelog for v${version}`);

try {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "chore: update changelog for v${version}" --no-verify`, { stdio: 'inherit' });
  
  console.log(`✅ Changelog committed for v${version}`);
  console.log(`🚀 Run 'git push' to deploy`);
  
} catch (error) {
  console.error(`❌ Failed to commit: ${error.message}`);
  process.exit(1);
}
