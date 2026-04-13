# CLAUDE Agent Handoff Notes

## Repo Orientation
- There is currently no dedicated `ROADMAP.md` file in the repository root; use `RELEASE_NOTES.md`, `SESSION_SUMMARY.md`, and open PR discussions for near-term planning context.
- Current project version is tracked in `VERSION.json`.
- Session-oriented PR structure guidance is in `SESSION_PR_TEMPLATE.md` and `OPEN_PR_INSTRUCTIONS.md`.

## Recent Stability Notes
- PR #16 (`feature/multi-account-session-tracking-skill` into `development`) had a code-quality finding for an unused variable in session aggregation logic.
- The unused variable `totalEnergy` in `packages/skills/multi-account-session-tracking-skill/src/tools/session-aggregation.ts` has been removed in this session.

## Execution Tips
- Run quality checks with:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- Lint currently reports `no-explicit-any` warnings in multi-account skill types, but no lint errors.

## Guardrails
- Never commit secrets or credentials.
- Keep changelog (`CHANGELOG.md`) updated for every merged fix.
