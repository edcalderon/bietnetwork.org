#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PACKAGES = [
  'package.json', // Root package
  'apps/web/package.json',
  'apps/docs/package.json',
  'packages/contracts/package.json',
  'packages/sdk/package.json',
  'packages/ui/package.json'
];

function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function updatePackageVersion(packagePath, newVersion) {
  const fullPath = path.join(__dirname, '..', packagePath);
  const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  
  fs.writeFileSync(fullPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  return oldVersion;
}

function updateAllVersions(newVersion) {
  console.log(`🔄 Updating all packages to version ${newVersion}...`);
  
  const updates = [];
  for (const packagePath of PACKAGES) {
    const fullPath = path.join(__dirname, '..', packagePath);
    if (fs.existsSync(fullPath)) {
      const oldVersion = updatePackageVersion(packagePath, newVersion);
      updates.push({ package: packagePath, oldVersion, newVersion });
      console.log(`  ✅ ${packagePath}: ${oldVersion} → ${newVersion}`);
    } else {
      console.log(`  ⚠️  ${packagePath}: Not found, skipping`);
    }
  }
  
  return updates;
}

function getGitInfo() {
  try {
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const isClean = execSync('git status --porcelain', { encoding: 'utf8' }).trim() === '';
    
    return { commitHash, branch, isClean };
  } catch (error) {
    console.warn('⚠️  Could not get git info');
    return { commitHash: 'unknown', branch: 'unknown', isClean: false };
  }
}

function createVersionEnv(version) {
  const { commitHash } = getGitInfo();
  const buildDate = new Date().toISOString();
  
  const envContent = `# Auto-generated version info
NEXT_PUBLIC_APP_VERSION=${version}
NEXT_PUBLIC_BUILD_NUMBER=${process.env.BUILD_NUMBER || 'local'}
NEXT_PUBLIC_COMMIT_HASH=${commitHash}
NEXT_PUBLIC_BUILD_DATE=${buildDate}
`;

  const envPath = path.join(__dirname, '../apps/web/.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`📝 Environment variables written to ${envPath}`);
}

function updateChangelog(version, type = 'patch') {
  const changelogPath = path.join(__dirname, '../apps/web/src/lib/changelog.ts');
  
  if (!fs.existsSync(changelogPath)) {
    console.log('⚠️  Changelog file not found, skipping update');
    return;
  }
  
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  
  // Add new entry at the beginning of CHANGELOG array
  const newEntry = `  {
    version: '${version}',
    date: '${today}',
    type: '${type}',
    description: 'Version ${version} release',
    features: [
      'Version synchronization across all packages',
      'Automated version management system',
    ],
    improvements: [
      'Updated all workspace packages to version ${version}',
      'Enhanced version display with GitHub changelog links',
    ],
    fixes: [
      'Fixed version inconsistencies across packages',
    ],
  },`;

  // Find the position to insert the new entry (after the opening bracket of CHANGELOG array)
  const insertPos = changelogContent.indexOf('[') + 1;
  const updatedContent = 
    changelogContent.slice(0, insertPos) + '\n' + newEntry + 
    changelogContent.slice(insertPos);
  
  fs.writeFileSync(changelogPath, updatedContent);
  console.log(`📋 Changelog updated with version ${version}`);
}

function bumpVersionType(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

function commitAndTag(version, updates) {
  try {
    // Stage all package.json files
    const packageFiles = PACKAGES.filter(p => fs.existsSync(path.join(__dirname, '..', p)));
    execSync(`git add ${packageFiles.join(' ')}`, { stdio: 'inherit' });
    
    // Also stage changelog and version display if they were updated
    const additionalFiles = [
      'apps/web/src/lib/changelog.ts',
      'apps/web/src/components/VersionDisplay.tsx',
      'scripts/sync-versions.js'
    ].filter(f => fs.existsSync(path.join(__dirname, '..', f)));
    
    if (additionalFiles.length > 0) {
      execSync(`git add ${additionalFiles.join(' ')}`, { stdio: 'inherit' });
    }
    
    // Commit changes
    const commitMessage = `chore: bump version to ${version}

${updates.map(u => `- ${u.package}: ${u.oldVersion} → ${u.newVersion}`).join('\n')}

- Automated version synchronization
- Updated all workspace packages
- Enhanced version management system`;
    
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Create tag
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    
    console.log(`🏷️  Created tag v${version}`);
    console.log(`📝 Committed version bump to ${version}`);
    
  } catch (error) {
    console.error('❌ Failed to commit and tag:', error.message);
    console.log('💡 You may need to commit manually and run: git tag v' + version);
  }
}

function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'patch'; // Default to patch
  const skipCommit = args.includes('--skip-commit');
  const skipChangelog = args.includes('--skip-changelog');
  
  // Handle --help
  if (process.argv.includes('--help')) {
    console.log(`
Version Synchronization Tool

Usage: node scripts/sync-versions.js [type] [options]

Types:
  major   - Bump major version (X.0.0)
  minor   - Bump minor version (X.Y.0)  
  patch   - Bump patch version (X.Y.Z) [default]

Options:
  --skip-commit    - Update files without committing
  --skip-changelog - Don't update the changelog
  --help          - Show this help message

Examples:
  node scripts/sync-versions.js patch
  node scripts/sync-versions.js minor --skip-commit
  node scripts/sync-versions.js major --skip-changelog
`);
    process.exit(0);
  }
  
  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('❌ Invalid version type. Use: major, minor, or patch');
    process.exit(1);
  }
  
  const gitInfo = getGitInfo();
  
  if (!gitInfo.isClean && !skipCommit) {
    console.error('❌ Working directory is not clean. Commit or stash changes first.');
    console.log('💡 Use --skip-commit to only update files without committing.');
    process.exit(1);
  }
  
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersionType(currentVersion, type);
  
  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`🚀 New version: ${newVersion} (${type})`);
  console.log(`🌿 Git branch: ${gitInfo.branch}`);
  console.log(`🔗 Commit: ${gitInfo.commitHash.slice(0, 8)}`);
  console.log('');
  
  // Update all package versions
  const updates = updateAllVersions(newVersion);
  
  // Update environment variables
  createVersionEnv(newVersion);
  
  // Update changelog
  if (!skipChangelog) {
    updateChangelog(newVersion, type);
  }
  
  // Commit and tag
  if (!skipCommit) {
    commitAndTag(newVersion, updates);
    console.log('');
    console.log('🎉 Version bump completed successfully!');
    console.log(`📋 To push changes: git push origin ${gitInfo.branch} --tags`);
  } else {
    console.log('');
    console.log('✅ Files updated (skipping commit and tag)');
    console.log(`💡 To commit manually: git add . && git commit -m "chore: bump version to ${newVersion}"`);
    console.log(`💡 To create tag: git tag v${newVersion}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  updateAllVersions,
  bumpVersionType,
  createVersionEnv,
  updateChangelog
};
