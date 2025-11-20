#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getCurrentVersion, updateAllVersions, bumpVersionType, createVersionEnv, updateChangelog } = require('./sync-versions.js');

function validateReleasePrerequisites() {
  // Check if we're on main branch
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (branch !== 'main' && branch !== 'master' && branch !== 'BIE-1') {
      console.error(`❌ You must be on main/master/BIE-1 branch to release. Current branch: ${branch}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Could not determine current branch');
    return false;
  }
  
  // Check if working directory is clean
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status !== '') {
      console.error('❌ Working directory is not clean. Commit or stash changes first.');
      return false;
    }
  } catch (error) {
    console.error('❌ Could not check git status');
    return false;
  }
  
  // Check if we're up to date with remote
  try {
    execSync('git fetch origin', { stdio: 'inherit' });
    const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    // Determine which remote branch to compare against
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const remoteRef = currentBranch === 'BIE-1' ? 'origin/BIE-1' : 'origin/main';

    const remoteCommit = execSync(`git rev-parse ${remoteRef}`, { encoding: 'utf8' }).trim();
    
    if (localCommit !== remoteCommit) {
      console.error(`❌ Local branch is not up to date with ${remoteRef}. Pull first.`);
      return false;
    }
  } catch (error) {
    console.error('❌ Could not sync with remote');
    return false;
  }
  
  return true;
}

function runBuildAndTests() {
  console.log('🔨 Running build and tests...');
  
  try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('yarn install', { stdio: 'inherit' });
    
    // Run TypeScript compilation
    console.log('🔍 Checking TypeScript compilation...');
    execSync('yarn tsc --noEmit', { stdio: 'inherit', cwd: path.join(__dirname, '../apps/web') });
    
    // Run build
    console.log('🏗️  Building applications...');
    execSync('yarn dlx turbo@latest run build', { stdio: 'inherit' });
    
    console.log('✅ All checks passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Build or tests failed:', error.message);
    return false;
  }
}

function createGitHubRelease(version, updates) {
  console.log(`📝 Creating GitHub release for v${version}...`);
  
  try {
    // Get changelog for this version
    const changelogPath = path.join(__dirname, '../apps/web/src/lib/changelog.ts');
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    // Extract version info from changelog
    const versionMatch = changelogContent.match(new RegExp(`version: '${version}'[^}]+}`, 's'));
    let releaseNotes = `Release v${version}\n\n`;
    
    if (versionMatch) {
      const versionEntry = versionMatch[0];
      const features = versionEntry.match(/features:\s*\[([^\]]+)\]/)?.[1] || '';
      const improvements = versionEntry.match(/improvements:\s*\[([^\]]+)\]/)?.[1] || '';
      const fixes = versionEntry.match(/fixes:\s*\[([^\]]+)\]/)?.[1] || '';
      
      if (features) {
        releaseNotes += '## 🚀 Features\n' + features.split(',').map(f => `- ${f.trim().replace(/['"]/g, '')}`).join('\n') + '\n\n';
      }
      if (improvements) {
        releaseNotes += '## 💎 Improvements\n' + improvements.split(',').map(i => `- ${i.trim().replace(/['"]/g, '')}`).join('\n') + '\n\n';
      }
      if (fixes) {
        releaseNotes += '## 🐛 Fixes\n' + fixes.split(',').map(f => `- ${f.trim().replace(/['"]/g, '')}`).join('\n') + '\n\n';
      }
    }
    
    releaseNotes += `## 📦 Package Updates\n${updates.map(u => `- ${u.package}: ${u.oldVersion} → ${u.newVersion}`).join('\n')}\n\n`;
    releaseNotes += `---\n\nAutomated release created by version management system.`;
    
    // Write release notes to file
    const releaseNotesPath = path.join(__dirname, '../RELEASE_NOTES.md');
    fs.writeFileSync(releaseNotesPath, releaseNotes);
    
    console.log(`📄 Release notes written to ${releaseNotesPath}`);
    console.log(`💡 To create GitHub release: gh release create v${version} --title "Release v${version}" --notes-file "${releaseNotesPath}"`);
    
    return releaseNotesPath;
    
  } catch (error) {
    console.error('⚠️  Could not create release notes:', error.message);
    return null;
  }
}

function deployRelease(version) {
  console.log('🚀 Deploying release...');
  
  try {
    // Push to remote
    execSync('git push origin main --tags', { stdio: 'inherit' });
    
    console.log('✅ Code pushed to remote with tags');
    
    // Trigger GitHub Actions deployment
    console.log('🔄 Triggering deployment via GitHub Actions...');
    console.log(`📊 Deployment status: https://github.com/edcalderon/bietnetwork.org/actions`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'patch';
  const skipTests = args.includes('--skip-tests');
  const skipDeploy = args.includes('--skip-deploy');
  
  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('❌ Invalid version type. Use: major, minor, or patch');
    process.exit(1);
  }
  
  console.log('🎯 Starting release process...');
  console.log(`📦 Release type: ${type}`);
  console.log('');
  
  // Validate prerequisites
  if (!validateReleasePrerequisites()) {
    process.exit(1);
  }
  
  // Run build and tests
  if (!skipTests) {
    if (!runBuildAndTests()) {
      console.error('❌ Release aborted due to failed tests or build');
      process.exit(1);
    }
  }
  
  // Get current and new version
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersionType(currentVersion, type);
  
  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`🚀 New version: ${newVersion}`);
  console.log('');
  
  // Update all versions
  const updates = updateAllVersions(newVersion);
  
  // Update environment
  createVersionEnv(newVersion);
  
  // Update changelog
  updateChangelog(newVersion, type);
  
  // Commit and tag
  try {
    const packageFiles = [
      'package.json',
      'apps/web/package.json',
      'apps/docs/package.json',
      'packages/contracts/package.json',
      'packages/sdk/package.json',
      'packages/ui/package.json',
      'apps/web/src/lib/changelog.ts',
      'scripts/sync-versions.js',
      'scripts/release.js'
    ];
    
    execSync(`git add ${packageFiles.join(' ')}`, { stdio: 'inherit' });
    
    const commitMessage = `chore: release v${newVersion}

${updates.map(u => `- ${u.package}: ${u.oldVersion} → ${u.newVersion}`).join('\n')}

- Automated version synchronization
- Updated all workspace packages
- Enhanced version management system`;
    
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
    
    console.log(`🏷️  Created tag v${newVersion}`);
    
  } catch (error) {
    console.error('❌ Failed to commit and tag:', error.message);
    process.exit(1);
  }
  
  // Create GitHub release notes
  const releaseNotesPath = createGitHubRelease(newVersion, updates);
  
  // Deploy
  if (!skipDeploy) {
    if (!deployRelease(newVersion)) {
      console.error('❌ Deployment failed');
      process.exit(1);
    }
  }
  
  console.log('');
  console.log('🎉 Release completed successfully!');
  console.log(`📦 Version: ${newVersion}`);
  console.log(`🏷️  Tag: v${newVersion}`);
  console.log(`📊 Repository: https://github.com/edcalderon/bietnetwork.org`);
  
  if (releaseNotesPath) {
    console.log(`📝 Release notes: ${releaseNotesPath}`);
    console.log(`💡 To create GitHub release: gh release create v${newVersion} --title "Release v${newVersion}" --notes-file "${releaseNotesPath}"`);
  }
  
  console.log('');
  console.log('🌐 Site will be available at: https://bietnetwork.org');
  console.log('📚 Documentation: https://bietnetwork.org/documentation');
}

// Handle --help
if (process.argv.includes('--help')) {
  console.log(`
Release Management Tool

Usage: node scripts/release.js [type] [options]

Types:
  major   - Major release (X.0.0)
  minor   - Minor release (X.Y.0)  
  patch   - Patch release (X.Y.Z) [default]

Options:
  --skip-tests    - Skip build and test validation
  --skip-deploy   - Skip deployment to remote
  --help         - Show this help message

Examples:
  node scripts/release.js patch      # Patch release with full validation
  node scripts/release.js minor      # Minor release with full validation
  node scripts/release.js major      # Major release with full validation
  node scripts/release.js patch --skip-tests  # Skip tests
`);
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateReleasePrerequisites,
  runBuildAndTests,
  createGitHubRelease,
  deployRelease
};
