# PR Merge Checklist Template

**Repository:** Fused-Gaming-Skill-MCP  
**Date:** `[YYYY-MM-DD]`  
**PR:** `#[number]` | **Branch:** `[branch-name]`

---

## 📋 Pre-Merge Validation Phase

### Dependency Management
- [ ] Run `npm install --package-lock-only --ignore-scripts`
- [ ] Verify `package-lock.json` synchronized with `package.json`
- [ ] Check for workspace naming conflicts (`npm ERR! EDUPLICATEWORKSPACE`)
- [ ] Confirm no missing type definitions (`@types/*` packages)
- [ ] Run `npm ci` successfully in clean environment

### Conflict Resolution
- [ ] Fetch latest from target branch (`git fetch origin main`)
- [ ] Rebase or merge target branch into feature branch
- [ ] Resolve all merge conflicts (code, lock file, metadata)
- [ ] Verify no accidental overwrites in conflict resolution
- [ ] Test build after conflict resolution

### Code Quality Gates
- [ ] **TypeScript Compilation:** `npm run typecheck` passes
  - [ ] No TS2307 (missing module) errors
  - [ ] No TS2688 (ambient type) errors
  - [ ] No TS1005 (syntax) errors
- [ ] **Linting:** `npm run lint` passes
  - [ ] No new warnings in changed files
  - [ ] Pre-existing warnings documented (if applicable)
- [ ] **Build:** `npm run build` completes successfully
  - [ ] No bundle size regressions
  - [ ] All workspace packages build without errors
- [ ] **Security:** `npm audit` reviewed
  - [ ] No critical/high vulnerabilities introduced
  - [ ] Acceptable vulnerabilities documented

---

## 🧪 Testing & Validation Phase

### Automated Test Execution
- [ ] **Unit/Integration Tests:** `npm test --workspaces --if-present`
  - [ ] All test suites pass
  - [ ] Code coverage meets project threshold (if applicable)
  - [ ] No flaky test failures
- [ ] **GitHub Actions CI/CD:**
  - [ ] Test matrix (Node 20.x, 22.x) passes on both lanes
  - [ ] CodeQL Advanced scan completes without errors
  - [ ] Deployment preview (if applicable) builds successfully

### Performance Benchmarking
- [ ] **Benchmark Suite:** `npm run benchmark` (if applicable)
  - [ ] Record baseline metrics before changes
  - [ ] Measure performance after changes
  - [ ] Identify regressions (if any)
  - [ ] Document benchmark results with data:
    ```
    Metric              Before    After     Δ       Status
    ─────────────────────────────────────────────────────
    Build Time (ms)     [X]       [Y]       [±Z%]   ✓/✗
    Bundle Size (KB)    [X]       [Y]       [±Z%]   ✓/✗
    Runtime Speed       [X]       [Y]       [±Z%]   ✓/✗
    Memory Usage        [X]       [Y]       [±Z%]   ✓/✗
    ```

### Manual Testing & E2E Validation
- [ ] **Feature Validation:**
  - [ ] Test golden path (happy path)
  - [ ] Test edge cases and error states
  - [ ] Verify no regressions in related features
- [ ] **Browser/Platform Testing** (if UI changes):
  - [ ] Chrome/Chromium latest
  - [ ] Firefox latest
  - [ ] Safari (if applicable)
  - [ ] Mobile responsive view
- [ ] **E2E Metrics Captured:**
  - [ ] Page load time
  - [ ] Time to interactive (TTI)
  - [ ] Cumulative Layout Shift (CLS)
  - [ ] First Contentful Paint (FCP)
  - [ ] User interaction latency
- [ ] **Environment Testing:**
  - [ ] Development environment
  - [ ] Staging environment (if applicable)
  - [ ] Production preview deployment

---

## 📝 Documentation & Release Preparation Phase

### Documentation Updates
- [ ] **CHANGELOG.md** updated (Unreleased section)
  - [ ] Feature additions documented
  - [ ] Bug fixes documented
  - [ ] Breaking changes highlighted
  - [ ] Migration guides (if needed)
- [ ] **README.md** updated (if applicable)
  - [ ] New features documented
  - [ ] API changes reflected
  - [ ] Examples/usage updated
- [ ] **Code Documentation**
  - [ ] JSDoc/TSDoc comments added for public APIs
  - [ ] Complex logic has explanatory comments
  - [ ] Component prop documentation complete
- [ ] **Migration Guides** (if breaking changes)
  - [ ] Step-by-step upgrade instructions
  - [ ] Deprecation warnings documented
  - [ ] Rollback procedures documented

### Version Metadata Updates
- [ ] **VERSION.json** aligned with changes
  - [ ] Major/minor/patch version bumped (if needed)
  - [ ] Build number incremented
  - [ ] Release date set
- [ ] **package.json** version synchronized
- [ ] **Workspace package versions** updated (if applicable)
- [ ] **Version bump rationale** documented in PR description

### Release Notes Preparation
- [ ] **Release notes drafted** with sections:
  ```
  ## v[X.Y.Z] Release Notes
  
  ### New Features
  - [Feature description with context]
  
  ### Bug Fixes
  - [Bug description and fix details]
  
  ### Performance Improvements
  - Benchmark: [metric] improved by [X%]
  - Benchmark: [metric] improved by [X%]
  
  ### Breaking Changes
  - [Breaking change with migration path]
  
  ### Dependencies
  - Updated: [package] to v[X.Y.Z]
  
  ### Contributors
  - @[github-handle]
  ```
- [ ] **Benchmark results embedded** in release notes
- [ ] **Migration path documented** (if breaking)

---

## 👥 Review & Approval Phase

### Peer Review
- [ ] **Code Review Completed**
  - [ ] At least 1 approved review (project minimum)
  - [ ] All requested changes addressed
  - [ ] Review comments resolved or documented
- [ ] **Review Comments Status:**
  - [ ] ✅ All "request changes" comments resolved
  - [ ] ✅ All "comment" feedback addressed or noted
  - [ ] ✅ Reviewer re-approval obtained (if changes made)
- [ ] **CI/CD Sign-Off**
  - [ ] All required status checks passing
  - [ ] No skipped/ignored checks
  - [ ] Deployment preview validated

### Architecture & Security Review (if applicable)
- [ ] **Architecture Review** (for structural changes)
  - [ ] Design patterns aligned with project standards
  - [ ] No anti-patterns introduced
  - [ ] Scalability considerations addressed
- [ ] **Security Review** (for sensitive code)
  - [ ] No hardcoded secrets/credentials
  - [ ] Input validation implemented
  - [ ] OWASP top 10 threats mitigated
  - [ ] Dependency vulnerabilities assessed

---

## 🚀 Merge Execution Phase

### Pre-Merge Final Checks
- [ ] **Branch Status Verified:**
  - [ ] No uncommitted changes
  - [ ] Latest commit signed (if required)
  - [ ] Branch up-to-date with target branch
- [ ] **Merge Strategy Confirmed:**
  - [ ] Merge commit / Squash / Rebase chosen
  - [ ] Rationale for strategy documented
- [ ] **Last-Minute Validation:**
  - [ ] `npm run build` passes one final time
  - [ ] CI/CD checks still passing
  - [ ] No new commits since last check

### Merge Execution
- [ ] Merge initiated via GitHub UI (preferred) or CLI
- [ ] Merge commit message follows conventional format:
  ```
  feat: Brief description of feature
  
  Longer explanation of changes, reasoning, and impact.
  
  Fixes #[issue-number]
  Closes #[pr-number]
  ```
- [ ] Confirm merge completed successfully
- [ ] Verify merged commit visible in target branch history
- [ ] Delete feature branch (if cleanup enabled)

### Post-Merge Verification
- [ ] **Target Branch Status:**
  - [ ] CI/CD passes on merged commit
  - [ ] No new errors introduced
  - [ ] Performance metrics stable
- [ ] **Release Preparation** (if release-ready):
  - [ ] Tag created (`git tag v[X.Y.Z]`)
  - [ ] Release notes published
  - [ ] Notification sent (if applicable)
  - [ ] NPM publish workflow triggered (if applicable)

---

## 🏷️ Publication Branch Tagging

### Version Tagging (if release-ready)
- [ ] **Tag Creation:**
  - [ ] Tag format verified: `v[X.Y.Z]` (semantic versioning)
  - [ ] Tag created on main/release branch: `git tag v[X.Y.Z]`
  - [ ] Tag annotated with release notes: `git tag -a v[X.Y.Z] -m "Release v[X.Y.Z]"`
  - [ ] Tag pushed to remote: `git push origin v[X.Y.Z]`
- [ ] **Release Branch:**
  - [ ] Release branch created (if applicable): `release/v[X.Y.Z]`
  - [ ] Release branch protection enabled (GitHub settings)
  - [ ] Release notes finalized on release branch

### Publication Documentation
- [ ] **Changelog Entry:**
  - [ ] Version header: `## v[X.Y.Z] - YYYY-MM-DD`
  - [ ] All changes categorized (Features, Fixes, Breaking, Performance)
  - [ ] Contributors listed
  - [ ] Migration guide included (if breaking)
- [ ] **GitHub Release:**
  - [ ] Release title: `v[X.Y.Z]: [Brief description]`
  - [ ] Release body matches CHANGELOG entry
  - [ ] Pre-release flag set (if beta/rc)
  - [ ] Artifacts attached (if applicable)

### Publication Workflow
- [ ] **NPM Publication** (if package):
  - [ ] `npm publish` or publish workflow triggered
  - [ ] Package version matches tag: `npm view [package] version`
  - [ ] README and documentation in published package
  - [ ] Package unpacked and verified: `npm pack`
- [ ] **Docker/Artifact Publication** (if applicable):
  - [ ] Docker image built: `docker build -t [name]:v[X.Y.Z]`
  - [ ] Image pushed to registry
  - [ ] Image verified: `docker run [name]:v[X.Y.Z]`
  - [ ] Artifact checksums computed and published

### Post-Publication Verification
- [ ] **Package Availability:**
  - [ ] NPM package visible on npmjs.com
  - [ ] GitHub Release visible on repository releases page
  - [ ] Docker image pullable from registry
  - [ ] Artifact downloads working
- [ ] **Notification:**
  - [ ] Release announcement published (if applicable)
  - [ ] Team notification sent
  - [ ] Dependent projects notified (if applicable)

---

## 🏷️ Label Checklist for Issues & PRs

### Issue Labels

**Priority Labels:**
- [ ] `priority:critical` - Blocks deployment/critical bug
- [ ] `priority:high` - High impact, urgent
- [ ] `priority:medium` - Normal priority
- [ ] `priority:low` - Nice-to-have, backlog

**Type Labels:**
- [ ] `type:bug` - Bug report or fix
- [ ] `type:feature` - New feature request/implementation
- [ ] `type:enhancement` - Improvement to existing feature
- [ ] `type:documentation` - Documentation update
- [ ] `type:refactor` - Code refactoring
- [ ] `type:performance` - Performance optimization
- [ ] `type:security` - Security fix or improvement
- [ ] `type:chore` - Maintenance, build, dependencies

**Status Labels:**
- [ ] `status:backlog` - In product backlog
- [ ] `status:ready` - Ready for development
- [ ] `status:in-progress` - Currently being worked on
- [ ] `status:in-review` - Under review
- [ ] `status:blocked` - Blocked by dependency
- [ ] `status:done` - Completed

**Category Labels:**
- [ ] `area:frontend` - Frontend/UI changes
- [ ] `area:backend` - Backend/API changes
- [ ] `area:database` - Database schema/queries
- [ ] `area:ci-cd` - CI/CD pipeline
- [ ] `area:documentation` - Docs and guides
- [ ] `area:dependencies` - Dependency updates
- [ ] `area:testing` - Testing infrastructure

**Workflow Labels:**
- [ ] `needs:design-review` - Awaiting design review
- [ ] `needs:security-review` - Awaiting security review
- [ ] `needs:architecture-review` - Awaiting architecture review
- [ ] `help-wanted` - Community contributions welcome
- [ ] `good-first-issue` - Good for new contributors
- [ ] `wontfix` - Won't be addressed
- [ ] `duplicate` - Duplicate of existing issue

### Pull Request Labels

**Change Type Labels:**
- [ ] `type:breaking` - Breaking change
- [ ] `type:feature` - New feature
- [ ] `type:bugfix` - Bug fix
- [ ] `type:refactor` - Refactoring
- [ ] `type:docs` - Documentation only
- [ ] `type:test` - Test additions/updates
- [ ] `type:chore` - Maintenance, build, deps

**Area Labels:**
- [ ] `area:frontend` - Frontend changes
- [ ] `area:backend` - Backend changes
- [ ] `area:ci-cd` - CI/CD changes
- [ ] `area:database` - Database changes
- [ ] `area:performance` - Performance improvements
- [ ] `area:security` - Security-related

**Review Status Labels:**
- [ ] `status:ready-for-review` - Ready for code review
- [ ] `status:changes-requested` - Awaiting author changes
- [ ] `status:approved` - Review approved
- [ ] `status:blocked` - Blocked (missing dependency)

**Size Labels:**
- [ ] `size:xs` - Very small (1-10 files)
- [ ] `size:s` - Small (10-50 files)
- [ ] `size:m` - Medium (50-100 files)
- [ ] `size:l` - Large (100-200 files)
- [ ] `size:xl` - Extra large (200+ files)

**Release Labels:**
- [ ] `release:v[X.Y.Z]` - Included in version X.Y.Z
- [ ] `milestone:next-release` - Target for next release
- [ ] `backport-candidate` - Consider for backport

### Labeling Rules

**Issue Creation:**
- [ ] Assign exactly one `type:*` label
- [ ] Assign exactly one `priority:*` label
- [ ] Assign one or more `area:*` labels (if applicable)
- [ ] Assign `status:backlog` by default

**Issue During Development:**
- [ ] Update status label as work progresses
- [ ] Add `needs:*-review` labels as needed
- [ ] Add `status:blocked` if dependencies arise

**PR Creation:**
- [ ] Assign exactly one `type:*` label
- [ ] Assign one or more `area:*` labels
- [ ] Assign `size:*` label based on scope
- [ ] Assign `status:ready-for-review` when ready

**PR During Review:**
- [ ] Update status labels based on review feedback
- [ ] Add `status:changes-requested` if changes needed
- [ ] Change to `status:approved` when ready to merge

**Before Release:**
- [ ] Apply `release:v[X.Y.Z]` label to merged PRs
- [ ] Apply `milestone:next-release` to related issues
- [ ] Clean up old milestone labels

---

---

## 📋 Completed Items Tracking

### Session Achievements (2026-05-17)
- [x] Created standardized PR template (`.github/pull_request_template.md`)
- [x] Created PR merge checklist reference (`docs/PR_MERGE_CHECKLIST.md`)
- [x] Created merge workflow guide (`docs/MERGE_WORKFLOW_GUIDE.md`)
- [x] Added publication branch tagging phase
- [x] Added comprehensive label checklist (9+ categories)
- [x] Fixed GlassmorphCard Tailwind opacity (`border-white/[0.08]`)
- [x] Enhanced breadcrumb component (3 variants: default, compact, minimal)
- [x] Integrated breadcrumb into Dashboard and Navigation
- [x] All TypeScript checks passing
- [x] All linting checks passing (no new warnings)
- [x] Build successful
- [x] All commits pushed to remote

### Recent Commits
1. `791abea` - Fix: Use valid Tailwind arbitrary opacity for GlassmorphCard border
2. `d8d19cf` - Feat: Add publication branch tagging and label checklist
3. `823f01e` - Docs: Add standardized PR merge checklist and workflow integration guide
4. `edfb156` - Feat: Create enhanced breadcrumb component with three design variants
5. `620cc4c` - Fix: Adjust SVG icon paths to fit within 24x24 viewBox

---

## 📊 Checklist Summary

**Total Items:** [AUTO-COUNT]  
**Completed:** [ ] / [ ]  
**Status:** 🟢 Ready / 🟡 In Progress / 🔴 Blocked

**Blockers (if any):**
- [ ] None
- [ ] [Blocker description]

**Notes & Additional Context:**
```
Session focused on:
1. Establishing standardized PR merge workflow
2. Adding comprehensive validation checklists
3. Implementing publication and release management procedures
4. Adding intelligent labeling system for issues and PRs
5. Fixing Tailwind CSS compatibility issues
6. Enhancing UI component library with breadcrumb variants

All changes validated and pushed to claude/resolve-comments-pr-BzLJY
```

---

## Sign-Off

**PR Author:** @[github-handle]  
**Reviewed By:** @[github-handle]  
**Merged By:** @[github-handle]  
**Merge Date/Time:** YYYY-MM-DD HH:MM UTC  

**Approval:** ✅ All checklist items addressed and verified
