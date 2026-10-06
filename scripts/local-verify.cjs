#!/usr/bin/env node
/**
 * Local verification gate.
 * Mirrors .github/workflows/test.yml and validate-branch-skill-match.yml so a
 * change can be proven green locally while hosted Actions are unavailable
 * (billing/account block). See docs/LOCAL_VERIFICATION_POLICY.md.
 *
 * Usage:
 *   node scripts/local-verify.cjs                run the full gate on this Node
 *   node scripts/local-verify.cjs --skip-install | --only=build,lint   partial run (never exits 0)
 *   node scripts/local-verify.cjs --check-matrix  exit 0 only if Node 20 AND 22 evidence
 *                                                 exist, passed, for HEAD (hosted CI runs both)
 * Run on another Node with: npx -y -p node@20 node scripts/local-verify.cjs
 * A run exits 0 only if every step ran and passed, on a supported Node major,
 * with a clean tree before AND after the steps, against a current origin/main.
 * Evidence: .local-verification/<sha>-node<major>.json plus a PR-ready markdown table.
 */
const { spawnSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const skipInstall = args.includes("--skip-install");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice(7).split(",") : null;

const steps = [
  // Same order as test.yml: sync lockfile metadata, then frozen install.
  // A lockfile change shows up as a dirty tree below: commit it.
  { id: "lockfile-sync", cmd: "npm install --package-lock-only --ignore-scripts", skip: skipInstall },
  { id: "install", cmd: "npm ci", skip: skipInstall },
  { id: "build", cmd: "npm run build --if-present" },
  { id: "typecheck", cmd: "npm run typecheck --if-present" },
  { id: "lint", cmd: "npm run lint --if-present" },
  { id: "test", cmd: "npm test --if-present --workspaces" },
  { id: "registry", cmd: "node scripts/validate-registry-local.cjs" }, // mirrors validate-registry.yml
  { id: "branch-skill-match", cmd: "node scripts/validate-branch-skill-match.cjs" },
];

const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
const SUPPORTED_NODE = [20, 22]; // mirrors the .github/workflows/test.yml matrix
const sha = sh("git rev-parse HEAD");
const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
const evidenceFile = (major) => path.join(".local-verification", `${sha}-node${major}.json`);

// Applies to EVERY mode, including --check-matrix: this script itself is contributor-controlled for a PR under review.
// The checked-out head controls every command below (npm lifecycle hooks, build/lint/test scripts),
// so for untrusted PRs this must run in a disposable container/VM without host credentials.
const sensitive = Object.keys(process.env).filter((k) => /(^|_)(TOKEN|SECRET|PASSWORD|PASSWD|API_?KEY|PRIVATE_?KEY|CREDENTIALS?)($|_)/i.test(k) || k === "SSH_AUTH_SOCK");
if (process.env.LOCAL_VERIFY_SANDBOX !== "1") {
  console.error("Refusing to run: set LOCAL_VERIFY_SANDBOX=1 to confirm this is a disposable container/VM with no host credentials (see docs/LOCAL_VERIFICATION_POLICY.md).");
  process.exit(1);
}
if (sensitive.length) {
  console.error(`Refusing to run: credential-looking environment variables are set (${sensitive.join(", ")}). Unset them (env -u NAME ...) or use a clean sandbox.`);
  process.exit(1);
}
// Refresh origin/main (a failed refresh is fatal: never validate against a stale base) and return its SHA.
function refreshBase() {
  try {
    sh("git fetch --quiet origin +refs/heads/main:refs/remotes/origin/main"); // explicit destination: a bare `fetch origin main` may only update FETCH_HEAD
    const base = sh("git rev-parse --verify --quiet origin/main");
    sh("git merge-base origin/main HEAD");
    return base;
  } catch (e) {
    console.error("Could not refresh origin/main, or it shares no history with HEAD (needs a merge-base). Check network/auth, then `git fetch --unshallow origin main` or `git fetch --depth=1000 origin main`.");
    process.exit(1);
  }
}

if (args.includes("--check-matrix")) {
  const currentBase = refreshBase();
  let allOk = true;
  for (const major of SUPPORTED_NODE) {
    let status = "missing";
    try {
      const r = JSON.parse(fs.readFileSync(evidenceFile(major), "utf8"));
      status = r.passed && r.complete && r.platform === "linux" && !r.dirtyBefore && !r.dirtyAfter ? (r.base === currentBase ? "passed" : "stale-base") : "failed";
    } catch {}
    console.log(`Node ${major} @ ${sha.slice(0, 7)}: ${status}`);
    if (status !== "passed") allOk = false;
  }
  process.exit(allOk ? 0 : 1);
}

// Hosted CI runs on ubuntu-latest: path casing, shell scripts and native/optional dependencies differ elsewhere.
if (process.platform !== "linux") {
  console.error(`Unsupported platform ${process.platform}: run in a Linux container matching ubuntu-latest (see docs/LOCAL_VERIFICATION_POLICY.md).`);
  process.exit(1);
}
if (!SUPPORTED_NODE.includes(nodeMajor)) {
  console.error(`Unsupported Node ${process.version}; supported majors: ${SUPPORTED_NODE.join(", ")}.`);
  process.exit(1);
}

// Precondition: the branch validator diffs against origin/main and silently
// reports success when that ref is missing or stale, so make that fatal here.
const base = refreshBase();
const dirtyBefore = sh("git status --porcelain").length > 0;
if (dirtyBefore) {
  // Steps regenerate files (e.g. registry/) and reset them, so never start on a dirty tree.
  console.error("Refusing to run: working tree has uncommitted changes. Commit or stash them first (evidence only counts for a clean tree, and some steps rewrite tracked files).");
  process.exit(1);
}

const results = [];
for (const step of steps) {
  if (step.skip || (only && !only.includes(step.id))) {
    results.push({ id: step.id, status: "skipped", seconds: 0 });
    continue;
  }
  console.log(`\n▶ ${step.id}: ${step.cmd}`);
  const t0 = Date.now();
  const r = spawnSync(step.cmd, { shell: true, stdio: "inherit" });
  results.push({
    id: step.id,
    status: r.status === 0 ? "passed" : "failed",
    seconds: Math.round((Date.now() - t0) / 1000),
  });
}

const dirtyAfter = sh("git status --porcelain").length > 0; // steps may rewrite tracked files
const ran = results.filter((r) => r.status !== "skipped");
const complete = results.every((r) => r.status !== "skipped");
const ok = complete && ran.every((r) => r.status === "passed");
const dirty = dirtyBefore || dirtyAfter;
const report = {
  commit: sha,
  base, // origin/main SHA the branch validator compared against
  branch: sh("git rev-parse --abbrev-ref HEAD"),
  dirtyBefore,
  dirtyAfter,
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  os: (() => { try { return (fs.readFileSync("/etc/os-release", "utf8").match(/^PRETTY_NAME="?([^"\n]+)/m) || [])[1] || "unknown"; } catch { return "unknown"; } })(),
  generatedAt: new Date().toISOString(),
  complete,
  passed: ok,
  steps: results,
};

fs.mkdirSync(".local-verification", { recursive: true });
fs.writeFileSync(evidenceFile(nodeMajor), JSON.stringify(report, null, 2) + "\n");

const icon = { passed: "✅", failed: "❌", skipped: "⏭️" };
console.log("\n### Local verification (hosted CI unavailable)\n");
console.log(`Commit \`${sha.slice(0, 7)}\` · Node ${process.version} · working tree ${dirty ? `DIRTY (${dirtyBefore ? "before" : "after"} the steps; not valid evidence)` : "clean before and after"}\n`);
console.log("| Step | Result | Time |\n| --- | --- | --- |");
results.forEach((r) => console.log(`| ${r.id} | ${icon[r.status]} ${r.status} | ${r.seconds}s |`));
if (dirty) console.log("\n⚠️  Commit your changes (including a changed package-lock.json) and re-run: evidence only counts for a clean tree before and after.");
if (!report.complete) console.log("\n⚠️  Some steps were skipped: this run is partial evidence only.");
console.log(`\nMerge evidence also needs the other supported Node major: run with --check-matrix after both runs.`);
process.exit(ok && complete && !dirty ? 0 : 1);
