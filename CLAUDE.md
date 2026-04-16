# CLAUDE Agent Notes

## Publishing gotcha
- `npm publish --workspaces --access public` can fail with `E404 Scope not found` when the configured package scope does not exist for the npm token owner.
- CI workflow now runs `scripts/prepare-publish-scope.js` before publish.
- Preferred configuration: set GitHub Actions variable `NPM_SCOPE` (without `@`) for org publishing.
- Fallback behavior: if `NPM_SCOPE` is unset, workflow uses `npm whoami` scope.

## Next-agent checklist
1. Validate that `NPM_SCOPE` is configured in repository variables for official releases.
2. For forks, leave `NPM_SCOPE` unset to use token-owner scope automatically.
3. Keep CHANGELOG and publishing docs updated whenever release automation changes.
4. GitHub Release creation is now handled by `.github/workflows/github-release.yml` (tag-triggered + manual); `publish.yml` no longer creates releases directly.
5. If PR triage is requested, prefer `gh pr list` when available; if `gh` is missing in environment, document that as a blocker and fall back to local git history.
6. Public npm publication currently uses `@h4shed/*`; keep release-facing docs aligned with that scope until org scope changes.
7. Skill inventory, missing skills, and backlog planning are tracked in `docs/ROADMAP.md`; update it whenever release priorities change.
8. New skill scaffolds now exist under `packages/skills/` for mermaid-terminal, ux-journeymapper, svg-generator, project-manager, project-status-tool, daily-review, multi-account-session-tracking, and linkedin-master-journalist.
9. If `npm ci` fails with missing workspace packages after merges, run `npm install` at repo root to regenerate `package-lock.json`, then re-run `npm ci` to verify lockfile sync.
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
