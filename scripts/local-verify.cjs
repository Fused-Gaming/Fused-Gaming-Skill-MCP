#!/usr/bin/env node
/**
 * Local verification gate.
 * Mirrors .github/workflows/test.yml and validate-branch-skill-match.yml so a
 * change can be proven green locally while hosted Actions are unavailable
 * (billing/account block). See docs/LOCAL_VERIFICATION_POLICY.md.
 *
 * Usage: node scripts/local-verify.cjs [--skip-install] [--only=build,lint]
 * Exit code 0 only if every step passed. Writes .local-verification/<sha>.json
 * and prints a markdown summary suitable for a PR comment.
 */
const { spawnSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const skipInstall = args.includes("--skip-install");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice(7).split(",") : null;

const steps = [
  { id: "install", cmd: "npm ci", skip: skipInstall },
  { id: "build", cmd: "npm run build --if-present" },
  { id: "typecheck", cmd: "npm run typecheck --if-present" },
  { id: "lint", cmd: "npm run lint --if-present" },
  { id: "test", cmd: "npm test --if-present --workspaces" },
  { id: "branch-skill-match", cmd: "node scripts/validate-branch-skill-match.cjs" },
];

const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
const sha = sh("git rev-parse HEAD");
const dirty = sh("git status --porcelain").length > 0;

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

const ran = results.filter((r) => r.status !== "skipped");
const ok = ran.length > 0 && ran.every((r) => r.status === "passed");
const report = {
  commit: sha,
  branch: sh("git rev-parse --abbrev-ref HEAD"),
  dirtyWorkingTree: dirty,
  node: process.version,
  generatedAt: new Date().toISOString(),
  complete: results.every((r) => r.status !== "skipped"),
  passed: ok,
  steps: results,
};

fs.mkdirSync(".local-verification", { recursive: true });
fs.writeFileSync(path.join(".local-verification", `${sha}.json`), JSON.stringify(report, null, 2) + "\n");

const icon = { passed: "✅", failed: "❌", skipped: "⏭️" };
console.log("\n### Local verification (hosted CI unavailable)\n");
console.log(`Commit \`${sha.slice(0, 7)}\` · Node ${process.version} · working tree ${dirty ? "DIRTY (not valid evidence)" : "clean"}\n`);
console.log("| Step | Result | Time |\n| --- | --- | --- |");
results.forEach((r) => console.log(`| ${r.id} | ${icon[r.status]} ${r.status} | ${r.seconds}s |`));
if (dirty) console.log("\n⚠️  Commit your changes and re-run: evidence only counts for a clean tree.");
if (!report.complete) console.log("\n⚠️  Some steps were skipped: this run is partial evidence only.");
process.exit(ok && !dirty ? 0 : 1);
