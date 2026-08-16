#!/usr/bin/env node
/**
 * route-intent.mjs
 *
 * Deterministic logic engine that maps free-text operator intent to:
 *   - owning workspace
 *   - internal SyncPulse agent (agents/*.md)
 *   - primary @h4shed skill (if any)
 *   - supporting @h4shed tools
 *   - suggested model class (economy/standard/premium)
 *   - whether a human decision gate is required
 *
 * This is the "decision order" step 1 from references/model-routing.md:
 * "Can deterministic tooling perform the task safely?" — classification
 * and routing is exactly that kind of deterministic step, so it should
 * run as a tool call, not be re-derived by a model on every request.
 *
 * The coordinator (agents/coordinator.md) and orchestrate skill should
 * call this BEFORE deciding which agent/model to invoke. It never
 * installs, mutates, or executes anything — it only classifies.
 *
 * Usage:
 *   node scripts/route-intent.mjs "add a design system with tokens and theming"
 *   echo "run our playwright suite" | node scripts/route-intent.mjs
 *   node scripts/route-intent.mjs --json "..."   # machine-readable output
 *   node scripts/route-intent.mjs --top 5 "..."  # return more than 3 matches
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TABLE_PATH = path.join(__dirname, "..", "config", "routing-table.json");

function tokenizeIntent(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Score = count of matched keyword phrases, weighted by phrase length
 * (multi-word phrases are more specific, so they score higher per hit).
 * A phrase matches if every one of its words appears somewhere in the
 * intent (order-independent) — this is intentionally simple and
 * auditable rather than fuzzy/ML; see capability-policy.md: routing
 * decisions should be traceable. Word-set matching (rather than exact
 * substring) means "sync the h4shed ecosystem" still matches the
 * keyword "sync the ecosystem".
 */
function scoreRule(intentWords, rule) {
  let score = 0;
  const hits = [];
  for (const kw of rule.keywords ?? []) {
    const kwWords = kw.toLowerCase().split(" ").filter(Boolean);
    const allPresent = kwWords.every((w) => intentWords.has(w));
    if (allPresent) {
      score += kwWords.length;
      hits.push(kw);
    }
  }
  return { score, hits };
}

async function loadTable() {
  const raw = await readFile(TABLE_PATH, "utf8");
  return JSON.parse(raw);
}

export async function routeIntent(intentText, { top = 3 } = {}) {
  const table = await loadTable();
  const intent = tokenizeIntent(intentText);
  const intentWords = new Set(intent.split(" ").filter(Boolean));

  const scored = table.rules
    .map((rule) => ({ rule, ...scoreRule(intentWords, rule) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const matches = scored.slice(0, top).map(({ rule, score, hits }) => ({
    id: rule.id,
    score,
    matchedKeywords: hits,
    workspace: rule.workspace,
    agent: rule.agent,
    primarySkill: rule.primarySkill,
    supportingTools: rule.supportingTools ?? [],
    modelClass: rule.modelClass,
    modelAlias: table.modelClasses?.[rule.modelClass] ?? null,
    humanGate: Boolean(rule.humanGate),
    notes: rule.notes ?? null,
  }));

  if (matches.length === 0) {
    const d = table.defaultRule;
    matches.push({
      id: d.id,
      score: 0,
      matchedKeywords: [],
      workspace: d.workspace,
      agent: d.agent,
      primarySkill: d.primarySkill,
      supportingTools: d.supportingTools ?? [],
      modelClass: d.modelClass,
      modelAlias: table.modelClasses?.[d.modelClass] ?? null,
      humanGate: Boolean(d.humanGate),
      notes: d.notes ?? null,
    });
  }

  return { intent: intentText, matches };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").trim();
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOut = args.includes("--json");
  const topIdx = args.indexOf("--top");
  const top = topIdx !== -1 ? Number(args[topIdx + 1]) || 3 : 3;

  const positional = args.filter(
    (a, i) => !a.startsWith("--") && args[i - 1] !== "--top"
  );

  let intentText = positional.join(" ").trim();
  if (!intentText && !process.stdin.isTTY) {
    intentText = await readStdin();
  }

  if (!intentText) {
    console.error(
      'Usage: node scripts/route-intent.mjs [--json] [--top N] "<intent text>"'
    );
    process.exitCode = 1;
    return;
  }

  const result = await routeIntent(intentText, { top });

  if (jsonOut) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Intent: ${result.intent}`);
  for (const m of result.matches) {
    console.log(
      `\n[${m.id}] score=${m.score}${m.humanGate ? "  (HUMAN GATE REQUIRED)" : ""}`
    );
    console.log(`  workspace:        ${m.workspace}`);
    console.log(`  agent:            ${m.agent}`);
    console.log(`  primary skill:    ${m.primarySkill ?? "(none — use repo tools)"}`);
    console.log(
      `  supporting tools: ${m.supportingTools.length ? m.supportingTools.join(", ") : "(none)"}`
    );
    console.log(`  model class:      ${m.modelClass} (${m.modelAlias})`);
    if (m.matchedKeywords.length) {
      console.log(`  matched on:       ${m.matchedKeywords.join(", ")}`);
    }
    if (m.notes) console.log(`  notes:            ${m.notes}`);
  }
}

// Only run the CLI when invoked directly, so this stays importable
// (e.g. from a future test suite) without side effects.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("route-intent failed:", err.message);
    process.exitCode = 1;
  });
}
