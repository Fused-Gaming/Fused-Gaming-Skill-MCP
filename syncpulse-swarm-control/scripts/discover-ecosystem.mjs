#!/usr/bin/env node
/**
 * discover-ecosystem.mjs
 *
 * Deterministic, read-only (P0 tier) discovery of the live @h4shed npm
 * ecosystem plus the authoritative package registry published in
 * Fused-Gaming/Fused-Gaming-Skill-MCP.
 *
 * This is a tool, not a model call. The capability-scout agent and the
 * expand-ecosystem skill should invoke this instead of guessing package
 * names or relying on a frozen list — see references/capability-policy.md.
 *
 * Usage:
 *   node scripts/discover-ecosystem.mjs [--out syncpulse-package-inventory.json]
 *
 * Writes a normalized inventory JSON and prints a short human summary.
 * Makes no mutating calls: no install, no publish, no auth.
 */

import { writeFile } from "node:fs/promises";

const NPM_SEARCH_URL =
  "https://registry.npmjs.org/-/v1/search?text=maintainer:h4shed&size=250";
const SOURCE_REGISTRY_URL =
  "https://raw.githubusercontent.com/Fused-Gaming/Fused-Gaming-Skill-MCP/main/registry/REGISTRY.md";

const FOUNDATION_ORDER = [
  "@h4shed/mcp-core",
  "@h4shed/mcp-cli",
  "@h4shed/skill-syncpulse",
  "@h4shed/syncpulse-hub",
];

function classify(name, description = "") {
  const n = name.toLowerCase();
  const d = description.toLowerCase();
  if (FOUNDATION_ORDER.includes(name)) return "foundation";
  if (n.includes("hub")) return "hub";
  if (n.startsWith("@h4shed/skill-") || n.includes("skill")) return "skill";
  if (n.startsWith("@h4shed/tool-") || n.includes("tool")) return "tool";
  if (n.includes("cli")) return "cli";
  if (n.includes("doc")) return "docs";
  if (n.includes("session")) return "session";
  if (d.includes("library")) return "library";
  return "other";
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "syncpulse-swarm-control-plugin/discovery" },
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "syncpulse-swarm-control-plugin/discovery" },
  });
  if (!res.ok) return null;
  return res.text();
}

async function discoverPackages() {
  const errors = [];

  let npmResults = [];
  try {
    const npmData = await fetchJson(NPM_SEARCH_URL);
    npmResults = npmData.objects ?? [];
  } catch (err) {
    errors.push(`npm registry search failed: ${err.message}`);
  }

  let sourceRegistryRaw = null;
  try {
    sourceRegistryRaw = await fetchText(SOURCE_REGISTRY_URL);
  } catch (err) {
    errors.push(`Fused-Gaming-Skill-MCP registry fetch failed: ${err.message}`);
  }

  const packages = npmResults.map(({ package: pkg }) => {
    const maintainers = (pkg.maintainers ?? []).map((m) => m.username);
    const isVerifiedH4shed = maintainers.includes("h4shed");
    const scoped = pkg.name.startsWith("@");

    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description ?? "",
      scoped,
      maintainers,
      verifiedH4shed: isVerifiedH4shed,
      links: pkg.links ?? {},
      date: pkg.date,
      classification: classify(pkg.name, pkg.description),
      foundationOrder: FOUNDATION_ORDER.indexOf(pkg.name),
      compatibilityDecision: isVerifiedH4shed
        ? "include"
        : "review-unscoped-provenance",
      compatibilityReason: isVerifiedH4shed
        ? "verified maintainer: h4shed"
        : "maintainer field does not confirm h4shed; do not auto-install",
    };
  });

  packages.sort((a, b) => {
    const af = a.foundationOrder === -1 ? 999 : a.foundationOrder;
    const bf = b.foundationOrder === -1 ? 999 : b.foundationOrder;
    if (af !== bf) return af - bf;
    return a.name.localeCompare(b.name);
  });

  return { packages, errors, sourceRegistryRaw };
}

// Exported so scripts/sync-registries.mjs (and anything else) can reuse the
// exact same discovery call instead of duplicating fetch/classify logic —
// this is what keeps the tools/agents registries extensible from a single
// source of truth rather than two divergent implementations.
export { discoverPackages, FOUNDATION_ORDER, classify };

async function main() {
  const outArgIdx = process.argv.indexOf("--out");
  const outPath =
    outArgIdx !== -1 && process.argv[outArgIdx + 1]
      ? process.argv[outArgIdx + 1]
      : "syncpulse-package-inventory.json";

  const { packages, errors, sourceRegistryRaw } = await discoverPackages();

  const inventory = {
    generatedAt: new Date().toISOString(),
    source: NPM_SEARCH_URL,
    sourceRegistryUrl: SOURCE_REGISTRY_URL,
    sourceRegistryFetched: Boolean(sourceRegistryRaw),
    totalDiscovered: packages.length,
    foundationOrder: FOUNDATION_ORDER,
    foundationStatus: FOUNDATION_ORDER.map((name) => ({
      name,
      discovered: packages.some((p) => p.name === name),
    })),
    packages,
    errors,
  };

  await writeFile(outPath, JSON.stringify(inventory, null, 2), "utf8");

  const verifiedCount = packages.filter((p) => p.verifiedH4shed).length;
  console.log(`Discovered ${packages.length} package(s) matching maintainer:h4shed.`);
  console.log(`  verified h4shed maintainer: ${verifiedCount}`);
  console.log(`  scoped (@h4shed/*):         ${packages.filter((p) => p.scoped).length}`);
  console.log(`  unscoped:                   ${packages.filter((p) => !p.scoped).length}`);
  for (const f of inventory.foundationStatus) {
    console.log(`  foundation: ${f.name} -> ${f.discovered ? "found" : "MISSING"}`);
  }
  if (errors.length) {
    console.log("Errors:");
    for (const e of errors) console.log(`  - ${e}`);
  }
  console.log(`Wrote inventory to ${outPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("discover-ecosystem failed:", err.message);
    process.exitCode = 1;
  });
}
