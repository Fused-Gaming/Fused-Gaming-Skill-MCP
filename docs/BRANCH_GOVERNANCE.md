# Branch Governance & Protection Rules

## Overview
This document establishes branch hierarchy, protection rules, and version control standards to prevent unclear branch relationships and maintain code quality.

## Branch Hierarchy

```
main (production-ready)
  ├── development (integration branch)
  │   ├── feature/* (feature development)
  │   ├── fix/* (bug fixes)
  │   └── codex/* (major workstreams)
  │
  └── codex/* (major initiatives - long-lived)
      ├── feat/* (feature branches within codex)
      └── fix/* (hotfix branches within codex)
```

## Branch Naming Conventions

| Type | Pattern | Example | Protection |
|------|---------|---------|-----------|
| **Production** | `main` | - | 🔒 Required |
| **Integration** | `development` | - | 🔒 Recommended |
| **Feature** | `feat/*` | `feat/syncpulse-orchestration-gui` | ⚠️ PR review |
| **Bugfix** | `fix/*` | `fix/cache-ttl-issue` | ⚠️ PR review |
| **Codex/Workstream** | `codex/*` | `codex/create-gaming-skill-dev-kit-gui` | 🔒 Required |
| **Experimental** | `exp/*` | `exp/test-feature` | ❌ None |
| **Personal/Agent** | `{agent}/*` | `claude/setup-claude-flow-gitignore-cbgTm` | ⚠️ PR review |

## Branch Protection Rules

### 1. `main` Branch (Production)
- ✅ Require pull request reviews before merging (minimum 2 approvals)
- ✅ Require status checks to pass (tests, lint, typecheck, build)
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale pull request approvals
- ✅ Require code owner review
- ✅ Require signed commits
- ✅ **NO FORCE PUSH**
- ✅ Only allow squash or rebase merging

### 2. `development` Branch (Integration)
- ✅ Require pull request reviews (minimum 1 approval)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Dismiss stale reviews
- ✅ **NO FORCE PUSH**
- ⚠️ Allow merge commits for history clarity

### 3. `codex/*` Workstream Branches
- ✅ Require pull request reviews (minimum 1 approval)
- ✅ Require status checks to pass
- ⚠️ Allow force push (for workstream consolidation)
- ⚠️ Documented parent branch requirement

### 4. `feat/*` & `fix/*` Branches
- ⚠️ No protections (developer choice)
- ✅ Follow naming convention strictly
- ✅ Keep PRs focused on single concern

## Merge Strategy

### To `main`:
```bash
# Only via squash merge (clean history)
git merge --squash <branch>
git commit -m "<conventional commit message>"
```

### To `development`:
```bash
# Via rebase or merge commit
git merge --no-ff <branch>
```

### To `codex/*`:
```bash
# Via fast-forward or merge
git merge <branch>
```

## Pull Request Requirements

### All PRs must include:
- ✅ Clear, descriptive title following conventional commits
- ✅ Description of changes and rationale
- ✅ Link to related issue or milestone
- ✅ Test coverage documentation
- ✅ Breaking changes clearly marked
- ✅ Migration guide (if applicable)

### Conventional Commit Format:
```
<type>(<scope>): <subject>

<body>

Fixes #<issue-number>
Milestone: <milestone-number>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Version Control Standards

### Commit Message Quality
- ✅ First line: <= 50 characters
- ✅ Body: <= 72 characters per line
- ✅ Reference issues/PRs: `Fixes #123`, `Relates to #456`
- ✅ Include milestone: `Milestone: #14`
- ✅ Include session link for Claude sessions

### Merge Commits
- ✅ Always include: `--no-ff` flag
- ✅ Always add: descriptive message
- ✅ Always reference: related issue/PR

### Force Push Policy
- ❌ **NEVER** force push to `main` or `development`
- ⚠️ Only allowed on personal/feature branches with justification
- ⚠️ Requires team notification before `codex/*` force push

## Branch Lifecycle

### Feature Branch Lifecycle:
```
1. Create from: develop or feature-parent
2. Name: feat/feature-name
3. Work: small, focused commits
4. Create PR: when ready for review
5. Review: minimum 1 approval
6. Merge: squash or rebase
7. Delete: after merge (auto-delete on GitHub)
```

### Codex Workstream Lifecycle:
```
1. Create: intentionally long-lived
2. Documentation: clearly document parent branch
3. Reviews: daily syncs or weekly check-ins
4. Consolidation: feature branches → codex branch
5. Integration: codex → development
6. Release: development → main
```

## Enforcement Checklist

Before pushing to any protected branch, verify:

```bash
# 1. Branch is up to date
git pull origin <base-branch>

# 2. All tests pass
npm run test
npm run lint
npm run typecheck

# 3. Code builds successfully
npm run build

# 4. Commit messages are clear
git log --oneline -5

# 5. No uncommitted changes
git status

# 6. Correct branch target
git branch

# 7. Remote is accessible
git fetch origin
```

## Current Branch Status

| Branch | Status | Parent | Last Update |
|--------|--------|--------|-------------|
| `main` | 🔒 Protected | — | (unknown) |
| `development` | 🔒 Protected | `main` | (unknown) |
| `codex/create-gaming-skill-dev-kit-gui` | Active | `development` | 2026-04-21 |
| `feat/syncpulse-orchestration-gui` | Active | `codex/...` | 2026-04-21 |
| `claude/setup-claude-flow-gitignore-cbgTm` | ✅ Merged | (merged to codex) | 2026-04-21 |
| `claude/custom-syncpulse-interface-bps5Y` | 📦 Archived | — | (stale) |

## Future Improvements

### Automation:
- [ ] GitHub branch protection rules configuration as code
- [ ] Automated branch validation on PR
- [ ] Automatic branch cleanup after merge
- [ ] Semantic versioning enforcement
- [ ] CHANGELOG auto-generation

### Governance:
- [ ] Establish code owner requirements
- [ ] Define per-team branch responsibilities
- [ ] Create merge approval workflow
- [ ] Document branch review SLAs

### Documentation:
- [ ] Link branch to design docs/specs
- [ ] Track branch ROI/completion status
- [ ] Create release notes from commit messages
- [ ] Archive old branches with context

## Questions & Escalation

For branch hierarchy questions:
1. Check this document first
2. Review existing branches in `git branch -a`
3. Check milestone definitions in GitHub
4. Ask in #engineering or escalate to maintainers

---

**Last Updated:** 2026-04-21  
**Enforced By:** Git hooks + GitHub branch protection rules  
**Review Cycle:** Quarterly
