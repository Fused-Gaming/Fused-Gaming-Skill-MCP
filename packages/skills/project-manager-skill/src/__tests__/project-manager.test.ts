/**
 * Contract checks: every advertised tool has a handler and every handler is advertised.
 */

import { skillTools } from '../index.js';
import { TOOL_NAMES, runTool } from '../handlers.js';

describe('Project Manager Skill contracts', () => {
  it('advertises exactly the tools the dispatcher implements', () => {
    expect(skillTools.map((t) => t.name).sort()).toEqual([...TOOL_NAMES].sort());
  });

  it('declares an object input schema with required fields for every tool', () => {
    for (const tool of skillTools) {
      expect(tool.inputSchema.type).toBe('object');
      expect(Array.isArray(tool.inputSchema.required)).toBe(true);
      expect(tool.inputSchema.required.length).toBeGreaterThan(0);
    }
  });

  it('returns a structured failure, never throws, when called with garbage', () => {
    for (const tool of skillTools) {
      expect(() => runTool(tool.name, undefined)).not.toThrow();
      expect(runTool(tool.name, undefined).ok).toBe(false);
    }
  });
});
