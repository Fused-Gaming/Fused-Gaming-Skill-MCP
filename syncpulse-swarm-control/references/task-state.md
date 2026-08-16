# Task State Contract

Suggested minimum task record:

```yaml
task:
  id: TASK-001
  project: PROJECT-ID
  epic: EPIC-ID
  title: ""
  intent: ""
  intent_record: INTENT-001   # immutable — see "Intent vs. plan" below
  workspace: implementation
  state: planned

  dependencies: []
  acceptance_criteria: []

  epochs_at_creation:          # from `node scripts/task-ledger.mjs epoch show` at task creation
    project_epoch: null
    architecture_epoch: null
    design_epoch: null
    api_contract_epoch: null

  lease:                       # from `node scripts/task-ledger.mjs lease grant`
    holder: null
    version: null
    write_scope: []
    expires_at: null

  execution:
    agent: null
    model_class: economy
    tools: []
    skills: []
    branch: null
    worktree: null

  verification:
    required: true
    status: pending
    evidence: []

  budget:
    soft_limit: null
    hard_limit: null
    observed_cost: null

  decision_gate:
    required: false
    reason: null
    resolution: null

  challenges: []               # from `node scripts/task-ledger.mjs challenge` — advisory, never mutates state directly

  provenance:
    capability_versions: {}
    created_at: null
    updated_at: null
```

## Transitions are commits, not assertions

A transition is not "the developer says it's done." Per `references/hive-architecture-v2.md` §1, every transition is proposed against a specific `from` state and only committed if that matches the task's actual current state (recomputed from `state/ledger.jsonl`, never trusted from an agent's memory of what it last saw):

```yaml
transition:
  task: TASK-284
  from: active
  proposed_to: verification
  evidence:
    tests: pass
    typecheck: pass
  coordinator_decision: commit   # or: deny (stale from-state, missing evidence, lease mismatch)
```

Run this with `node scripts/task-ledger.mjs transition --task TASK-284 --from active --to verification --evidence '{"tests":"pass"}'`.

## Intent vs. plan

Human intent should be stable; plans against it are disposable. Record intent separately from the plan attempting to satisfy it, and never let a failed or superseded plan mutate the original `intent_record`:

```yaml
intent:
  id: INTENT-012
  summary: "Users need passwordless login."
  immutable: true

plan:
  id: PLAN-028
  intent: INTENT-012
  status: superseded   # active | failed | superseded
```

This plugin doesn't yet enforce `immutable: true` mechanically — see `hive-architecture-v2.md` §5 — but recording `intent_record` on every task (as above) is the first step toward it.

## Recommended state flow

```text
intake
-> planned
-> ready
-> active
-> verification
-> review
-> remediation (when needed)
-> merge_ready
-> integrated
-> regression
-> release_ready
-> released
```

No task may silently skip a required verification or human decision gate. No task may transition without its `from` state matching current projected state (`node scripts/task-ledger.mjs project --task <id>`). No task may hold conflicting write leases with another active task.
