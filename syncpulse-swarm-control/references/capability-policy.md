# Capability Discovery and Procurement Policy

## Purpose

Continuously improve the swarm without allowing automatic self-expansion to become automatic compromise.

## Capability lifecycle

```text
observed gap
  -> candidate discovery
  -> provenance + permission classification
  -> incumbent comparison
  -> sandbox evaluation
  -> compatibility/security verification
  -> promote | quarantine | reject
  -> version agent knowledge
```

## Candidate record

Record:

- id/name/version
- source and maintainer
- capability supplied
- capability gap addressed
- requested permissions
- dependencies
- compatibility
- integrity/signature/hash when available
- license/commercial constraints when relevant
- benchmark/evaluation evidence
- incumbent comparison
- rollback/uninstall path
- risk tier

## Risk tiers

| Tier | Examples | Rule |
|---|---|---|
| P0 | docs, schemas, non-executable references | may auto-adopt after validation |
| P1 | read-only skills/tools | may sandbox and auto-promote if local policy allows |
| P2 | repository write-capable tools, execution helpers | coordinator approval, and must complete shadow-mode evaluation first (see below) |
| P3 | credentials, deployment, secrets, billing, global permission/routing changes, self-expanding privileges | explicit human approval |

Imported catalog entries (e.g. `registry/claude-flow-agents.registry.json`) are metadata only, not executable capabilities — they carry no risk tier until someone writes a real `agents/<name>.md` for them and that new agent file goes through this same lifecycle like any other capability.

## Capability shadow mode (required for P2 promotion)

Before an incumbent tool or skill is replaced, run the candidate against the same real tasks the incumbent handles, without using the candidate's output for anything — the incumbent's result is still what ships. Compare over 20–50 representative executions:

```yaml
shadow_evaluation:
  incumbent: "@h4shed/tool-webpack"
  candidate: "@h4shed/tool-vite"
  executions: 32
  results:
    success_delta: "+6%"
    cost_delta: "-14%"
    latency_delta: "-21%"
    regressions: 0
  decision: promote
```

"Sandbox passed once" is not shadow mode and is not sufficient evidence for a P2 promotion — see "Improvement evidence" below. Shadow mode is what turns a single successful sandbox run into an actual comparative sample.

## Can / cannot / unknown

Agent capability declarations should distinguish three states, not two:

```yaml
capabilities:
  can:
    - typescript
    - api-design
  cannot:
    - production-deploy
    - billing-change
    - license-policy-change
  unknown:
    - kubernetes
```

`cannot` is a policy restriction — the agent must not attempt it regardless of how confident it feels. `unknown` is a potential capability gap — it should route to `capability-scout`/`expand-ecosystem` (see `skills/expand-ecosystem/SKILL.md`) rather than being silently attempted or silently refused. Treating `unknown` as `cannot` hides real capability gaps; treating it as `can` risks an agent guessing at something outside its verified scope.

## Improvement evidence

Promotion requires a measurable benefit such as:

- higher verifier pass rate
- fewer retries
- lower total model/tool cost
- lower latency with equal quality
- capability coverage previously absent
- reduced security risk
- improved compatibility or maintenance state

"Newest" is not evidence. Neither is a single successful run — see shadow mode above.

## Agent knowledge patches

Patch AGENT.md/capability manifests only for reusable lessons — and only at the right layer. Distinguish four layers per `references/hive-architecture-v2.md` §16, and only the last one should ever become a mandatory, enforced rule:

```text
Observation:  "3 migrations were forgotten."
Knowledge:    "Schema changes require migrations."
Heuristic:    "When schema files change, inspect the migration directory."
Policy:       "A schema-changing task cannot enter review without migration verification."
```

Good (knowledge/heuristic/policy-worthy):
- a required migration verification step repeatedly prevented defects
- a tool was deprecated and replaced with a validated successor
- a workspace boundary needed clarification after recurring conflicts

Bad (stays at observation, never becomes policy):
- one-off task trivia
- unverified preferences
- temporary debugging state

Collapsing every observation straight into mandatory policy is how a swarm accumulates bureaucracy nobody remembers the reason for. Version all material capability/instruction changes.
