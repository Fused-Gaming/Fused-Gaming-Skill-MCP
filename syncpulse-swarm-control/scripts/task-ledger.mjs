#!/usr/bin/env node
/**
 * task-ledger.mjs
 *
 * A minimal, working implementation of four of the architectural
 * improvements adopted into references/hive-architecture-v2.md:
 *
 *   #1  transactional task-state transitions (preconditions -> evidence -> commit)
 *   #2  task leases (exclusive write scope, versioned, expiring)
 *   #3  project epochs (stale-work detection)
 *   #14 causal event log (state is a projection of events, not a mutable row)
 *
 * State lives at state/ledger.jsonl — append-only, one JSON event per
 * line. state/epochs.json holds current epoch counters. Nothing here
 * calls a model; it's the deterministic substrate the coordinator
 * commits transitions against. See references/task-state.md for the
 * full event/transition schema this implements.
 *
 * Commands:
 *   node scripts/task-ledger.mjs epoch bump architecture
 *   node scripts/task-ledger.mjs epoch show
 *   node scripts/task-ledger.mjs lease grant --task TASK-284 --agent developer --write "src/auth/**" --ttl 3600
 *   node scripts/task-ledger.mjs lease request --task TASK-284 --agent other-agent --write "src/auth/**"
 *   node scripts/task-ledger.mjs transition --task TASK-284 --from active --to verification --evidence '{"tests":"pass"}'
 *   node scripts/task-ledger.mjs challenge --task TASK-284 --agent developer --claim "violates ADR-017"
 *   node scripts/task-ledger.mjs project --task TASK-284   # replay events -> current state
 *   node scripts/task-ledger.mjs log                        # print raw event log
 */

import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = path.join(__dirname, "..", "state");
const LEDGER_PATH = path.join(STATE_DIR, "ledger.jsonl");
const EPOCHS_PATH = path.join(STATE_DIR, "epochs.json");

async function ensureState() {
  await mkdir(STATE_DIR, { recursive: true });
}

async function loadEpochs() {
  try {
    return JSON.parse(await readFile(EPOCHS_PATH, "utf8"));
  } catch {
    return { project_epoch: 1, architecture_epoch: 1, design_epoch: 1, api_contract_epoch: 1 };
  }
}

async function saveEpochs(epochs) {
  await writeFile(EPOCHS_PATH, JSON.stringify(epochs, null, 2) + "\n", "utf8");
}

async function appendEvent(event) {
  await ensureState();
  const withMeta = { ...event, eventId: crypto.randomUUID(), at: new Date().toISOString() };
  await appendFile(LEDGER_PATH, JSON.stringify(withMeta) + "\n", "utf8");
  return withMeta;
}

async function readEvents() {
  try {
    const raw = await readFile(LEDGER_PATH, "utf8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      flags[key] = args[i + 1];
      i++;
    }
  }
  return flags;
}

/**
 * Replays events for one task into a current-state projection.
 * This is the "state is a projection of events" principle — nothing is
 * stored as a mutable row; `project` recomputes it from the log.
 */
function projectTask(events, taskId) {
  const relevant = events.filter((e) => e.task === taskId);
  const state = {
    task: taskId,
    status: "unknown",
    lease: null,
    transitions: [],
    challenges: [],
    epochsAtCreation: null,
  };
  for (const e of relevant) {
    if (e.type === "lease.granted") {
      state.lease = {
        holder: e.agent,
        version: e.leaseVersion,
        writeScope: e.write,
        expiresAt: e.expiresAt,
      };
    }
    if (e.type === "lease.request_denied") {
      state.transitions.push({ note: `lease request by ${e.agent} denied: ${e.reason}`, at: e.at });
    }
    if (e.type === "transition.committed") {
      state.status = e.to;
      state.transitions.push({ from: e.from, to: e.to, evidence: e.evidence, at: e.at });
      if (!state.epochsAtCreation && e.from === "intake") state.epochsAtCreation = e.epochsAtTransition;
    }
    if (e.type === "challenge.raised") {
      state.challenges.push({ agent: e.agent, claim: e.claim, evidence: e.evidence, at: e.at });
    }
  }
  return state;
}

async function cmdEpochBump(flags, positional) {
  const epochName = positional[0];
  if (!epochName) throw new Error("usage: epoch bump <name>  (e.g. architecture, design, api_contract, project)");
  const key = `${epochName}_epoch`;
  const epochs = await loadEpochs();
  if (!(key in epochs)) throw new Error(`unknown epoch "${epochName}" — known: ${Object.keys(epochs).map((k) => k.replace("_epoch", "")).join(", ")}`);
  epochs[key] += 1;
  await saveEpochs(epochs);
  await appendEvent({ type: "epoch.bumped", epoch: key, value: epochs[key] });
  console.log(`${key} -> ${epochs[key]}`);
  console.log("Any active task recorded against the previous value of this epoch is now potentially stale — see hive-architecture-v2.md §3 for the revalidate/rebase/cancel/restart decision.");
}

async function cmdEpochShow() {
  const epochs = await loadEpochs();
  console.log(JSON.stringify(epochs, null, 2));
}

async function cmdLeaseGrant(flags) {
  const { task, agent, write, ttl } = flags;
  if (!task || !agent || !write) throw new Error("usage: lease grant --task <id> --agent <name> --write <glob> [--ttl seconds]");
  const events = await readEvents();
  const current = projectTask(events, task);
  if (current.lease && new Date(current.lease.expiresAt) > new Date()) {
    console.log(`Denied: task ${task} already has an active lease held by ${current.lease.holder} (expires ${current.lease.expiresAt}).`);
    await appendEvent({ type: "lease.request_denied", task, agent, reason: `active lease held by ${current.lease.holder}` });
    process.exitCode = 1;
    return;
  }
  const leaseVersion = (current.lease?.version ?? 0) + 1;
  const expiresAt = new Date(Date.now() + (Number(ttl) || 3600) * 1000).toISOString();
  const ev = await appendEvent({ type: "lease.granted", task, agent, write, leaseVersion, expiresAt });
  console.log(`Granted lease v${leaseVersion} on "${write}" to ${agent} for task ${task}, expires ${expiresAt}.`);
  return ev;
}

async function cmdTransition(flags) {
  const { task, from, to, evidence } = flags;
  if (!task || !from || !to) throw new Error('usage: transition --task <id> --from <state> --to <state> [--evidence \'{"k":"v"}\']');
  const events = await readEvents();
  const current = projectTask(events, task);
  if (current.status !== "unknown" && current.status !== from) {
    console.log(`Denied: task ${task} is in state "${current.status}", not "${from}". Re-read current state before proposing a transition.`);
    process.exitCode = 1;
    return;
  }
  const epochs = await loadEpochs();
  let parsedEvidence = {};
  try {
    parsedEvidence = evidence ? JSON.parse(evidence) : {};
  } catch {
    throw new Error("--evidence must be valid JSON");
  }
  const ev = await appendEvent({
    type: "transition.committed",
    task,
    from,
    to,
    evidence: parsedEvidence,
    epochsAtTransition: epochs,
  });
  console.log(`Committed: ${task} ${from} -> ${to}`);
  return ev;
}

async function cmdChallenge(flags) {
  const { task, agent, claim, evidence } = flags;
  if (!task || !agent || !claim) throw new Error('usage: challenge --task <id> --agent <name> --claim "text" [--evidence "..."]');
  const ev = await appendEvent({ type: "challenge.raised", task, agent, claim, evidence: evidence ?? null });
  console.log(`Recorded challenge from ${agent} on ${task}: "${claim}". This does not change task state — the coordinator must evaluate and commit a transition per hive-architecture-v2.md §15 (agents can challenge, not override).`);
  return ev;
}

async function cmdProject(flags) {
  const events = await readEvents();
  if (flags.task) {
    console.log(JSON.stringify(projectTask(events, flags.task), null, 2));
    return;
  }
  const taskIds = [...new Set(events.map((e) => e.task).filter(Boolean))];
  for (const id of taskIds) {
    console.log(`\n=== ${id} ===`);
    console.log(JSON.stringify(projectTask(events, id), null, 2));
  }
}

async function cmdLog() {
  const events = await readEvents();
  for (const e of events) console.log(JSON.stringify(e));
  console.log(`\n${events.length} event(s) in ${path.relative(process.cwd(), LEDGER_PATH)}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const rest = argv.slice(1);

  if (command === "epoch") {
    const subcommand = rest[0];
    const flags = parseFlags(rest.slice(1));
    const positional = rest.slice(1).filter((a) => !a.startsWith("--"));
    if (subcommand === "bump") return cmdEpochBump(flags, positional);
    if (subcommand === "show") return cmdEpochShow();
  } else if (command === "lease") {
    const subcommand = rest[0];
    const flags = parseFlags(rest.slice(1));
    if (subcommand === "grant") return cmdLeaseGrant(flags);
  } else if (command === "transition") {
    return cmdTransition(parseFlags(rest));
  } else if (command === "challenge") {
    return cmdChallenge(parseFlags(rest));
  } else if (command === "project") {
    return cmdProject(parseFlags(rest));
  } else if (command === "log") {
    return cmdLog();
  }

  console.error(`Unknown command. Usage:
  node scripts/task-ledger.mjs epoch bump <name>
  node scripts/task-ledger.mjs epoch show
  node scripts/task-ledger.mjs lease grant --task <id> --agent <name> --write <glob> [--ttl seconds]
  node scripts/task-ledger.mjs transition --task <id> --from <state> --to <state> [--evidence '{...}']
  node scripts/task-ledger.mjs challenge --task <id> --agent <name> --claim "text"
  node scripts/task-ledger.mjs project [--task <id>]
  node scripts/task-ledger.mjs log`);
  process.exitCode = 1;
}

main().catch((err) => {
  console.error("task-ledger failed:", err.message);
  process.exitCode = 1;
});
