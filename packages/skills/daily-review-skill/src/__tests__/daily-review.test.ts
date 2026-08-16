/**
 * Daily Review Skill Tests
 * Validates session tracking, daily/weekly reviews, and productivity metrics
 */

import { skillTools, generateDailyReview, analyzeWeekly } from '../index';

describe('Daily Review Skill', () => {
  describe('Skill Tools Registration', () => {
    it('should export 3 skill tools', () => {
      expect(skillTools).toHaveLength(3);
    });

    it('should have log-session tool', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('session');
    });

    it('should have generate-daily-review tool', () => {
      const tool = skillTools.find(t => t.name === 'generate-daily-review');
      expect(tool).toBeDefined();
    });

    it('should have analyze-weekly tool', () => {
      const tool = skillTools.find(t => t.name === 'analyze-weekly');
      expect(tool).toBeDefined();
    });
  });

  describe('Tool Structure Validation', () => {
    it('should have valid inputSchema for all tools', () => {
      skillTools.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      });
    });

    it('should have descriptions for all tools', () => {
      skillTools.forEach(tool => {
        expect(tool.description).toBeDefined();
        expect(tool.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('log-session Tool', () => {
    it('should require essential session fields', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('title');
      expect(required).toContain('startTime');
      expect(required).toContain('endTime');
      expect(required).toContain('durationMinutes');
      expect(required).toContain('focusScore');
    });

    it('should support optional session metadata', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const props = tool?.inputSchema.properties || {};
      expect(props.account).toBeDefined();
      expect(props.artifacts).toBeDefined();
      expect(props.category).toBeDefined();
      expect(props.tools).toBeDefined();
      expect(props.output).toBeDefined();
    });

    it('should support array of tools used', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const toolsProp = tool?.inputSchema.properties?.tools;
      expect(toolsProp?.type).toBe('array');
      expect(toolsProp?.items?.type).toBe('string');
    });
  });

  describe('generate-daily-review Tool', () => {
    it('should require date, sessions, and accomplishments', () => {
      const tool = skillTools.find(t => t.name === 'generate-daily-review');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('date');
      expect(required).toContain('sessions');
      expect(required).toContain('accomplishments');
    });

    it('should support optional blockers and priorities', () => {
      const tool = skillTools.find(t => t.name === 'generate-daily-review');
      const props = tool?.inputSchema.properties || {};
      expect(props.blockers).toBeDefined();
      expect(props.nextDayPriorities).toBeDefined();
      expect(props.notes).toBeDefined();
    });

    it('should accept array of accomplishments', () => {
      const tool = skillTools.find(t => t.name === 'generate-daily-review');
      const accomplishmentsProp = tool?.inputSchema.properties?.accomplishments;
      expect(accomplishmentsProp?.type).toBe('array');
      expect(accomplishmentsProp?.items?.type).toBe('string');
    });
  });

  describe('analyze-weekly Tool', () => {
    it('should require week dates and daily reviews', () => {
      const tool = skillTools.find(t => t.name === 'analyze-weekly');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('weekStart');
      expect(required).toContain('weekEnd');
      expect(required).toContain('dailyReviews');
    });

    it('should accept array of daily review objects', () => {
      const tool = skillTools.find(t => t.name === 'analyze-weekly');
      const dailyReviewsProp = tool?.inputSchema.properties?.dailyReviews;
      expect(dailyReviewsProp?.type).toBe('array');
    });
  });

  describe('Exported Functions', () => {
    it('should export generateDailyReview function', () => {
      expect(typeof generateDailyReview).toBe('function');
    });

    it('should export analyzeWeekly function', () => {
      expect(typeof analyzeWeekly).toBe('function');
    });
  });

  describe('Tool Uniqueness', () => {
    it('should have unique tool names', () => {
      const names = skillTools.map(t => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('Date Format Expectations', () => {
    it('log-session should document time format', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const startTimeProp = tool?.inputSchema.properties?.startTime;
      expect(startTimeProp?.description).toContain('HH:MM');
    });

    it('generate-daily-review should document date format', () => {
      const tool = skillTools.find(t => t.name === 'generate-daily-review');
      const dateProp = tool?.inputSchema.properties?.date;
      expect(dateProp?.description).toContain('YYYY-MM-DD');
    });

    it('analyze-weekly should use ISO date format', () => {
      const tool = skillTools.find(t => t.name === 'analyze-weekly');
      const props = tool?.inputSchema.properties || {};
      expect(props.weekStart?.description).toContain('YYYY-MM-DD');
      expect(props.weekEnd?.description).toContain('YYYY-MM-DD');
    });
  });

  describe('Focus Score Validation', () => {
    it('log-session should require focus score', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('focusScore');
    });

    it('focus score should be numeric', () => {
      const tool = skillTools.find(t => t.name === 'log-session');
      const focusScoreProp = tool?.inputSchema.properties?.focusScore;
      expect(focusScoreProp?.type).toBe('number');
    });
  });
});
