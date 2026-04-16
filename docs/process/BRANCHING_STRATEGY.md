# Branching Strategy

## Overview

Fused Gaming MCP uses a **Git Flow** branching strategy with clear naming conventions and CI/CD integration.

## Main Branches

### `main`
- **Purpose:** Production-ready code
- **Protection:** Requires PR review, all CI checks must pass
- **Deployment:** Auto-publishes to npm on version tags (`v*`)
- **Updates:** Only via pull requests from `release/*` or `hotfix/*`

### `develop`
- **Purpose:** Integration branch for features
- **Protection:** Requires PR review
- **Deployment:** Auto-publishes nightly builds (optional)
- **Updates:** From feature branches via PRs

## Supporting Branches

### Feature Branches (`feature/*`)

**Purpose:** Develop new features or skills

**Naming Convention:**
```
feature/{issue-number}-{description}
feature/123-algorithmic-art-improvements
feature/new-skill-text-processor
```

**Workflow:**
1. Branch from: `develop`
2. Open PR immediately (before any commits)
3. Add PR description with goals and success metrics
4. Commit with conventional commits
5. Merge back to: `develop` (via PR)
6. Delete branch after merge

**Example:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/123-new-skill
git push -u origin feature/123-new-skill
# Open PR on GitHub immediately
# Then make commits...
```

### Bug Fix Branches (`fix/*`)

**Purpose:** Fix bugs in development or production

**Naming Convention:**
```
fix/{issue-number}-{description}
fix/456-skill-loader-crash
fix/critical-security-issue
```

**Workflow:**
1. For develop bugs: Branch from `develop`
2. For production bugs: Branch from `main` as `hotfix/*`
3. Open PR immediately
4. Merge to source branch + cross-merge to other branches

### Release Branches (`release/*`)

**Purpose:** Prepare production releases

**Naming Convention:**
```
release/v1.0.0
release/v1.1.0-rc1
```

**Workflow:**
1. Branch from: `develop`
2. Update versions, CHANGELOG
3. Fix release-blocking bugs only
4. Merge to: `main` (tag version)
5. Merge back to: `develop`
6. Delete after merge

### Hotfix Branches (`hotfix/*`)

**Purpose:** Critical production fixes

**Naming Convention:**
```
hotfix/v1.0.1-security-patch
hotfix/critical-bug-fix
```

**Workflow:**
1. Branch from: `main`
2. Fix critical issue
3. Merge to: `main` (tag version) + `develop`
4. Delete after merge

---

## Session Workflow (NEW STANDARD)

### Before Any Code Changes

1. **Create a feature branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/{issue}-{description}
   git push -u origin feature/{issue}-{description}
   ```

2. **Open a pull request immediately** (even with no commits)
   ```bash
   # Via GitHub CLI
   gh pr create --title "Feature: ..." --body "..." --draft
   # Or via GitHub UI
   ```

3. **Add PR description with:**
   - Session goals (what you're trying to accomplish)
   - Success metrics (how to measure if successful)
   - Technical approach (optional but helpful)

4. **Example PR Comment:**
   ```markdown
   ## Session Goals
   - [ ] Implement full tool for hero skill #1 (algorithmic-art)
   - [ ] Create 100% test coverage for core module
   - [ ] Write deployment guide documentation

   ## Success Metrics
   ✅ All tools fully functional with real implementations
   ✅ 80%+ test coverage across packages
   ✅ Zero linting errors or type issues
   ✅ Documentation reviewed and ready for users

   ## Technical Approach
   - Enhance p5.js pattern generators with actual algorithms
   - Add unit tests for each tool handler
   - Create deployment.md guide
   ```

5. **Only then:** Start making commits and pushing

6. **Throughout session:**
   - Push commits regularly to feature branch
   - Update PR description with progress
   - Link any related issues
   - Add labels (bug, feature, documentation, etc.)

7. **When ready to merge:**
   - Ensure all CI checks pass
   - Request review from maintainers
   - Address feedback
   - Merge via "Squash and merge" or "Create a merge commit"

---

## Commit Message Format

Use **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Formatting (no code change)
- `refactor` — Code restructuring (no feature change)
- `perf` — Performance improvement
- `test` — Test additions/changes
- `chore` — Build/tooling changes

### Scope (Optional)
- `core`, `cli`, `skills`, `docs`, `config`

### Examples

```bash
git commit -m "feat(skills): add weather skill with 3 tools"
git commit -m "fix(core): handle missing skill gracefully"
git commit -m "docs: add deployment guide"
git commit -m "test(core): add SkillRegistry test coverage"
git commit -m "chore: update dependencies"
```

---

## Branch Protection Rules

For `main` and `develop`:

1. ✅ Require pull request reviews (min 1)
2. ✅ Require status checks to pass (lint, build, test)
3. ✅ Require branches to be up to date before merge
4. ✅ Require code review from CODEOWNERS
5. ✅ Restrict who can push (maintainers only)

---

## CI/CD Pipeline

### On Every Push

```
→ Run ESLint
→ Run TypeScript compiler
→ Run tests
→ Build all packages
```

**Status:** Must pass before PR can be merged

### On PR to `main`

```
→ All above checks
→ Verify version bumps
→ Check CHANGELOG updated
→ Generate build artifacts
```

### On Merge to `main` with Version Tag

```
→ All above checks
→ Publish to npm (all packages)
→ Create GitHub release
→ Deploy documentation
→ Notify community
```

---

## Merge Strategy

### Feature → Develop

**Default:** Squash and merge
- Keeps history clean
- One commit per feature
- Preserves feature branch history

```bash
# Via GitHub: "Squash and merge"
```

### Release/Hotfix → Main

**Strategy:** Create merge commit
- Preserves branch history
- Clear separation of releases
- Better for git bisect

```bash
# Via GitHub: "Create a merge commit"
```

### Main → Develop (Sync)

**Strategy:** Fast-forward merge
- Keeps develop in sync
- No merge commits

```bash
git checkout develop
git merge --ff-only main
```

---

## Common Workflows

### Starting a Feature Session

```bash
# 1. Start with develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/123-my-feature

# 3. Push immediately
git push -u origin feature/123-my-feature

# 4. Open PR on GitHub (empty PR)
gh pr create --draft \
  --title "Feature: My Feature" \
  --body "
## Goals
- Implement X
- Test Y

## Success Metrics
- All tests pass
- 80%+ coverage
"

# 5. Make commits
git commit -m "feat: implementation 1"
git commit -m "feat: implementation 2"
git push

# 6. Mark PR ready for review
gh pr ready

# 7. Address feedback and merge
```

### Fixing a Bug in Develop

```bash
git checkout develop
git pull origin develop
git checkout -b fix/456-bug-name
git push -u origin fix/456-bug-name
gh pr create --draft --title "Fix: Bug name" --body "..."
# Make commits
git commit -m "fix: resolve bug condition"
git push
gh pr ready
# Merge when approved
```

### Creating a Release

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Update versions
npm version minor

# Update CHANGELOG.md
# Add release notes

git commit -m "chore: release v1.1.0"
git push -u origin release/v1.1.0

# Open PR
gh pr create --title "Release: v1.1.0" --body "..."

# After PR approval:
git checkout main
git merge --no-ff release/v1.1.0
git tag v1.1.0
git push origin main --tags

# Sync back to develop
git checkout develop
git merge --ff-only main
git push origin develop

# Delete release branch
git push origin --delete release/v1.1.0
```

### Hotfix for Production

```bash
git checkout main
git pull origin main
git checkout -b hotfix/v1.0.1-security

# Fix critical issue
git commit -m "fix: critical security issue"

# Update version
npm version patch

# Update CHANGELOG
git commit -m "chore: release v1.0.1"

# Merge to main
git checkout main
git merge --no-ff hotfix/v1.0.1-security
git tag v1.0.1
git push origin main --tags

# Sync to develop
git checkout develop
git merge --no-ff main
git push origin develop

# Delete hotfix
git push origin --delete hotfix/v1.0.1-security
```

---

## Branch Naming Quick Reference

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{issue}-{desc}` | `feature/123-new-skill` |
| Bug Fix | `fix/{issue}-{desc}` | `fix/456-crash-fix` |
| Release | `release/v{version}` | `release/v1.0.0` |
| Hotfix | `hotfix/v{version}-{desc}` | `hotfix/v1.0.1-patch` |
| Docs | `docs/{topic}` | `docs/api-guide` |
| Chore | `chore/{task}` | `chore/deps-update` |

---

## Review Checklist

Before merging, ensure:

- [ ] PR description is clear and complete
- [ ] All CI checks pass (lint, build, test)
- [ ] Code follows project style guide
- [ ] Commits follow conventional format
- [ ] Documentation is updated
- [ ] Tests added for new features
- [ ] No breaking changes (or clearly documented)
- [ ] CHANGELOG updated (for releases)
- [ ] At least 1 approval from maintainer

---

## FAQ

**Q: Can I push directly to main?**  
A: No. All changes must go through PR with review.

**Q: Should I delete local branches?**  
A: Yes, after merging: `git branch -d feature/123`

**Q: How long can a feature branch exist?**  
A: Keep to 1-2 weeks max. Longer = harder to merge.

**Q: What if my branch is behind develop?**  
A: Rebase and force push:
```bash
git fetch origin
git rebase origin/develop
git push -f origin feature/123
```

**Q: Can multiple people work on one branch?**  
A: Yes, but avoid conflicts. Use small, focused PRs.

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow (Alternative)](https://guides.github.com/introduction/flow/)
