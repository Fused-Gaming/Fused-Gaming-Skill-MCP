# Mermaid Terminal Skill

Visualization engine for generating Mermaid diagrams in Fused Gaming MCP.

## Overview

The Mermaid Terminal Skill provides tools to generate professional diagrams for workflows, architecture, sequences, and more using Mermaid syntax.

## Features

- ✅ Flowchart generation
- ✅ Sequence diagram creation
- ✅ Architecture visualization
- ✅ Class and state diagrams
- ✅ Entity-relationship diagrams
- ✅ Gantt charts for project timelines
- ✅ Diagram validation
- ✅ Multiple export formats

## Installation

```bash
npm install
npm run build
```

## Usage

### Generate Flowchart

```typescript
import { generateFlowchart } from '@fused-gaming/skill-mermaid-terminal';

const flowchart = generateFlowchart('Development Process', [
  { id: 'start', text: 'Start' },
  { id: 'dev', text: 'Development' },
  { id: 'test', text: 'Testing' },
  { id: 'deploy', text: 'Deploy' },
  { id: 'end', text: 'End' }
]);

console.log(flowchart.code);
```

### Generate Architecture Diagram

```typescript
const architecture = generateArchitectureDiagram('System Architecture', [
  { name: 'Frontend', type: 'React' },
  { name: 'API', type: 'Node.js' },
  { name: 'Database', type: 'PostgreSQL' },
  { name: 'Cache', type: 'Redis' }
]);
```

### Generate Sequence Diagram

```typescript
const sequence = generateSequenceDiagram(
  'User Authentication',
  ['User', 'Browser', 'Server', 'Database'],
  [
    { from: 'User', to: 'Browser', label: 'Enter credentials' },
    { from: 'Browser', to: 'Server', label: 'POST /login' },
    { from: 'Server', to: 'Database', label: 'Query user' },
    { from: 'Database', to: 'Server', label: 'User data' },
    { from: 'Server', to: 'Browser', label: 'Auth token' }
  ]
);
```

## API

### generateDiagram(input): MermaidDiagram
Creates a Mermaid diagram from definition.

### generateFlowchart(title, steps): MermaidDiagram
Generates a flowchart with specified steps.

### generateArchitectureDiagram(title, components): MermaidDiagram
Creates an architecture diagram.

### generateSequenceDiagram(title, actors, messages): MermaidDiagram
Generates a sequence diagram showing interactions.

## Supported Diagram Types

- **flowchart** - Process flows and workflows
- **sequence** - Message interactions between actors
- **class** - Object-oriented class hierarchies
- **state** - State machines and transitions
- **erDiagram** - Entity relationship diagrams
- **gantt** - Project timelines and schedules
- **graph** - General graphs and networks

## Integration

### With Project Status Tool
```typescript
// Visualize project dependencies
const deps = project.dependencies.map(d => ({
  from: project.name,
  to: d.projectName,
  label: d.status
}));
```

### With Daily Review Skill
```typescript
// Show weekly productivity trends
const diagram = generateFlowchart('Weekly Productivity', 
  weeklyMetrics.days.map((day, i) => ({
    id: `day${i}`,
    text: `${day.date}: ${day.metrics.averageFocusScore}/10`
  }))
);
```

## Output Formats

Diagrams are exported as:
- Mermaid markdown code
- PNG/SVG (with additional rendering)
- Interactive HTML
- JSON structure

## Development Status

- [x] Basic diagram generation
- [x] Flowchart support
- [x] Sequence diagrams
- [x] Architecture diagrams
- [ ] Advanced styling options
- [ ] Real-time preview
- [ ] Diagram templates
- [ ] SVG/PNG export

## License

Apache-2.0
