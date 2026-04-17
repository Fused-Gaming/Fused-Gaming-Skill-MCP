# Roadmap & Release Orientation (April 2026)

## Current Published Packages (npm)

The active public npm scope is currently `@h4shed` (not an npm org scope).

### Published now
1. `@h4shed/mcp-cli`
2. `@h4shed/mcp-core`
3. `@h4shed/skill-algorithmic-art`
4. `@h4shed/skill-ascii-mockup`
5. `@h4shed/skill-canvas-design`
6. `@h4shed/skill-frontend-design`
7. `@h4shed/skill-mcp-builder`
8. `@h4shed/skill-pre-deploy-validator`
9. `@h4shed/skill-skill-creator`
10. `@h4shed/skill-theme-factory`
11. `@h4shed/skill-underworld-writer`

---

## Skill Status Updates

### Published
- `@h4shed/skill-underworld-writer` (confirmed published)

### Scaffolded in repository (queued for publish)
- `@h4shed/skill-mermaid-terminal`
- `@h4shed/skill-ux-journeymapper`
- `@h4shed/skill-svg-generator`
- `@h4shed/skill-project-manager`
- `@h4shed/skill-project-status-tool`
- `@h4shed/skill-daily-review`
- `@h4shed/multi-account-session-tracking`
- `@h4shed/skill-linkedin-master-journalist`

---

## Planned Skill Backlog

### A
- Accessibility Audit
- API Contract Generator
- Architecture Decision Record (ADR) Writer

### B
- Backend Refactorer
- Bug Reproduction Planner

### C
- Codebase Analyzer
- Component Generator
- Context Builder
- Core Web Vitals Optimizer

### D
- Data Model Designer
- Debugging Strategist
- Dependency Auditor

### E
- Error Log Analyzer

### F
- Feature Planner
- Frontend Performance Optimizer

### G
- Git Diff Summarizer
- GitHub PR Reviewer

### I
- Integration Tester Generator
- Infrastructure Generator (Terraform)

### L
- Logging Strategy Designer

### M
- Meeting Notes Summarizer
- Microservice Boundary Identifier

### O
- Observability Setup Guide

### P
- Performance Profiler
- Planning with Files
- PRD Generator

### Q
- Query Optimizer

### R
- Refactor Planner
- Repository Scraper

### S
- Security Analyzer
- SEO Optimizer
- Skill Generator
- State Management Advisor

### T
- Test Generator
- Task Breakdown Engine
- Tech Debt Analyzer

### U
- UI/UX Critic

### V
- Validation Rule Generator

### W
- Web Quality Auditor
- Workflow Automator

---

## Blockers

1. GitHub CLI/API visibility is required to inspect live PR comments/check-runs from this environment.
2. Newly scaffolded skills still need full tool logic, tests, and release tags before npm publication.
3. Planned backlog is not yet mapped into implementation-ready milestones (owners, dates, dependencies).

## PR #51 Merge Readiness (Daily Review + Follow-on Skills)

### Deliverables and success metrics
1. **Documentation sync complete**: README, roadmap, changelog, and release planning docs are aligned.
2. **Versioning complete**: repository metadata bumped for merge-review traceability.
3. **Execution clarity**: blockers/current steps/next-three-steps are explicitly documented for handoff.
4. **Milestone + issue mapping**: planned tools/skills are grouped into trackable delivery streams.

### Recent PR status notes (environment constraints)
- Local git history confirms related merged PRs (`#44`, `#46`, `#45`, `#42`, `#39`) touching CI, docs, and scaffolding.
- Live comments/check-runs/deployment states for PR #51 and recent PRs **cannot be queried in this runtime** because GitHub CLI (`gh`) and remote/API credentials are unavailable.
- Action required: confirm check suites and deployment conclusions in GitHub UI before merging PR #51.

## Current Steps

1. Keep release-facing docs synchronized with actual `@h4shed` package publication.
2. Finalize PR #51 merge-readiness docs/version/changelog updates.
3. Complete implementation for newly scaffolded skills.
4. Keep release workflow docs synchronized with CI workflows.

## Immediate Next 3 Steps

1. Verify PR #51 checks/deployments in GitHub UI and resolve any failing workflows before merge.
2. Implement production logic + tests for `mermaid-terminal`, `ux-journeymapper`, `svg-generator`.
3. Add CI validation to ensure docs package names stay aligned with published scope metadata.

---


## Session Orientation Update (2026-04-17)

### Recent PRs (local branch context)
- `#90` `codex/fix-deployment-failures` merged into `work`.
- `#88` `claude/fix-yargs-dependencies-WfwLJ` merged into `work`.
- `#87` `claude/fix-yargs-dependencies-dnDMm` merged into `work`.

> Runtime limitation: GitHub CLI/API credentials are unavailable in this environment, so live PR comments, check-runs, and deployment outcomes must be verified in the GitHub web UI.

### Blockers and Current Steps
1. **Blocker:** cannot fetch live PR comments/check statuses from local terminal.
   - **Current step:** use local git history + documentation snapshots for triage, then hand off UI verification tasks.
2. **Blocker:** recently scaffolded skills still had stubbed logic.
   - **Current step:** implement highest-priority skill behavior (started with `ux-journeymapper`).
3. **Blocker:** no automated tests for newly scaffolded skills.
   - **Current step:** build/typecheck targeted packages and queue follow-on tests in next iteration.

### Immediate Next 3 Steps (execution order)
1. Verify PR #90/#88/#87 checks and deployments in GitHub UI; fix any failing workflow/deploy jobs first.
2. Add tests for `ux-journeymapper` and complete remaining scaffolded skills (`mermaid-terminal`, `svg-generator`).
3. Add CI guardrail that rejects scaffold-only tool handlers in publishable skill packages.

### Top 3 Priorities and Agent Directives
1. **Deployment Health Agent** — confirm failing checks/deployments and patch CI/deploy scripts until green.
2. **Skill Implementation Agent** — complete production-grade tool logic for queued skills and publish readiness.
3. **Release Hygiene Agent** — keep version/changelog/README/roadmap synchronized and generate handoff artifacts each session.

## Milestones and Issue Buckets (Planned Tools + Skills)

### Milestone M1 — PR #51 Daily Review Merge Stabilization (target: immediate)
- **Issue A:** Validate and document PR #51 check-run and deployment outcomes.
- **Issue B:** Keep changelog/version/docs synchronized in same merge window.
- **Issue C:** Capture blocker/handoff notes for next agent to avoid duplicate triage.

### Milestone M2 — Next-Wave Skill Completion (target: next release cycle)
- **Issue A:** `skill-mermaid-terminal` implementation + tests.
- **Issue B:** `skill-ux-journeymapper` implementation + tests.
- **Issue C:** `skill-svg-generator` implementation + tests.
- **Issue D:** `skill-project-manager` and `skill-project-status-tool` MVP command sets.

### Milestone M3 — Planned Tooling and Release Observability (target: subsequent cycle)
- **Issue A:** Unified PR release checklist with test/deploy evidence links.
- **Issue B:** CI guardrails to detect docs/package/version drift.
- **Issue C:** Automation for milestone issue template generation from roadmap backlog.

---

## Recent PR Context (Local-Git View)

- `#32` `fix(ci): prevent npm scope-not-found publish failures`
- `#30` `ci: publish npm packages on main pushes`
- `#14` merge for underworld writer feature delivery

CI/deployment status for these PRs must be verified in GitHub UI/API.
