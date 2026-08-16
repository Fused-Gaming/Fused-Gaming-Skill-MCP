# SyncPulse Swarm Control — Claude Code Plugin

A Claude Code plugin implementation of the SyncPulse swarm control-plane architecture.

## What it does

The plugin gives Claude an operational framework for:

- intent normalization;
- project/task decomposition;
- workspace-scoped ownership;
- specialist agent routing;
- least-cost qualified model selection;
- deterministic-first execution;
- verification and escalation;
- agent/tool/skill capability gap detection;
- evidence-based capability procurement;
- human decision gates;
- task/branch/provenance discipline.

The product boundary is deliberate:

> **SyncPulse executes. Queen governs ecosystem trust.**

## Structure

```text
syncpulse-swarm-control/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .mcp.json
├── skills/
│   ├── orchestrate/
│   │   └── SKILL.md
│   └── expand-ecosystem/
│       └── SKILL.md
├── agents/
│   ├── coordinator.md
│   ├── project-manager.md
│   ├── designer.md
│   ├── architect.md
│   ├── developer.md
│   ├── tester.md
│   ├── reviewer.md
│   ├── remediator.md
│   ├── release-manager.md
│   └── capability-scout.md
├── scripts/
│   ├── discover-ecosystem.mjs
│   ├── sync-registries.mjs
│   ├── import-claude-flow-agents.mjs
│   ├── task-ledger.mjs
│   └── route-intent.mjs
├── registry/
│   ├── tools.registry.json
│   ├── agents.registry.json
│   └── claude-flow-agents.registry.json
├── state/
│   ├── .gitignore
│   ├── ledger.jsonl        (generated — event log)
│   └── epochs.json         (generated — epoch counters)
├── config/
│   ├── policy.example.yaml
│   └── routing-table.json
└── references/
    ├── architecture.md
    ├── hive-architecture-v2.md
    ├── model-routing.md
    ├── capability-policy.md
    ├── task-state.md
    ├── agent-catalog.md
    └── tool-catalog.md
```

## Local install/test

From the parent directory:

```bash
claude --plugin-dir ./syncpulse-swarm-control
```

Then invoke:

```text
/syncpulse-swarm-control:orchestrate Build this feature and coordinate design, implementation, testing, review, fixes, and merge readiness.
```

Claude may also invoke the skill automatically when its description matches the task.

Validate the package with:

```bash
claude plugin validate ./syncpulse-swarm-control
```

## One-command install (self-hosted marketplace)

This repo is its own marketplace via `.claude-plugin/marketplace.json`, so once it's pushed to a Git host:

```bash
claude plugin marketplace add Fused-Gaming/syncpulse-swarm-control
claude plugin install syncpulse-swarm-control@syncpulse-marketplace
```

## Expanding tools/skills/agents

Growth into the rest of the `@h4shed` ecosystem (the packages published from `Fused-Gaming/Fused-Gaming-Skill-MCP` — 61 packages total: 31 skills, 28 tools, 2 core, at last check) is handled by the **`expand-ecosystem`** skill, not by editing this repo's config by hand.

```bash
node scripts/discover-ecosystem.mjs
```

queries the live npm registry (`maintainer:h4shed`) plus the upstream `registry/REGISTRY.md`, writes `syncpulse-package-inventory.json`, and never installs anything by itself — it's the read-only (P0) input the `capability-scout` agent and `expand-ecosystem` skill use to route, risk-tier, and install new capabilities. Invoke it directly, or ask Claude to "add the tailwind styling skill" / "sync the h4shed ecosystem" and let the skill route it.

## Agents and Tools

- **`references/agent-catalog.md`** — every internal agent in `agents/`, with workspace, model, effort, and write scope. This is what `orchestrate` assigns work to.
- **`references/tool-catalog.md`** — every `@h4shed/tool-*` execution package this plugin knows how to route to, grouped by category (build/bundling, style/CSS, testing/QA, docs/components, CLI/automation, analysis/reporting), each mapped to a typical workspace and agent.

## Intent routing engine

`config/routing-table.json` + `scripts/route-intent.mjs` is the deterministic logic engine that assigns an agent, a primary `@h4shed` skill, and supporting `@h4shed` tools from free-text operator intent — no model call required for the classification step itself:

```bash
node scripts/route-intent.mjs "add a design system with tokens and theming"
# -> workspace: design, agent: designer, primary skill: @h4shed/skill-theme-factory
#    supporting tools: @h4shed/design-tokens, @h4shed/skill-style-dictionary-system, ...

node scripts/route-intent.mjs --json "run our playwright suite" | jq .matches[0]
```

Every rule in the table carries a `humanGate` flag (e.g. smart contracts, LinkedIn publishing, Vercel deploys) that the coordinator must respect. `skills/orchestrate/SKILL.md` calls this engine as step 3 of its mandatory operating loop, before deciding which agent/model to invoke — see `references/model-routing.md`'s decision order ("Can deterministic tooling perform the task safely?"). A request that doesn't match any rule falls through to `defaultRule` (ordinary repository tools, no forced package), never a guess.

## Registries (the part that stays current)

`config/routing-table.json` is *decision logic*. `registry/tools.registry.json` and `registry/agents.registry.json` are the *inventory* it decides over — and they're built to extend themselves as the ecosystem publishes new packages, rather than needing a hand edit every time:

```bash
node scripts/sync-registries.mjs
```

- **Tools registry** — upserts every `@h4shed/tool-*` (or verified unscoped) package found by live discovery. Known entries get `verifiedH4shed`/`description`/`latestKnownVersion` refreshed; unrecognized-but-verified new packages are appended as `source: "discovered"`, `category: "uncategorized"` for a human to file.
- **Agents registry** — `localAgents` is fully regenerated from `agents/*.md` frontmatter (add an agent file, it appears here automatically). `discoveredAgentPackages` picks up any verified package whose name/description signals agent/swarm/orchestration behavior, flagged `wiredToRoutingTable: false` until someone deliberately adds a routing rule for it — discovery never silently wires a new agent into production routing.
- **Validation** — every run cross-checks `config/routing-table.json` against both registries and prints a warning for any `agent` or `supportingTools` reference that doesn't resolve, so drift between the routing logic and what's actually installed/known gets caught immediately instead of failing silently at runtime.

Running this against the live ecosystem today picks up things like a verified-but-unscoped `blockchain-forensic-toolkit` package automatically — proof this extends past the `@h4shed/*` scope on its own when npm's maintainer metadata confirms it, without anyone updating this repo by hand.

## Imported: claude-flow agent-type catalog

```bash
node scripts/import-claude-flow-agents.mjs
```

`Fused-Gaming/Fused-Gaming-Skill-MCP`'s `.claude-flow/` directory is runtime state for [claude-flow v3](https://github.com/ruvnet/claude-flow), not hand-written agent files — the real catalog of ~55 named agent types (`byzantine-coordinator`, `sparc-coord`, `mobile-dev`, `production-validator`, and so on) lives in `.claude-flow/CAPABILITIES.md`. This command parses that file and writes `registry/claude-flow-agents.registry.json`. It's a catalog import (name + category), not a spec import — there's no system prompt behind any of these names until someone writes one. See `references/agent-catalog.md` § *Imported: claude-flow agent-type catalog* for the promotion path from catalog entry to a real, routable `agents/<name>.md`.

## Task ledger — leases, epochs, transactional transitions, event log

```bash
node scripts/task-ledger.mjs lease grant --task TASK-284 --agent developer --write "src/auth/**" --ttl 3600
node scripts/task-ledger.mjs transition --task TASK-284 --from active --to verification --evidence '{"tests":"pass"}'
node scripts/task-ledger.mjs challenge --task TASK-284 --agent reviewer --claim "violates ADR-017"
node scripts/task-ledger.mjs epoch bump architecture
node scripts/task-ledger.mjs project --task TASK-284
```

Working, tested implementation of four of the improvements in `references/hive-architecture-v2.md`: task leases (exclusive, versioned, expiring write scope — conflicting requests are denied, not queued silently), transactional transitions (a transition only commits if the proposed `from` state matches the task's actual current state, recomputed from the log — never trusted from an agent's say-so), project epochs (stale-work detection when architecture/design/API-contract assumptions change), and a causal event log (`state/ledger.jsonl`, append-only — current state is always a replay/projection of events, never a mutable row). See `references/hive-architecture-v2.md` for the full set of adopted improvements, including the ones that are documented architecture rather than running code yet.

## Model policy

Default execution classes:

- **Haiku:** economy/routine bounded work
- **Sonnet:** standard implementation/design/review
- **Opus:** coordinator escalation and difficult synthesis

These are policy defaults. The orchestrator should still prefer deterministic tools whenever they can perform the work safely and cheaply.

## MCP integration

`.mcp.json` at the plugin root wires the three verified `@h4shed` foundation packages that are themselves MCP servers:

- `@h4shed/mcp-core` — registry/loading behavior
- `@h4shed/skill-syncpulse` — coordination/task-state
- `@h4shed/syncpulse-hub` — ecosystem-wide discovery/orchestration

`@h4shed/mcp-cli` is a CLI (`fused-gaming-mcp`), not an MCP server, so it isn't listed there — invoke it via `npx --no-install fused-gaming-mcp --help`, never globally installed. Email workflows and hub mutations are disabled by default via env vars in `.mcp.json`; flip them on only with explicit operator authorization. Keep real secrets out of `.mcp.json` — use environment variables and `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths.

## Publishing

For a reusable team/community release:

1. commit this directory to a Git repository;
2. keep semantic versions in `.claude-plugin/plugin.json`;
3. validate before tagging;
4. optionally add the plugin to a Claude Code marketplace repository.

## First policy decisions to make

Before enabling broad automation, set:

- whether P1 read-only capabilities may auto-promote;
- model/provider privacy restrictions;
- project/task hard budget thresholds;
- whether validated agent-instruction patches may auto-merge;
- what telemetry SyncPulse may send to Queen;
- whether the coordinator is a single authority or a council with one state-transition authority.
