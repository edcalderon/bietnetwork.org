# Changelog

All notable changes to Biet Network will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.13] - 2025-11-18

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.10] - 2025-11-18

### 🐛 Patch Version

### Added
- Docusaurus internationalization (i18n) support for Spanish and English
- Next.js integration to serve documentation under /documentation path
- Automatic documentation build and copy script for deployment

### Improved
- Translation file formatting with proper JSON structure
- Environment-based configuration for development vs production
- Clean URL routing without duplication for language switching

### Fixed
- URL duplication issue with /en/en/en paths in development
- Translation labels not displaying correctly in navbar
- Language switching redirecting to production URLs during development
- Double /documentation path issues in development environment

---

## [0.2.9] - 2025-11-18

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.8] - 2025-11-17

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.7] - 2025-11-17

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.6] - 2025-11-17

### 🐛 Patch Version

### Added
- TypeScript configuration improvements with JSX react-jsx support
- Enhanced UI package with proper TypeScript configuration

### Improved
- Restored original styling system after glass morphism experiment
- Maintained existing 3D effects and component styling
- Fixed TypeScript module resolution and JSX configuration

### Fixed
- TypeScript JSX intrinsic elements errors
- Module resolution issues for React, Next.js, and Lucide React
- IDE lint errors related to TypeScript configuration

---

## [0.2.5] - 2025-11-16

### 🐛 Patch Version

### Added
- Subtle glowing 3-step hero card that highlights the Identity → Token → Governance → Value flow

### Improved
- Mobile-first layout for the landing hero (scaled typography, better spacing on small screens)
- CTA section with `Connect Wallet` and `Learn More` buttons aligned in a single responsive row
- Navbar right-side layout on mobile to prioritize wallet + menu while keeping version/language visible on larger screens

### Fixed
- Visual duplication between hero right column and lower feature cards by tightening the hero step card design

---

## [0.2.4] - 2025-11-15

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.3] - 2025-11-15

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.2] - 2025-11-15

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.1] - 2025-11-15

### 🐛 Patch Version

### Added
- [TODO: Add new features here]

### Improved
- [TODO: Add improvements here]

### Fixed
- [TODO: Add bug fixes here]

---

## [0.2.0] - 2025-11-15

### Added
- Complete translation system with 200+ translation keys
- English and Spanish language support
- Language switcher component in navigation
- Persistent language preferences in localStorage
- Browser auto-detection of language
- Proper file structure with hooks, locales, and utilities
- Type-safe translation system with TypeScript support
- Comprehensive versioning system with changelog management
- Version display component in UI
- Version context for global state management
- Build script to automatically set version info
- Version comparison utilities

### Improved
- Moved useLanguage hook to proper /src/hooks/ directory
- Separated translations into JSON files for better maintainability
- Added nested translation structure for better organization
- Fixed all TypeScript lint errors
- Improved developer experience with better type safety
- Enhanced build process with automatic version injection

### Fixed
- Fixed type indexing issues in translation utilities
- Resolved TypeScript errors in LanguageContext
- Fixed language switching functionality
- Resolved version context provider hierarchy

## [0.1.2] - 2025-11-06

### 🐛 Bug Fixes
- Update Next.js config for GitHub Pages deployment

## [0.1.1] - 2025-11-06

### 🚚 Chores
- Release 0.1.0
- Set up versioning and changelog generation
- Update package-lock.json

### ✨ Features
- Add governance, token, and biets pages with navigation

## [0.1.0] - 2025-11-06

### 🚚 Chores
- Set up versioning and changelog generation

---

## How to Update This Changelog

When making changes to the project:

1. **For new features**: Add to the "Added" section
2. **For improvements**: Add to the "Improved" section  
3. **For bug fixes**: Add to the "Fixed" section
4. **For breaking changes**: Add a "### Breaking Changes" section

### Version Bumping Commands

```bash
# Patch version (0.2.0 → 0.2.1)
npm run version:patch

# Minor version (0.2.0 → 0.3.0)
npm run version:minor

# Major version (0.2.0 → 1.0.0)
npm run version:major
```

### Automatic Version Info

The build process automatically:
- Sets version from package.json
- Includes git commit hash
- Adds build timestamp
- Creates environment variables for the UI

### Translation Integration

All version-related strings are translatable:
- Version information dialog
- Changelog categories (Features, Improvements, Fixes)
- Update notifications
