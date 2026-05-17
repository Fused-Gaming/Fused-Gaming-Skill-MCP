## 📝 Description
<!-- Provide a brief description of your changes -->

## 🏷️ Labels
**Select appropriate labels for this PR:**

### Change Type (required - select one)
- [ ] `type:breaking` - Breaking change
- [ ] `type:feature` - New feature
- [ ] `type:bugfix` - Bug fix
- [ ] `type:refactor` - Refactoring
- [ ] `type:docs` - Documentation only
- [ ] `type:test` - Test additions/updates
- [ ] `type:chore` - Maintenance, build, deps

### Area (select one or more)
- [ ] `area:frontend` - Frontend changes
- [ ] `area:backend` - Backend changes
- [ ] `area:ci-cd` - CI/CD changes
- [ ] `area:database` - Database changes
- [ ] `area:performance` - Performance improvements
- [ ] `area:security` - Security-related

### Review Status
- [ ] `status:ready-for-review` - Ready for code review
- [ ] `status:blocked` - Blocked (specify reason below)

### Size (required - select one)
- [ ] `size:xs` - Very small (1-10 files)
- [ ] `size:s` - Small (10-50 files)
- [ ] `size:m` - Medium (50-100 files)
- [ ] `size:l` - Large (100-200 files)
- [ ] `size:xl` - Extra large (200+ files)

---

## 🎯 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♻️ Refactoring (code change that doesn't fix a bug or add a feature)
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix

## 🔗 Related Issues
Closes #[issue-number]  
Relates to #[other-issue-number]

---

## ✅ Pre-Merge Checklist

### 📦 Dependency & Conflict Management
- [ ] `npm install --package-lock-only --ignore-scripts` runs successfully
- [ ] `package-lock.json` synchronized with `package.json`
- [ ] No workspace naming conflicts (`EDUPLICATEWORKSPACE`)
- [ ] All merge conflicts resolved
- [ ] Branch up-to-date with target branch (`main`)

### 🔍 Code Quality
- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no new warnings in changed files)
- [ ] `npm run build` succeeds (all packages build)
- [ ] `npm audit` reviewed (no critical/high vulnerabilities)

### ✅ Testing
- [ ] `npm test --workspaces --if-present` passes
- [ ] Manual feature testing completed (golden path + edge cases)
- [ ] No regressions in related features
- [ ] GitHub Actions CI/CD passes on both Node lanes (20.x, 22.x)

### 📊 Performance (if applicable)
- [ ] Benchmark baseline recorded (`npm run benchmark`)
- [ ] Performance metrics compared
- [ ] E2E metrics captured (TTI, CLS, FCP, load time)
- [ ] Results documented below

### 📝 Documentation
- [ ] `CHANGELOG.md` updated (Unreleased section)
- [ ] `README.md` updated (if applicable)
- [ ] JSDoc/TSDoc comments added for public APIs
- [ ] Release notes drafted (if release-ready)
- [ ] Version bumps justified and documented

### 👥 Review
- [ ] Code review completed (at least 1 approval)
- [ ] All review comments addressed or documented
- [ ] Architecture/security review completed (if applicable)

### 🏷️ Publication Tagging (if release-ready)
- [ ] Semantic version determined (major.minor.patch)
- [ ] CHANGELOG.md updated with release notes
- [ ] Version tags documented (v[X.Y.Z] format)
- [ ] Release branch created (if applicable)
- [ ] NPM publish workflow ready (if package)
- [ ] GitHub Release notes prepared

---

## 📊 Benchmark Results (if applicable)

| Metric | Before | After | Δ | Status |
|--------|--------|-------|---|--------|
| Build Time (ms) | - | - | - | ✓/✗ |
| Bundle Size (KB) | - | - | - | ✓/✗ |
| Runtime Speed | - | - | - | ✓/✗ |
| Memory Usage | - | - | - | ✓/✗ |
| Test Coverage | - | - | - | ✓/✗ |

**Test Environment:** Node v[X.Y.Z], [OS], [Hardware]  
**Baseline Commit:** `[SHA]`  
**Test Duration:** [X runs averaged]

---

## 🔄 Migration Guide (if breaking changes)

<!-- Provide step-by-step upgrade instructions -->

1. Step 1...
2. Step 2...
3. Rollback procedure...

---

## 🎬 Demonstration (if UI changes)

<!-- Include screenshots, GIFs, or video links demonstrating the changes -->

### Before:
[Screenshot/GIF]

### After:
[Screenshot/GIF]

---

## 📋 Additional Notes

<!-- Any additional context, decisions, or special considerations -->

---

## 📋 Implementation Checklist

### Code Changes
- [ ] Feature implemented as specified
- [ ] All edge cases handled
- [ ] No dead code or temporary debug statements
- [ ] Code follows project style guide
- [ ] No security vulnerabilities introduced

### Testing
- [ ] Unit tests written/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Regressions verified

### Documentation
- [ ] Code comments added (where needed)
- [ ] Public APIs documented
- [ ] README updated (if applicable)
- [ ] CHANGELOG updated
- [ ] Examples provided (if new feature)

### Quality Assurance
- [ ] TypeScript typecheck passes
- [ ] ESLint passing (no new warnings)
- [ ] Build succeeds
- [ ] No console errors/warnings
- [ ] Performance impact assessed

---

## 🚀 Ready for Merge
- [ ] All checklist items completed
- [ ] No blockers remaining
- [ ] Ready for code review
- [ ] Ready to merge to `main`
