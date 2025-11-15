# Version Management System

Biet Network uses a comprehensive automated versioning system that handles semantic version bumping, changelog generation, and deployment integration.

## 🚀 Quick Start

```bash
# Bump patch version (0.2.4 → 0.2.5)
npm run version:patch

# Bump minor version (0.2.4 → 0.3.0) 
npm run version:minor

# Bump major version (0.2.4 → 1.0.0)
npm run version:major

# Update changelog after editing
npm run changelog

# Deploy new version
npm run deploy
```

## 📋 Workflow

### 1. Version Bumping
```bash
npm run version:patch  # or version:minor, version:major
```

This automatically:
- ✅ Updates all `package.json` files across the monorepo
- ✅ Generates a changelog entry with template
- ✅ Sets version info in environment variables
- ✅ Creates a semantic git commit
- ✅ Skips pre-commit hooks to avoid conflicts

### 2. Edit Changelog
After bumping, edit the generated changelog entry in `CHANGELOG.md`:

```markdown
## [0.2.5] - 2025-11-15

### 🐛 Patch Version

### Added
- Add new feature description here

### Improved  
- Add improvement description here

### Fixed
- Add bug fix description here
```

### 3. Commit Changelog
```bash
npm run changelog
```

### 4. Deploy
```bash
git push
```

## 🛠️ Scripts

### `scripts/bump-version.js`
Main version bumping script that:
- Validates bump type (patch/minor/major)
- Checks git state (must be clean)
- Updates all package.json files
- Generates changelog template
- Sets environment variables
- Creates semantic commit

### `scripts/update-changelog.js`
Helper script that:
- Commits changelog changes
- Uses semantic commit message
- Skips pre-commit hooks

### `scripts/set-version.js`
Build script that:
- Sets version info in environment variables
- Includes git commit hash and build date
- Runs automatically during builds

## 📁 File Structure

```
├── scripts/
│   ├── bump-version.js      # Main version bumping script
│   ├── update-changelog.js  # Changelog commit helper
│   └── set-version.js       # Version info injection
├── src/
│   ├── lib/
│   │   ├── version.ts       # Version utilities and types
│   │   └── changelog.ts     # Changelog management
│   ├── contexts/
│   │   └── VersionContext.tsx # Global version state
│   └── components/
│       └── VersionDisplay.tsx # UI version display
├── package.json             # Root version
├── apps/web/package.json    # Web app version
├── packages/*/package.json  # Package versions
└── CHANGELOG.md             # Version history
```

## 🎯 Version Display

The version is displayed in the navbar with:
- Current version number
- Visual indicator for new versions
- Clickable dialog showing:
  - Full version info (build number, commit hash, date)
  - Complete changelog history
  - Mark as read functionality

## 🔄 Environment Variables

The system automatically sets:
- `NEXT_PUBLIC_APP_VERSION` - Current version
- `NEXT_PUBLIC_BUILD_NUMBER` - Build number (from CI or 'local')
- `NEXT_PUBLIC_COMMIT_HASH` - Git commit hash
- `NEXT_PUBLIC_BUILD_DATE` - Build timestamp

## 📝 Changelog Format

Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format:

```markdown
## [0.2.4] - 2025-11-15

### ✨ Features
- New functionality additions

### 🔧 Improvements  
- Enhancements to existing features

### 🐛 Fixes
- Bug fixes and corrections

### 💥 Breaking Changes (major versions only)
- Changes that break compatibility
```

## 🏗️ Build Integration

Version info is automatically injected during:
- Development builds
- Production builds  
- CI/CD deployments

The version display updates automatically after deployment.

## 📊 Version Types

- **Patch** (0.2.4 → 0.2.5): Bug fixes, small improvements
- **Minor** (0.2.4 → 0.3.0): New features, improvements
- **Major** (0.2.4 → 1.0.0): Breaking changes, major rewrites

## 🎨 UI Features

- **Version Badge**: Shows current version in navbar
- **New Version Indicator**: Red badge when updates are available
- **Version Dialog**: Detailed version information and changelog
- **Mark as Read**: Dismiss update notifications
- **Translation Support**: Full i18n support for version UI

## 🔧 Development

### Adding New Version Types
Edit `scripts/bump-version.js` to add new bump types and update the validation logic.

### Customizing Changelog Template
Edit the `generateChangelogEntry()` function in `scripts/bump-version.js`.

### Modifying Version Display
Update `src/components/VersionDisplay.tsx` to change the UI appearance.

## 🚨 Troubleshooting

### "Working directory is not clean"
Commit or stash changes before bumping version:
```bash
git add -A && git commit -m "WIP: save changes"
```

### Pre-commit hook failures
The scripts automatically skip pre-commit hooks using `--no-verify`.

### Build failures
Ensure all dependencies are installed and the workspace is clean:
```bash
yarn install
yarn clean
yarn build
```

## 📚 Best Practices

1. **Always edit changelog** after bumping version
2. **Use semantic commits** for all changes
3. **Test version display** after deployment
4. **Keep git history clean** before bumping
5. **Document breaking changes** clearly

## 🔄 CI/CD Integration

The versioning system integrates with GitHub Actions:
- Automatic version detection
- Build number injection
- Deployment with version tracking
- Version display updates

---

**Current Version**: v0.2.4  
**Last Updated**: 2025-11-15  
**Next**: Edit this file when adding new versioning features!
