# Changelog

## 0.5.0

- Added `references/hive-architecture-v2.md`: adopted a set of 20 architectural improvements from an internal review, marked per-item as **Implemented** (working code, tested) or **Specified** (documented, not yet running). Adopted thesis: make the coordination substrate more deterministic than the agents operating on it.
- Added `scripts/task-ledger.mjs`: working implementation of task leases (exclusive/versioned/expiring write scope, conflicting requests denied), transactional state transitions (commit only if proposed `from` matches actual current state), project epochs (stale-work detection with `epoch bump`/`epoch show`), and a causal, append-only event log (`state/ledger.jsonl`) with state-as-projection (`project`) and non-authoritative challenges (`challenge`). Full lifecycle smoke-tested: lease grant/conflict, valid/invalid transitions, challenge, epoch bump, projection.
- Extended `references/task-state.md` schema with `epochs_at_creation`, `lease`, `challenges`, and an intent/plan split (`intent_record` immutable vs. disposable plans).
- Extended `references/capability-policy.md`: capability shadow mode required before P2 promotion, explicit `can`/`cannot`/`unknown` capability declarations, and a four-layer observation → knowledge → heuristic → policy distinction for agent knowledge patches.
- Extended `config/policy.example.yaml` with `ledger`, `circuit_breaker` (thresholds only, not yet evaluated), and `speculative_execution` sections.
- Updated `agents/coordinator.md`: explicit multi-reasoner-advises/one-committer model, attention-budget routing (mechanical → economy → core), transaction-authority commits via `task-ledger.mjs`, and challenge-not-override handling.
- Added `registry/claude-flow-agents.registry.json` + `scripts/import-claude-flow-agents.mjs`: imports the ~55-entry claude-flow v3 agent-TYPE catalog surfaced in `Fused-Gaming/Fused-Gaming-Skill-MCP`'s `.claude-flow/CAPABILITIES.md` (that repo's `.claude-flow/` is claude-flow runtime state, not hand-written agent files — `agents/store.json` holds stale, timestamped instances from past sessions; the catalog lives in `CAPABILITIES.md`). Import is catalog-only (name + category) and explicitly non-authoritative until promoted — every entry starts `wiredToRoutingTable: false`.
- Added a `large-parallel-swarm` routing-table rule that surfaces the claude-flow catalog + promotion path instead of silently routing to an unbuilt agent (human-gated, since it's a capability request, not existing-capability use).
- Documented the promotion path from claude-flow catalog entry -> real `agents/<name>.md` in `references/agent-catalog.md`.
- Bumped plugin/marketplace version to 0.5.0.

## 0.4.0

- Added `registry/tools.registry.json`: extensible, hand-seeded-then-auto-upserted registry of `@h4shed/tool-*` packages (category, workspace, agent, verified status, latest known version, source).
- Added `registry/agents.registry.json`: `localAgents` regenerated in full from `agents/*.md` frontmatter, plus `discoveredAgentPackages` for verified npm packages that look agent/swarm/orchestration-related.
- Added `scripts/sync-registries.mjs`: the extensibility engine. Upserts live discovery into the tools registry (new verified packages appended as `source: "discovered"`, never overwriting hand-set `category`/`workspace`/`agent`), regenerates local agents from files, and validates `config/routing-table.json` against both registries, warning on any unresolved `agent` or `supportingTools` reference.
- Refactored `scripts/discover-ecosystem.mjs` to export a reusable `discoverPackages()` so the sync script (and any future consumer) shares one fetch/classify implementation instead of duplicating it.
- Verified against the live ecosystem: sync run picked up a previously-unlisted verified tool package automatically and correctly flagged 3 agent/orchestration-related packages for review — confirming the extension path works without a manual repo edit.
- Cross-agent validation caught and fixed a real gap: `remediator` had no routing-table rule pointing to it (unreachable) — added `remediate-defect`.
- `references/agent-catalog.md` and `references/tool-catalog.md` now point to the registries as the canonical, self-extending source; the markdown tables are curated views, not the source of truth.
- Bumped plugin/marketplace version to 0.4.0.

## 0.3.0

- Added `references/agent-catalog.md`: browsable table of all 10 internal agents (workspace, model, effort, write scope), tied explicitly to the routing engine.
- Added `references/tool-catalog.md`: `@h4shed/tool-*` packages grouped by category (build/bundling, style/CSS, testing/QA, docs/components, CLI/automation, analysis/reporting) with typical workspace/agent.
- Added `config/routing-table.json`: the routing data — 25 intent rules plus a default fallback, each carrying workspace, agent, primary skill, supporting tools, model class, and a `humanGate` flag.
- Added `scripts/route-intent.mjs`: deterministic keyword/word-set matching engine that assigns agent + skill + tools from free-text intent. No model call for the classification step; importable as a module or run as a CLI (`--json`, `--top N`).
- Wired the routing engine into `skills/orchestrate/SKILL.md`'s mandatory operating loop as step 3 (before agent/model selection).
- Added a `content` workspace (articles, LinkedIn drafts, narrative writing — always draft-only / human-gated) to the workspace list.
- Bumped plugin/marketplace version to 0.3.0.

## 0.2.0

- Added `.mcp.json` wiring `@h4shed/mcp-core`, `@h4shed/skill-syncpulse`, and `@h4shed/syncpulse-hub` as MCP servers (email/hub mutations off by default).
- Added `scripts/discover-ecosystem.mjs`: deterministic, read-only live discovery of the `@h4shed` npm ecosystem plus the `Fused-Gaming/Fused-Gaming-Skill-MCP` registry.
- Added `skills/expand-ecosystem/SKILL.md`: risk-tiered discovery -> route -> install workflow for growing the plugin's tool/skill/agent set from the verified ecosystem.
- Wired `capability-scout` to the discovery script instead of memory-recalled package names.
- Added `.claude-plugin/marketplace.json` for one-command self-hosted install (`claude plugin marketplace add` + `claude plugin install`).
- Bumped plugin metadata (author, homepage, keywords).

## 0.1.0

- Initial SyncPulse swarm-control Claude Code plugin.
- Added orchestration skill.
- Added specialist workspace agents.
- Added least-cost model routing policy.
- Added capability discovery/procurement policy.
- Added human decision gates.
- Added task-state contract and example policy.
- Preserved SyncPulse execution / Queen trust-plane boundary.
