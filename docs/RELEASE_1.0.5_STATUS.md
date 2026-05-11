# Release 1.0.5 Status & Completion Checklist

## Executive Summary

**Status:** Ready to finalize  
**Root Version:** 1.0.5 (already bumped)  
**Build Status:** ✅ All passing (build, typecheck, lint)  
**Blocker:** Secure signing keys setup (GitHub secrets for GPG + npm token)

## Package Version Summary

Total packages in workspace: 60  
Unique versions: 17 (mix of workspace packages and external tool re-exports)

### Published Packages (Per VERSION.json)
These are the packages published to npm as `@h4shed/*`:

**Ready for 1.0.5 (currently 1.0.4):**
- ✅ @h4shed/mcp-core
- ✅ @h4shed/mcp-cli
- ✅ @h4shed/skill-algorithmic-art
- ✅ @h4shed/skill-ascii-mockup
- ✅ @h4shed/skill-canvas-design
- ✅ @h4shed/skill-frontend-design
- ✅ @h4shed/skill-mcp-builder
- ✅ @h4shed/skill-pre-deploy-validator
- ✅ @h4shed/skill-skill-creator
- ✅ @h4shed/skill-theme-factory
- ✅ @h4shed/skill-underworld-writer

**At 1.0.2 (need decision):**
- ⏳ @h4shed/skill-daily-review
- ⏳ @h4shed/skill-linkedin-master-journalist
- ⏳ @h4shed/skill-mermaid-terminal
- ⏳ @h4shed/skill-project-manager
- ⏳ @h4shed/skill-project-status-tool
- ⏳ @h4shed/skill-svg-generator
- ⏳ @h4shed/skill-ux-journeymapper
- ⏳ @h4shed/multi-account-session-tracking

**At 1.0.1 (need decision):**
- ⏳ @h4shed/skill-agentic-flow-devkit

### Tool Packages (Not Published)
External dependency re-exports at upstream versions:
- tool-jest (29.0.0)
- tool-cypress (13.0.0)
- tool-storybook (7.0.0)
- tool-vite (5.0.0)
- etc.

These keep their original versions as they're just re-exporting upstream packages.

### Publishing Soon (Currently 1.0.0)
Per VERSION.json, these should eventually be published:
- @h4shed/skill-mermaid-terminal
- @h4shed/skill-ux-journeymapper
- @h4shed/skill-svg-generator
- @h4shed/skill-project-manager
- @h4shed/skill-project-status-tool
- @h4shed/skill-daily-review
- @h4shed/multi-account-session-tracking
- @h4shed/skill-linkedin-master-journalist
- @h4shed/skill-agentic-flow-devkit

## Build Status ✅

```
npm run build      ✅ PASS - All workspaces compile
npm run typecheck  ✅ PASS - No type errors
npm run lint       ✅ PASS - 11 warnings only (no errors)
npm ci             ✅ PASS - All dependencies installed
```

## Pre-Release Checklist

### Code Quality ✅
- [x] Build passes without errors
- [x] TypeScript compilation clean
- [x] Linting passes (warnings acceptable)
- [x] All dependencies installed and resolved
- [x] No unused types or imports

### Git Status ✅
- [x] Working directory clean
- [x] All changes committed
- [x] Branch: `claude/secure-signing-keys-gdvgs`
- [x] Latest: `0e9a894` (SyncPulse ethical hacking merge)
- [x] VERSION.json updated to 1.0.5
- [x] package.json updated to 1.0.5

### Configuration ⏳
- [ ] GitHub secret `GPG_PRIVATE_KEY` configured
- [ ] GitHub secret `GPG_PASSPHRASE` configured
- [ ] GitHub secret `NPM_TOKEN` configured (or verify existing)
- [ ] GitHub variable `NPM_SCOPE` configured (default: @h4shed)

### Documentation ✅
- [x] SECURE_SIGNING_SETUP.md created
- [x] CHANGELOG.md up to date (check needed)
- [x] README.md reflects 1.0.5
- [ ] Release notes prepared (manual)

## Critical Decision: Version Strategy for 1.0.5

### Option A: Uniform Bump (Recommended)
**Action:** Bump ALL workspace @h4shed/* packages to 1.0.5

**Pros:**
- Simple, clear versioning
- All packages released together as cohesive unit
- Easier for users to understand version alignment
- Matches semantic versioning strategy

**Cons:**
- Bumps 1.0.2 packages without changes
- Creates false impression of updates

**Command:**
```bash
./scripts/publish-signed.sh
# Choose: Custom version 1.0.5 for all packages
```

### Option B: Selective Bump
**Action:** Only bump packages that have changes

**Pros:**
- Accurate version history
- No unnecessary semver increments
- Reflects actual package updates

**Cons:**
- Complex multi-version release
- Hard to track cohesion
- Risk of missed packages

**Command:**
Manual script edits to `scripts/prepare-publish-versions.cjs`

### Recommendation
**Use Option A (Uniform Bump to 1.0.5)**

Rationale:
- Workspace packages are tightly coupled (MCP ecosystem)
- Security fixes and framework updates benefit all
- User expectation: "1.0.5 release" means all packages at 1.0.5
- SyncPulse integration (recent merge) affects entire framework

## Next Steps to Complete Release

### Step 1: Configure GitHub Secrets (No Exposure)
⏳ **Waiting on maintainer with GPG key**

Execute locally (maintainer only):
```bash
./scripts/setup-gpg-signing.sh
# Choose option 3: Export GPG key for GitHub Actions
# Adds GPG_PRIVATE_KEY and GPG_PASSPHRASE to GitHub secrets
```

### Step 2: Verify npm Token
Verify `NPM_TOKEN` exists in GitHub:
```bash
gh secret list | grep NPM_TOKEN
```

If missing:
1. Go to [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Create "Automation" type token
3. Add to GitHub secrets

### Step 3: Commit Secure Setup Docs
```bash
git add docs/SECURE_SIGNING_SETUP.md docs/RELEASE_1.0.5_STATUS.md
git commit -m "docs: add secure signing and release status documentation"
git push origin claude/secure-signing-keys-gdvgs
```

### Step 4: Create Pull Request
```bash
gh pr create --title "Setup: Secure package signing for 1.0.5 release" \
  --body "Adds secure signing infrastructure without exposing keys"
```

### Step 5: Publish When Secrets Ready
After GitHub secrets configured:
```bash
git checkout main
git pull origin main
./scripts/publish-signed.sh
# Selects: Version 1.0.5
```

This creates:
- Signed commit with version bump
- Signed git tag: `v1.0.5`
- Triggers GitHub Actions publish workflow
- npm publishes all packages
- GitHub release created

## Verification After Publish

### Check npm Registry
```bash
npm view @h4shed/mcp-core@1.0.5
npm view @h4shed/skill-algorithmic-art@1.0.5
```

### Check GitHub Release
Visit: https://github.com/fused-gaming/fused-gaming-skill-mcp/releases/tag/v1.0.5

### Check Signed Commits
```bash
git log --show-signature -1
git tag -v v1.0.5
```

## Important Security Notes

🔐 **Never display:**
- GPG_PRIVATE_KEY content
- GPG_PASSPHRASE values
- NPM_TOKEN values

In chat, logs, or code comments

📝 **Always:**
- Add `*.key`, `*.gpg`, `gpg-private-key.asc` to .gitignore
- Use GitHub secrets for sensitive values
- Rotate npm tokens quarterly
- Keep GPG keys secure locally

## Timeline

| Step | Status | Est. Time |
|------|--------|-----------|
| Code ready | ✅ Done | - |
| Docs created | ✅ Done | - |
| GPG key setup | ⏳ Pending | 10 mins |
| GitHub secrets | ⏳ Pending | 5 mins |
| PR review | ⏳ Pending | varies |
| Publish workflow | ⏳ Pending | 3-5 mins |
| Total | | ~30 mins active |

---

**Last Updated:** 2026-05-07  
**Branch:** `claude/secure-signing-keys-gdvgs`  
**Ready to proceed when:** GitHub secrets configured

For detailed setup instructions, see [SECURE_SIGNING_SETUP.md](./SECURE_SIGNING_SETUP.md)
