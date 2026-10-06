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
  { id: "branch-skill-match", cmd: "node scripts/validate-branch-skill-match.cjs" },
];

const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
const SUPPORTED_NODE = [20, 22]; // mirrors the .github/workflows/test.yml matrix
const sha = sh("git rev-parse HEAD");
const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
const evidenceFile = (major) => path.join(".local-verification", `${sha}-node${major}.json`);

if (args.includes("--check-matrix")) {
  let allOk = true;
  for (const major of SUPPORTED_NODE) {
    let status = "missing";
    try {
      const r = JSON.parse(fs.readFileSync(evidenceFile(major), "utf8"));
      status = r.passed && r.complete && !r.dirtyBefore && !r.dirtyAfter ? "passed" : "failed";
    } catch {}
    console.log(`Node ${major} @ ${sha.slice(0, 7)}: ${status}`);
    if (status !== "passed") allOk = false;
  }
  process.exit(allOk ? 0 : 1);
}

if (!SUPPORTED_NODE.includes(nodeMajor)) {
  console.error(`Unsupported Node ${process.version}; supported majors: ${SUPPORTED_NODE.join(", ")}.`);
  process.exit(1);
}

// Preconditions: the branch validator diffs against origin/main and silently
// reports success when that ref is missing, so make that fatal here.
try {
  try { sh("git fetch origin main --quiet"); } catch {}
  sh("git rev-parse --verify --quiet origin/main");
  sh("git merge-base origin/main HEAD");
} catch (e) {
  console.error("origin/main must exist and share history with HEAD (needs a merge-base): run `git fetch --unshallow origin main` or `git fetch --depth=1000 origin main`.");
  process.exit(1);
}
const dirtyBefore = sh("git status --porcelain").length > 0;

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
  branch: sh("git rev-parse --abbrev-ref HEAD"),
  dirtyBefore,
  dirtyAfter,
  node: process.version,
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
