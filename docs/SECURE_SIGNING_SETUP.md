# Secure Signing Keys Setup Guide

This guide explains how to configure secure package signing for the npm publishing workflow without exposing sensitive keys in the codebase or chat context.

## Overview

The publish workflow uses three key components:
1. **GPG Signing** - For signed commits and tags
2. **npm Token** - For publishing packages to the npm registry
3. **GitHub Actions Integration** - Securely handles signing during automated publishes

## Prerequisites

- GitHub repository admin access
- gpg command-line tool installed locally (for local signing)
- npm account with publishing permissions

## Part 1: GitHub Actions Secrets (No Exposure)

GitHub secrets are stored securely and never displayed in logs or chat. You need to configure:

### Secret 1: `GPG_PRIVATE_KEY`
**What it is:** Your GPG private key in ASCII-armored format  
**Where to get it:** Export from your local GPG setup (see Part 2)  
**How to add to GitHub:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GPG_PRIVATE_KEY`
4. Paste the exported key content (from `gpg-private-key.asc`)
5. Click "Add secret"

> **Security:** GitHub displays `***` for secret values. Never paste the actual content in chat, comments, or logs.
> **Safety net:** `.gitignore` is pre-configured to exclude `gpg-private-key.asc`, `*.gpg`, and `*.key` files from version control.

### Secret 2: `GPG_PASSPHRASE`
**What it is:** The passphrase protecting your GPG private key  
**Where to get it:** Your GPG key passphrase  
**How to add to GitHub:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GPG_PASSPHRASE`
4. Paste your passphrase
5. Click "Add secret"

### Secret 3: `NPM_TOKEN` (Usually Already Set)
**What it is:** Your npm authentication token for publishing  
**Where to get it:**
- Log in to [npmjs.com](https://www.npmjs.com)
- Click your avatar → Access Tokens
- Create token with "Automation" type for CI/CD
**How to add to GitHub:**
1. Follow same steps as above
2. Name: `NPM_TOKEN`

### Variable: `NPM_SCOPE` (Optional)
**What it is:** Your npm scope/organization (e.g., "h4shed")  
**How to add to GitHub:**
1. Go to Settings → Secrets and variables → Actions
2. Click "Variables" tab
3. New repository variable
4. Name: `NPM_SCOPE`
5. Value: your scope (without @)

## Part 2: Local GPG Setup (For Maintainers)

### Option A: Generate New GPG Key

```bash
./scripts/setup-gpg-signing.sh
# Select option 1: Generate new GPG key
# Follow the prompts to create a new key
```

### Option B: Use Existing GPG Key

```bash
./scripts/setup-gpg-signing.sh
# Select option 2: Use existing GPG key
```

### Option C: Export Key for GitHub (One-Time)

```bash
./scripts/setup-gpg-signing.sh
# Select option 3: Export GPG key for GitHub Actions
# The script generates `gpg-private-key.asc`
# Copy its contents to GitHub as `GPG_PRIVATE_KEY` secret
# Then DELETE the local `gpg-private-key.asc` file
```

⚠️ **CRITICAL:** Delete `gpg-private-key.asc` after adding it to GitHub. Never commit it to git.

Add to `.gitignore`:
```
gpg-private-key.asc
*.gpg
*.key
```

### Option D: Configure Git to Auto-Sign

```bash
./scripts/setup-gpg-signing.sh
# Select option 5: Configure git to use GPG
# This enables automatic signing for all commits
```

## Part 3: Verify Everything is Set Up

### Check GitHub Secrets (No Values Shown)
```bash
# GitHub CLI
gh secret list

# Expected output:
# GPG_PASSPHRASE    created_at:YYYY-MM-DD
# GPG_PRIVATE_KEY   created_at:YYYY-MM-DD
# NPM_TOKEN         created_at:YYYY-MM-DD
```

### Check Local Git Configuration
```bash
git config --global user.signingkey
git config --global commit.gpgsign
# Should return your GPG key ID and true
```

### Test Local Signing
```bash
echo "test message" | gpg --armor --detach-sign -
# Should produce signed output without errors
```

## Part 4: Publishing Workflow

### Automated (Recommended)
When you push to `main` or create a tag:
1. GitHub Actions triggers the publish workflow
2. Secrets are injected at runtime (never displayed)
3. GPG signs commits and tags
4. npm publishes packages automatically
5. GitHub release is created

### Manual Local Signing
For testing or manual releases:

```bash
# Full signed publish with all checks
./scripts/publish-signed.sh

# This will:
# 1. Check all requirements (git, npm, gpg)
# 2. Run lint, typecheck, build
# 3. Prompt for version bump
# 4. Create signed commit
# 5. Create signed tag
# 6. Push to GitHub (triggers CI publish)
```

## Part 5: Troubleshooting

### "Cannot find type definition file for 'node'"
```bash
# Install dependencies
npm ci

# Rebuild
npm run build
```

### "GPG key not found during publish"
1. Verify GPG key exists: `gpg --list-secret-keys`
2. Verify GitHub secrets are set (Settings → Secrets)
3. Check GitHub Actions logs for error messages

### "npm token invalid"
1. Generate new token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Delete old secret: Settings → Secrets → Delete `NPM_TOKEN`
3. Add new secret with same name

## Best Practices

✅ **DO:**
- Keep GitHub secrets up-to-date
- Delete local `gpg-private-key.asc` after exporting
- Use GitHub CLI for local secret management when possible
- Rotate npm tokens regularly (quarterly)
- Enable 2FA on npm account
- Rely on `.gitignore` patterns (already configured) to catch accidental key commits

❌ **DON'T:**
- Paste secrets in chat, PR comments, or logs
- Commit `.gpg` or `.key` files to version control (`.gitignore` prevents this)
- Reuse keys across different services
- Share passphrases in plain text
- Log secret values in build output
- Run `git add -A` without reviewing untracked files first

## Version Release Checklist

Before running `./scripts/publish-signed.sh`:

- [ ] All code changes committed and pushed
- [ ] `npm run build` passes without errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes (warnings OK)
- [ ] All package versions updated in `VERSION.json`
- [ ] `CHANGELOG.md` updated with release notes
- [ ] GitHub secrets configured (`GPG_PRIVATE_KEY`, `GPG_PASSPHRASE`, `NPM_TOKEN`)
- [ ] Local GPG key configured with `git config`
- [ ] Working directory clean (`git status`)

Then execute:
```bash
./scripts/publish-signed.sh
```

## Current Release Status (1.0.5)

✅ Build passes
✅ Typecheck passes  
✅ Lint passes (warnings only)
✅ All workspace dependencies resolved
⏳ Awaiting GPG secret configuration in GitHub

## Next Steps

1. **Maintainer Only:** Export your GPG key and add to GitHub secrets
2. **CI/CD:** Publish workflow will automatically handle signing on tag push
3. **Verify:** Check [GitHub Actions](https://github.com/fused-gaming/fused-gaming-skill-mcp/actions) for successful publish runs

---

For more details:
- [npm Publishing Guide](./NPM_PUBLISHING.md)
- [Publish Workflow](./../.github/workflows/publish.yml)
- [GPG Setup Script](./../scripts/setup-gpg-signing.sh)
