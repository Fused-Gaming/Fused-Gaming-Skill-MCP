# GitHub MCP Agents Orientation (feat/github-agents)

_Date: 2026-04-17_

## Deliverables and Success Metrics

1. Create and use feature branch `feat/github-agents` for GitHub MCP agent rollout planning.
2. Produce an execution-oriented status snapshot that includes blockers, current steps, and immediate next 3 steps.
3. Inventory recent PR context and clearly separate confirmed facts from environment blockers.
4. Define top-3 prioritized items and assign actionable agent directives for implementation continuity.

## Blockers

1. GitHub CLI and authenticated API access are unavailable in this runtime, so live PR comments/check-runs/deployment outcomes cannot be verified directly.
2. No deployment-capable runtime credentials are available for performing actual remote deployments from this environment.
3. Several queued skills remain scaffold-level; agent deployment depends on implementation/test readiness by workspace owners.

## Current Steps

1. Keep roadmap/version/changelog documentation synchronized with active CI and release strategy.
2. Validate Node LTS CI lanes (`20.x`, `22.x`) and keep workflow docs aligned with runtime truth.
3. Complete production logic + tests for queued skills before publication.
4. Maintain explicit handoff notes in `CLAUDE.md` to reduce repeated triage work between agent sessions.

## Immediate Next 3 Steps

1. Verify recent PR checks/deployments from an authenticated GitHub session and log outcomes in this document.
2. Implement and test one queued skill end-to-end (`mermaid-terminal` recommended first), then run full workspace validation.
3. Add a lightweight status artifact (JSON/Markdown) generated in CI that captures PR readiness signals for agent ingestion.

## Vercel Project Configuration Recommendation

- `skills.vln.gg`: keep as a dedicated API project using framework preset `Other`, root directory `.` and existing `vercel.json` routing to `api/index.ts`.
- `sync.vln.gg`: create a separate app project (recommended `Next.js`) rooted at `apps/sync` to isolate frontend deployments from skills API releases.
- Full setup guide: `docs/process/VERCEL_PROJECT_SETUP.md`.

## Recent Pull Requests (Local Git History View)

> Source: `git log --oneline --decorate -n 25` in this repository.

- `#92` Development
- `#80` `fix(ci): resolve PR #73 width typecheck failure`
- `#78` `fix(publish): bump only changed workspaces`
- `#77` `fix(lint): rename unused tool params with underscore prefix`
- `#76` `fix(ci): remove missing jest test placeholders for PR #73`
- `#75` Feature/mermaid terminal skill
- `#73` Merge pull request from `development`
- `#72`, `#71`, `#69`, `#68`, `#67`, `#52`, `#51`, `#44`, `#43`, `#32`, `#30`, `#20`, `#14`

### PR Status / Test & Deployment Notes

- **Known from repository context**: multiple PRs targeted CI/publish/test stability.
- **Not directly verifiable here**: per-PR check-run status, deployment environments, and comment threads (blocked by missing authenticated GitHub access).
- **Required follow-up**: confirm test/deploy conclusions in GitHub Actions UI and sync any failures back into this plan.

## Open-Issue Check and Resolution Plan

### Open issues requiring attention now

1. Missing authenticated check/deployment visibility (high priority).
2. Incomplete implementation/testing for queued skills (high priority).
3. Lack of standardized, machine-readable readiness summary for agent orchestration (medium priority).

### Execution Plan

1. **Visibility unblock**: run authenticated `gh pr list`/`gh pr view` and capture checks/deploy outcomes.
2. **Stabilize first failing item**: if any PR shows failed checks/deploy, fix that failure before starting new feature work.
3. **Agent-enable rollout**: once green, proceed with prioritized agent directives below.

## Top 3 Prioritized Items

1. **CI/Deployment Signal Visibility** — unblock authenticated inspection and create a durable status log.
2. **Queued Skill Production Readiness** — deliver at least one queued skill with tests and lint/typecheck/build pass.
3. **Agent-Oriented Execution Protocol** — enforce repeatable directives + handoff structure for multi-agent continuity.

## Agent Directives (Deployment-Oriented)

### Agent A: CI Visibility Agent
- Authenticate GitHub tooling.
- Export PR check/deployment summaries for recent PRs and active branch PR.
- Stop and escalate if any required checks are red.

### Agent B: Skill Stabilization Agent
- Pick highest-impact queued skill.
- Implement core tool flow + tests.
- Run `npm run lint`, `npm run typecheck`, `npm run build`, and workspace tests.

### Agent C: Documentation & Handoff Agent
- Update `CHANGELOG.md`, `docs/ROADMAP.md`, and `CLAUDE.md` after each stabilized merge.
- Maintain concise session handoff entries: blocker, action taken, next concrete command.

## Handoff Notes for Next Agent

- Branch in use: `feat/github-agents`.
- This session established planning and prioritization artifacts; no remote PR/deployment statuses could be verified due to environment authentication limits.
- Start next session by pulling authenticated PR check/deployment data and resolving any red checks before new feature additions.
