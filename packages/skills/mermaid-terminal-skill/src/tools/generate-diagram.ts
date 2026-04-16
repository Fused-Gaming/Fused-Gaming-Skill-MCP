/**
 * Generate Diagram Tool
 */

import { MermaidDiagram, DiagramType } from '../types.js';

export interface GenerateDiagramInput {
  title: string;
  type: DiagramType;
  description?: string;
  definition: string;
}

export function generateDiagram(input: GenerateDiagramInput): MermaidDiagram {
  const diagramId = `mermaid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const diagram: MermaidDiagram = {
    id: diagramId,
    title: input.title,
    type: input.type,
    description: input.description,
    code: formatMermaidCode(input.type, input.definition),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return diagram;
}

/**
 * Format mermaid code with proper syntax
 */
function formatMermaidCode(type: DiagramType, definition: string): string {
  return `${type}\n${definition}`;
}

/**
 * Generate flowchart diagram
 */
export function generateFlowchart(title: string, steps: Array<{ id: string; text: string }>): MermaidDiagram {
  let definition = '';
  steps.forEach((step, index) => {
    if (index === 0) {
      definition += `    ${step.id}["${step.text}"]\n`;
    } else {
      definition += `    ${steps[index - 1].id} --> ${step.id}["${step.text}"]\n`;
    }
  });

  return generateDiagram({
    title,
    type: 'flowchart',
    definition,
  });
}

/**
 * Generate architecture diagram
 */
export function generateArchitectureDiagram(
  title: string,
  components: Array<{ name: string; type: string }>
): MermaidDiagram {
  let definition = '';
  components.forEach((comp) => {
    definition += `    ${comp.name}["${comp.name}<br/>(${comp.type})"]\n`;
  });

  return generateDiagram({
    title,
    type: 'graph',
    definition,
  });
}

/**
 * Generate sequence diagram
 */
export function generateSequenceDiagram(
  title: string,
  actors: string[],
  messages: Array<{ from: string; to: string; label: string }>
): MermaidDiagram {
  let definition = '';
  definition += `    autonumber\n`;

  actors.forEach((actor) => {
    definition += `    actor ${actor}\n`;
  });

  messages.forEach((msg) => {
    definition += `    ${msg.from} ->> ${msg.to}: ${msg.label}\n`;
  });

  return generateDiagram({
    title,
    type: 'sequence',
    definition,
  });
}

/**
 * Validate diagram code
 */
export function validateDiagram(diagram: MermaidDiagram): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!diagram.title || diagram.title.trim().length === 0) {
    errors.push('Diagram title is required');
  }

  if (!diagram.code || diagram.code.trim().length === 0) {
    errors.push('Diagram code is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
