# Modular NPX Architecture — Assessment (feature test branch)

Status: **Draft for evaluation** · Branch: `feature/test-modular-npx-architecture` · Baseline: `main` @ b902fbf (hotfix #332, `@h4shed/mcp-core` / `@h4shed/mcp-cli` 1.0.41)

## 1. Proposal

Skills, agents and tools live in separate repositories with independent versioning. Make the platform modular around three NPX-executable layers (MCP Core, CLI, SyncPulse), add a **management brain** and **learning engine** that improve routing over time, keep the default install extremely lightweight, load everything else on demand, and use a **swarm of micro-tasks by default**.

## 2. Measured baseline (published 1.0.41 tarballs, clean install)

| Metric | Value |
| --- | --- |
| `npm i @h4shed/mcp-core @h4shed/mcp-cli` | 149 packages, ~71 MB `node_modules`, ~5.5 s |
| Core tarball / CLI tarball | 12 KB / 8 KB (dist only, after hotfix #332) |
| Core runtime deps | `@modelcontextprotocol/sdk` (~7.7 MB), `express` |
| CLI runtime deps | `boxen`, `chalk`, `figlet`, `gradient-string`, `inquirer`, `ora`, `yargs`… (UI weight) |
| Core source | ~1,080 lines, of which ~640 are two server entrypoints (`skill-repository-server`, `sync-coordinator-server`) that pull in `express` |
| Workspace | 8 workspace groups; 30 skills, 29 tools under `packages/` |

Observations that shape the design:

1. **Lazy loading already exists.** `SkillRegistry.loadSkill()` does a dynamic `import("@h4shed/skill-<name>")`. The "load as needed" principle is a policy/packaging change, not a rewrite.
2. **Core is not actually minimal.** The two HTTP servers (and `express`) ship in core even for stdio-only users. The CLI bundles interactive UI deps that `--help`/`add`/`remove` don't need.
3. **Single naming convention.** Registry only resolves `@h4shed/skill-*`; agents and tools have no equivalent loader contract.
4. **Hygiene debt that blocks modularity.** 52 compiled artifacts (`.js`, `.d.ts`, `.map`) are tracked under `packages/{core,cli}/src`, and the hotfix (#332) existed because tarball layout (`dist/packages/core/src/...`) leaked the monorepo structure. A split-repo model multiplies this class of bug.

## 3. Target architecture

```
npx @h4shed/mcp-cli  ──►  thin launcher (no UI deps, <1 MB)
                              │ resolves manifest, verifies integrity, spawns/loads
                              ▼
        @h4shed/mcp-core  (kernel: registry + transport + capability manifest only)
                              │  loadModule(kind, name, versionRange)
        ┌─────────────────────┼──────────────────────┐
   skill-*  packages     agent-*  packages      tool-*  packages
        └─────────────────────┼──────────────────────┘
                              ▼
        SyncPulse (state + swarm bus)  ◄──►  Brain (router/policy)  ◄──►  Learning engine
```

### 3.1 Kernel (mcp-core)
- Only: transport, `ModuleRegistry` (generalised from `SkillRegistry`), capability manifest schema, lifecycle hooks.
- Move `skill-repository-server` / `sync-coordinator-server` (and `express`) to optional packages: `@h4shed/mcp-server-repository`, `@h4shed/mcp-server-sync`.
- Target: install < 15 MB and < 40 packages for `npx @h4shed/mcp-cli init`.

### 3.2 Module contract (new, one for all kinds)
`kind: skill | agent | tool`, `name`, `version`, `engines.mcp-core`, `capabilities[]`, `cost` (cold-start ms, size), `permissions[]` (network/fs/exec), `entry`. Declared in `package.json#h4shed` so the brain can plan **without importing** the module. Resolution order: workspace → local cache → npm (integrity-checked) → refuse.

### 3.3 CLI as launcher
- Split `@h4shed/mcp-cli` into a tiny launcher and an optional `@h4shed/mcp-cli-ui` (figlet/inquirer/gradient). `--help`, `add`, `list`, `remove` stay dependency-light; the panel is loaded on first use.

### 3.4 Brain (management)
- Stage 1 (deterministic): capability-match router over module manifests; chooses minimal module set per task, emits an install/load plan, enforces budgets and permission gates. This extends the existing router/`syncpulse-swarm-control` coordinator rather than replacing it.
- Stage 2 (adaptive): ranks candidate modules/topologies using outcome history.

### 3.5 Learning engine
- Append-only **outcome log** in SyncPulse state: task type, modules loaded, topology, duration, tokens, pass/fail, human override.
- Learns only **routing/selection** (which modules, which topology, preloading/prefetch) — never rewrites module code or permissions.
- Safety: learned preferences are advisory, bounded by the manifest permissions and the brain's policy; every change is explainable and resettable (`syncpulse learn --reset`).

### 3.6 Swarm-by-default micro-tasks
- Default execution unit = micro-task (single module, single capability, bounded budget, idempotent) dispatched on the SyncPulse bus. Topology chosen from dependency shape (parallel fan-out, pipeline, hierarchical).
- Guard: if a task decomposes to one step, run it inline — no swarm overhead. Swarm is the default *planner*, not a mandatory runtime.

## 4. Repo-split assessment

| Concern | Monorepo (today) | Split repos | Recommendation |
| --- | --- | --- | --- |
| Independent versioning | `publish:prepare` auto-bump script, collisions/merge-order bugs (see CLAUDE.md notes) | Native per repo | Split **skills/tools/agents**; keep core+cli+syncpulse together |
| Cross-cutting change | One PR | N coordinated PRs, version skew | Keep kernel in one repo with a contract-test suite published as `@h4shed/module-contract-tests` |
| CI cost / blast radius | One slow matrix | Small, fast | Win for split |
| Discoverability | Single tree | Needs registry | Generate `registry/index.json` from npm search (`maintainer:h4shed`) + manifest |
| Release hotfix risk | Layout leak (#332) | Same risk ×N | Enforce a shared `prepublishOnly` + `npm pack --dry-run` tarball check in a reusable workflow |

Decision: **hybrid** — kernel trio (core, cli, syncpulse) stays in this repo; skills, agents, tools are independent repos publishing against the module contract.

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| Supply chain: on-demand install of code at runtime | Allowlist `@h4shed/*`, verify maintainer + npm integrity, lockfile for module cache, no lifecycle scripts, permission manifest, explicit consent for network/exec |
| Cold-start latency from lazy loading | Prefetch from learning engine; cache; measure p95 |
| Learning drift / feedback loops | Advisory-only, bounded, resettable, human-override logged and weighted highest |
| Swarm overhead on trivial tasks | Single-step inline bypass; budget caps |
| Version skew across repos | `engines.mcp-core` range + contract tests in CI of every module repo |
| Existing consumers of `@h4shed/mcp` entry points | Keep deprecation shims for one minor |

## 6. Test plan for this branch (gates before any split)

1. **Footprint benchmark**: scripted clean install of the launcher and core; fail CI if > 15 MB / > 40 packages (baseline above: 71 MB / 149).
2. **Cold-start benchmark**: time to first tool list, with 0 / 1 / 5 modules lazily loaded (extend `benchmarks/`, which already records per-release results).
3. **Spike A — `ModuleRegistry`**: generalise `SkillRegistry` to `kind`, load one skill and one tool via manifest, with integrity check.
4. **Spike B — CLI split**: launcher without UI deps; `--help` must not import `figlet`/`inquirer`.
5. **Spike C — brain stage 1**: manifest-based router selecting modules for 5 canned tasks; compare to the existing routing matrix.
6. **Spike D — outcome log**: record outcomes; replay to show ranking changes without altering permissions.
7. **Tarball gate**: `npm pack --dry-run` assertion that every published package exposes `dist/index.js` and no `packages/*/src` path (prevents a repeat of #332).

## 7. Suggested phasing

| Phase | Deliverable | Exit criterion |
| --- | --- | --- |
| 0 | Remove tracked build artifacts from `src/`; tarball gate in CI | CI green, 0 tracked `.d.ts/.js` in `src` |
| 1 | Kernel slimming + CLI launcher split | Footprint targets met |
| 2 | Module contract + `ModuleRegistry` | Skill and tool load via manifest |
| 3 | Brain stage 1 + swarm planner with inline bypass | Beats current routing on canned tasks |
| 4 | Outcome log + learning (advisory) | Measurable cold-start/selection gain, reset works |
| 5 | Repo split for skills/tools/agents | Contract tests pass in each repo |

## 8. Open decisions

1. Agents as npm packages (`@h4shed/agent-*`) vs. prompt/config files loaded by the brain.
2. Where the outcome log lives (local file, SyncPulse state, or opt-in remote) and its privacy defaults.
3. Whether the launcher may auto-install modules or must prompt each time (recommended: prompt unless pre-approved per module in config).
