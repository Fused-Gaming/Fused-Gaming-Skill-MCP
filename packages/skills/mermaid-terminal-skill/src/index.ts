/**
 * Mermaid Terminal Skill
 * Visualization engine for diagram generation
 */

export * from './types.js';
export * from './tools/generate-diagram.js';

export const skillTools = [
  {
    name: 'generate-diagram',
    description: 'Generate a Mermaid diagram from description',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Diagram title' },
        type: {
          type: 'string',
          enum: ['flowchart', 'sequence', 'class', 'state', 'erDiagram', 'gantt', 'graph'],
          description: 'Diagram type',
        },
        description: { type: 'string', description: 'Diagram description' },
        definition: { type: 'string', description: 'Mermaid diagram definition' },
      },
      required: ['title', 'type', 'definition'],
    },
  },
  {
    name: 'generate-flowchart',
    description: 'Generate a flowchart diagram',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Flowchart title' },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              text: { type: 'string' },
            },
          },
          description: 'Flowchart steps',
        },
      },
      required: ['title', 'steps'],
    },
  },
  {
    name: 'generate-architecture',
    description: 'Generate an architecture diagram',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Architecture title' },
        components: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
            },
          },
          description: 'System components',
        },
      },
      required: ['title', 'components'],
    },
  },
  {
    name: 'generate-sequence',
    description: 'Generate a sequence diagram',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Sequence diagram title' },
        actors: { type: 'array', items: { type: 'string' }, description: 'Actor names' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              label: { type: 'string' },
            },
          },
          description: 'Messages between actors',
        },
      },
      required: ['title', 'actors', 'messages'],
    },
  },
];
