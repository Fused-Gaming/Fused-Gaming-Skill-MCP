# CLAUDE.md

## Agent Notes (2026-04-13)

### Environment / Dependency Constraints
- `npm ci` currently hangs in this environment while attempting to fetch packages and can leave partial/empty package directories under `node_modules`.
- The npm registry endpoint is restricted in this environment (for example, `npm view @typescript-eslint/parser` returns HTTP 403).
- Because of this, use `npm install --package-lock-only --ignore-scripts` when the immediate task is lockfile synchronization.

### Current Repository State Guidance
- `package-lock.json` needed regeneration to include workspace `@fused-gaming/skill-daily-review` at `packages/skills/daily-review-skill`.
- CI matrix in `.github/workflows/test.yml` targets Node `20.x` and `24.x`; local validation in this environment may be blocked without a successful dependency install.

### Recommended Next Steps for Next Agent
1. Run full dependency install in an environment with npm registry access.
2. Execute `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` under Node 20 and Node 24.
3. If any failures appear, patch and iterate until both matrix lanes pass.
