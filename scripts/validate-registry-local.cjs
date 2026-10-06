#!/usr/bin/env node
/**
 * Local mirror of .github/workflows/validate-registry.yml.
 * Regenerates the skill registry, validates structure/consistency/completeness,
 * and fails if the committed registry is stale (ignoring the timestamp line).
 * Restores timestamp-only churn so it never dirties the tree by itself.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// The only lines that legitimately change on every generation (all other diffs mean a stale registry).
const GENERATION_TIME_LINES = [
  // Match the field, never the date format: the generator uses toLocaleString(), which varies by locale.
  /^[+-]\s*"timestamp": ".+",?$/,                                              // skills.json / .ts / .cjs
  /^[+-]\*\*Generated:\*\* .+$/,                                                // REGISTRY.md
  /^[+-]\s*<p>Generated on .+ \| Fused Gaming MCP v[\d.]+<\/p>$/,                 // registry.html
];

const sh = (c) => execSync(c, { encoding: "utf8" });
const fail = (m) => { console.error(`❌ ${m}`); process.exit(1); };

// The generator overwrites registry/ and we restore it with git checkout, so uncommitted edits there would be destroyed.
if (sh("git status --porcelain -- registry").trim()) {
  fail("registry/ has uncommitted changes; commit or stash them first (this check regenerates and resets registry/).");
}
execSync("node scripts/generate-skill-registry.js", { stdio: "inherit" });

for (const f of ["skills.json", "REGISTRY.md", "registry.html"]) {
  if (!fs.existsSync(path.join("registry", f))) fail(`registry/${f} not found`);
}
const registry = JSON.parse(fs.readFileSync("registry/skills.json", "utf8"));
if (!registry.version) fail("Missing version field");
if (!registry.timestamp) fail("Missing timestamp field");
if (!Array.isArray(registry.skills)) fail("Missing skills array");
if (typeof registry.totalSkills !== "number") fail("Missing totalSkills");
if (typeof registry.totalTools !== "number") fail("Missing totalTools");
if (!registry.categories || typeof registry.categories !== "object" || Array.isArray(registry.categories)) {
  fail("Missing categories object"); // the hosted workflow reads Object.keys/entries(registry.categories)
}
registry.skills.forEach((s, i) => {
  for (const k of ["name", "id", "package", "category"]) if (!s[k]) fail(`Skill ${i} missing ${k}`);
  if (!Array.isArray(s.tools)) fail(`Skill ${i} missing tools array`);
});

let errors = 0;
for (const s of registry.skills) {
  const dirs = [s.name, "skill-" + s.name, s.name + "-skill"].map((d) => path.join("packages/skills", d, "package.json"));
  if (!dirs.some((p) => fs.existsSync(p))) { console.error(`❌ Skill not found on disk: ${s.name}`); errors++; }
}
const registered = new Set(registry.skills.map((s) => s.package));
for (const d of fs.readdirSync("packages/skills")) {
  const pj = path.join("packages/skills", d, "package.json");
  if (d === ".claude-flow" || !fs.existsSync(pj)) continue;
  const name = JSON.parse(fs.readFileSync(pj, "utf8")).name;
  if (!registered.has(name)) { console.error(`❌ Unregistered skill on disk: ${d} (${name})`); errors++; }
}
if (errors) fail(`${errors} registry inconsistencies. Run: npm run registry:generate and commit.`);

// Staleness: any registry diff other than timestamp lines means the committed files are out of date.
const changed = sh("git diff -U0 -- registry").split("\n")
  .filter((l) => /^[+-][^+-]/.test(l) && !GENERATION_TIME_LINES.some((re) => re.test(l)));
if (changed.length) {
  console.error(changed.slice(0, 10).join("\n"));
  fail("Committed registry/ is stale vs. generator output: commit the regenerated files.");
}
execSync("git checkout -- registry"); // drop timestamp-only noise
console.log(`✅ Registry valid and current (${registry.totalSkills} skills, ${registry.totalTools} tools)`);
