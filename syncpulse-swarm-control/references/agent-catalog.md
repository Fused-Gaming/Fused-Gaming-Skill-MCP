# Agent Catalog

This is the browsable index of every internal SyncPulse agent shipped in `agents/`. Each agent is a persistent, versioned operational identity (see `architecture.md` §8) — a workspace, a permission scope, and a model policy, not a specific model call.

`scripts/route-intent.mjs` assigns one of these agents to a task from free-text intent using `config/routing-table.json`. This table is the single source of truth for which agent owns which kind of request; edit the table, not this document, to change routing — this file is generated context for humans and for the coordinator, not the routing data itself.

**Canonical extensible source:** `registry/agents.registry.json`. Its `localAgents` section is regenerated in full from `agents/*.md` frontmatter every time `node scripts/sync-registries.mjs` runs — add or edit an agent file, not the registry, to change a local agent. Its `discoveredAgentPackages` section is upserted from live npm discovery: any verified `@h4shed` package whose name or description mentions "agent", "swarm", or "orchestrat*" is recorded there automatically, flagged `wiredToRoutingTable: false`, so nothing gets silently auto-wired — a human or the coordinator still has to promote it into `config/routing-table.json`.

| Agent | File | Workspace | Model | Effort | Write access | Owns |
|---|---|---|---|---|---|---|
| coordinator | `agents/coordinator.md` | agent-governance (cross-cutting) | opus | high | task state only | Intent normalization, decomposition, routing, budgets, gates |
| project-manager | `agents/project-manager.md` | project-management | haiku | medium | none (`disallowedTools: Write, Edit`) | Backlog, milestones, dependencies, acceptance criteria, blockers |
| designer | `agents/designer.md` | design | sonnet | medium | design artifacts | UX/UI flows, design systems, implementation-ready specs |
| architect | `agents/architect.md` | architecture | sonnet | high | ADRs, schemas | Interfaces, security boundaries, cross-component decisions |
| developer | `agents/developer.md` | implementation | sonnet | medium | src, tests (worktree-isolated) | Feature implementation, refactors, unit tests, migrations |
| tester | `agents/tester.md` | testing | haiku | medium | none (`disallowedTools: Write, Edit`) | Integration/E2E/regression/perf/security validation evidence |
| reviewer | `agents/reviewer.md` | review | sonnet | high | none (`disallowedTools: Write, Edit`) | Independent code/architecture/security/quality review findings |
| remediator | `agents/remediator.md` | remediation | sonnet | medium | src, tests (worktree-isolated) | Targeted fixes for verified defects |
| release-manager | `agents/release-manager.md` | release | haiku | medium | branch/merge state | Merge readiness, versioning, release-state transitions |
| capability-scout | `agents/capability-scout.md` | capability-management | haiku | medium | none (`disallowedTools: Write, Edit`) | Capability-gap detection, candidate evaluation, risk tiering |

## Read broadly, write narrowly

Per `architecture.md` §7, every agent above may read across workspaces but writes only within its own. The scoutand review-type agents (`project-manager`, `tester`, `reviewer`, `capability-scout`) are explicitly `disallowedTools: Write, Edit` — they produce findings and evidence, never patches. This is enforced at the agent-definition level, not just documented: a reviewer that tries to implement its own fix is a policy violation, not a style choice.

## Adding a new agent

1. Add `agents/<name>.md` with frontmatter (`name`, `description`, `model`, `effort`, `maxTurns`, and `disallowedTools`/`isolation` if applicable).
2. Run `node scripts/sync-registries.mjs` — the new agent appears in `registry/agents.registry.json`'s `localAgents` automatically; no manual registry edit needed.
3. Add a row to this table.
4. Add or extend a rule in `config/routing-table.json` with `"agent": "<name>"` so `route-intent.mjs` can actually assign it. `sync-registries.mjs` validates this on every run and warns if any rule references an agent it can't find.
5. Confirm `node scripts/route-intent.mjs "<sample intent>"` resolves to the new agent before considering it wired.

An agent file with no routing-table entry is unreachable — the coordinator has no deterministic way to find it and would have to guess, which `references/model-routing.md` explicitly discourages. `sync-registries.mjs`'s validation pass exists specifically to catch this before it becomes a silent gap.

## Imported: claude-flow agent-type catalog

`Fused-Gaming/Fused-Gaming-Skill-MCP`'s `.claude-flow/` directory is runtime state for [claude-flow v3](https://github.com/ruvnet/claude-flow) (`agents/store.json` holds timestamped instances from past swarm sessions — stale by design, not reusable). The actual catalog of ~55 named agent *types* lives in `.claude-flow/CAPABILITIES.md`.

`registry/claude-flow-agents.registry.json` imports that catalog via `node scripts/import-claude-flow-agents.mjs`, grouped into 10 categories (Core Development, Consensus & Distributed, SPARC Methodology, GitHub & Repository, and so on).

**This is a catalog, not a set of agent specs.** Each entry is a name and a category — there is no system prompt to run, no permission scope, no model policy. Every entry starts `wiredToRoutingTable: false` and stays that way until someone deliberately promotes it:

1. Write a real `agents/<name>.md` with actual frontmatter and instructions — using `.claude-flow/CAPABILITIES.md`'s one-line description and the claude-flow upstream docs as a starting point, not a substitute for actually defining the agent's scope, model, and restrictions.
2. Run `node scripts/sync-registries.mjs` so it appears in `agents.registry.json`'s `localAgents`.
3. Add it to this table and to `config/routing-table.json`.
4. Set `promotedAgentFile` on the corresponding entry in `registry/claude-flow-agents.registry.json` and flip `wiredToRoutingTable: true`.

Never route a live task to a bare catalog name (e.g. `"agent": "byzantine-coordinator"` with no `agents/byzantine-coordinator.md`) — that's exactly the unreachable-agent trap described above, compounded by not even having a behavior spec behind the name.
