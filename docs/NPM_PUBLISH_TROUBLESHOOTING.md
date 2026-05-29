# NPM Publish Failures: Root Cause Analysis & Resolution

**Date**: 2026-05-26
**Branch**: `claude/keen-wright-1pNGa`
**Issue**: Workspace UNMET DEPENDENCY warnings and failed npm publish workflow

## Root Causes Identified

### 1. **Scope Inconsistency in Workspace Packages**
- **Problem**: Mixed package scopes across workspace
  - Root package name: `@h4shed/mcp` (v1.1.5)
  - Web package name: `@fused-gaming/swarm-controller` (private, v1.0.0)
  - All other packages: `@h4shed/*` scope
  - Two packages recently renamed: `@fused-gaming/*` → `@h4shed/*`

- **Impact**: 
  - NPM registry expects consistent scope for all publishable workspace packages
  - Mixed scopes cause dependency resolution failures during publish
  - The web package is marked `private: true`, but should align with workspace scope convention

- **Evidence**:
  ```bash
  npm ls
  # Returns 31+ "UNMET DEPENDENCY" warnings for file:// workspace references
  # All are @h4shed/* packages showing as unmet
  ```

### 2. **Lockfile Out-of-Sync with Package Manifests**
- **Problem**: Recent package name changes not reflected in all dependency declarations
  - `packages/skills/multi-account-session-tracking-skill/package.json`: Renamed from `@fused-gaming/skill-multi-account-session-tracking` to `@h4shed/skill-multi-account-session-tracking-extended`
  - `packages/skills/project-manager-skill/package.json`: Renamed from `@fused-gaming/skill-project-manager-skill` to `@h4shed/skill-project-manager-legacy`
  - `package-lock.json` only knows new names but workspaces may not all reference updated versions

- **Impact**:
  - When `npm install --package-lock-only --ignore-scripts` runs in workflow, lockfile version constraints don't match actual package.json declarations
  - Dependency resolution fails when upstream packages reference the old names
  - npm ci fails or times out waiting for missing dependencies

### 3. **TypeScript baseUrl Deprecation (Secondary Issue)**
- **Problem**: TypeScript 5.3.2 warns about deprecated `baseUrl` option
- **Impact**: Blocks the `prepare` script's `npm run build` step, preventing installation in CI
- **Severity**: Non-blocking for publish but delays dependency resolution

### 4. **Workspace Dependency Range Inconsistencies**
- **Problem**: The `prepare-publish-versions.cjs` script updates internal workspace dependency ranges to `^x.y.z` format
- **Impact**: When a package is bumped for republish, downstream workspace packages must also be updated with the new version range
- **Current State**: Two packages recently changed names but their dependents may still reference old names

## Publish Workflow Failure Points

### Typical Failure Sequence
1. **Trigger**: Push to main or tag push initiates `.github/workflows/publish.yml`
2. **Step: Prepare versions** (`prepare-publish-versions.cjs`)
   - Checks if each workspace package@version exists on npm
   - If yes: bumps patch version locally
   - Rewrites workspace dependencies to new versions
   - **Issue**: May not catch all renamed packages in one pass

3. **Step: Auto-bump versions** (`auto-bump-publish-versions.js`)
   - Evaluates changed-only packages using git diff
   - Bumps versions for publishing
   - **Issue**: git diff may not detect workspace rename operations

4. **Step: Sync lockfile** (`npm install --package-lock-only --ignore-scripts`)
   - Refreshes package-lock.json after version bumps
   - **Failure Point**: If package.json references non-existent package names, npm registry lookup fails or times out

5. **Step: Install dependencies** (`npm ci`)
   - Frozen install of locked tree
   - **Failure Point**: Missing dependencies prevent installation; workflow times out

6. **Step: Publish** (`npm publish --workspaces`)
   - Iterates over workspace packages and publishes each
   - **Failure Point**: Some workspace packages skipped if not in `package-lock.json` or marked `private: true`

## Solutions

### Immediate Fixes

#### Fix 1: Align All Workspace Package Scopes
**Action**: Ensure all publishable packages use `@h4shed` scope consistently.

```bash
# All workspace packages should declare @h4shed scope:
@h4shed/mcp                                         # root
@h4shed/mcp-core                                    # packages/core
@h4shed/mcp-cli                                     # packages/cli
@h4shed/design-tokens                               # packages/design-tokens
@h4shed/license-client                              # packages/license-client
@h4shed/skill-*                                     # packages/skills/*
@h4shed/tool-*                                      # packages/tools/*
@h4shed/syncpulse-hub                               # packages/skills/syncpulse-hub
@fused-gaming/swarm-controller                      # packages/web (PRIVATE - keep as-is)
```

**Status**: 2 packages recently changed to `@h4shed` scope. Remaining packages use consistent scope. ✓ Aligned.

#### Fix 2: Update Lockfile to Reflect Current Package Names
**Action**: Re-run lockfile sync with current package manifests.

```bash
npm install --package-lock-only --ignore-scripts
```

**Expected**: All workspace packages should be listed with their current names in `package-lock.json`.

#### Fix 3: Verify Workspace Dependency References
**Action**: Scan all `package.json` files for dangling references to renamed packages.

**Check**:
- Any package referencing `@fused-gaming/skill-multi-account-session-tracking` should use `@h4shed/skill-multi-account-session-tracking-extended`
- Any package referencing `@fused-gaming/skill-project-manager-skill` should use `@h4shed/skill-project-manager-legacy`

**Status**: Needs verification in `packages/tools/*` and skills that may depend on renamed packages.

#### Fix 4: Suppress TypeScript baseUrl Deprecation (Optional)
**Action**: Add `"ignoreDeprecations": "6.0"` to root `tsconfig.json` to silence TS5101 warnings.

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    // ... rest of config
  }
}
```

**Impact**: Unblocks prepare script's build phase; non-essential for publish success.

### Publish Workflow Improvements

#### Improvement 1: Enhanced Scope Validation
Add pre-flight check in `.github/workflows/publish.yml`:

```bash
# Verify all non-private workspace packages use same scope
npm run lint:scopes --if-present
```

Script: `scripts/lint-workspace-scopes.js`
- Ensures all `publishConfig.access: "public"` packages use `@h4shed/*`
- Reports mismatches before publish attempt
- Fails fast with clear error message

#### Improvement 2: Explicit Dependency Audit
Add step after version bumps:

```bash
# Verify all workspace internal dependencies are resolvable
npm list --depth=1 --workspaces
```

Fail publish if any UNMET DEPENDENCY warnings appear before step 3 (lockfile sync).

#### Improvement 3: Dry-Run Publish Check
Add step before actual publish:

```bash
# Simulate publishing to registry without modifying npm account
npm publish --workspaces --dry-run
```

Catches auth, scope, or version collision issues before they fail the real publish.

## Prevention Checklist

Before merging any PR that modifies workspace packages:

- [ ] **Package name changes**: If renaming a workspace package:
  - [ ] Update all internal references in `package.json` dependency fields
  - [ ] Update any documentation referencing old package names
  - [ ] Re-run `npm install --package-lock-only --ignore-scripts` to sync lockfile
  - [ ] Verify no UNMET DEPENDENCY warnings from `npm ls`

- [ ] **Scope alignment**: 
  - [ ] All non-private packages use `@h4shed/*` scope
  - [ ] Private packages (like web package) explicitly set `"private": true`
  - [ ] Root package scope matches workspace scope convention

- [ ] **Version consistency**:
  - [ ] No packages with version already published on npm (unless bumping with prepare script)
  - [ ] Workspace internal dependencies updated to new versions if bumped

- [ ] **Lockfile validation**:
  - [ ] Run `npm install --package-lock-only --ignore-scripts` after any changes
  - [ ] Commit updated `package-lock.json`
  - [ ] Verify `npm ls` shows no UNMET DEPENDENCY warnings

## Testing the Fix

### Local Validation
```bash
# 1. Verify workspace integrity
npm install --package-lock-only --ignore-scripts
npm ls

# 2. Ensure no unmet dependencies
npm ls 2>&1 | grep -c "UNMET DEPENDENCY"
# Expected output: 0

# 3. Verify all workspaces build
npm run build --workspaces

# 4. Verify publish-prepare script works
node scripts/prepare-publish-versions.cjs

# 5. Simulate publish
npm publish --workspaces --dry-run
```

### CI Validation
- Push to a test branch
- GitHub Actions test workflow should pass all checks
- Publish workflow should reach "Publish workspaces to npm" step without timing out

### NPM Registry Validation
- After successful publish, verify all packages are listed on npm
- Check package scopes align: `npm view @h4shed/mcp-core`, etc.
- Verify no duplicate versions or scope conflicts

## Related Documentation

- `.github/workflows/publish.yml` - Publish automation workflow
- `scripts/prepare-publish-versions.cjs` - Version bump logic
- `scripts/auto-bump-publish-versions.js` - Auto-bump for changed packages
- `docs/NPM_PUBLISHING.md` - Published npm standards guide
- `CHANGELOG.md` - Version history and breaking changes

## Timeline

| Date | Event |
|------|-------|
| 2026-04-21 | Workspace name changes applied (multi-account-session-tracking, project-manager-skill) |
| 2026-05-26 | Investigation: Identified scope inconsistency and lockfile drift |
| 2026-05-26 | **This document created** with remediation steps |

## Contacts

For further troubleshooting:
- **Repo**: https://github.com/fused-gaming/fused-gaming-skill-mcp
- **Publish Logs**: GitHub Actions → Workflows → Publish to npm → Recent runs
- **Issues**: GitHub → Issues, filter: `npm`, `publish`, `workspace`
