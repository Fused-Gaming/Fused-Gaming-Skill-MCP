# @fused-gaming/skill-ux-journeymapper

Create UX journey maps with pain points, touchpoints, and opportunities.

## Installation

```bash
npm install @fused-gaming/skill-ux-journeymapper
```

## Tools

### `map-user-journey`

Builds a structured UX journey map and returns:

- phase-by-phase goals
- touchpoints
- pain points
- opportunities
- success signals
- summary themes and next action

#### Input

- `objective` (required): primary journey outcome to map
- `context` (optional): domain details to tune the output
- `persona` (optional): user type (for example `commander`, `squad lead`, `player`)
- `phases` (optional): comma-separated phase names (defaults to `Discover, Plan, Execute, Monitor, Adapt`)

#### Specialized behavior

If the objective/context contains command-and-control keywords (`army`, `squad`, `troop`, `commander`, `orchestrate`), the tool emits a mission-operations journey template optimized for deploy/monitor/adapt workflows.

## Example

```json
{
  "objective": "Orchestrate army units with an easy-to-deploy and visual interface",
  "context": "Real-time operations room with agent-assisted recommendations",
  "persona": "Commander"
}
```

## Implementation Status

- ✅ Package scaffolded
- ✅ Tool schema and production handler implemented
- ⏳ Add automated tests and publish package
