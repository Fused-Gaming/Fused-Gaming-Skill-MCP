# Branch-Skill Matching & Tagging Strategy

This document defines the strategy for matching git branches to skill packages and using tags for proper version control in the @h4shed ecosystem.

## Overview

The @h4shed ecosystem contains 25+ independent skill packages. To maintain clarity and prevent unintended publishing:

1. **Tags are the source of truth** - Proper tagging (`skill-name@X.Y.Z`) validates any branch
2. **Branch naming is preferred** for clarity (but optional if properly tagged)
3. **Changes must match a declared skill** (via branch name OR tag)
4. **Tags control what gets published** to npm
5. **Each skill has its own version** and publication cycle

**Key Principle**: If a branch is not named after a skill, but changes are properly tagged with a skill version tag, the changes are automatically accepted.

## Branch Naming Convention

### Valid Branch Formats

```bash
# Feature branches for a specific skill
feat/linkedin-master-journalist
feat/mermaid-terminal
feat/theme-factory

# Generic feature branches (with skill specification)
feature/skill-name

# Skill-focused branches
skill/ux-journeymapper
skill/svg-generator

# Claude Agent implementation branches
claude/implement-linkedin-master-journalist
claude/implement-project-manager

# Documentation and configuration branches
docs/update-readme
chore/update-dependencies
fix/ci-pipeline
```

### Invalid Branch Names (Will Trigger Warning)

```bash
feature-branch           # ❌ No skill designation
my-changes              # ❌ No type prefix
update-things           # ❌ Unclear scope
```

## Validation Rules

### Rule 1: Tags Are the Source of Truth
A branch is valid if **either**:
- ✓ Branch name matches skill naming convention, AND changes match that skill
- ✓ Changes are tagged with a skill version tag (`skill-{name}@X.Y.Z`)

Either one is sufficient for validation.

### Rule 2: Branch Naming Convention (Preferred)
Branch names should follow one of these patterns:
- `{type}/{skill-name}` where type is: feat, feature, skill, fix, docs, chore
- `claude/implement-{skill-name}`
- `main`, `develop`, `development`

**Note**: Branch naming is strongly recommended for clarity, but tags are the fallback.

### Rule 3: Changed Files Must Match a Skill (Via Name OR Tag)
If a branch declares a skill through naming:
- ✓ Changes to that skill's package are allowed
- ✓ Changes to documentation and config files are allowed
- ❌ Changes to unrelated skills are NOT allowed

**Alternative**: If branch doesn't match naming convention, tag changes:
```bash
# Branch name doesn't follow convention
git checkout -b my-feature-branch

# Make changes to skill packages
# ...changes to packages/skills/linkedin-master-journalist/...

# Tag with skill version
git tag skill-linkedin-master-journalist@1.0.1

# ✓ Validation will pass because of tag
```

### Rule 4: Single-Skill Per Branch (Preferred)
Each branch should focus on ONE skill package:
- ✓ OK: All changes are to one skill + docs
- ❌ NOT OK: Changes to multiple unrelated skills

**Exception**: Config/infrastructure branches can touch multiple packages
- `chore/` branches
- `fix/ci-` branches  
- `docs/` branches

### Rule 5: Branch-to-Tag Mapping

```
Branch                          → Tag Format
feat/linkedin-master-journalist → skill-linkedin-master-journalist@1.0.1
feat/theme-factory              → skill-theme-factory@2.1.0
claude/implement-ux-journeymapper → skill-ux-journeymapper@1.0.0
my-other-branch*                → skill-theme-factory@1.0.0 (via tag)
main (root version bump)        → v1.0.4
```

*Branches without skill naming convention must use tags

## Tagging Strategy

### Tag Formats

#### 1. Skill Package Tags (For Publishing Individual Skills)
```bash
skill-{skill-name}@{version}
```

**Examples:**
```bash
git tag skill-linkedin-master-journalist@1.0.1
git tag skill-theme-factory@2.1.0
git tag skill-mermaid-terminal@1.2.3
```

**When to use:**
- Publishing a new skill version to npm
- Updating an existing skill
- One tag per skill release

#### 2. Root Version Tags (For Monorepo Releases)
```bash
v{major}.{minor}.{patch}
```

**Examples:**
```bash
git tag v1.0.4
git tag v1.1.0
git tag v2.0.0-beta.1
```

**When to use:**
- Coordinated release affecting multiple packages
- Major version bumps
- Release notes that cover the whole ecosystem

### Publishing Workflow

#### Step 1: Verify Branch Matches Skill
```bash
# Create feature branch with skill name
git checkout -b feat/linkedin-master-journalist

# Make changes
npm run build --workspace=packages/skills/linkedin-master-journalist
```

#### Step 2: Validation (Automatic)
The CI workflow will automatically:
- ✓ Validate branch name matches changed files
- ✓ Warn about unrelated changes
- ✓ Suggest tag format

#### Step 3: Create Tag for Publishing
```bash
# Get version from package.json
VERSION=$(grep '"version"' packages/skills/linkedin-master-journalist/package.json | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

# Create tag
git tag skill-linkedin-master-journalist@$VERSION

# Push tag (triggers publish workflow)
git push origin skill-linkedin-master-journalist@$VERSION
```

#### Step 4: Automatic Publication
The publish workflow will:
1. Detect the tag matches `skill-*@*.*.*` format
2. Extract skill name and version
3. Publish to npm as `@h4shed/skill-linkedin-master-journalist@1.0.1`

## Validation Script

The `validate-branch-skill-match.cjs` script is automatically run:
- **On every push** to feature branches
- **On every PR** to main/develop
- **As pre-commit hook** (if configured)

### Manual Validation
```bash
# Check current branch
node scripts/validate-branch-skill-match.cjs

# Output example:
# 📋 Validating branch: feat/linkedin-master-journalist
# 🎯 Skills modified: linkedin-master-journalist
# ✓ Branch skill "linkedin-master-journalist" matches changed files
# ✓ Validation passed
```

### Expected Output Scenarios

**✓ Valid - Skill branch with matching changes:**
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: linkedin-master-journalist
✓ Branch skill "linkedin-master-journalist" matches changed files
✓ Validation passed
```

**⚠️ Warning - Multiple skills changed:**
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: linkedin-master-journalist, theme-factory
⚠️ Warning: Changes also affect other skills: theme-factory
✓ Validation passed (but with warnings)
```

**❌ Invalid - Skill mismatch:**
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: theme-factory
❌ Branch skill mismatch!
   Branch claims: "linkedin-master-journalist"
   Actually changed: theme-factory
❌ Validation failed
```

## CI Enforcement

### GitHub Actions Workflow: `validate-branch-skill-match.yml`

Runs on:
- Every push to feature branches
- Every PR to main/develop
- Every push to main/develop (to validate merges)

Checks:
1. **Branch naming convention** - Warns if name doesn't match pattern
2. **File-to-skill matching** - Fails if changes don't match branch skill
3. **Tag format validation** - Ensures tags follow proper format
4. **Skill package existence** - Verifies package exists before tagging

## Exemptions and Special Cases

### Branches That Skip Validation
- `main` - Production branch
- `develop` - Development branch
- `development` - Alias for develop

### Changes That Don't Require Skill Matching
- `.github/workflows/` - CI/CD configuration
- `docs/` (root level) - General documentation
- `scripts/` - Build/maintenance scripts
- `.gitignore`, `package.json`, `tsconfig.json` - Root configuration

### Changes That DO Require Skill Matching
- `packages/skills/*` - Individual skill packages
- `packages/core/*` - Core MCP package
- `packages/cli/*` - CLI package

## Best Practices

### ✓ DO
- ✓ Use descriptive branch names with skill designation
- ✓ Keep one skill per branch (one feature per PR)
- ✓ Follow semantic versioning for skill packages
- ✓ Create tags immediately before publishing
- ✓ Use the suggested tag format from CI output

### ❌ DON'T
- ❌ Don't commit changes from multiple unrelated skills
- ❌ Don't create tags without a corresponding branch
- ❌ Don't use inconsistent version numbers
- ❌ Don't push tags without corresponding code
- ❌ Don't modify skills you didn't create

## Examples

### Example 1: Publishing LIMJ v1.0.1
```bash
# Create branch
git checkout -b feat/linkedin-master-journalist

# Make changes
npm run build --workspace=packages/skills/linkedin-master-journalist

# Commit
git commit -m "feat(limj): Add hashtag verification tool"

# Merge to main
git push origin feat/linkedin-master-journalist
# (create PR, get approval, merge to main)

# Create tag for publishing
git tag skill-linkedin-master-journalist@1.0.1
git push origin skill-linkedin-master-journalist@1.0.1

# ✓ Automatic: Publish workflow detects tag and publishes to npm
```

### Example 2: Root Version Bump
```bash
# All work is done and merged to main
# Update VERSION.json

git checkout main
git pull origin main

# Bump root version
npm version minor  # Updates package.json and creates v1.1.0 tag
git push origin main --tags

# ✓ Automatic: Publish workflow detects v1.1.0 tag
```

### Example 3: Multi-Skill Branch (Documentation)
```bash
# Branch name indicates type, not specific skill
git checkout -b docs/update-skill-documentation

# Changes to multiple skills are OK for docs
packages/skills/linkedin-master-journalist/docs/
packages/skills/theme-factory/docs/
packages/skills/mermaid-terminal/docs/

# Validation passes because branch type is "docs"
```

### Example 4: Non-Conventional Branch Name + Tag Validation
```bash
# Branch doesn't follow skill naming convention
git checkout -b improve-theme-factory

# Make changes to theme-factory skill
npm run build --workspace=packages/skills/theme-factory

# Commit changes
git commit -m "feat: Add new color variants to theme factory"

# Tag with skill version (this validates the branch)
git tag skill-theme-factory@2.2.0

# Create PR or merge to main
# ✓ Validation will pass because of tag, even though branch name doesn't match

# Push tag to trigger publishing
git push origin skill-theme-factory@2.2.0
```

This approach is useful when:
- Branch is used for experimentation
- Team decides to publish without renaming branch
- Legacy branches need publishing without refactoring

## Troubleshooting

### Issue: "Branch skill mismatch"
**Solution:**
- Verify branch name matches changed skill
- Use `git checkout -b feat/correct-skill-name` to rename branch
- Or move changes to correct branch

### Issue: "Tag format invalid"
**Solution:**
- Use format: `skill-skill-name@X.Y.Z` or `vX.Y.Z`
- Example: `git tag skill-linkedin-master-journalist@1.0.1`

### Issue: "Skill package not found"
**Solution:**
- Check spelling of skill name in branch
- Verify `packages/skills/skill-name/package.json` exists

## See Also

- [Publishing Guide](./NPM_PUBLISHING.md) - Detailed npm publishing instructions
- [ROADMAP.md](./ROADMAP.md) - Skill development roadmap
- [Contributing](./CONTRIBUTING.md) - Contributing guidelines

---

**Last Updated:** May 11, 2026  
**Status:** Active - Enforced by CI
