# CLAUDE.md

## Agent Notes (2026-04-17, Vercel TypeScript ambient types failure fix)

### Root Cause
- `packages/skills/daily-review-skill/tsconfig.json` and `packages/skills/underworld-writer-skill/tsconfig.json` were standalone and did not inherit root compiler settings (`types: ["node"]`).
- During monorepo workspace builds, TypeScript attempted to include ambient `@types/*` entries from transitive dependencies, producing TS2688 missing-type-library errors in CI/Vercel.

### What Was Changed
- Updated `packages/skills/daily-review-skill/tsconfig.json` and `packages/skills/underworld-writer-skill/tsconfig.json` to extend `../../../tsconfig.json` and keep only package-local `rootDir`/`outDir` overrides.
- This aligns the package with the other workspace tsconfig patterns and constrains default ambient type loading.

### Next Agent Checks
1. Re-run Vercel deployment for the branch and confirm build no longer fails with TS2688 type-definition lookup errors.
2. Keep new package tsconfigs aligned with the workspace-extends pattern to prevent ambient type drift regressions.

## Agent Notes (2026-04-16, Vercel install failure fix)

### Root Cause
- Root `prepare` script invoked `npm run build` across all workspaces during `npm install`.
- In production installs (such as Vercel), workspace package dependencies were not guaranteed to be present when that hook ran, causing TypeScript module resolution failures in `packages/cli`.

### What Was Changed
- Replaced root `prepare` build hook with a no-op message in `package.json`.
- This prevents installation-time build failures; explicit CI/build steps should continue to call `npm run build`.

### Next Agent Checks
1. Confirm Vercel/CI install stage succeeds with the new prepare behavior.
2. Verify the explicit build stage still runs and passes in environments that install all workspace dependencies.

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

## Agent Notes (2026-04-16, v1.0.3 Lockfile + Issue Specification Sync)

### What Was Updated
- Executed `npm install --package-lock-only --ignore-scripts` successfully to ensure lock metadata aligns with workspace manifests.
- Expanded `docs/ROADMAP.md` milestone issue buckets to include issue-by-issue specification criteria.
- Converted PR #51 checklist document into explicit checklist format and added required evidence fields.
- Bumped repository metadata from `1.0.2` to `1.0.3` (`package.json`, `VERSION.json`, README badge, changelog/release notes).

### Remaining Constraints
1. `npm ci` can remain long-running/stalled in this runtime due proxy/network behavior, so dependency-install completion should be revalidated in unrestricted CI or local network.
2. GitHub PR comments/check-runs/deployment details are still not directly queryable here without authenticated remote access.

### Next-Agent Follow-up
1. Re-run `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build` in a network-stable environment and attach logs to the active PR.
2. Verify PR #51 and latest branch-related PR checks/deployments directly in GitHub UI, then update checklist evidence entries.

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

## Agent Notes (2026-04-16, Changed-Only Publish Version Bumps)

### What Was Updated
- `scripts/prepare-publish-versions.cjs` now computes changed files from git diff (`VERSION_BUMP_BASE_REF` or `GITHUB_EVENT_BEFORE` fallback) and only evaluates changed workspace packages for npm-version collisions.
- `scripts/auto-bump-publish-versions.js` now limits auto-bump targets to changed workspace packages and avoids global/root version increments when unchanged packages exist.

### Why
- Previous behavior could patch-bump packages that had no source changes, creating unnecessary version churn and avoidable metadata drift.

### Next-Agent Validation
1. In CI, verify `GITHUB_EVENT_BEFORE` is present for push events so changed-package detection is accurate.
2. For manual runs, set `VERSION_BUMP_BASE_REF=<sha>` when comparing against a non-default baseline.

## Agent Notes (2026-04-16, PR #73 Typecheck Regression + Versioning Standard)

### What Was Fixed
- Resolved TypeScript workflow failure in `packages/skills/svg-generator/src/tools/generate-svg-asset.ts` by defining the missing `width` constant in `generateButton(...)`.
- This unblocks CI jobs that execute TypeScript compilation during dependency/install lifecycle.

### Versioning Standard Update
- `docs/NPM_PUBLISHING.md` now includes a **Validated Update Standards** sequence requiring `typecheck`, `lint`, `build`, workspace tests, and `publish:prepare` before any version bump or release tagging.

### Next-Agent Reminder
1. If workflow annotations show `Cannot find name 'width'`, verify the `generateButton` template variables in `generate-svg-asset.ts` first.
2. Keep version/changelog updates coupled to a successful full validation pass (do not bump before checks are green).

## Agent Notes (2026-04-17, CLI Child-Branch Build Dependency Resolution)

### Root Cause Pattern
- Child branches that include richer CLI UI command modules can fail TypeScript compilation with `TS2307` when optional CLI UI libraries are imported but not declared in `packages/cli/package.json`.
- Missing modules observed in failures: `ora`, `chalk`, `gradient-string`, `figlet`, `inquirer`, `boxen`, plus type package gaps for `figlet`/`inquirer`.

### Fix Applied
- Added the missing CLI runtime dependencies and associated type packages to `packages/cli/package.json`.

### Next Agent Priority Sequence
1. Verify PR #51 and related recent PR workflow/deployment states in GitHub UI.
2. If any checks fail, fix those errors first and rerun workflows before additional feature work.
3. Continue next-wave skill implementation (`mermaid-terminal`, `ux-journeymapper`, `svg-generator`) after CI/deployment stability is confirmed.

## Agent Notes (2026-04-16, Deployment Build Resolution)

### What Changed
- Promoted CLI runtime dependencies (`boxen`, `chalk`, `figlet`, `gradient-string`, `inquirer`, `ora`, `yargs`) to the root `package.json` `dependencies` block so monorepo root installs include modules needed by `packages/cli` TypeScript builds in deployment runtimes.

### Why
- Deployment logs showed `TS2307` module-resolution failures during workspace builds for `packages/cli` when these modules were not present at the root install boundary.

### Next Agent Check
1. In CI/Vercel with full registry access, run a clean install and `npm run build` to confirm CLI module-resolution errors are resolved.
2. If remaining failures are type-only, verify whether the install mode omits dev dependencies and adjust compile pipeline accordingly.
### Next-Agent Guardrail
1. If CLI build fails with `TS2307` module errors, verify dependency declarations in `packages/cli/package.json` before debugging TypeScript config.
2. In restricted environments, lockfile refresh may fail with npm `403`; validate dependency graph in CI with registry access.
