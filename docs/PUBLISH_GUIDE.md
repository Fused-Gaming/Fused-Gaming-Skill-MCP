# Publishing Guide

This guide covers publishing packages to npm with GPG signed commits and tags.

## Prerequisites

### NPM Setup

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **npm Token**: Generate a token at https://www.npmjs.com/settings/tokens
   - **Token Type**: Automation (for CI/CD)
   - **Permissions**: Read and Publish

### GPG Signing Setup

1. **Generate GPG Key** (if you don't have one):
   ```bash
   gpg --full-generate-key
   # Follow prompts:
   # - Key type: RSA (option 1)
   # - Key size: 4096
   # - Expiration: 0 (no expiration) or 2y (2 years)
   # - Real name: Your Name
   # - Email: your.email@example.com
   ```

2. **Export GPG Private Key**:
   ```bash
   gpg --armor --export-secret-keys YOUR_EMAIL@example.com > gpg-key.asc
   ```

3. **Get Passphrase**: The passphrase you set during key generation

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. **NPM_TOKEN**: Your npm automation token
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

2. **GPG_PRIVATE_KEY**: Your exported GPG key
   - Name: `GPG_PRIVATE_KEY`
   - Value: Contents of `gpg-key.asc`

3. **GPG_PASSPHRASE**: Your GPG key passphrase
   - Name: `GPG_PASSPHRASE`
   - Value: Your passphrase

## Publishing Process

### Option 1: Publish on Main Branch Push

When you push to `main`, the workflow automatically:
1. Bumps versions in all changed workspaces
2. Commits and signs the version bump
3. Creates a signed tag
4. Publishes to npm

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main
# Workflow runs automatically
```

### Option 2: Publish with Manual Tag

Create a tag to trigger publishing:

```bash
# Tag format for root package
git tag -s v1.0.6 -m "Release version 1.0.6"
git push origin v1.0.6

# Tag format for skills
git tag -s skill-mermaid-terminal-1.0.0 -m "Release skill-mermaid-terminal v1.0.0"
git push origin skill-mermaid-terminal-1.0.0
```

### Option 3: Manual Publish via Workflow Dispatch

```bash
# Trigger workflow without code changes
gh workflow run publish.yml
```

## Version Bumping

Version updates follow this logic:

1. **Automatic Detection**: Workflow detects changed packages via git diff
2. **Collision Avoidance**: `prepare-publish-versions.cjs` checks if versions exist on npm
3. **Auto-Bump**: `auto-bump-publish-versions.js` increments patch versions as needed
4. **Validation**: `preflight-publish-check.js` confirms readiness

### Manual Version Bump

Edit `package.json` and `VERSION.json`:

```bash
# Update root package.json
npm version patch  # or minor, major

# Update VERSION.json
node scripts/update-version.js

# Commit and push
git add .
git commit -S -m "chore: bump version to 1.0.6"
git push origin main
```

## Workflow Steps Explained

### 1. **Configure Git User**
Sets up git identity for commits and tags

### 2. **Import GPG Key**
Uses the GitHub Actions action `crazy-max/ghaction-import-gpg` to:
- Import your GPG private key
- Configure git to sign commits
- Configure git to sign tags

### 3. **Version Management**
- `prepare-publish-versions.cjs`: Handles changed package detection
- `auto-bump-publish-versions.js`: Auto-increments patch versions
- `preflight-publish-check.js`: Validates version integrity

### 4. **Code Quality Checks**
- Lint: ESLint validation
- Typecheck: TypeScript compilation
- Build: Full workspace build

### 5. **Signed Commit**
Creates a GPG-signed commit with version bumps:
```bash
git commit -S -m "chore: bump versions..."
```

### 6. **Signed Tag**
Creates a GPG-signed tag:
```bash
git tag -s v1.0.6 -m "Release version 1.0.6"
```

### 7. **npm Publish**
Publishes all packages to npm with public access

### 8. **GitHub Release**
Creates a release on GitHub with workflow link

## Verifying Signed Commits

### Check Signature Locally

```bash
# View commit signature
git log --show-signature -1

# Expected output shows:
# gpg: Good signature from "github-actions[bot]"
```

### Check on GitHub

1. Go to repository commits page
2. Click on a commit
3. Look for "Verified" badge next to commit

## Troubleshooting

### "GPG failed to sign data"

**Cause**: GPG key not properly configured

**Solution**:
```bash
# Test GPG key
gpg --list-secret-keys

# Ensure key is imported in GitHub Actions
# Re-export and update GPG_PRIVATE_KEY secret
```

### "Tag already exists"

**Cause**: Version was already published

**Solution**:
```bash
# Bump version in package.json
npm version patch

# Commit and push
git add .
git commit -S -m "chore: bump version"
git push origin main
```

### "npm ERR! 401 Unauthorized"

**Cause**: Invalid or expired npm token

**Solution**:
1. Generate new token at npmjs.com
2. Update NPM_TOKEN secret in GitHub
3. Restart workflow

### "Permission denied: .git/hooks/pre-commit"

**Cause**: Git hook permissions issue

**Solution**:
```bash
chmod +x .git/hooks/*
```

## Best Practices

1. **Always Sign**: Ensure commits and tags are always signed
2. **Semantic Versioning**: Follow semver for version bumps
3. **Changelog First**: Update CHANGELOG.md before publishing
4. **Test Before Publish**: Run full CI/CD checks locally
5. **One Scope Per Workflow**: Keep NPM_SCOPE consistent
6. **Audit Dependencies**: Run `npm audit` before major releases

## Security Considerations

1. **Keep GPG Passphrase Safe**: Never commit or expose it
2. **Rotate Keys Periodically**: Generate new GPG keys annually
3. **Use Strong Passphrase**: At least 16 characters, mixed case
4. **Limit Token Scope**: Use automation tokens with minimal permissions
5. **Monitor Releases**: Watch npm package for unauthorized publishes

## Quick Reference

| Task | Command |
|------|---------|
| Publish on main push | `git push origin main` |
| Manual tag publish | `git tag -s v1.0.6 && git push origin v1.0.6` |
| Trigger workflow | `gh workflow run publish.yml` |
| Check signatures | `git log --show-signature` |
| List GPG keys | `gpg --list-secret-keys` |
| Update versions | `npm version patch && node scripts/update-version.js` |

## Related Documentation

- [NPM Publishing](./NPM_PUBLISHING.md)
- [CHANGELOG Standards](../CHANGELOG.md)
- [Version Management](./VERSION_MANAGEMENT.md)
- [GitHub Actions Setup](../.github/workflows/publish.yml)
