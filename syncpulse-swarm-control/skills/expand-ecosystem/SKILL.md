---
name: expand-ecosystem
description: Discover, evaluate, and install verified @h4shed skills, tools, and agents from the live npm ecosystem and the Fused-Gaming-Skill-MCP registry into this project, so the plugin's tool/skill/agent set can grow without hand-editing config. Use when the operator asks to add a capability, when the capability-scout records a gap, or when asked to sync/update the installed ecosystem.
argument-hint: "[capability or task description, or 'sync']"
---

# Expand Ecosystem

Grow this plugin's installed capability set from the live, verified `@h4shed` ecosystem — never from a guessed or frozen package list.

This skill is the executable counterpart to `agents/capability-scout.md` and follows `references/capability-policy.md` and the four-step foundation order in `references/architecture.md`. It does not replace the coordinator; it is invoked by the coordinator or the capability-scout when a gap is confirmed.

## Step 1 — Discover, don't guess

Run the deterministic discovery tool. Never invent a package name.

```bash
node scripts/discover-ecosystem.mjs --out syncpulse-package-inventory.json
```

This queries `https://registry.npmjs.org/-/v1/search?text=maintainer:h4shed&size=250` and cross-references `Fused-Gaming/Fused-Gaming-Skill-MCP`'s `registry/REGISTRY.md`, then writes a normalized inventory with per-package `classification` (foundation/skill/tool/hub/cli/docs/session/other) and `compatibilityDecision`.

This step is read-only (P0 tier per `capability-policy.md`) and requires no gate.

## Step 1b — Sync the registries

```bash
node scripts/sync-registries.mjs
```

This upserts Step 1's discovery results into `registry/tools.registry.json` (refreshing known entries, appending new ones as `source: "discovered"`), regenerates `registry/agents.registry.json`'s `localAgents` from `agents/*.md`, records any newly discovered agent-like package under `discoveredAgentPackages`, and validates every `config/routing-table.json` rule against both registries — printing a warning for any agent or tool reference that doesn't resolve. Also P0/P1: it only ever writes the two registry files, never `package.json`, never an install.

## Step 2 — Foundation check

Before installing anything else, confirm the four foundation packages are present and installed **in this exact order**, each with its own gate — never combined into one install command:

1. `@h4shed/mcp-core`
2. `@h4shed/mcp-cli`
3. `@h4shed/skill-syncpulse`
4. `@h4shed/syncpulse-hub`

`inventory.foundationStatus` from Step 1 tells you which are discoverable. If a foundation package is not yet an explicit direct dependency in `package.json`, install it before touching anything else, even if it is already present transitively.

## Step 3 — Route the request

If the operator asked for a specific capability, map it through the routing matrix in the ecosystem bootstrap prompt (operator-request router / capability routing matrix — see `references/capability-policy.md` for the risk framing and the project's own `SyncPulse Ecosystem Bootstrap` prompt for the full table). Prefer:

- one primary skill for domain instructions/workflow,
- the smallest set of tool packages for execution,
- the non-deprecated, newest-stable package when two overlap.

If the operator said "sync" or "update the ecosystem," treat every `verifiedH4shed: true` package not yet declared as a direct dependency as a candidate, grouped in this order:

1. shared libraries required by already-selected packages
2. skills matched to outstanding operator intent
3. tool wrappers required by those skills
4. docs/design-system/session/specialized packages
5. everything else, only if the operator has explicitly requested a full sync

## Step 4 — Risk-tier the candidate

For each candidate, classify per `references/capability-policy.md`:

| Tier | What | Gate |
|---|---|---|
| P0 | docs, schemas, inventory metadata | auto-adopt |
| P1 | read-only skill/tool | sandbox, then auto-promote only if `config/policy.example.yaml` (or the project's copy) sets `p1_auto_promote: true` |
| P2 | repository-write-capable tool | coordinator approval |
| P3 | credentials, deployment, billing, self-expanding privileges | explicit human approval — always |

Never install a package whose registry metadata does not list `h4shed` as a maintainer, regardless of how closely the name matches. `compatibilityDecision: "review-unscoped-provenance"` in the inventory means stop and ask, not proceed.

## Step 5 — Install, register, smoke-test

Use the package manager already in use for this project (check for `pnpm-lock.yaml` / `yarn.lock` / `bun.lock(b)` / `package-lock.json`; default to npm only if none exists). Install compatible packages in small batches so a failure is attributable to one package. Then:

- confirm the package resolves (`require.resolve` / import check, or the package's documented smoke test),
- if it is a skill, confirm it is discoverable through `@h4shed/mcp-core`'s registry interface,
- if it is a CLI, run its `--help` (never an undocumented mutating command),
- record the installed version.

Do not use `--force` or `--legacy-peer-deps` as a first response to a conflict — diagnose first.

## Step 6 — Record and report

Update `syncpulse-package-inventory.json` (from Step 1) and summarize for the operator:

- what was discovered vs. what was installed vs. what was skipped, with reasons
- foundation status
- any P2/P3 items still awaiting a human decision gate
- how to re-run discovery later (`node scripts/discover-ecosystem.mjs`)

Never claim a package is "verified" on the strength of installation alone — verification requires the resolve/import/smoke-test step in Step 5.

## What this skill does not do

- It does not publish packages, deploy anything, or push commits.
- It does not write secrets or invent credentials.
- It does not install anything outside the `@h4shed` scope, or an unscoped package whose maintainer metadata doesn't confirm `h4shed`, without an explicit human decision gate.
