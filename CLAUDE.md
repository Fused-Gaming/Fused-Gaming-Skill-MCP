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

## Agent Notes (2026-04-16, PR #51 Merge Readiness)

### Orientation Updates
- PR #51 merge-readiness documentation was consolidated into `docs/process/PR_51_MERGE_CHECKLIST.md`.
- Version metadata was bumped to `1.0.1` to mark the daily-review merge-prep window.
- Roadmap now includes explicit milestone/issue buckets for planned tools/skills and release observability tasks.

### Environment Constraints Reconfirmed
- `gh` CLI is not available in this runtime.
- Git remotes/API credentials are not configured locally, so live PR comments/check-runs/deployment outcomes cannot be queried from terminal.

### Next Agent Priority Sequence
1. Verify PR #51 and related recent PR workflow/deployment states in GitHub UI.
2. If any checks fail, fix those errors first and rerun workflows before additional feature work.
3. Continue next-wave skill implementation (`mermaid-terminal`, `ux-journeymapper`, `svg-generator`) after CI/deployment stability is confirmed.
