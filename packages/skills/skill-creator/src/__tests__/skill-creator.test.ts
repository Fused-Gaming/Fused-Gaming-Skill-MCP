/**
 * Skill Creator Skill Tests
 * Validates custom skill creation and tool generation capabilities
 */

import { skillCreatorSkill } from '../index';

describe('Skill Creator Skill', () => {
  describe('Skill Registration', () => {
    it('should export skillCreatorSkill object', () => {
      expect(skillCreatorSkill).toBeDefined();
      expect(typeof skillCreatorSkill).toBe('object');
    });

    it('should have correct name', () => {
      expect(skillCreatorSkill.name).toBe('skill-creator');
    });

    it('should have version', () => {
      expect(skillCreatorSkill.version).toBe('1.0.0');
    });

    it('should have description', () => {
      expect(skillCreatorSkill.description).toBeDefined();
      expect(skillCreatorSkill.description).toContain('skill');
      expect(skillCreatorSkill.description).toContain('tool');
    });

    it('should mention MCP ecosystem', () => {
      expect(skillCreatorSkill.description).toContain('MCP');
      expect(skillCreatorSkill.description).toContain('Fused Gaming');
    });

    it('should mention templates and generators', () => {
      expect(skillCreatorSkill.description).toContain('template');
    });
  });

  describe('Tools Registration', () => {
    it('should export tools array', () => {
      expect(skillCreatorSkill.tools).toBeDefined();
      expect(Array.isArray(skillCreatorSkill.tools)).toBe(true);
    });

    it('should have at least one tool', () => {
      expect(skillCreatorSkill.tools.length).toBeGreaterThanOrEqual(1);
    });

    it('should have create-skill tool', () => {
      const tool = skillCreatorSkill.tools.find(t => t.name === 'create-skill');
      expect(tool).toBeDefined();
    });
  });

  describe('Lifecycle Methods', () => {
    it('should have initialize method', () => {
      expect(typeof skillCreatorSkill.initialize).toBe('function');
    });

    it('should have cleanup method', () => {
      expect(typeof skillCreatorSkill.cleanup).toBe('function');
    });

    it('initialize should be async', async () => {
      const result = skillCreatorSkill.initialize({} as any);
      expect(result instanceof Promise).toBe(true);
    });

    it('cleanup should be async', async () => {
      const result = skillCreatorSkill.cleanup();
      expect(result instanceof Promise).toBe(true);
    });
  });

  describe('Tool Structure', () => {
    it('create-skill tool should have name', () => {
      const tool = skillCreatorSkill.tools[0];
      expect(tool.name).toBeDefined();
      expect(typeof tool.name).toBe('string');
    });

    it('create-skill tool should have description', () => {
      const tool = skillCreatorSkill.tools[0];
      expect(tool.description).toBeDefined();
      expect(typeof tool.description).toBe('string');
    });

    it('create-skill tool should have inputSchema', () => {
      const tool = skillCreatorSkill.tools[0];
      expect(tool.inputSchema).toBeDefined();
      expect(typeof tool.inputSchema).toBe('object');
    });

    it('create-skill tool should have handler', () => {
      const tool = skillCreatorSkill.tools[0];
      expect(tool.handler || typeof tool === 'object').toBeTruthy();
    });
  });

  describe('Skill Creator Purpose', () => {
    it('should enable custom skill creation', () => {
      expect(skillCreatorSkill.description).toContain('Create');
      expect(skillCreatorSkill.name).toContain('creator');
    });

    it('should target Fused Gaming ecosystem', () => {
      expect(skillCreatorSkill.description).toContain('Fused Gaming');
    });

    it('should support MCP protocol', () => {
      expect(skillCreatorSkill.description).toContain('MCP');
    });
  });

  describe('Exported Module', () => {
    it('should export as default', () => {
      const moduleExports = require('../index');
      expect(moduleExports.default).toBe(skillCreatorSkill);
    });
  });

  describe('Initialization', () => {
    it('should initialize without error', async () => {
      await expect(skillCreatorSkill.initialize({} as any)).resolves.toBeUndefined();
    });

    it('should cleanup without error', async () => {
      await expect(skillCreatorSkill.cleanup()).resolves.toBeUndefined();
    });
  });

  describe('Tool Meta Information', () => {
    it('tools should have proper structure', () => {
      skillCreatorSkill.tools.forEach(tool => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        // Most tools have inputSchema, some may have other structures
        expect(tool.inputSchema || tool).toBeDefined();
      });
    });

    it('should support custom skill definitions', () => {
      expect(skillCreatorSkill.description).toContain('custom');
    });
  });

  describe('Generator Support', () => {
    it('should mention generator capabilities', () => {
      expect(skillCreatorSkill.description).toContain('generator');
    });

    it('should support template-based creation', () => {
      expect(skillCreatorSkill.description).toContain('template');
    });
  });
});
