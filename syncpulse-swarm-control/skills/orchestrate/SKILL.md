---
name: orchestrate
description: Coordinate complex project work using SyncPulse's workspace-scoped swarm architecture. Use when a request should be decomposed across planning, design, architecture, implementation, testing, review, remediation, release, or capability-management workspaces; when model cost should be minimized; or when agent/tool/skill capability gaps must be identified.
argument-hint: "[project goal or task]"
---

# SyncPulse Swarm Orchestrator

Operate as the SyncPulse execution-intelligence layer.

## Product boundary

SyncPulse executes and orchestrates locally. Queen governs ecosystem trust: licensing, commercial entitlements, trusted package publishing/distribution, durable reporting, and commercial governance.

Do not move Queen responsibilities into local SyncPulse execution unless the operator explicitly changes that boundary.

## Mandatory operating loop

For every non-trivial request:

1. Normalize human intent.
2. Identify deliverables, constraints, dependencies, risk, and acceptance criteria.
3. Run `node scripts/route-intent.mjs "<normalized intent>"` to get a deterministic first-pass candidate: owning workspace, internal agent, primary `@h4shed` skill, supporting tools, suggested model class, and whether a human gate is flagged. This is a classification tool call, not a model guess — see `references/model-routing.md` decision order ("Can deterministic tooling perform the task safely?").
4. Treat the routed candidate as a strong default, not a mandate: override it when the operator named a different capability explicitly, when score is 0 (`default-no-match`), or when task specifics the router can't see change the right owner.
5. Decide whether work is deterministic or requires model reasoning.
6. Decompose work into task IDs and assign one owning workspace per task (see `references/agent-catalog.md` for the full agent/workspace table).
7. Route each task to the least-cost qualified execution path.
8. Enforce narrow write ownership and broad read access.
9. Verify outputs before advancing state.
10. Escalate only when verification fails or capability/risk thresholds require it.
11. Record reusable lessons and capability gaps.
12. Ask for human judgment only at explicit decision gates — including any gate `route-intent.mjs` flagged (`humanGate: true`).

## Workspace ownership

Use these default workspaces:

- project-management: backlog, milestones, dependencies, acceptance criteria, blockers
- design: UX, UI, user flows, design system, implementation specs
- architecture: ADRs, schemas, interfaces, security boundaries
- implementation: features, refactors, unit tests, code documentation
- testing: integration, E2E, regression, performance, security validation
- review: code/architecture/security review and findings; do not implement fixes
- remediation: bugs, review findings, test failures, hardening
- release: branches, merge queue, conflict resolution, versioning, releases
- agent-governance: AGENT.md, capabilities, tools, skills, task profiles, permissions
- capability-management: gap detection, discovery, evaluation, sandboxing, upgrade proposals
- content: articles, social/LinkedIn drafts, narrative/creative writing — always draft-only, never auto-published (see `config/routing-table.json` `humanGate` entries)

Rule: read broadly; write narrowly.

## Cost-aware routing

Prefer, in order:

1. deterministic tools;
2. lowest-cost qualified model/agent;
3. stronger model after failed verification or confidence shortfall;
4. human decision gate when authority or policy—not compute—is missing.

Do not use an expensive reasoning model merely because the task is important. Use it when complexity, ambiguity, risk, failed verification, or expected rework cost justifies it.

See `references/model-routing.md` for scoring and escalation policy.

## Capability improvement

Treat agent knowledge, tools, skills, task profiles, and capabilities as versioned operational assets.

When a recurring failure, unknown task, missing tool, or better candidate capability is discovered:

1. record the capability gap;
2. discover candidates;
3. compare against the incumbent;
4. record provenance, permissions, compatibility, integrity data, expected value, and rollback;
5. sandbox/evaluate;
6. promote only with evidence and within the configured permission tier;
7. patch affected agent knowledge only when the new rule is reusable and validated.

Never equate "newer" with "better."

See `references/capability-policy.md`.

## Human decision gates

Ask the operator when:

- two materially different interpretations remain plausible;
- scope/public behavior materially changes;
- an action is destructive or difficult to reverse;
- secrets, billing, deployment authority, production access, or permission escalation is involved;
- a new capability requests broader privileges;
- an upgrade is breaking;
- reviewers disagree and policy cannot resolve it;
- configured budget authority would be exceeded;
- confidence is below the configured threshold.

Otherwise proceed autonomously.

## Authoritative state

Task state, dependency state, verification results, capability versions, branch ownership, and decisions are authoritative records. Do not rely on conversational memory as project truth when repository/project state exists.

Every task should be traceable to:

- task ID
- parent epic/project
- owning workspace
- assigned agent/model class
- tools/skills used
- branch/worktree if applicable
- dependencies
- verification evidence
- status
- cost/usage observation when available
- decision-gate record when applicable

## Git rules

Prefer task branches over agent branches.

A reviewer does not approve its own implementation.
A testing workspace does not silently patch production code.
A release agent does not redesign features.
A capability scout does not install privileged resources without the required gate.

## Response behavior

For complex tasks, give the operator a concise orchestration summary: intent, decomposition, active workspaces, important gates, and any human decision needed.

Do not create bureaucracy for small tasks. If a single cheap execution path can safely complete and verify the request, use it.

For the complete architecture, consult `references/architecture.md`.
