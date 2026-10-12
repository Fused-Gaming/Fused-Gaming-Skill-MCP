# @h4shed/skill-project-status-tool

Summarize current project status, risks, and next actions. Provides typed tools for creating projects, updating progress and status, validating project records, building portfolio dashboards, and summarizing status with next actions.

## Installation

```bash
npm install @h4shed/skill-project-status-tool
```

Requires Node.js `>=20`.

## CLI

The package installs a `skill-project-status-tool` binary. Each tool takes a JSON object and prints JSON to stdout.

```bash
# JSON as an argument
skill-project-status-tool create-project '{"name":"Beta","owner":"bob"}'

# JSON on stdin
echo '{"projects":[]}' | skill-project-status-tool generate-dashboard

# List tools
skill-project-status-tool --list
```

Exit codes: `0` on success. On invalid input (bad JSON, missing fields, unknown tool) the command prints a JSON error object to stderr and exits `1`.

When run from a checkout, use `node dist/cli.js <tool-name> '<json>'`.

## Programmatic use

```ts
import { runTool, summarizeProjectStatus } from '@h4shed/skill-project-status-tool';

const result = runTool('create-project', { name: 'Beta', owner: 'bob' });
if (result.ok) {
  console.log(result.data);
} else {
  console.error(result.error.code, result.error.issues);
}
```

`runTool` never throws for bad input. It returns `{ ok: false, error: { code, message, issues? } }` with code `UNKNOWN_TOOL`, `INVALID_INPUT`, or `INTERNAL_ERROR`. Input and output types are exported from the package root (`CreateProjectInput`, `ToolContracts`, `ProjectSummary`, and others).

## Tools

| Tool | Input | Output |
| --- | --- | --- |
| `create-project` | `name`, `owner`, optional `description`, `targetDate`, `teamMembers` | `{ project }` in `planning` status |
| `update-project-progress` | `project`, `tasksCompleted`, `tasksTotal` | `{ project }` with recalculated `progress` and `health` |
| `update-project-status` | `project`, `status`, optional `notes` | `{ project }`; `completed` stamps `completionDate` |
| `validate-project` | `project` | `{ valid, errors }` |
| `generate-dashboard` | `projects` | `{ dashboard, text }` |
| `summarize-project-status` | `objective`, optional `context`, `projects` | `{ success, tool, objective, context, summary }` with `nextActions` |

Statuses: `planning`, `in-progress`, `blocked`, `completed`, `on-hold`. Health: `excellent`, `good`, `fair`, `poor`, `critical`.

`project` objects must include `id`, `name`, `owner`, `status`, `health`, `startDate`, `progress` (0-100), `stats`, and `updatedAt`. Nested `team`, `risks`, `blockers`, `metrics`, and `dependencies` are checked only to be arrays.

## Development

```bash
# from the package directory
npm run build   # emits dist/ (dist/index.js, dist/cli.js)
npm test        # jest + ts-jest
npx tsc --noEmit -p tsconfig.json
```

From the repository root:

```bash
npm run build --workspace=packages/skills/project-status-tool
npm run test --workspace=packages/skills/project-status-tool
```

`prepublishOnly` runs the build, and the published tarball contains only `dist/` and this README.

## License

Apache-2.0
