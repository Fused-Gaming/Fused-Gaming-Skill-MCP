# Local Verification Policy (temporary, while hosted CI is unavailable)

**Status:** active until GitHub Actions billing and the Vercel account are restored.
**Why:** hosted checks (`Test`, `CodeQL`, `Validate Branch-Skill Match`, Vercel) currently fail within seconds on every branch, including `main`, because of an account/billing block, not because of code.

## Rule

While this policy is active, a change is **merge-ready** when `npm run verify:local` exits 0 on a **clean working tree** at the PR's head commit, and its summary table is posted on the PR.

`verify:local` runs the same steps as CI, in the same order:

| Step | Command | Mirrors |
| --- | --- | --- |
| install | `npm ci` | `test.yml` |
| build | `npm run build --if-present` | `test.yml` |
| typecheck | `npm run typecheck --if-present` | `test.yml` |
| lint | `npm run lint --if-present` | `test.yml` |
| test | `npm test --if-present --workspaces` | `test.yml` |
| branch-skill-match | `node scripts/validate-branch-skill-match.cjs` | `validate-branch-skill-match.yml` |

## What counts as evidence
- Run on a clean tree at the exact head SHA (the script refuses to pass a dirty tree).
- All steps ran (no `--skip-install` / `--only`). A partial run is labelled partial and is not merge evidence.
- Paste the printed markdown table into the PR. The JSON copy is written to `.local-verification/<sha>.json` (git-ignored).
- Any push invalidates prior evidence: re-run.

## What this policy does NOT change
- Failing steps are never skipped, disabled or quarantined; a failed local step blocks merge exactly as a failed CI job would.
- Branch protection and workflow files are untouched. If "required status checks" block the merge button, a repo admin must bypass or temporarily unrequire them; that is a repo-settings decision, not something a PR can do.
- CodeQL and Vercel preview deploys are not replicated locally. Security-sensitive changes (auth, publishing, dependency changes) need a manual review note in the PR until CodeQL is back.
- Publishing to npm still requires its own explicit authorization.

## Exit criteria
Remove this policy once billing is paid and `Test` is green on `main`. Then re-run CI on any PR merged under this policy that touched code.
