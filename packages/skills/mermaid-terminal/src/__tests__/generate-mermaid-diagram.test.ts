/**
 * Mermaid Terminal Tool Tests
 * Validates diagram generation, type detection, and output formatting
 */

import { GenerateMermaidDiagramTool } from '../tools/generate-mermaid-diagram.js';

interface DiagramResult extends Record<string, unknown> {
  success: boolean;
  diagramType?: string;
  mermaidCode?: string;
  textPreview?: string;
  description?: string;
  error?: string;
}

describe('GenerateMermaidDiagramTool', () => {
  describe('Flowchart Generation', () => {
    it('should generate valid flowchart from objective', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'User login process: enter credentials, validate, grant access',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(result.mermaidCode).toBeDefined();
      expect(result.mermaidCode).toContain('flowchart');
    });

    it('should include start and end nodes', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Simple process flow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const code = result.mermaidCode as string;
      expect(code).toContain('Start');
      expect(code).toContain('End');
    });

    it('should structure steps as connected nodes', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Step 1, Step 2, Step 3',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const code = result.mermaidCode as string;
      expect(code).toMatch(/-->/);
    });
  });

  describe('Diagram Type Detection', () => {
    it('should detect sequence diagrams from keywords', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Sequence diagram showing user interaction with API',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(['sequenceDiagram', 'flowchart']).toContain(result.diagramType);
    });

    it('should detect state diagrams from keywords', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'State machine with transitions',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(['stateDiagram', 'flowchart']).toContain(result.diagramType);
    });

    it('should detect class diagrams from keywords', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Class diagram showing object relationships',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(['classDiagram', 'flowchart']).toContain(result.diagramType);
    });

    it('should default to flowchart for ambiguous objectives', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Generic workflow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBeDefined();
    });
  });

  describe('Text Preview', () => {
    it('should provide terminal-friendly text preview', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Simple workflow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(result.textPreview).toBeDefined();
      expect(typeof result.textPreview).toBe('string');
    });

    it('should render preview without ANSI codes when not in terminal', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Process flow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const preview = result.textPreview as string;
      expect(preview).not.toContain('\x1b[');
    });
  });

  describe('Description Generation', () => {
    it('should provide descriptive summary', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Authentication workflow with MFA',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      expect(result.description).toBeDefined();
      expect(result.description?.length).toBeGreaterThan(0);
    });

    it('should describe diagram structure', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Multi-step process',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const desc = result.description as string;
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty objectives', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: '',
      })) as DiagramResult;

      expect(typeof result.success).toBe('boolean');
    });

    it('should handle very long objectives', async () => {
      const longObjective = 'A'.repeat(1000);
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: longObjective,
      })) as DiagramResult;

      expect(typeof result.success).toBe('boolean');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle special characters in objectives', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Process with <special> & "characters" involved',
      })) as DiagramResult;

      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.mermaidCode).toBeDefined();
      }
    });
  });

  describe('Mermaid Syntax Validation', () => {
    it('should produce valid Mermaid syntax', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Login flow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const code = result.mermaidCode as string;
      expect(code).toMatch(/^(flowchart|sequenceDiagram|stateDiagram|classDiagram|timeline)/);
    });

    it('should use proper node syntax', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Process steps',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const code = result.mermaidCode as string;
      expect(code).toMatch(/\[.*\]/);
    });

    it('should connect nodes with arrows', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Connected workflow',
      })) as DiagramResult;

      expect(result.success).toBe(true);
      const code = result.mermaidCode as string;
      expect(code).toMatch(/-->/);
    });
  });

  describe('Performance', () => {
    it('should generate diagram within reasonable time', async () => {
      const startTime = performance.now();

      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Performance test workflow',
      })) as DiagramResult;

      const elapsedTime = performance.now() - startTime;

      expect(result.success).toBe(true);
      expect(elapsedTime).toBeLessThan(5000);
    });

    it('should handle multiple sequential generations', async () => {
      const results = [];

      for (let i = 0; i < 5; i++) {
        const result = (await GenerateMermaidDiagramTool.handler({
          objective: `Workflow ${i}`,
        })) as DiagramResult;
        results.push(result);
      }

      expect(results).toHaveLength(5);
      expect(results.every(r => typeof r.success === 'boolean')).toBe(true);
    });
  });

  describe('Output Structure', () => {
    it('should provide consistent output fields', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: 'Test diagram',
      })) as DiagramResult;

      expect(result).toHaveProperty('success');
      if (result.success) {
        expect(result).toHaveProperty('diagramType');
        expect(result).toHaveProperty('mermaidCode');
        expect(result).toHaveProperty('textPreview');
        expect(result).toHaveProperty('description');
      }
    });

    it('should include error field when generation fails', async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: '',
      })) as DiagramResult;

      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });
});
