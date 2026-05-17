# PR Merge Workflow Guide

## Timeline & Phases

| Phase | Stage | Owner | Duration | Status |
|-------|-------|-------|----------|--------|
| 1 | Pre-Merge Validation | Author + CI/CD | Early (parallel) | 🟡 Can start immediately |
| 2 | Testing & Validation | Author + CI/CD + Manual | Early (parallel) | 🟡 Run as PR develops |
| 3 | Documentation & Release | Author | Before merge | 🟡 Execute after approval |
| 4 | Review & Approval | Reviewers | Throughout | ✅ Blocking condition |
| 5 | Merge Execution | Merge executor | Final step | ✅ Terminal step |

---

## Phase Breakdown

### 🔴 PHASE 1: PRE-MERGE VALIDATION

**When:** PR creation → Code review  
**Commands:**
```bash
npm install --package-lock-only --ignore-scripts
npm run typecheck
npm run lint
npm run build
```

**Checklist Items:**
- Dependencies installed and synchronized
- No workspace naming conflicts
- No TypeScript/linting errors
- Build completes successfully
- All merge conflicts resolved

---

### 🔵 PHASE 2: TESTING & VALIDATION

**When:** Parallel with Phase 1  
**Commands:**
```bash
npm test --workspaces --if-present
npm run benchmark  # if performance-critical
```

**Manual Testing:**
- Test golden path (happy path)
- Test edge cases and error states
- Verify no regressions
- Capture E2E metrics (TTI, CLS, FCP)
- Cross-browser validation (if UI changes)

---

### 🟢 PHASE 3: DOCUMENTATION & RELEASE

**When:** After code review approved  
**Files to Update:**
- `CHANGELOG.md` (Unreleased section)
- `README.md` (if applicable)
- `VERSION.json` + `package.json`
- Release notes (if release-ready)

**Template:**
```markdown
## v[X.Y.Z] Release Notes

### New Features
- [Feature description]

### Bug Fixes
- [Bug description]

### Performance Improvements
- Build Time: [X% improvement]
- Bundle Size: [X% improvement]

### Breaking Changes
- [Breaking change with migration path]

### Contributors
- @[github-handle]
```

---

### 🟣 PHASE 4: REVIEW & APPROVAL

**When:** Parallel with Phases 1-2  
**Requirements:**
- ✅ At least 1 code approval
- ✅ All "request changes" resolved
- ✅ All "comment" feedback addressed
- ✅ CI/CD checks passing

**Blocking Conditions:**
```
MUST PASS:
  ✓ npm run typecheck (no errors)
  ✓ npm run lint (no new warnings)
  ✓ npm run build (succeeds)
  ✓ GitHub Actions CI/CD (all lanes)
  ✓ Code review approval (≥1)
  ✓ Merge conflicts resolved
  ✓ Branch up-to-date with main
```

---

### 🟠 PHASE 5: MERGE EXECUTION

**When:** After Phase 1-4 complete  
**Final Checks:**
- Branch is up-to-date
- CI/CD still passing
- All checklist items checked
- No uncommitted changes

**Merge Execution:**
```bash
# Ensure up-to-date
git fetch origin
git rebase origin/main

# Final validation
npm run build
npm run typecheck

# Merge via GitHub UI (preferred)
# Or CLI: git merge origin/main
# Or: gh pr merge #<number>
```

**Post-Merge:**
- [ ] CI/CD passes on merged commit
- [ ] No new errors introduced
- [ ] Performance metrics stable
- [ ] Tag created (if release-ready)
- [ ] Release notes published

---

## 🏷️ Publication Branch Tagging

### Version Tagging
**When:** After merge to main/release branch  
**Format:** `v[X.Y.Z]` (semantic versioning)

```bash
# Create annotated tag with release notes
git tag -a v1.2.3 -m "Release v1.2.3: Major features and bug fixes"

# Push tag to remote
git push origin v1.2.3

# Verify tag
git tag -l -n v1.2.3
```

### Release Branch Strategy
- **Release Branches:** `release/v[X.Y.Z]` (for patch/hotfix)
- **Hotfix Branches:** `hotfix/v[X.Y.Z]` (critical fixes only)
- **Protection Rules:** Require PR review before merge

### Publication Checklist
- [ ] Semantic version determined (major/minor/patch)
- [ ] Tag format verified: `v[X.Y.Z]`
- [ ] Release notes finalized
- [ ] CHANGELOG.md updated
- [ ] GitHub Release created
- [ ] NPM publish triggered (if package)
- [ ] Artifacts verified and accessible

---

## 🏷️ Label Checklist for Issues & PRs

### Issue Labels (9+ categories)

**Priority:** `priority:critical`, `priority:high`, `priority:medium`, `priority:low`  
**Type:** `type:bug`, `type:feature`, `type:enhancement`, `type:documentation`, `type:refactor`, `type:performance`, `type:security`, `type:chore`  
**Status:** `status:backlog`, `status:ready`, `status:in-progress`, `status:in-review`, `status:blocked`, `status:done`  
**Area:** `area:frontend`, `area:backend`, `area:database`, `area:ci-cd`, `area:documentation`  
**Workflow:** `needs:design-review`, `needs:security-review`, `help-wanted`, `good-first-issue`, `wontfix`, `duplicate`

### PR Labels (5+ categories)

**Change Type (required):** `type:breaking`, `type:feature`, `type:bugfix`, `type:refactor`, `type:docs`, `type:test`, `type:chore`  
**Area:** `area:frontend`, `area:backend`, `area:ci-cd`, `area:database`, `area:performance`, `area:security`  
**Review Status:** `status:ready-for-review`, `status:changes-requested`, `status:approved`, `status:blocked`  
**Size (required):** `size:xs`, `size:s`, `size:m`, `size:l`, `size:xl`  
**Release:** `release:v[X.Y.Z]`, `milestone:next-release`, `backport-candidate`

### Labeling Workflow

**On Issue Creation:**
```
1. Assign type:* (required, one)
2. Assign priority:* (required, one)
3. Assign area:* (optional, one or more)
4. Default status: status:backlog
```

**On PR Creation:**
```
1. Assign type:* (required, one)
2. Assign area:* (optional, one or more)
3. Assign size:* (required, one)
4. Default status: status:ready-for-review
```

**During Review:**
```
1. Changes requested → Add status:changes-requested
2. Approved → Add status:approved
3. Ready to merge → Confirm all labels present
```

**Before Release:**
```
1. Add release:v[X.Y.Z] to merged PRs
2. Add milestone:next-release to related issues
3. Archive old milestone labels
```

---

## Command Reference

### Quick Validation Sequence

**Before opening PR:**
```bash
npm install --package-lock-only --ignore-scripts
npm run typecheck && npm run lint && npm run build
```

**During code review:**
```bash
npm test --workspaces --if-present
npm run benchmark  # if performance-critical
```

**Before merge:**
```bash
git fetch origin
git rebase origin/main
npm run build && npm run typecheck && npm run lint
```

---

## Benchmark Metrics Template

| Metric | Before | After | Δ | Status |
|--------|--------|-------|---|--------|
| Build Time (ms) | 12,345 | 11,890 | -3.7% | ✓ |
| Bundle Size (KB) | 456 | 452 | -0.9% | ✓ |
| TTI (First Load) | 2.1s | 2.0s | -4.8% | ✓ |
| Memory (avg) | 128MB | 128MB | 0% | ✓ |
| Test Coverage | 87% | 89% | +2.3% | ✓ |

**Document:**
- Test environment: [Node version, OS, hardware]
- Baseline commit: [SHA before changes]
- Test duration: [how many runs averaged]
- Warmup runs: [n runs before measurement]

---

## Usage Patterns

### Option A: Include Checklist in PR Description

```markdown
## PR Description
[Standard details...]

## Pre-Merge Checklist
- [ ] Dependencies installed and synchronized
- [ ] Code quality passes
- [ ] Tests pass on both Node 20.x and 22.x
[... rest of items ...]
```

✅ **Benefit:** Transparent, visible in GitHub UI, linked to PR

### Option B: Use in Comments

Create GitHub issue comment with checklist:
- Link to `docs/PR_MERGE_CHECKLIST.md`
- Update as items complete
- Provides audit trail

✅ **Benefit:** Organized, separate from description

### Option C: Reference in CLAUDE.md

Link standardized checklist:
- `docs/PR_MERGE_CHECKLIST.md`
- `docs/MERGE_WORKFLOW_GUIDE.md`

✅ **Benefit:** Consistent, version-controlled, reusable

---

## Customization Examples

### For Database Changes
```
[ ] Migration files created
[ ] Rollback procedure tested
[ ] Data validation complete
[ ] Backup verified before production
```

### For API Changes
```
[ ] API documentation updated
[ ] Breaking changes documented
[ ] Migration guide provided
[ ] Client SDKs updated
```

### For Security Changes
```
[ ] Security audit completed
[ ] No hardcoded secrets
[ ] Input validation verified
[ ] OWASP top 10 threats mitigated
```

### For Performance-Critical Changes
```
[ ] Benchmark targets met
[ ] Load testing completed
[ ] Memory profiling verified
[ ] Caching strategy validated
```

---

## Tracking & Metrics

### Monitor
- Average time from PR open to merge
- Checklist completion rate (% items checked)
- Most frequently skipped items
- Most common blockers
- Review turnaround time
- Post-merge defect rate

### Monthly Review
- Share metrics with team
- Identify trends
- Update checklist as needed
- Celebrate high-quality merges

---

## Team Adoption

1. **Communication**
   - Share workflow guide with team
   - Highlight blocking conditions
   - Show example PR with completed checklist
   - Answer questions

2. **Training**
   - New PRs auto-populate with template
   - Reviewers watch for completion
   - Track adoption metrics
   - Iterate based on feedback

3. **Iteration**
   - Monthly retrospectives
   - Update checklist based on needs
   - Document exceptions
   - Celebrate improvements

---

## Recent Updates (2026-05-17)

### New Documentation
- ✅ Standardized PR template with embedded checklist
- ✅ Comprehensive 5-phase merge checklist (136+ items)
- ✅ Merge workflow integration guide
- ✅ Publication branch tagging procedures
- ✅ Label checklist for issues and PRs (9+ categories)

### Updated Components
- ✅ Breadcrumb component (3 design variants)
- ✅ GlassmorphCard (Tailwind opacity fix)
- ✅ Dashboard integration
- ✅ Navigation integration

### Checklist Template Enhancements
1. **Publication Phase** - Version tagging, release branches, artifact management
2. **Label System** - Priority, Type, Status, Area, Review labels for issues
3. **Label System** - Type, Area, Review, Size, Release labels for PRs
4. **Implementation Tracking** - Code, testing, documentation, QA checklists

### Key Metrics
- **Total Phases:** 5 (Validation, Testing, Docs, Review, Merge)
- **Total Checklist Items:** 136+
- **Issue Label Categories:** 7+
- **PR Label Categories:** 5+
- **Recent Commits:** 5 (all merged to branch)

---

## See Also

- Full checklist: `docs/PR_MERGE_CHECKLIST.md`
- GitHub PR template: `.github/pull_request_template.md`
- Project standards: `CLAUDE.md`
- Current branch: `claude/resolve-comments-pr-BzLJY`
