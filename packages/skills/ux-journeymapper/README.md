# @h4shed/skill-ux-journeymapper

Create UX journey maps with pain points, touchpoints, and opportunities.

## Installation

```bash
npm install @h4shed/skill-ux-journeymapper
```

## Tools

### `map-user-journey`

Create UX journey maps with pain points, touchpoints, and opportunities.

## Persona Input

The optional `persona` argument is validated before any map is generated:

```typescript
{
  name: string;                 // required, 1-120 chars
  role: string;                 // required, 1-120 chars
  goals: string[];              // required, 1-20 non-empty strings
  painPoints?: string[];        // optional, up to 20 non-empty strings
  techProficiency?: "novice" | "intermediate" | "expert";
}
```

Unknown fields are rejected. Invalid input never throws: the tool returns
`{ success: false, error, issues: [{ path, message }] }`.

## Output Contract

Success results match `JourneyMapSuccess` (`success: true`, `persona`, `goal`,
`stages[]`, `summary`, `keyInsights[]`, optional `personaProfile`). Every stage
has non-empty `touchpoints`, `emotions`, `painPoints` and `opportunities`.
Use `validateJourneyMap` / `isJourneyMapResult` from `src/validation.ts` to check
results. Generation is deterministic: identical input yields identical output.

## Implementation Status

- ✅ Persona input validation with structured issues
- ✅ Typed output contract with validator
- ✅ Jest suite with snapshot coverage of the default template output

## Features

- **Multi-stage journey mapping**: Automatically generates journey stages (Awareness → Retention)
- **Touchpoint identification**: Identifies customer touchpoints at each stage
- **Pain point analysis**: Detects potential friction points and frustrations
- **Opportunity discovery**: Recommends improvement opportunities
- **Emotional journey**: Captures user emotions throughout the journey
- **Actionable insights**: Provides key insights and recommendations
- **Persona-aware**: Adapts journey mapping based on user persona

## Usage Examples

```typescript
// Basic e-commerce journey
{
  objective: "E-commerce customer journey",
  context: "Budget-conscious millennial"
}

// Support/retention journey
{
  objective: "SaaS customer support and retention journey"
}

// Product adoption
{
  objective: "Mobile app user adoption journey",
  context: "Non-technical user"
}
```

## Output Structure

Each journey map includes:
- **Stages**: Key phases of the user journey
- **Touchpoints**: Customer interaction points at each stage
- **Pain Points**: Issues and frustrations experienced
- **Opportunities**: Recommendations for improvement
- **Emotions**: Emotional tone at each stage
- **Key Insights**: Summary of findings and recommendations
## Usage

This package exports an MCP skill definition that can be loaded by `@h4shed/mcp-core` via the workspace skill registry.

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/ux-journeymapper
npm run test --workspace=packages/skills/ux-journeymapper
```

Snapshots live in `src/__tests__/__snapshots__/`. Regenerate intentionally with
`npx jest -u` inside the package.

## License

Apache-2.0
