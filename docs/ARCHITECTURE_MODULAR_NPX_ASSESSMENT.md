# Modular NPX Architecture — Assessment (feature test branch)

Status: **Draft for evaluation** · Branch: `feature/test-modular-npx-architecture` · Baseline: `main` @ b902fbf (hotfix #332, `@h4shed/mcp-core` / `@h4shed/mcp-cli` 1.0.41)

## 1. Proposal

Skills, agents and tools live in separate repositories with independent versioning. Make the platform modular around three layers (MCP Core, CLI, SyncPulse) reached through NPX executables (today only `@h4shed/mcp-cli` declares a `bin`; Core and SyncPulse are libraries, so either they get their own bins, e.g. `h4shed-core` / `h4shed-syncpulse`, with smoke tests in Phase 1, or they stay libraries fronted by CLI subcommands such as `panel`/`syncpulse`; this is open decision 4), add a **management brain** and **learning engine** that improve routing over time, keep the default install extremely lightweight, load everything else on demand, and use a **swarm of micro-tasks by default**.

## 2. Measured baseline (published 1.0.41 tarballs, clean install)

Reproduce with pinned versions, never `latest`: `npm i @h4shed/mcp-core@1.0.41 @h4shed/mcp-cli@1.0.41 --ignore-scripts --no-audit --no-fund` in an empty directory (Node v22.22.0, npm as bundled, no lockfile; transitive ranges float, so commit the generated `package-lock.json` and re-measure from it for any later comparison). The benchmark script (test plan item 1) must record Node/npm versions and the lockfile hash with each result.

| Metric | Value |
| --- | --- |
| `npm i @h4shed/mcp-core @h4shed/mcp-cli` | 149 packages, ~71 MB `node_modules`, ~5.5 s |
| Core tarball / CLI tarball | 12 KB / 8 KB (dist only, after hotfix #332) |
| Core runtime deps | `@modelcontextprotocol/sdk` (~7.7 MB), `express` |
| CLI runtime deps | `boxen`, `chalk`, `figlet`, `gradient-string`, `inquirer`, `ora`, `yargs`… (UI weight) |
| Core source | ~1,080 lines, of which ~640 are two server entrypoints (`skill-repository-server`, `sync-coordinator-server`) that pull in `express` |
| Workspace | 8 workspace groups; 30 skills, 28 tools under `packages/` |

Observations that shape the design:

1. **Lazy loading already exists.** `SkillRegistry.loadSkill()` does a dynamic `import("@h4shed/skill-<name>")`. The "load as needed" principle is a policy/packaging change, not a rewrite.
2. **Core is not actually minimal.** The two HTTP servers (and `express`) ship in core even for stdio-only users. The CLI bundles interactive UI deps that `--help`/`add`/`remove` don't need.
3. **Single naming convention.** Registry only resolves `@h4shed/skill-*`; agents and tools have no equivalent loader contract.
4. **Hygiene debt that blocks modularity.** 52 compiled artifacts (`.js`, `.d.ts`, `.map`) are tracked under `packages/{core,cli}/src`, and the hotfix (#332) existed because tarball layout (`dist/packages/core/src/...`) leaked the monorepo structure. A split-repo model multiplies this class of bug.

## 2a. Current multi-repo state (inspected, read-only)

The split has already started, but the new repos are **catalogs**, not independent packages:

| Repo | What it actually contains | Observations |
| --- | --- | --- |
| `Fused-Gaming/skills` | `marketplace-registry.json`, docs, and a **copy of `mcp-core`** (`@h4shed/mcp-core` 1.0.40) | Core `src/*.ts` is byte-identical to `packages/core` here, but one patch behind (1.0.40 vs published 1.0.41). Registry declares `totalSkills: 30` but lists 53 entries; `VERSION.json` says 53 skills / 60 tools. Entries point at four different source repos (`Fused-Gaming-Skill-MCP`, `case-canon`, `syncpulse`, `underworld-writer`). |
| `Fused-Gaming/tools` | `marketplace-registry.json`, docs, `validate-tools.sh` | 36 registry entries vs "28 tools" in README vs 38 in `VERSION.json`. Entries point back at `Fused-Gaming-Skill-MCP` or `skills` as their source; the tool code does not live here. |
| `Fused-Gaming/agents` | ~100 agent prompt markdown files under `agent-prompts/` plus marketplace generator scripts | Agents are **prompt files, not npm packages**. Package name is `@fused-gaming/agents`, a different scope from `@h4shed/*` (see the scope warning in CLAUDE.md). |
| `Fused-Gaming/Fused-Gaming-Skill-MCP` | Core, CLI, SyncPulse, 30 skills, 28 tools (source of truth for code) | `registry/` here is a fourth, separate registry. |
| Independent npm repos | Not inventoried | Need wiring to both MCP and their skill/agent/tool counterparts. |

Consequences for the design:

1. **There are at least four registries** (`registry/` here, `skills`, `tools`, `agents/docs/reference`) with drifting counts. The brain cannot route reliably until there is one canonical, generated index.
2. **Core is duplicated.** Two copies of `mcp-core` will diverge (already one patch apart). The kernel must have exactly one home and be consumed from npm everywhere else.
3. **Catalog repos should be thin and generated.** They should hold manifests and docs only; each registry entry should resolve to a real package or file with a pinned version and integrity hash.
4. **Agents need a decision**: ship as `@h4shed/agent-*` npm packages with the same module manifest, or keep as prompt files referenced by a manifest entry (`kind: agent`, `entry: <path or package>`). Either way they get the same lazy-loading contract.
5. **Independent npm repos** should adopt the module manifest (`package.json#h4shed`) so they register into MCP and into the skills/tools/agents catalogs without bespoke wiring.

Revised recommendation: keep core/cli/syncpulse in `Fused-Gaming-Skill-MCP`; make `skills`, `tools`, `agents` pure generated catalogs fed by manifests; have every independent package publish a manifest and pass the shared contract tests; one script (`registry:build`) produces the canonical index from npm plus manifests (discovery: `GET /-/v1/search?text=@h4shed&size=250` paginated with `from=`, then confirm each package's `maintainers` field via its packument; note that `text=maintainer:h4shed` currently returns 0 results, whereas `author:h4shed` and the `@h4shed` scope query return 64 and 68, so the maintainer qualifier must not be relied on) and CI-fails on count/scope/version drift.

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
- Move `skill-repository-server` / `sync-coordinator-server` (and `express`) to optional packages: `@h4shed/mcp-server-repository`, `@h4shed/mcp-server-sync`. The extraction must also migrate every consumer of the old paths: root scripts `server:sync` / `server:skills` / `server:both`, and `Dockerfile.sync` / `Dockerfile.skills`, which import `packages/core/dist/servers/*.js` and build only the core workspace. Keep deprecation re-exports at the old paths for one minor and add a container-startup smoke test (build each image, start it, hit its health endpoint) to the phase exit criteria.
- Target: install < 15 MB and < 40 packages for `npx @h4shed/mcp-cli init`.

### 3.2 Module contract (new, one for all kinds)
`kind: skill | agent | tool`, `name`, `version`, `engines.mcp-core`, `capabilities[]`, `cost` (cold-start ms, size), `permissions[]` (network/fs/exec), `entry`. Declared in `package.json#h4shed` so the brain can plan **without importing** the module. Resolution order: workspace → local cache → npm (integrity-checked) → refuse.

### 3.3 CLI as launcher
- Split `@h4shed/mcp-cli` into a tiny launcher and an optional `@h4shed/mcp-cli-ui` (figlet/inquirer/gradient). `--help`, `add`, `list`, `remove` stay dependency-light. `@h4shed/mcp-cli-ui` must NOT be a `dependency` or `optionalDependency` (npm installs both by default), and an undeclared package cannot be dynamically imported. Define one explicit path: on first `panel` use the launcher prints the install command and, with consent, runs a project-local `npm i @h4shed/mcp-cli-ui@<pinned>` into the module cache, then imports it from there; otherwise it exits with the command to run. The install is always `npm i --ignore-scripts` (no `preinstall`/`install`/`postinstall` of the package or its dependencies), consistent with the "no lifecycle scripts" mitigation in the risk table. Spike B must measure the clean-install footprint (launcher only) and a first panel launch through this path.

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
| Discoverability | Single tree | Needs registry | Generate `registry/index.json` from paginated registry search (scope query) verified against each package's `maintainers`, plus manifest |
| Release hotfix risk | Layout leak (#332) | Same risk ×N | Enforce a shared `prepublishOnly` + `npm pack --dry-run` tarball check in a reusable workflow |

Decision: **hybrid** — kernel trio (core, cli, syncpulse) stays in this repo; skills, agents, tools are independent repos publishing against the module contract.

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| Supply chain: on-demand install of code at runtime | Allowlist `@h4shed/*`, verify maintainer + npm integrity, lockfile for module cache, no lifecycle scripts, explicit consent for network/exec. **Manifest permissions are declarations, not enforcement:** today `SkillRegistry.loadSkill` does an in-process `import()` (`packages/core/src/skill-registry.ts`), so a compromised module can use `fs`, `child_process` or the network on import regardless of its manifest. Enforcement requires isolation: run non-builtin modules in a separate process under an OS-level sandbox: a container (or equivalent) is required whenever network access is not granted, because Node's `--permission` model covers filesystem, child processes, workers and similar, but has no network permission, so it can only enforce the fs/exec part of a grant with the granted permissions as its policy, communicating over MCP/stdio. Until that exists, the architecture must not claim that permissions are gated; only first-party, reviewed modules may load in-process |
| Cold-start latency from lazy loading | Prefetch from learning engine; cache; measure p95 |
| Learning drift / feedback loops | Advisory-only, bounded, resettable, human-override logged and weighted highest |
| Swarm overhead on trivial tasks | Single-step inline bypass; budget caps |
| Version skew across repos | `ModuleRegistry` must itself check the module's declared `mcp-core` range against the running core version with semver and refuse to import on mismatch (npm's `engines` check only evaluates `node`/`npm`, so it does not do this); a negative contract test (module requiring an excluded core range is rejected, cached or fresh) is mandatory, plus contract tests in CI of every module repo |
| Existing consumers of `@h4shed/mcp` entry points | Keep deprecation shims for one minor |

## 6. Test plan for this branch (gates before any split)

1. **Footprint benchmark**: scripted clean install of the launcher and core; fail CI if > 15 MB / > 40 packages (baseline above: 71 MB / 149).
2. **Cold-start benchmark**: time to first tool list, with 0 / 1 / 5 modules lazily loaded (extend `benchmarks/`, which already records per-release results).
3. **Spike A — `ModuleRegistry`**: generalise `SkillRegistry` to `kind`, load one skill and one tool via manifest, with integrity check.
4. **Spike B — CLI split**: launcher without UI deps; `--help` must not import `figlet`/`inquirer`.
5. **Spike C — brain stage 1**: manifest-based router selecting modules for 5 canned tasks; compare to the existing routing matrix.
6. **Spike D — outcome log**: record outcomes; replay to show ranking changes without altering permissions.
7. **Isolation spike**: load one untrusted-style module in a container with no network and a read-only filesystem, plus a Node `--permission` child process for the fs/exec subset, and prove that `fs`/network/exec calls outside the grant fail (network denial must be demonstrated in the container, not in `--permission`); load the same module in-process to document the difference.
8. **Compatibility spike**: negative test that `ModuleRegistry` rejects a module whose `mcp-core` range excludes the running version.
9. **Container gate**: build and start both server images after extraction.
10. **Tarball gate**: `npm pack --dry-run` assertion that every published package exposes `dist/index.js` and no `packages/*/src` path (prevents a repeat of #332).

## 7. Suggested phasing

| Phase | Deliverable | Exit criterion |
| --- | --- | --- |
| 0 | Remove tracked build artifacts from `src/`; tarball gate in CI; delete the duplicate `mcp-core` in `skills`; registry drift check | CI green, 0 tracked `.d.ts`/`.js`/`.map` files in `packages/{core,cli}/src` (52 today: 13 + 13 + 26), one core, counts consistent |
| 1 | Kernel slimming + CLI launcher split | Footprint targets met |
| 2 | Module contract + `ModuleRegistry` | Skill and tool load via manifest |
| 3 | Brain stage 1 + swarm planner with inline bypass | Beats current routing on canned tasks |
| 4 | Outcome log + learning (advisory) | Measurable cold-start/selection gain, reset works |
| 5 | **Extract existing modules**: migrate the 30 skill and 28 tool implementations out of this monorepo into independent repos, publish each with a manifest, cut consumers (workspaces, `registry/`, Dockerfiles, docs) over to the published packages, then remove them from `packages/` | Each module builds, publishes and passes contract tests from its own repo; the monorepo builds with the modules removed |
| 6 | Convert `skills`/`tools`/`agents` to generated catalogs; onboard independent npm repos via manifest | Contract tests pass in each repo; one canonical index |

## 8. Open decisions

1. Agents as npm packages (`@h4shed/agent-*`) vs. prompt/config files loaded by the brain.
2. Where the outcome log lives (local file, SyncPulse state, or opt-in remote) and its privacy defaults.
3. Whether the launcher may auto-install modules or must prompt each time (recommended: prompt unless pre-approved per module in config).
4. Whether Core and SyncPulse ship their own NPX `bin`s or stay libraries behind CLI subcommands.
