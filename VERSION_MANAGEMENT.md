# Version Management System

This repository includes an automated version management system that keeps all packages synchronized and handles releases properly.

## 🚀 Quick Start

### Version Synchronization
```bash
# Update all packages with a patch version (0.2.12 → 0.2.13)
yarn version:patch

# Update with a minor version (0.2.12 → 0.3.0)
yarn version:minor

# Update with a major version (0.2.12 → 1.0.0)
yarn version:major

# Just sync versions without bumping
yarn version:sync
```

### Full Release Process
```bash
# Complete patch release with validation and deployment
yarn release:patch

# Complete minor release with validation and deployment
yarn release:minor

# Complete major release with validation and deployment
yarn release:major
```

## 📦 Package Structure

The system automatically synchronizes versions across all packages:

- `package.json` (root)
- `apps/web/package.json`
- `apps/docs/package.json`
- `packages/contracts/package.json`
- `packages/sdk/package.json`
- `packages/ui/package.json`

## 🛠️ Available Scripts

### Version Management Scripts

| Script | Description |
|--------|-------------|
| `yarn version:sync` | Sync all packages to current version |
| `yarn version:patch` | Bump patch version and sync all packages |
| `yarn version:minor` | Bump minor version and sync all packages |
| `yarn version:major` | Bump major version and sync all packages |

### Release Scripts

| Script | Description |
|--------|-------------|
| `yarn release:patch` | Complete patch release with validation |
| `yarn release:minor` | Complete minor release with validation |
| `yarn release:major` | Complete major release with validation |

### Advanced Usage

```bash
# Update versions without committing
node scripts/sync-versions.js patch --skip-commit

# Update versions without updating changelog
node scripts/sync-versions.js minor --skip-changelog

# Release without running tests
node scripts/release.js patch --skip-tests

# Release without deploying
node scripts/release.js minor --skip-deploy
```

## 🔄 What Happens During Version Sync

1. **Version Bumping**: Calculates new version based on type (major/minor/patch)
2. **Package Updates**: Updates all package.json files with new version
3. **Environment Variables**: Updates .env.local with version info
4. **Changelog**: Adds new entry to changelog with features/improvements/fixes
5. **Git Operations**: Commits changes and creates git tag (unless skipped)

## 🚀 What Happens During Release

1. **Prerequisites Validation**: 
   - Must be on main/master branch
   - Working directory must be clean
   - Must be up to date with remote

2. **Build & Test Validation**:
   - Installs dependencies
   - Runs TypeScript compilation
   - Builds all applications

3. **Version Management**: Same as sync process above

4. **Release Operations**:
   - Commits all changes
   - Creates git tag
   - Pushes to remote with tags
   - Triggers GitHub Actions deployment

5. **Release Notes**: Generates GitHub release notes

## 📋 Changelog Management

The system automatically updates the changelog in `apps/web/src/lib/changelog.ts`:

```typescript
{
  version: '0.2.13',
  date: '2025-11-18',
  type: 'patch',
  description: 'Version 0.2.13 release',
  features: [
    'Version synchronization across all packages',
    'Automated version management system',
  ],
  improvements: [
    'Updated all workspace packages to version 0.2.13',
    'Enhanced version display with GitHub changelog links',
  ],
  fixes: [
    'Fixed version inconsistencies across packages',
  ],
}
```

## 🏷️ Git Tags

All releases are automatically tagged with semantic versioning:

- `v0.2.12` - Patch releases
- `v0.3.0` - Minor releases  
- `v1.0.0` - Major releases

## 🌐 Deployment

Releases automatically trigger deployment through GitHub Actions:

1. **Web Application**: Deployed to https://bietnetwork.org
2. **Documentation**: Deployed to https://bietnetwork.org/documentation
3. **GitHub Releases**: Created with release notes

## 📊 Version Display

The version is displayed in the application footer with:
- Current version number
- Link to GitHub releases/changelog
- Build information (commit hash, build date)

## 🔧 Manual Version Management

If you need to manage versions manually:

```bash
# Check current version
node -e "console.log(require('./package.json').version)"

# Update specific package
npm version patch --workspace=@biet-network/web

# Create tag manually
git tag v0.2.13
git push origin v0.2.13
```

## 🚨 Important Notes

1. **Always use the scripts** - Manual version updates can cause inconsistencies
2. **Main branch only** - Releases must be made from main/master branch
3. **Clean working directory** - Commit or stash changes before releasing
4. **Up to date** - Pull latest changes before releasing
5. **Semantic versioning** - Follow semver rules for version bumping

## 🐛 Troubleshooting

### Version sync fails
```bash
# Check git status
git status

# Stash or commit changes
git stash
# or
git add . && git commit -m "WIP"
```

### Release fails tests
```bash
# Run tests manually
yarn test
yarn build

# Fix issues and retry
yarn release:patch
```

### Need to rollback
```bash
# Reset to previous tag
git checkout v0.2.12
git reset --hard v0.2.12
git push --force-with-lease
```

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [GitHub Actions](https://github.com/edcalderon/bietnetwork.org/actions)
- [Release History](https://github.com/edcalderon/bietnetwork.org/releases)
