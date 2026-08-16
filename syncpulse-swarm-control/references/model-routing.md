# Model Routing Policy

## Objective

Minimize total expected completion cost while preserving required correctness, safety, and turnaround.

Cost is not only token price. Include expected retries, rework, reviewer time, and failure impact.

## Decision order

```text
Can deterministic tooling perform the task safely?
  yes -> use the tool
  no  -> classify task

Can the lowest-cost model class meet the minimum capability threshold?
  yes -> assign and verify
  no  -> move up one class

Did verification pass?
  yes -> advance task state
  no  -> diagnose failure

Is failure correctable by a targeted retry?
  yes -> retry once within budget
  no  -> escalate model/capability or create human gate
```

## Default model classes

| Class | Typical use | Default Claude alias |
|---|---|---|
| economy | classification, extraction, status synthesis, routine docs, bounded checks | haiku |
| standard | implementation, design reasoning, test authoring, ordinary review | sonnet |
| premium | architecture deadlocks, subtle cross-system reasoning, severe failures, high-risk synthesis | opus |

These are defaults, not entitlements. Repository/provider policy may restrict available models.

## Eligibility dimensions

Score each candidate against:

- task-type success history
- tool/skill compatibility
- context requirement
- reasoning complexity
- security/privacy classification
- latency
- estimated input/output usage
- expected retry probability
- verification cost
- failure impact

A cheap model that repeatedly fails is not cheap.

## Escalation triggers

Escalate one class when one or more applies:

- verifier failure after one targeted retry;
- unresolved ambiguity affecting architecture or correctness;
- cross-workspace conflict requiring synthesis;
- security-sensitive reasoning exceeds standard confidence;
- task history shows the cheaper class underperforms;
- expected retry/rework cost exceeds direct escalation cost.

Escalate to a human when authority, not reasoning ability, is missing.

## Budget policy

Support soft and hard budgets at organization/project/epic/task scopes.

Soft limit:
- prefer deterministic tools;
- reduce duplicated reasoning;
- reuse validated artifacts;
- use targeted prompts/context;
- reconsider decomposition.

Hard limit:
- stop additional model escalation unless pre-authorized;
- create a human decision gate with current state, evidence, and expected incremental cost.
