#!/usr/bin/env node
/**
 * import-claude-flow-agents.mjs
 *
 * Fused-Gaming-Skill-MCP's .claude-flow/ directory is the runtime state
 * for claude-flow v3 (github.com/ruvnet/claude-flow) — not hand-written
 * agent definition files. agents/store.json holds transient, timestamped
 * instances from past swarm sessions (stale by design); the actual
 * catalog of ~55 named agent TYPES lives in CAPABILITIES.md's
 * "Available Agents" and "Worker Types" sections.
 *
 * This script parses that catalog and upserts it into
 * registry/claude-flow-agents.registry.json — mirroring the pattern in
 * sync-registries.mjs: refresh known fields, append new ones, never
 * overwrite a human-set field, never auto-wire anything into
 * config/routing-table.json.
 *
 * IMPORTANT: these are catalog entries (name + category + one-line
 * description), not full behavioral specs. Unlike agents/*.md, there is
 * no system prompt here to run — see references/agent-catalog.md
 * "Promoting a claude-flow catalog entry" before treating one as usable.
 *
 * Usage:
 *   node scripts/import-claude-flow-agents.mjs
 *   node scripts/import-claude-flow-agents.mjs --dry-run
 *   node scripts/import-claude-flow-agents.mjs --ref main   # branch/tag/sha
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "registry", "claude-flow-agents.registry.json");

const SOURCE_REPO = "Fused-Gaming/Fused-Gaming-Skill-MCP";
const SOURCE_PATH = ".claude-flow/CAPABILITIES.md";

function rawUrl(ref) {
  return `https://raw.githubusercontent.com/${SOURCE_REPO}/${ref}/${SOURCE_PATH}`;
}

/**
 * The "Available Agents" section is a series of "### Category (N)"
 * headers each followed by a single backtick-delimited, comma-separated
 * line of agent names. The later "Hive-Mind Consensus > Worker Types"
 * table adds a few names (analyst, architect, optimizer, documenter)
 * not present under "Available Agents" — those are folded in under a
 * synthetic "hive-mind-worker-types" category.
 */
function parseCapabilities(markdown) {
  const entries = [];

  const availableAgentsSection = markdown.split("## Available Agents")[1]?.split("\n---\n")[0] ?? "";
  const categoryBlocks = availableAgentsSection.split(/^### /m).slice(1);
  for (const block of categoryBlocks) {
    const [headerLine, ...rest] = block.split("\n");
    const category = headerLine.replace(/\s*\(\d+\)\s*$/, "").trim();
    const body = rest.join("\n");
    const nameLine = body.split("\n").find((l) => l.includes("`"));
    if (!nameLine) continue;
    const names = [...nameLine.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]);
    for (const name of names) {
      entries.push({ name, category });
    }
  }

  const workerTypesMatch = markdown.match(/### Worker Types \(\d+\)\s*\n`([^\n]+)`/);
  if (workerTypesMatch) {
    const names = [...workerTypesMatch[1].matchAll(/`?([a-z0-9-]+)`?/g)]
      .map((m) => m[1])
      .filter(Boolean);
    const known = new Set(entries.map((e) => e.name));
    for (const name of names) {
      if (!known.has(name)) {
        entries.push({ name, category: "Hive-Mind Worker Types" });
        known.add(name);
      }
    }
  }

  return entries;
}

async function loadRegistry() {
  try {
    return JSON.parse(await readFile(REGISTRY_PATH, "utf8"));
  } catch {
    return {
      $schema: "./claude-flow-agents.registry.schema.json",
      version: 1,
      generatedAt: null,
      sourceRepo: `https://github.com/${SOURCE_REPO}`,
      sourcePath: SOURCE_PATH,
      note: "Catalog-only import of claude-flow (ruvnet/claude-flow) agent TYPES surfaced through .claude-flow/CAPABILITIES.md in the upstream repo. Not full agent specs — see references/agent-catalog.md before wiring any entry into config/routing-table.json.",
      entries: [],
    };
  }
}

function upsert(existingEntries, parsed) {
  const byName = new Map(existingEntries.map((e) => [e.name, e]));
  const now = new Date().toISOString();
  let added = 0;
  let refreshed = 0;

  for (const { name, category } of parsed) {
    const existing = byName.get(name);
    if (existing) {
      existing.category = existing.categoryOverridden ? existing.category : category;
      existing.lastSeenAt = now;
      refreshed++;
    } else {
      byName.set(name, {
        name,
        category,
        categoryOverridden: false,
        wiredToRoutingTable: false,
        promotedAgentFile: null,
        source: "claude-flow",
        firstSeenAt: now,
        lastSeenAt: now,
      });
      added++;
    }
  }

  return { entries: [...byName.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)), added, refreshed };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const refIdx = args.indexOf("--ref");
  const ref = refIdx !== -1 ? args[refIdx + 1] : "main";

  const res = await fetch(rawUrl(ref), {
    headers: { "user-agent": "syncpulse-swarm-control-plugin/import-claude-flow-agents" },
  });
  if (!res.ok) {
    throw new Error(`${rawUrl(ref)} -> HTTP ${res.status}`);
  }
  const markdown = await res.text();

  const parsed = parseCapabilities(markdown);
  if (parsed.length === 0) {
    throw new Error("Parsed 0 agent entries — CAPABILITIES.md format may have changed; check parseCapabilities().");
  }

  const registry = await loadRegistry();
  const { entries, added, refreshed } = upsert(registry.entries, parsed);

  console.log(`Parsed ${parsed.length} agent-type reference(s) from ${SOURCE_REPO}@${ref}:${SOURCE_PATH}`);
  console.log(`Registry: +${added} new, ${refreshed} refreshed, ${entries.length} total`);

  const byCategory = {};
  for (const e of entries) byCategory[e.category] = (byCategory[e.category] ?? 0) + 1;
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`);
  }

  if (dryRun) {
    console.log("\n--dry-run: not writing registry file.");
    return;
  }

  const next = { ...registry, generatedAt: new Date().toISOString(), entries };
  await writeFile(REGISTRY_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${path.relative(ROOT, REGISTRY_PATH)}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("import-claude-flow-agents failed:", err.message);
    process.exitCode = 1;
  });
}
