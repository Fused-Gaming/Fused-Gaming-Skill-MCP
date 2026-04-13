# NPM Publishing & CI/CD Guide

Complete guide for publishing Fused Gaming MCP and its skills to npm with automated CI/CD pipelines.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Publishing Setup](#publishing-setup)
3. [Manual Publishing](#manual-publishing)
4. [Automated CI/CD](#automated-cicd)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### NPM Account

1. [Create an npm account](https://www.npmjs.com/signup) (if you don't have one)
2. [Verify your email](https://docs.npmjs.com/verifying-your-email-address)
3. [Enable 2FA](https://docs.npmjs.com/configuring-two-factor-authentication) (recommended)

### Required Permissions

- **Core team**: Publish to `@h4shed` scope
- **Collaborators**: Can publish specific skills under their namespace

### Local Setup

```bash
# Login to npm
npm login

# Verify login
npm whoami

# Set npm token (for CI/CD)
# See "GitHub Actions Setup" below
```

## Publishing Setup

### Configure NPM Scope

The `@h4shed` scope is already configured in `package.json`:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Access Control

Each package in `packages/` has its own `package.json`:

```json
{
  "name": "@h4shed/skill-my-feature",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Add Collaborators

Add team members who can publish (on npm.js):

```bash
npm owner add username @h4shed/mcp-core
npm owner add username @h4shed/mcp-cli
npm owner add username @h4shed/skill-algorithmic-art
# ... etc
```

## Manual Publishing

### Pre-Release Checklist

```bash
# 1. Ensure on main branch
git checkout main
git pull origin main

# 2. Run full test suite
npm run build
npm run typecheck
npm run lint
npm test

# 3. Update version in package.json files
# Use semantic versioning: MAJOR.MINOR.PATCH
```

### Publishing Steps

#### Option A: Publish Individual Skill

```bash
# Update skill package.json version
cd packages/skills/my-feature
# Edit package.json: "version": "1.1.0"

# Build and test
npm run build
npm run test

# Publish
npm publish

# Verify on npm
npm view @h4shed/skill-my-feature
```

#### Option B: Publish All Skills

```bash
# Update root package.json version
# Edit package.json: "version": "1.1.0"

# Build and test all
npm run build
npm run typecheck
npm run lint
npm test

# Publish all workspace packages
npm run publish:packages

# Verify
npm view @h4shed/mcp-core
npm view @h4shed/mcp-cli
npm view @h4shed/skill-algorithmic-art
```

### Post-Publish

```bash
# 1. Tag the release
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# 2. Create GitHub Release
# Go to: https://github.com/fused-gaming/fused-gaming-skill-mcp/releases/new
# Tag: v1.1.0
# Title: Release v1.1.0
# Description: Copy from CHANGELOG.md

# 3. Announce release
# Update CHANGELOG.md [Unreleased] to the new version
# Update docs/EXAMPLES.md if needed
# Notify users via discussions

# 4. Update VERSION.json
# Update version and releaseDate
```

## Scope Selection in CI

To avoid `E404 Scope not found` during workspace publishing:

- Set repository variable `NPM_SCOPE` to force an org/user scope (for example `fused-gaming`).
- If `NPM_SCOPE` is not set, the workflow falls back to `npm whoami` and publishes using the token owner's scope.

This allows forks and contributor tokens to publish without rewriting package manifests manually.

### Duplicate Version Auto-Bump + Preflight Guard

The publish workflow now runs:
1. `node scripts/auto-bump-publish-versions.js`
2. `node scripts/preflight-publish-check.js`

This runs **before lint/typecheck/build**. The auto-bump script checks npm for every workspace package (`npm view <name>@<version> version`) and automatically increments patch versions across root + all workspaces until an unpublished version is found. The preflight script then verifies there are no duplicates left.

This prevents late-stage `npm publish --workspaces` failures like:
- `E403 Forbidden - You cannot publish over the previously published versions`

Local commands:
1. `npm run publish:auto-bump`
2. `npm run publish:preflight`
3. `npm run publish:prepare` (runs both in sequence)

## Automated CI/CD

### GitHub Actions Setup

Create `.github/workflows/publish.yml` for npm and `.github/workflows/github-release.yml` for GitHub Releases:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      publish_type:
        description: 'Publish type (root, skills, all)'
        required: true
        default: 'root'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Publish to NPM
        run: npm run publish:packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Notify Slack (optional)
        uses: 8398a7/action-slack@v3
        if: always()
        with:
          status: ${{ job.status }}
          text: 'NPM Publish: ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

Create `.github/workflows/github-release.yml`:

```yaml
name: GitHub Release

on:
  push:
    tags:
      - "v*"
      - "skill-*"
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

### Set Up Secrets

In GitHub repository settings (Settings > Secrets and variables > Actions):

1. **NPM_TOKEN**
   ```bash
   # Create on npm.js
   # Go to: https://www.npmjs.com/settings/~/tokens
   # Create "Automation" token
   # Copy token to GitHub secret
   ```

2. **GH_TOKEN**
   ```bash
   # Personal access token (repo scope) for release creation
   # Store as Actions secret: GH_TOKEN
   ```

3. **SLACK_WEBHOOK** (optional)
   ```bash
   # Create Slack app webhook
   # In GitHub: Settings > Secrets > New secret
   # Name: SLACK_WEBHOOK
   # Value: https://hooks.slack.com/...
   ```

### Publishing Workflow

```bash
# 1. Update version in package.json files
git checkout -b release/v1.1.0

# 2. Update CHANGELOG.md
# Move [Unreleased] section to [1.1.0] with date

# 3. Update VERSION.json
{
  "version": "1.1.0",
  "releaseDate": "2026-04-04"
}

# 4. Commit changes
git add CHANGELOG.md VERSION.json package.json packages/*/package.json
git commit -m "chore(release): bump version to 1.1.0"

# 5. Create and push tag
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin release/v1.1.0
git push origin v1.1.0

# 6. GitHub Actions automatically publishes when tag is pushed
```

## Advanced Publishing

### Beta Releases

For pre-release versions:

```json
{
  "version": "1.1.0-beta.1"
}
```

Tag format:
```bash
git tag v1.1.0-beta.1
```

Publish as beta tag:
```bash
npm publish --tag beta
```

Install beta version:
```bash
npm install @h4shed/mcp-core@beta
```

### Canary Releases

For testing before full release:

```bash
# Publish canary
npm publish --tag canary

# Install canary
npm install @h4shed/mcp-core@canary
```

### Monorepo Publishing

For independent versioning of skills:

```bash
# Option 1: Use Lerna (if adopting)
npm install -g lerna
lerna publish

# Option 2: Manual per-skill versioning
cd packages/skills/skill-1
npm version minor
npm publish
```

## Distribution Channels

### Official Registry

Primary: https://registry.npmjs.org/

Packages:
- `@h4shed/mcp-core` - Core server
- `@h4shed/mcp-cli` - CLI tool
- `@h4shed/skill-*` - Individual skills

### Yarn & PNPM

Both support npm registry:

```bash
# Yarn
yarn add @h4shed/mcp-core @h4shed/mcp-cli

# PNPM
pnpm add @h4shed/mcp-core @h4shed/mcp-cli
```

## Version Management

### VERSION.json Updates

Automatically update via npm script:

```bash
npm version patch
npm version minor
npm version major
```

This triggers the `version` script in `package.json`:

```json
{
  "scripts": {
    "version": "node scripts/update-version.js && git add VERSION.json"
  }
}
```

Create `scripts/update-version.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const versionFile = path.join(__dirname, '../VERSION.json');
const version = packageJson.version;

const versionJson = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
versionJson.version = version;
versionJson.releaseDate = new Date().toISOString().split('T')[0];

const [major, minor, patch] = version.split('.');
versionJson.majorVersion = parseInt(major);
versionJson.minorVersion = parseInt(minor);
versionJson.patchVersion = parseInt(patch);

fs.writeFileSync(versionFile, JSON.stringify(versionJson, null, 2) + '\n');
console.log(`Updated VERSION.json to ${version}`);
```

## Release Calendar

Recommended release schedule:

- **Patch**: Weekly (bug fixes, security patches)
- **Minor**: Bi-weekly (new skills, features)
- **Major**: Quarterly (breaking changes)

Track in GitHub:

```markdown
# Release Schedule - Q2 2026

## April
- [ ] v1.0.1 - Bug fixes (2026-04-10)
- [ ] v1.1.0 - New skill: advanced-animation (2026-04-24)

## May
- [ ] v1.1.1 - Security patch (2026-05-08)
- [ ] v1.2.0 - Theme system improvements (2026-05-22)

## June
- [ ] v2.0.0 - Major redesign (2026-06-30)
```

## Monitoring

### Npm Stats

Track downloads:

```bash
# View package stats
npm stats @h4shed/mcp-core
npm stats @h4shed/skill-algorithmic-art
```

Or use [npm analytics](https://www.npmjs.com/package/npm-stats):

```bash
npm stats --json | jq '.downloads'
```

### Deprecated Packages

When removing a package:

```bash
npm deprecate @h4shed/old-skill "Use @h4shed/new-skill instead"
```

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate
npm logout
npm login

# Or use token
npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN
```

### Publish Failures

```bash
# Check if already published
npm view @h4shed/mcp-core@1.1.0

# Check npm registry connectivity
npm ping

# Force re-authentication
npm auth-clean
npm login
```

### Version Conflicts

```bash
# Check published versions
npm view @h4shed/mcp-core versions

# View latest
npm view @h4shed/mcp-core@latest version
```

## Best Practices

### 1. **Version Control**
- Always tag releases in git
- Document changes in CHANGELOG.md
- Use semantic versioning consistently

### 2. **Quality Assurance**
- Run full test suite before publishing
- Type check all code
- Lint code
- Test with real npm install

### 3. **Documentation**
- Update README.md with new features
- Add examples in docs/EXAMPLES.md
- Document breaking changes
- Provide migration guides

### 4. **Communication**
- Announce major releases
- Provide upgrade instructions
- Respond to issues promptly
- Maintain security advisories

### 5. **Automation**
- Use CI/CD for publishing
- Automate version bumps
- Generate changelogs automatically
- Test before publishing

## References

- [npm Publishing Documentation](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
- [Scoped Packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [GitHub Actions - NPM Publishing](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
- [Semantic Versioning](https://semver.org/)

## Contact

For publishing issues:
- Email: publish@fused-gaming.io
- GitHub Issues: [Fused Gaming MCP Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)
