# @h4shed/tool-release-manager

Automated release management tool for monorepo contributions, version bumping, and GitHub release generation.

## Overview

`tool-release-manager` streamlines the release process by automating version management, changelog generation, git tagging, and release notes creation. Perfect for maintaining consistent versioning and release documentation across large monorepos.

## Features

- ✅ **Semantic Versioning** - Automatic major/minor/patch version calculation
- ✅ **Version File Management** - Updates VERSION.json and package.json automatically
- ✅ **Release Notes Generation** - Creates comprehensive release documentation
- ✅ **Git Integration** - Commits and tags releases automatically
- ✅ **Commit Statistics** - Calculates lines changed, files modified, commit counts
- ✅ **Validation** - Validates release configuration before publishing
- ✅ **Contributor Tracking** - Optional contributor attribution

## Installation

Install via npm workspace:
```bash
npm install @h4shed/tool-release-manager
```

Build the tool:
```bash
npm run build
```

## Usage

### Basic Release

```typescript
import ReleaseManager from '@h4shed/tool-release-manager';

const manager = new ReleaseManager('/path/to/repo');

// Get current version
const current = await manager.getCurrentVersion();
console.log(`Current version: ${current.version}`);

// Calculate next version
const next = manager.calculateNextVersion(current, 'minor');
console.log(`Next version: ${next.version}`);

// Update version files
await manager.updateVersionFiles(next);

// Generate release notes
const notes = await manager.generateReleaseNotes({
  versionType: 'minor',
  releaseDate: '2026-05-15',
  description: 'Release with new features and improvements',
  features: [
    'Daily Review Skill with session tracking',
    'TypeScript configuration hardening',
    'Ecosystem documentation and analysis'
  ],
  bugFixes: [
    'Fixed TypeScript deprecation warnings',
    'Improved CI/CD pipeline stability'
  ],
  breakingChanges: [],
  contributors: ['Claude Code', 'Fused Gaming Team']
}, next);

// Create git tag
await manager.createGitTag(next.version, notes);
```

### Get Commit Statistics

```typescript
const stats = await manager.getCommitStats('v1.0.5');
console.log(`Commits since v1.0.5: ${stats.totalCommits}`);
console.log(`Files changed: ${stats.filesChanged}`);
console.log(`Lines added: ${stats.linesAdded}`);
console.log(`Lines deleted: ${stats.linesDeleted}`);
```

### Validate Release Configuration

```typescript
const errors = manager.validateConfig({
  versionType: 'minor',
  releaseDate: '2026-05-15',
  description: 'Release v1.1.0',
  features: ['Feature 1', 'Feature 2'],
  bugFixes: [],
  breakingChanges: []
});

if (errors.length > 0) {
  console.error('Validation errors:', errors);
}
```

## API

### ReleaseManager

#### Constructor
```typescript
new ReleaseManager(rootDir?: string)
```
- `rootDir` - Repository root directory (defaults to cwd)

#### Methods

##### `getCurrentVersion(): Promise<VersionInfo>`
Reads and returns current version information from VERSION.json

##### `calculateNextVersion(current: VersionInfo, type: 'major' | 'minor' | 'patch'): VersionInfo`
Calculates next version based on semantic versioning rules

##### `updateVersionFiles(newVersion: VersionInfo): Promise<void>`
Updates VERSION.json and package.json with new version

##### `generateReleaseNotes(config: ReleaseConfig, version: VersionInfo): Promise<string>`
Generates comprehensive release notes in markdown format

##### `createGitTag(version: string, notes: string): Promise<void>`
Creates git commit and annotated tag for release

##### `getCommitStats(lastTag?: string): Promise<CommitStats>`
Retrieves statistics about commits since last release

##### `validateConfig(config: ReleaseConfig): string[]`
Validates release configuration and returns array of errors (if any)

## Types

### ReleaseConfig
```typescript
interface ReleaseConfig {
  versionType: 'major' | 'minor' | 'patch';
  releaseDate: string;
  description: string;
  features: string[];
  bugFixes: string[];
  breakingChanges: string[];
  contributors?: string[];
}
```

### VersionInfo
```typescript
interface VersionInfo {
  version: string;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  releaseDate: string;
  buildNumber: number;
}
```

## Workflow

### Recommended Release Workflow

1. **Prepare Release** - Gather commits and changes since last release
2. **Validate Configuration** - Ensure release config is complete
3. **Update Versions** - Bump VERSION.json and package.json
4. **Generate Notes** - Create comprehensive release documentation
5. **Create Tag** - Commit and tag the release in git
6. **Publish** - Push to npm registry and create GitHub release
7. **Announce** - Post release announcement to channels

### Example Workflow Script

```bash
#!/bin/bash
set -e

# Calculate new version
echo "📊 Analyzing commits since last release..."
npm run release:stats

# Bump version and create tag
echo "🚀 Creating release v1.1.0..."
npm run release:create -- --type minor --description "Daily Review & Ecosystem Expansion"

# Push to remote
echo "📤 Pushing to remote..."
git push origin --all --tags

# Create GitHub release
echo "✨ Creating GitHub release..."
npm run release:github

echo "✅ Release complete!"
```

## Best Practices

1. **Semantic Versioning** - Follow semver strictly (major.minor.patch)
2. **Descriptive Features** - Write clear, concise feature descriptions
3. **Git Hygiene** - Ensure all changes are committed before releasing
4. **Release Notes** - Always document breaking changes prominently
5. **Testing** - Validate release on target environment before publishing
6. **Contributor Credit** - Acknowledge all contributors in release notes

## Development Status

- [x] Core release management functionality
- [x] Version file updates
- [x] Release notes generation
- [x] Git integration
- [ ] GitHub API integration for creating releases
- [ ] Automated changelog generation
- [ ] Comparison between releases
- [ ] Rollback functionality
- [ ] Multi-package release coordination

## License

Apache-2.0

## See Also

- `tool-commander` - Command-line interface building
- `tool-husky` - Git hook automation
- Release Manager integration guide (coming soon)
