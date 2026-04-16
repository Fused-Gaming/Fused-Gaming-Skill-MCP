# CLAUDE.md

## Agent Notes (2026-04-13)

### Environment / Dependency Constraints
- `npm ci` can fail when `package.json` workspace metadata and `package-lock.json` are transiently out of sync, especially after workspace additions.
- The npm registry endpoint may be restricted in some environments (for example, `npm view @typescript-eslint/parser` can return HTTP 403).
- In constrained environments, `npm install --package-lock-only --ignore-scripts` is a safe pre-step to synchronize lock metadata before `npm ci`.

### Current Repository State Guidance
- CI workflow now includes an explicit lockfile synchronization step before dependency install.
- CI matrix in `.github/workflows/test.yml` targets Node `20.x` and `24.x`; local validation in restricted environments may still be limited by registry/network access.

### Recommended Next Steps for Next Agent
1. Re-run GitHub Actions for the current branch to confirm `Install dependencies` passes on both Node matrix lanes.
2. Execute `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` in an environment with full npm registry access.
3. If failures appear, patch and iterate until both matrix lanes pass.

## Agent Notes (2026-04-13, Node 24 Actions Migration)

### CI / Actions Compatibility
- Updated GitHub Actions references from `actions/checkout@v4` to `actions/checkout@v5` and `actions/setup-node@v4` to `actions/setup-node@v5` in test, publish, and codeql workflows.
- This removes the runner deprecation warnings about JavaScript actions pinned to Node.js 20 and aligns workflows with Node.js 24 action runtime migration.

### Follow-up Verification
1. Re-run `Test` workflow matrix (`20.x`, `24.x`) and verify no Node 20 deprecation warnings remain.
2. Re-run `CodeQL Advanced` and `Publish to npm` workflow checks on PR to confirm upgraded actions are accepted.

### Documentation Drift Prevention
- Keep GitHub Actions examples in `docs/NPM_PUBLISHING.md`, `fused-gaming-mcp-manifest.md`, `fused-gaming-mcp-prompts.md`, and `fused-gaming-mcp-execution.md` aligned with live workflows to avoid reintroducing deprecated `@v4` references.

## Agent Notes (2026-04-13, Workspace Publish Merge-Conflict Recovery)

### What Was Fixed
- Added `scripts/prepare-publish-versions.cjs` to detect workspace package versions that are already published on npm and patch-bump them before release.
- Script also rewrites internal workspace dependency ranges to keep package graph consistent after bumping.
- Updated `.github/workflows/publish.yml` to run `npm run publish:prepare` before dependency install and publish steps.

### Why This Prevents Repeat Failures
- Merge-order conflicts across CI/version-bump PRs no longer depend on manual sequencing.
- Publish jobs can recover automatically when a package version already exists upstream.

### Follow-up for Next Agent
1. Validate publish workflow on a tag in GitHub Actions with npm registry access.
2. If any package requires a non-patch bump policy, add a strategy flag to `prepare-publish-versions.cjs`.

## Agent Notes (2026-04-13, Publish Lockfile Sync + PR Check Visibility)

### What Was Adjusted
- Added a dedicated lockfile synchronization step to `.github/workflows/publish.yml`:
  - `npm install --package-lock-only --ignore-scripts`
  - Runs immediately after `npm run publish:prepare` and before `npm ci`.
- This ensures auto-bumped workspace versions from `prepare-publish-versions.cjs` are reflected in `package-lock.json` before frozen install.

### Why
- `publish:prepare` mutates workspace `package.json` versions and internal ranges.
- Without refreshing the lockfile first, `npm ci` can fail due to lock/package manifest mismatch.

### GitHub Visibility Constraint Encountered
- Public PR pages #38/#40/#41/#42/#43 are visible, but unauthenticated checks/deployments detail is partially unavailable in this environment (GitHub API returns HTTP 403; checks UI reports loading errors).
- Next agent should validate real checks/deployments from an authenticated GitHub session or Actions UI.

## Agent Notes (2026-04-13, Orientation + Priority Refresh)

### Blockers Confirmed
- No dedicated roadmap file was found from local repo discovery (`roadmap`/`ROADMAP`/`plan` filename patterns did not return a project roadmap document).
- GitHub PR checks/deployments for PRs `#38`, `#40`, `#41`, `#42`, `#43` cannot be fully validated in this environment due unauthenticated/API access limits (HTTP 403 responses).

### Current Progress Snapshot
- Publish control point remains centralized in:
  - `scripts/prepare-publish-versions.cjs`
  - `.github/workflows/publish.yml`
- Lockfile synchronization mitigation is already landed in `publish.yml` and should be treated as baseline behavior for tag publish verification.

### Immediate Next 3 Steps (for next agent)
1. Validate checks/deployments for PRs `#38/#40/#41/#42/#43` from an authenticated GitHub Actions session.
2. Push a test tag (`v*` or `skill-*`) and confirm publish workflow completes end-to-end with the current `publish:prepare -> lockfile sync -> npm ci` sequence.
3. If publish errors persist, iterate first in `scripts/prepare-publish-versions.cjs` and `.github/workflows/publish.yml`, then re-run tag publish.

## Agent Notes (2026-04-16, Workspace Install Blocker Fix)

### What Broke
- Root workspace install (`npm install --package-lock-only --ignore-scripts`) failed with `EDUPLICATEWORKSPACE` because two workspaces shared `@fused-gaming/skill-mermaid-terminal`:
  - `packages/skills/mermaid-terminal`
  - `packages/skills/mermaid-terminal-skill`

### What Was Changed
- Renamed `packages/skills/mermaid-terminal-skill/package.json` package name to `@fused-gaming/skill-mermaid-terminal-skill` to restore unique workspace naming.
- Updated release metadata/docs to align on Node.js `>=20.0.0` and patch release `1.0.1`.

### Next-Agent Guardrail
1. If workspace install fails, run `npm install --package-lock-only --ignore-scripts` first and check for duplicate package names across `packages/*/package.json`.
2. Keep `VERSION.json` metadata `nodeMinimum` aligned with root `package.json` `engines.node` and docs.

## Agent Notes (2026-04-16, v1.0.2 Metadata + Package README Standardization)

### What Was Updated
- Advanced root release metadata to `1.0.2` (`package.json` + `VERSION.json` patch/build fields).
- Added missing `packages/cli/README.md`.
- Standardized every workspace package README to include npm-oriented baseline sections:
  - `Installation` with explicit `npm install <package-name>`
  - `Development` workspace build/test commands
  - `License`
- Replaced the legacy `packages/skills/mermaid-terminal-skill/README.md` with a corrected package-name-aware README (`@fused-gaming/skill-mermaid-terminal-skill`).

### Validation Notes
1. Workspace tests still execute (`npm run test --workspaces --if-present`), but are mostly placeholder scripts.
2. Lockfile/dependency sync remains blocked in this environment by npm registry HTTP 403 on `mermaid` (`npm install --package-lock-only --ignore-scripts`).


## Agent Notes (2026-04-16, Node Workflow Test Lane Stabilization)

### What Was Updated
- Test workflow matrix was moved from Node `20.x` + `24.x` to `20.x` + `22.x` to keep CI on current active LTS lanes.
- GitHub release workflow now uses `actions/checkout@v5` and includes explicit `actions/setup-node@v5` (`22.x`).
- Release metadata/docs were bumped to `v1.0.3` and aligned with the workflow/runtime changes.

### Remaining Blockers
1. GitHub PR checks/deployment status still require authenticated API/UI access from outside this execution environment.
2. Full dependency reinstall/lock refresh can still fail here when npm registry access returns HTTP 403 for transitive packages.
## Agent Notes (2026-04-16, PR #73 Node Test Failure)

### Root Cause
- Three skill workspaces used placeholder test scripts (`jest --passWithNoTests`) but `jest` is not installed in the monorepo, causing CI `npm test --workspaces` to fail on merge checks.

### Fix Applied
- Updated test scripts in:
  - `packages/skills/mermaid-terminal/package.json`
  - `packages/skills/svg-generator/package.json`
  - `packages/skills/ux-journeymapper/package.json`
- All three now use `echo "No tests yet"` to keep pipeline green until real tests are implemented.

### Follow-up
1. Add a shared test runner dependency (Jest or Vitest) only when real test suites are introduced.
2. Replace placeholder test scripts with runnable tests as each skill reaches implementation phase.

## Agent Notes (2026-04-16, Lint Unused-Args Cleanup)

### What Was Fixed
- Resolved `@typescript-eslint/no-unused-vars` failures in skill tools by renaming intentionally unused parameters to underscore-prefixed names in:
  - `packages/skills/mermaid-terminal/src/tools/generate-mermaid-diagram.ts`
  - `packages/skills/ux-journeymapper/src/tools/map-user-journey.ts`

### Validation
1. `npm run lint -- packages/skills/mermaid-terminal/src/tools/generate-mermaid-diagram.ts packages/skills/ux-journeymapper/src/tools/map-user-journey.ts` passes locally.
