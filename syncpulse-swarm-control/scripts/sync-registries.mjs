#!/usr/bin/env node
/**
 * sync-registries.mjs
 *
 * Keeps registry/tools.registry.json and registry/agents.registry.json
 * extensible without hand-editing: it upserts live npm discovery results
 * into the tools registry, regenerates the agents registry's localAgents
 * section from agents/*.md frontmatter, and flags any new agent-like
 * package it finds on npm as a discoveredAgentPackages candidate.
 *
 * This is the write side of discovery. discover-ecosystem.mjs is P0
 * (read-only, no gate). This script only writes to the two registry
 * files in this repo — never to package.json, never an install — so it
 * stays P0/P1 per references/capability-policy.md. It never removes an
 * entry a human added by hand; it only adds and refreshes fields owned
 * by discovery (verifiedH4shed, description, latestKnownVersion,
 * lastDiscoveredAt).
 *
 * Usage:
 *   node scripts/sync-registries.mjs
 *   node scripts/sync-registries.mjs --dry-run
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { discoverPackages } from "./discover-ecosystem.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TOOLS_REGISTRY_PATH = path.join(ROOT, "registry", "tools.registry.json");
const AGENTS_REGISTRY_PATH = path.join(ROOT, "registry", "agents.registry.json");
const AGENTS_DIR = path.join(ROOT, "agents");
const ROUTING_TABLE_PATH = path.join(ROOT, "config", "routing-table.json");

const AGENT_LIKE_PATTERN = /\b(agent|swarm|orchestrat)/i;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (m) fields[m[1]] = m[2].trim();
  }
  return fields;
}

async function loadJson(p) {
  return JSON.parse(await readFile(p, "utf8"));
}

async function regenerateLocalAgents() {
  const files = (await readdir(AGENTS_DIR)).filter((f) => f.endsWith(".md"));
  const localAgents = [];
  for (const file of files) {
    const raw = await readFile(path.join(AGENTS_DIR, file), "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm.name) continue;
    localAgents.push({
      name: fm.name,
      file: `agents/${file}`,
      workspace: null, // owned by config/routing-table.json, not agent frontmatter
      model: fm.model ?? null,
      effort: fm.effort ?? null,
      source: "local",
    });
  }
  return localAgents.sort((a, b) => a.name.localeCompare(b.name));
}

function upsertTools(existingEntries, discoveredPackages) {
  const byName = new Map(existingEntries.map((e) => [e.name, e]));
  const now = new Date().toISOString();
  let added = 0;
  let refreshed = 0;

  for (const pkg of discoveredPackages) {
    if (pkg.classification !== "tool") continue;
    const existing = byName.get(pkg.name);
    if (existing) {
      existing.verifiedH4shed = pkg.verifiedH4shed;
      existing.description = pkg.description || existing.description;
      existing.latestKnownVersion = pkg.version;
      existing.lastDiscoveredAt = now;
      refreshed++;
    } else {
      byName.set(pkg.name, {
        name: pkg.name,
        category: "uncategorized",
        workspace: null,
        agent: null,
        verifiedH4shed: pkg.verifiedH4shed,
        latestKnownVersion: pkg.version,
        description: pkg.description || "",
        source: "discovered",
        lastDiscoveredAt: now,
      });
      added++;
    }
  }

  return { entries: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name)), added, refreshed };
}

function upsertDiscoveredAgentPackages(existing, discoveredPackages) {
  const byName = new Map(existing.map((e) => [e.name, e]));
  const now = new Date().toISOString();
  let added = 0;

  for (const pkg of discoveredPackages) {
    const text = `${pkg.name} ${pkg.description}`;
    if (!AGENT_LIKE_PATTERN.test(text)) continue;
    if (byName.has(pkg.name)) {
      byName.get(pkg.name).lastDiscoveredAt = now;
      byName.get(pkg.name).latestKnownVersion = pkg.version;
      continue;
    }
    byName.set(pkg.name, {
      name: pkg.name,
      latestKnownVersion: pkg.version,
      description: pkg.description || "",
      verifiedH4shed: pkg.verifiedH4shed,
      wiredToRoutingTable: false,
      source: "discovered",
      lastDiscoveredAt: now,
    });
    added++;
  }

  return { entries: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name)), added };
}

async function validateRoutingTableAgainstRegistries(toolsRegistry, agentsRegistry) {
  const routingTable = await loadJson(ROUTING_TABLE_PATH);
  const knownToolNames = new Set(toolsRegistry.map((t) => t.name));
  const knownAgentNames = new Set(agentsRegistry.map((a) => a.name));
  const warnings = [];

  const allRules = [...routingTable.rules, routingTable.defaultRule];
  for (const rule of allRules) {
    if (!knownAgentNames.has(rule.agent)) {
      warnings.push(`rule "${rule.id}" references unknown agent "${rule.agent}" — add agents/${rule.agent}.md or fix the rule`);
    }
    for (const tool of rule.supportingTools ?? []) {
      if (tool.startsWith("@h4shed/tool-") && !knownToolNames.has(tool)) {
        warnings.push(`rule "${rule.id}" references tool "${tool}" not present in registry/tools.registry.json`);
      }
    }
  }
  return warnings;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const toolsRegistry = await loadJson(TOOLS_REGISTRY_PATH);
  const agentsRegistry = await loadJson(AGENTS_REGISTRY_PATH);

  const { packages, errors } = await discoverPackages();
  if (errors.length) {
    console.log("Discovery warnings:");
    for (const e of errors) console.log(`  - ${e}`);
  }

  const { entries: toolEntries, added: toolsAdded, refreshed: toolsRefreshed } =
    upsertTools(toolsRegistry.entries, packages);

  const localAgents = await regenerateLocalAgents();

  const { entries: discoveredAgentEntries, added: agentsAdded } =
    upsertDiscoveredAgentPackages(agentsRegistry.discoveredAgentPackages, packages);

  const now = new Date().toISOString();
  const nextToolsRegistry = { ...toolsRegistry, generatedAt: now, entries: toolEntries };
  const nextAgentsRegistry = {
    ...agentsRegistry,
    generatedAt: now,
    localAgents,
    discoveredAgentPackages: discoveredAgentEntries,
  };

  const warnings = await validateRoutingTableAgainstRegistries(
    nextToolsRegistry.entries,
    [...localAgents, ...discoveredAgentEntries]
  );

  console.log(`Tools registry:  +${toolsAdded} new, ${toolsRefreshed} refreshed, ${toolEntries.length} total`);
  console.log(`Agents registry: ${localAgents.length} local agent(s) regenerated from agents/*.md`);
  console.log(`                 +${agentsAdded} newly discovered agent-like package(s)`);
  if (warnings.length) {
    console.log(`\nrouting-table.json validation (${warnings.length} warning(s)):`);
    for (const w of warnings) console.log(`  - ${w}`);
  } else {
    console.log("\nrouting-table.json validation: all agent/tool references resolve.");
  }

  if (dryRun) {
    console.log("\n--dry-run: not writing registry files.");
    return;
  }

  await writeFile(TOOLS_REGISTRY_PATH, JSON.stringify(nextToolsRegistry, null, 2) + "\n", "utf8");
  await writeFile(AGENTS_REGISTRY_PATH, JSON.stringify(nextAgentsRegistry, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${path.relative(ROOT, TOOLS_REGISTRY_PATH)} and ${path.relative(ROOT, AGENTS_REGISTRY_PATH)}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("sync-registries failed:", err.message);
    process.exitCode = 1;
  });
}
