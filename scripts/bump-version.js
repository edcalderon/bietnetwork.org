#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bumpType = process.argv[2];

if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('❌ Use: patch, minor, or major');
  process.exit(1);
}

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

const [major, minor, patch] = currentVersion.split('.').map(Number);

let newVersion;
switch (bumpType) {
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
}

console.log(`🚀 Bumping version from ${currentVersion} to ${newVersion}`);

// Update root package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Update workspace packages
const packages = [
  'apps/web/package.json',
  'packages/sdk/package.json',
  'packages/ui/package.json',
  'packages/contracts/package.json'
];

packages.forEach(packagePath => {
  const fullPath = path.join(__dirname, '..', packagePath);
  if (fs.existsSync(fullPath)) {
    const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    pkg.version = newVersion;
    fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2));
    console.log(`✅ Updated ${packagePath}`);
  }
});

// Update changelog
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const today = new Date().toISOString().split('T')[0];
const newEntry = `## [${newVersion}] - ${today}

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

`;

let changelog = fs.readFileSync(changelogPath, 'utf8');
const insertPosition = changelog.indexOf('## [0.');
changelog = changelog.slice(0, insertPosition) + newEntry + changelog.slice(insertPosition);
fs.writeFileSync(changelogPath, changelog);

console.log(`✅ Updated CHANGELOG.md`);

// Set version info
const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const envContent = `NEXT_PUBLIC_APP_VERSION=${newVersion}
NEXT_PUBLIC_BUILD_NUMBER=local
NEXT_PUBLIC_COMMIT_HASH=${commitHash}
NEXT_PUBLIC_BUILD_DATE=${new Date().toISOString()}
`;

fs.writeFileSync(path.join(__dirname, '../apps/web/.env.local'), envContent);

// Git commit
execSync('git add -A', { stdio: 'inherit' });
execSync(`git commit -m "chore: bump version to ${newVersion}" --no-verify`, { stdio: 'inherit' });

console.log(`✅ Version bumped to ${newVersion}`);
console.log(`📝 Edit CHANGELOG.md with actual changes`);
console.log(`🚀 Run 'npm run changelog' and 'git push'`);
