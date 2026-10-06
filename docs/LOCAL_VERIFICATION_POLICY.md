# Local Verification Policy (temporary, while hosted CI is unavailable)

**Status:** active until GitHub Actions billing and the Vercel account are restored.
**Why:** hosted checks (`Test`, `CodeQL`, `Validate Branch-Skill Match`, Vercel) currently fail within seconds on every branch, including `main`, because of an account/billing block, not because of code.

## Rule

While this policy is active, a change is **merge-ready** when `npm run verify:local` exits 0 on a **clean working tree** at the PR's head commit on **both Node 20 and Node 22** (the hosted matrix), `node scripts/local-verify.cjs --check-matrix` exits 0, and the summary tables are posted on the PR. Run the second Node with `npx -y -p node@20 node scripts/local-verify.cjs`. Other Node majors are rejected.

`verify:local` runs the same steps as CI, in the same order:

| Step | Command | Mirrors |
| --- | --- | --- |
| lockfile-sync | `npm install --package-lock-only --ignore-scripts` | `test.yml` |
| install | `npm ci` | `test.yml` |
| build | `npm run build --if-present` | `test.yml` |
| typecheck | `npm run typecheck --if-present` | `test.yml` |
| lint | `npm run lint --if-present` | `test.yml` |
| test | `npm test --if-present --workspaces` | `test.yml` |
| registry | `node scripts/validate-registry-local.cjs` | `validate-registry.yml` (regenerates the skill registry, validates structure/consistency/completeness, fails if committed `registry/` is stale) |
| branch-skill-match | `node scripts/validate-branch-skill-match.cjs` | `validate-branch-skill-match.yml` |

## Where to run it (security)
`verify:local` executes code from the checked-out head: `npm ci` runs dependency lifecycle hooks and `build`/`lint`/`test` scripts can be replaced in `package.json`. Never run it for an untrusted PR on a workstation with credentials. Use a disposable **Linux container matching the hosted runner** (an Ubuntu image equivalent to `ubuntu-latest`; macOS, Windows or other VMs are not equivalent) with no host credentials, no SSH agent and no secrets, then set `LOCAL_VERIFY_SANDBOX=1`. The script refuses to run on a non-Linux platform, and records platform, arch and OS in each report; `--check-matrix` requires both reports to be from Linux. The script refuses to run without that acknowledgement, and also refuses if credential-looking environment variables (`*TOKEN*`, `*SECRET*`, `SSH_AUTH_SOCK`, ...) are present. Trusted maintainers' own branches carry the same risk from compromised dependencies, so the rule applies to them too.

## What counts as evidence
- Run on a clean tree at the exact head SHA; cleanliness is checked before and after the steps, so a build or test that rewrites tracked files (or a changed `package-lock.json`) fails the run.
- `origin/main` is refreshed on every run (a failed fetch fails the run) and must share a merge-base with HEAD (fetch deeper if needed); otherwise the run fails, because the branch validator would see no changed files and pass.
- All steps ran. `--skip-install` / `--only` runs always exit non-zero and are labelled partial.
- Paste the printed markdown table into the PR. The JSON copy is written to `.local-verification/<sha>-node<major>.json` (git-ignored).
- Any push invalidates prior evidence: re-run.

## What this policy does NOT change
- Failing steps are never skipped, disabled or quarantined; a failed local step blocks merge exactly as a failed CI job would.
- Branch protection and workflow files are untouched. If "required status checks" block the merge button, a repo admin must bypass or temporarily unrequire them; that is a repo-settings decision, not something a PR can do.
- CodeQL and Vercel preview deploys are not replicated locally. Security-sensitive changes (auth, publishing, dependency changes) need a manual review note in the PR until a real CodeQL analysis is back. Note that `.github/workflows/codeql.yml` currently only runs `echo "CodeQL check passed"`: it never initializes CodeQL or analyzes anything, so a green `CodeQL` check does not mean a scan ran.
- Publishing to npm still requires its own explicit authorization.

## Exit criteria
Remove this policy only when **every** hosted check it replaces has run green on `main`: `Test` on Node 20 and 22, `Validate Branch-Skill Match`, `Registry Validation` (`validate-registry.yml`; trigger it with `workflow_dispatch` if no path-filtered run exists), the Vercel status, and a **real CodeQL analysis** (a workflow that runs `github/codeql-action` init and analyze and uploads results, not the current echo placeholder, which would turn green without scanning anything). If only some are restored, narrow this policy to the ones that are still blocked instead of removing it. Then re-run CI on any PR merged under this policy that touched code.
