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

10. Root documentation was reorganized into categorized folders under `docs/`; place new process docs in `docs/process/`, release records in `docs/releases/`, quickstarts in `docs/getting-started/`, and historical artifacts in `docs/archive/`.
