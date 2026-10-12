# @h4shed/skill-project-manager-skill

Task and project management skill for team collaboration in the Fused Gaming MCP ecosystem.

## Installation

```bash
npm install @h4shed/skill-project-manager-skill
```

Requires Node.js `>=20`.

## Features

- Create tasks with validated priority, due date (`YYYY-MM-DD`), estimate, and labels
- Status workflow: `todo`, `in-progress`, `in-review`, `done`, `blocked` (reopening clears `completedAt`)
- Assignment, time logging, labels, and dependencies
- Metrics: completion rate, status counts, overdue tasks, estimated vs. actual hours, average priority
- Structured results for every call: `{ ok: true, data }` or `{ ok: false, error, issues }`

## Design

The skill is stateless. Every tool receives the task it operates on and returns the
updated task, so you own persistence. Tools never throw on bad input; they return a
structured failure instead.

## Tools

| Tool | Input | Output `data` |
| --- | --- | --- |
| `create-task` | `title` (required), `description?`, `projectId?`, `priority?`, `assignee?`, `dueDate?`, `estimatedHours?`, `labels?` | `{ task }` |
| `update-task-status` | `task`, `status` | `{ task }` |
| `assign-task` | `task`, `assignee` | `{ task }` |
| `log-task-time` | `task`, `hours` (positive) | `{ task }` |
| `add-task-label` | `task`, `label` | `{ task }` |
| `add-task-dependency` | `task`, `dependsOn` | `{ task }` |
| `get-metrics` | `tasks`, `projectId?` | `{ metrics, taskCount }` |

The `skillTools` export lists the JSON input schema for each tool.

## Usage

```typescript
import { runTool, type Task } from '@h4shed/skill-project-manager-skill';

const created = runTool('create-task', { title: 'Ship v1', priority: 'high', dueDate: '2026-10-30' });
if (created.ok) {
  const { task } = created.data as { task: Task };
  const done = runTool('update-task-status', { task, status: 'done' });
}
```

## CLI

The package installs a `skill-project-manager` command. Pass JSON as the second
argument or pipe it on stdin:

```bash
skill-project-manager create-task '{"title":"Write docs","priority":"low"}'
echo '{"tasks":[]}' | skill-project-manager get-metrics
```

Output is JSON on stdout with exit code `0` on success. Failures print JSON to
stderr and exit with code `1`. Run `skill-project-manager --help` for the tool list.

## Development

```bash
npm run build      # emits dist/ (index.js, cli.js, ...)
npm test           # jest unit tests
npm run typecheck
```

`prepublishOnly` rebuilds `dist/` before every publish, and only `dist/` and this
README are shipped in the tarball.

## License

Apache-2.0
