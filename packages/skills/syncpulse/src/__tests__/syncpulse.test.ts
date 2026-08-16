/**
 * SyncPulse Skill Tests
 * Validates core functionality: project state caching, agent coordination, and email automation
 */

import { createSyncPulseSkill } from '../index';

describe('SyncPulse Skill', () => {
  let skill: ReturnType<typeof createSyncPulseSkill>;

  beforeEach(() => {
    skill = createSyncPulseSkill();
  });

  describe('Skill Registration', () => {
    it('should export createSyncPulseSkill function', () => {
      expect(typeof createSyncPulseSkill).toBe('function');
    });

    it('should create skill instance with correct metadata', () => {
      expect(skill.name).toBe('syncpulse');
      expect(skill.version).toBe('1.0.0');
      expect(skill.organization).toBe('Fused-Gaming');
      expect(skill.description).toContain('intelligent');
    });

    it('should have all required services', () => {
      expect(skill.services).toBeDefined();
      expect(skill.services.swarm).toBeDefined();
      expect(skill.services.memory).toBeDefined();
      expect(skill.services.tasks).toBeDefined();
      expect(skill.services.cache).toBeDefined();
      expect(skill.services.email).toBeDefined();
    });
  });

  describe('Tools Registration', () => {
    it('should export 16 MCP tools', () => {
      expect(skill.tools).toHaveLength(16);
    });

    it('should have core coordination tools', () => {
      const toolNames = skill.tools.map(t => t.name);
      expect(toolNames).toContain('synchronize_project_state');
      expect(toolNames).toContain('query_cache');
      expect(toolNames).toContain('coordinate_agents');
      expect(toolNames).toContain('analyze_performance');
    });

    it('should have email automation tools', () => {
      const toolNames = skill.tools.map(t => t.name);
      expect(toolNames).toContain('send_email');
      expect(toolNames).toContain('send_bulk_email');
      expect(toolNames).toContain('send_marketing_campaign');
      expect(toolNames).toContain('verify_email_configuration');
    });

    it('should have authentication workflow tools', () => {
      const toolNames = skill.tools.map(t => t.name);
      expect(toolNames).toContain('send_magic_link_login');
      expect(toolNames).toContain('send_mfa_code');
      expect(toolNames).toContain('send_password_reset');
      expect(toolNames).toContain('send_security_alert');
    });

    it('should have business workflow tools', () => {
      const toolNames = skill.tools.map(t => t.name);
      expect(toolNames).toContain('send_invoice');
      expect(toolNames).toContain('send_newsletter');
    });

    it('should have operational workflow tools', () => {
      const toolNames = skill.tools.map(t => t.name);
      expect(toolNames).toContain('send_outage_notice');
      expect(toolNames).toContain('send_maintenance_notice');
      expect(toolNames).toContain('send_ticket_update');
    });
  });

  describe('Tool Structure Validation', () => {
    it('should have valid inputSchema for all tools', () => {
      skill.tools.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      });
    });

    it('should have handler function for all tools', () => {
      skill.tools.forEach(tool => {
        expect(typeof tool.handler).toBe('function');
      });
    });

    it('should have descriptions for all tools', () => {
      skill.tools.forEach(tool => {
        expect(tool.description).toBeDefined();
        expect(tool.description.length).toBeGreaterThan(0);
      });
    });

    it('synchronize_project_state tool should require projectId', () => {
      const tool = skill.tools.find(t => t.name === 'synchronize_project_state');
      expect(tool?.inputSchema.required).toContain('projectId');
    });

    it('send_email tool should require recipients, subject, htmlBody', () => {
      const tool = skill.tools.find(t => t.name === 'send_email');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('recipients');
      expect(required).toContain('subject');
      expect(required).toContain('htmlBody');
    });
  });

  describe('Service Initialization', () => {
    it('should initialize SwarmOrchestrator', () => {
      expect(skill.services.swarm.constructor.name).toBe('SwarmOrchestrator');
    });

    it('should initialize MemorySystem', () => {
      expect(skill.services.memory.constructor.name).toBe('MemorySystem');
    });

    it('should initialize TaskOrchestrator', () => {
      expect(skill.services.tasks.constructor.name).toBe('TaskOrchestrator');
    });

    it('should initialize CacheService', () => {
      expect(skill.services.cache.constructor.name).toBe('CacheService');
    });

    it('should initialize EmailService', () => {
      expect(skill.services.email.constructor.name).toBe('EmailService');
    });
  });

  describe('Tool Configuration', () => {
    it('should have unique tool names', () => {
      const names = skill.tools.map(t => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('coordinate_agents tool should support multiple topologies', () => {
      const tool = skill.tools.find(t => t.name === 'coordinate_agents');
      const topologyEnum = tool?.inputSchema.properties?.topology?.enum;
      expect(topologyEnum).toContain('hierarchical');
      expect(topologyEnum).toContain('mesh');
      expect(topologyEnum).toContain('adaptive');
    });

    it('send_bulk_email tool should support per-recipient variables', () => {
      const tool = skill.tools.find(t => t.name === 'send_bulk_email');
      const recipientSchema = tool?.inputSchema.properties?.recipients?.items;
      expect(recipientSchema?.properties?.variables).toBeDefined();
    });
  });

  describe('Email Workflow Tools', () => {
    describe('send_magic_link_login', () => {
      it('should require email and magicLink', () => {
        const tool = skill.tools.find(t => t.name === 'send_magic_link_login');
        const required = tool?.inputSchema.required || [];
        expect(required).toContain('email');
        expect(required).toContain('magicLink');
      });

      it('should support optional expiry and branding', () => {
        const tool = skill.tools.find(t => t.name === 'send_magic_link_login');
        const props = tool?.inputSchema.properties || {};
        expect(props.expiryMinutes).toBeDefined();
        expect(props.companyName).toBeDefined();
      });
    });

    describe('send_mfa_code', () => {
      it('should require email and mfaCode', () => {
        const tool = skill.tools.find(t => t.name === 'send_mfa_code');
        const required = tool?.inputSchema.required || [];
        expect(required).toContain('email');
        expect(required).toContain('mfaCode');
      });
    });

    describe('send_marketing_campaign', () => {
      it('should require campaign metadata', () => {
        const tool = skill.tools.find(t => t.name === 'send_marketing_campaign');
        const required = tool?.inputSchema.required || [];
        expect(required).toContain('campaignName');
        expect(required).toContain('recipients');
        expect(required).toContain('subject');
        expect(required).toContain('htmlBody');
      });

      it('should support tracking pixel', () => {
        const tool = skill.tools.find(t => t.name === 'send_marketing_campaign');
        const props = tool?.inputSchema.properties || {};
        expect(props.trackingPixel).toBeDefined();
      });
    });
  });

  describe('Operational Workflow Tools', () => {
    describe('send_outage_notice', () => {
      it('should require service, status, and startTime', () => {
        const tool = skill.tools.find(t => t.name === 'send_outage_notice');
        const required = tool?.inputSchema.required || [];
        expect(required).toContain('service');
        expect(required).toContain('status');
        expect(required).toContain('startTime');
      });
    });

    describe('send_maintenance_notice', () => {
      it('should require maintenance window details', () => {
        const tool = skill.tools.find(t => t.name === 'send_maintenance_notice');
        const required = tool?.inputSchema.required || [];
        expect(required).toContain('service');
        expect(required).toContain('startTime');
        expect(required).toContain('endTime');
        expect(required).toContain('impact');
      });
    });
  });

  describe('Skill Export', () => {
    it('should export SwarmOrchestrator', () => {
      expect(require('../index').SwarmOrchestrator).toBeDefined();
    });

    it('should export MemorySystem', () => {
      expect(require('../index').MemorySystem).toBeDefined();
    });

    it('should export TaskOrchestrator', () => {
      expect(require('../index').TaskOrchestrator).toBeDefined();
    });

    it('should export CacheService', () => {
      expect(require('../index').CacheService).toBeDefined();
    });

    it('should export EmailService', () => {
      expect(require('../index').EmailService).toBeDefined();
    });

    it('should export type definitions', () => {
      const exports = require('../index');
      expect(Object.keys(exports).length).toBeGreaterThan(7);
    });
  });
});
