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
