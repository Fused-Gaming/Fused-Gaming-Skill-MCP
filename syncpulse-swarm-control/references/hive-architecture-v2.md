# Hive Architecture v2 — Adopted Improvements

`references/architecture.md` describes the baseline: authoritative coordination, isolated workspaces, versioned agent knowledge, least-cost routing, independent verification, capability procurement, human decision gates. This document records a set of improvements adopted on top of that baseline from an internal architecture review, reframed around one thesis:

> Make the coordination substrate more deterministic than the agents operating on it. The swarm scales safely by making agents cheap, replaceable workers against a disciplined execution substrate — not by making agents smarter.

Each item below is marked **Implemented** (working code in this plugin, testable today) or **Specified** (architecture this plugin documents and should be built toward, but doesn't run yet — it requires infrastructure beyond a markdown-and-scripts plugin, e.g. a real event store or multi-project deployment).

## Implemented

### 1 — Transactional task-state transitions

`scripts/task-ledger.mjs transition` never lets a transition happen just because an agent says "done." A transition requires the task's current state (recomputed from the event log, not trusted from memory) to match the declared `from` state, and it records `evidence` alongside the commit. A transition proposed against a stale `from` state is denied, not silently accepted.

### 2 — Task leases

`scripts/task-ledger.mjs lease grant` gives an agent an exclusive, versioned, expiring write scope over a task — not permanent ownership. A conflicting lease request is denied and recorded (`lease.request_denied`), not silently queued or ignored. This is enforced by the ledger itself, not merely documented as a convention.

### 3 — Project epochs

`scripts/task-ledger.mjs epoch bump <name>` increments `project_epoch`, `architecture_epoch`, `design_epoch`, or `api_contract_epoch` in `state/epochs.json`, and every committed transition records which epoch values were current at the time (`epochsAtTransition`). A task recorded against a stale epoch is technically not wrong — it's stale. Deciding continue/revalidate/rebase/cancel/restart for tasks caught by an epoch bump is still a coordinator judgment call (not automated), but the data to make that call — which epoch a task was built against, and what it is now — is captured automatically.

### 14 — Causal event log

`state/ledger.jsonl` is append-only. `scripts/task-ledger.mjs project --task <id>` replays every event for a task into a current-state view — state is a *projection*, never a mutable row that can drift from its own history. `scripts/task-ledger.mjs log` prints the raw event stream for debugging "why did this happen."

### 15 — Agents can challenge, not override

`scripts/task-ledger.mjs challenge` lets any agent record a claim against a task (e.g. "violates ADR-017") with evidence. Recording a challenge never changes task state by itself — only a `transition` commit does that, and only the coordinator (or whichever agent legitimately owns that workspace) should be issuing commits in response to a challenge. This gives distributed intelligence without distributed authority.

## Specified (documented, not yet running code)

### 4 — Context Capsules

Instead of handing an agent the whole repo, whole history, and every AGENTS.md, the coordinator should build a capsule per task: `intent`, `authoritative_inputs` (content-addressed — see #19), `dependencies`, `allowed_surfaces.read`/`.write` (matching the task's lease), `acceptance` criteria, and `excluded_context`. This plugin's `config/routing-table.json` already narrows `supportingTools`/`primarySkill` per intent; a capsule is the next layer — narrowing *content*, not just capability selection. Building this requires a real content store and is out of scope for a markdown/scripts plugin today.

### 5 — Separate intent from plan

Human intent (`INTENT-12: users need passwordless login`) should be immutable. Plans against it (`PLAN-28`, `PLAN-29`, ...) are disposable and can fail or be superseded without ever mutating the original objective. `references/task-state.md` now has fields for this (see below) but nothing enforces the immutability yet — that requires a real intent store, not just a schema.

### 6 — Selective speculative execution

For cheap, uncertain tasks, run 2–3 candidate approaches in parallel and let a verifier pick a winner — but only when `cost_of_parallel_candidates < expected_cost_of_wrong_decision`. This is a policy decision for `references/model-routing.md`, not a mechanism this plugin runs today.

### 7 — Cheapest *expected successful completion*, not cheapest model

`references/model-routing.md` already says prefer the lowest-cost qualified model. The refinement: `ExpectedTotalCost = initial + P(retry)×retry_cost + P(escalation)×escalation_cost + verification_cost + expected_rework + expected_failure_impact`. A cheap model with a high failure rate can be more expensive in expectation than a pricier model that succeeds on the first attempt. Computing this requires the historical performance data `architecture.md` §23 already calls for — this plugin doesn't yet have a metrics store to learn from.

### 8 — Confidence is not evidence

Route on `confidence_evidence` (tests pass, typecheck pass, static analysis pass, independent review pass, requirements coverage), never on a model's self-reported confidence score. This is a policy statement, already consistent with `references/model-routing.md`'s emphasis on independent verification — worth stating explicitly since self-reported confidence is an easy trap.

### 9 — Negative and unknown capabilities

Agent capability declarations should distinguish `can`, `cannot` (a policy restriction — e.g. `production-deploy`, `billing-change`), and `unknown` (a potential capability gap, which should route to `capability-scout`/`expand-ecosystem`, not silently fail or silently proceed). `agents/*.md` frontmatter doesn't carry this today; adding it is a small, low-risk follow-up.

### 10 — Swarm circuit breaker

Trip on: the same failure recurring >3 times, cost velocity exceeding a threshold, tasks recursively spawning tasks, merge-conflict rate spiking, review-rejection rate spiking, or a capability install causing regressions. States: `Normal → Degraded → Frozen → HumanReview → Normal|Rollback`. `config/policy.example.yaml` now has threshold fields for this (see below); nothing evaluates them yet.

### 11 — Swarm health metrics

Throughput, first-pass verification rate, mean retries, mean escalation depth, coordinator queue latency, context/epoch invalidation rate, merge-conflict rate, human-intervention rate, cost per accepted vs. rejected task, capability utilization/regression rate, agent-instruction churn, dead-task percentage. One in particular is worth calling out:

> **Useful Work Ratio** = accepted verified work ÷ total generated work. A hive producing a huge volume of output isn't valuable if only a fraction survives verification.

### 12 — Attention budget (central authority ≠ central computation)

Not every event needs the coordinator's full reasoning. Three paths: **mechanical** (deterministic state engine — a test passed, a branch was created) → **light** (economy-model coordination) → **core** (central reasoning authority, for strategic/ambiguous decisions only). `agents/coordinator.md` has been updated to state this explicitly. `scripts/route-intent.mjs`'s deterministic classification is already an instance of the "mechanical" path in practice — the routing decision itself doesn't need a model call.

### 13 — Hierarchical hives

Global coordinator → project coordinators → workspace coordinators → workers, with one rule preserved at every level: *delegate reasoning, but authority must have a deterministic parent.* Relevant once this plugin coordinates more than one project at a time; out of scope for the current single-repo design.

### 16 — Separate knowledge from policy

Observation ("3 migrations were forgotten") → Knowledge ("schema changes require migrations") → Heuristic ("when schema files change, inspect migration directory") → Policy ("a schema-changing task cannot enter review without migration verification"). Only the policy layer should be mandatory/enforced — most lessons should stop at knowledge or heuristic. `references/capability-policy.md`'s "Agent knowledge patches" section already gestures at this distinction; this makes the four layers explicit.

### 17 — Capability shadow mode

Before replacing an incumbent tool/skill, run the candidate on the same real tasks without using its output, and compare (success rate, cost, latency, regressions) over 20–50 executions before promoting. Now required for P2 promotions — see the `capability-policy.md` update below.

### 18 — Capability inheritance

Agent definitions should be able to extend a base (`agent://base → engineering → typescript → frontend → react`) so a policy change propagates without editing every agent file by hand. `agents/*.md` frontmatter doesn't support an `extends` field today; adding it is a larger change to how agents are loaded and is deferred.

### 19 — Content-addressed artifacts

Reference `DESIGN-14@sha256:...`, not "the latest design," so "latest" can't silently change under a running task. Pairs directly with epochs (#3) and context capsules (#4). Requires a content store this plugin doesn't have yet.

### 20 — Swarm simulator

Before a new routing policy, capability policy, or coordinator prompt goes live, replay historical task events against both the current and candidate policy and compare outcomes before promoting. This is the natural next consumer of `state/ledger.jsonl` once enough real history accumulates — not usable on day one.

## Multi-reasoner coordinator, not one giant conversation

The coordinator should not be a single sprawling model conversation. Planning, architecture, cost/routing, and risk/policy questions can go to separate reasoning calls — but only the coordinator commits authoritative state (via `task-ledger.mjs transition`). Many participants may *advise*; exactly one component *commits*. This is already implicit in `agents/coordinator.md`'s "coordinate; do not become the default implementation agent," and is now stated explicitly there.

## The mental model

| SyncPulse concept | OS analogy |
|---|---|
| Intent Engine | shell / API |
| Coordinator | scheduler |
| Task graph (`config/routing-table.json` + `state/ledger.jsonl`) | process graph |
| Task lease | lock |
| Workspace | process isolation |
| Context capsule (specified) | process memory |
| Capability registries (`registry/*.json`) | package manager |
| Model router (`references/model-routing.md`) | compute scheduler |
| Verifier | runtime checks |
| Event log (`state/ledger.jsonl`) | journal |
| Queen | trusted ecosystem/control service |
| Human | root authority |
