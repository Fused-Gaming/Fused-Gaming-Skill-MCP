# CLAUDE Agent Handoff Notes

## Repo Orientation
- There is currently no dedicated `ROADMAP.md` file in the repository root; use `RELEASE_NOTES.md`, `SESSION_SUMMARY.md`, and open PR discussions for near-term planning context.
- Current project version is tracked in `VERSION.json`.
- Session-oriented PR structure guidance is in `SESSION_PR_TEMPLATE.md` and `OPEN_PR_INSTRUCTIONS.md`.

## Recent Stability Notes
- PR #16 (`feature/multi-account-session-tracking-skill` into `development`) had a code-quality finding for an unused variable in session aggregation logic.
- The unused variable `totalEnergy` in `packages/skills/multi-account-session-tracking-skill/src/tools/session-aggregation.ts` has been removed in this session.

## Execution Tips
- CI `npm ci` can fail with EUSAGE if a new workspace package is added but root `package-lock.json` is not regenerated. Run `npm install` at repo root and commit the lockfile update.
- CI now enforces lockfile freshness in `test.yml` and `publish.yml` via `npm install --package-lock-only --ignore-scripts && git diff --exit-code package-lock.json`; dependency-only edits must include lockfile changes in the same commit.
- Run quality checks with:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- Keep `VERSION.json` runtime requirements aligned with `package.json` engines (currently Node >=20).
- GitHub Actions Node runtime migration is active: prefer `actions/checkout@v5` and `actions/setup-node@v5` to avoid Node 20 deprecation warnings and upcoming forced Node 24 execution behavior.
- For transition-period stability, keep `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` set in workflow `env` so action-runtime regressions surface before Node 24 becomes mandatory.

## Environment Constraints
- GitHub REST API and anonymous PR listing can return `403 Forbidden` in this execution environment; when that happens, rely on local files (`SESSION_SUMMARY.md`, `OPEN_PR_INSTRUCTIONS.md`, git history) for orientation and explicitly call out the API-access blocker.

## Guardrails
- Never commit secrets or credentials.
- Keep changelog (`CHANGELOG.md`) updated for every merged fix.
