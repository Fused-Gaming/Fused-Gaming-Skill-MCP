# @h4shed/tool-ora

Agent-aware terminal progress and task-context rendering for SyncPulse, Claude Code, Codex, MCP workers, and other queue-driven code agents.

The package wraps [`ora`](https://github.com/sindresorhus/ora) while adding a structured task-context view so an agent window can immediately show **who is working, what it owns, what must be delivered, what is queued next, and which constraints apply**.

## Install

```bash
npm install @h4shed/tool-ora ora
```

## Agent task context

```ts
import { createAgentProgress } from '@h4shed/tool-ora';

const progress = createAgentProgress({
  agent: 'code-03',
  role: 'executor',
  taskId: 'TASK-42',
  objective: 'Implement the package registry endpoint',
  currentStep: 'Inspecting existing registry code',
  workspace: 'implementation',
  branch: 'agent/code-03/package-registry',
  source: 'sync.vln.gg',
  deliverables: [
    'typed registry endpoint',
    'unit tests',
    'integration notes',
  ],
  constraints: [
    'do not modify license semantics',
    'preserve backwards compatibility',
  ],
  queue: [
    {
      id: 'TASK-42',
      title: 'Implement package registry endpoint',
      state: 'working',
      owner: 'code-03',
    },
    {
      id: 'TASK-43',
      title: 'Run integration review',
      state: 'queued',
      dependsOn: ['TASK-42'],
    },
  ],
  metadata: {
    priority: 'P0',
    attempt: 1,
  },
});

progress.start();
progress.update('Writing endpoint');
progress.update('Running tests');
progress.succeed('Registry endpoint ready');
```

A non-interactive terminal receives a stable snapshot instead of escape-sequence animation:

```text
┌─ SYNCPULSE TASK CONTEXT
  Agent        code-03 · executor
  Task         TASK-42 · Implement the package registry endpoint
  Step         Inspecting existing registry code
  Workspace    implementation
  Branch       agent/code-03/package-registry
  Source       sync.vln.gg
  Deliverables
    • typed registry endpoint
    • unit tests
    • integration notes
  Constraints
    • do not modify license semantics
    • preserve backwards compatibility
  Queue
    ◉ TASK-42 Implement package registry endpoint @code-03
    ○ TASK-43 Run integration review ← TASK-42
  Metadata
    priority: P0
    attempt: 1
└─
```

## Render without a spinner

```ts
import { renderAgentTaskContext } from '@h4shed/tool-ora';

console.log(renderAgentTaskContext(context));
```

This is useful for agent boot messages, task handoffs, log artifacts, CI output, and SyncPulse coordinator responses.

## Plain Ora wrapper

Existing consumers can still use the package as a minimal Ora adapter:

```ts
import { createSpinner } from '@h4shed/tool-ora';

const spinner = createSpinner('Building');
spinner.start();
spinner.succeed('Built');
```

## Context contract

`AgentTaskContext` supports:

- agent and role
- task ID and objective
- current step
- workspace and branch
- source/coordinator
- deliverables
- constraints
- task queue with owner/dependency information
- arbitrary scalar metadata

Queue states are `queued`, `working`, `blocked`, `waiting`, `success`, `failed`, and `cancelled`.

## Design intent

`@h4shed/tool-ora` is deliberately presentation-only. SyncPulse or another coordinator remains authoritative for task assignment, state, dependencies, and policy. This package receives that context and makes it visible inside the agent's terminal without creating a second source of truth.

## Development

```bash
npm run build
npm test
```

Requires Node.js 20+.
