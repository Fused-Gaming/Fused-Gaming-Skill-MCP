/**
 * Project Manager Skill Tests
 * Validates task management, status tracking, and team collaboration features
 */

import { skillTools } from '../index';

describe('Project Manager Skill', () => {
  describe('Skill Tools Registration', () => {
    it('should export 5 skill tools', () => {
      expect(skillTools).toHaveLength(5);
    });

    it('should have create-task tool', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      expect(tool).toBeDefined();
    });

    it('should have update-task-status tool', () => {
      const tool = skillTools.find(t => t.name === 'update-task-status');
      expect(tool).toBeDefined();
    });

    it('should have assign-task tool', () => {
      const tool = skillTools.find(t => t.name === 'assign-task');
      expect(tool).toBeDefined();
    });

    it('should have log-task-time tool', () => {
      const tool = skillTools.find(t => t.name === 'log-task-time');
      expect(tool).toBeDefined();
    });

    it('should have get-metrics tool', () => {
      const tool = skillTools.find(t => t.name === 'get-metrics');
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

  describe('create-task Tool', () => {
    it('should require title', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('title');
    });

    it('should support priority levels', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const priorityProp = tool?.inputSchema.properties?.priority;
      expect(priorityProp?.enum).toContain('critical');
      expect(priorityProp?.enum).toContain('high');
      expect(priorityProp?.enum).toContain('medium');
      expect(priorityProp?.enum).toContain('low');
    });

    it('should support optional task metadata', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const props = tool?.inputSchema.properties || {};
      expect(props.description).toBeDefined();
      expect(props.projectId).toBeDefined();
      expect(props.assignee).toBeDefined();
      expect(props.dueDate).toBeDefined();
      expect(props.estimatedHours).toBeDefined();
      expect(props.labels).toBeDefined();
    });

    it('should support array of labels', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const labelsProp = tool?.inputSchema.properties?.labels;
      expect(labelsProp?.type).toBe('array');
      expect(labelsProp?.items?.type).toBe('string');
    });
  });

  describe('update-task-status Tool', () => {
    it('should require taskId and status', () => {
      const tool = skillTools.find(t => t.name === 'update-task-status');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('taskId');
      expect(required).toContain('status');
    });

    it('should support defined status values', () => {
      const tool = skillTools.find(t => t.name === 'update-task-status');
      const statusProp = tool?.inputSchema.properties?.status;
      expect(statusProp?.enum).toContain('todo');
      expect(statusProp?.enum).toContain('in-progress');
      expect(statusProp?.enum).toContain('in-review');
      expect(statusProp?.enum).toContain('done');
      expect(statusProp?.enum).toContain('blocked');
    });

    it('should have 5 status options', () => {
      const tool = skillTools.find(t => t.name === 'update-task-status');
      const statusProp = tool?.inputSchema.properties?.status;
      expect(statusProp?.enum).toHaveLength(5);
    });
  });

  describe('assign-task Tool', () => {
    it('should require taskId and assignee', () => {
      const tool = skillTools.find(t => t.name === 'assign-task');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('taskId');
      expect(required).toContain('assignee');
    });

    it('should have proper field descriptions', () => {
      const tool = skillTools.find(t => t.name === 'assign-task');
      const props = tool?.inputSchema.properties || {};
      expect(props.taskId?.description).toContain('Task ID');
      expect(props.assignee?.description).toContain('name');
    });
  });

  describe('log-task-time Tool', () => {
    it('should require taskId and hours', () => {
      const tool = skillTools.find(t => t.name === 'log-task-time');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('taskId');
      expect(required).toContain('hours');
    });

    it('should have numeric hours field', () => {
      const tool = skillTools.find(t => t.name === 'log-task-time');
      const hoursProp = tool?.inputSchema.properties?.hours;
      expect(hoursProp?.type).toBe('number');
    });
  });

  describe('get-metrics Tool', () => {
    it('should require tasks array', () => {
      const tool = skillTools.find(t => t.name === 'get-metrics');
      const required = tool?.inputSchema.required || [];
      expect(required).toContain('tasks');
    });

    it('should accept optional projectId', () => {
      const tool = skillTools.find(t => t.name === 'get-metrics');
      const props = tool?.inputSchema.properties || {};
      expect(props.projectId).toBeDefined();
    });

    it('should accept array of task objects', () => {
      const tool = skillTools.find(t => t.name === 'get-metrics');
      const tasksProp = tool?.inputSchema.properties?.tasks;
      expect(tasksProp?.type).toBe('array');
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
    it('create-task should use ISO date format for dueDate', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const dueDateProp = tool?.inputSchema.properties?.dueDate;
      expect(dueDateProp?.description).toContain('YYYY-MM-DD');
    });
  });

  describe('Time Tracking', () => {
    it('should support hour-based time logging', () => {
      const tool = skillTools.find(t => t.name === 'log-task-time');
      const hoursProp = tool?.inputSchema.properties?.hours;
      expect(hoursProp?.description).toContain('hours');
    });

    it('should support estimated hours in task creation', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const estimatedHoursProp = tool?.inputSchema.properties?.estimatedHours;
      expect(estimatedHoursProp?.type).toBe('number');
      expect(estimatedHoursProp?.description).toContain('hours');
    });
  });

  describe('Team Collaboration', () => {
    it('should support assignee in task creation', () => {
      const tool = skillTools.find(t => t.name === 'create-task');
      const assigneeProp = tool?.inputSchema.properties?.assignee;
      expect(assigneeProp?.description).toContain('member');
    });

    it('should support task reassignment', () => {
      const tool = skillTools.find(t => t.name === 'assign-task');
      expect(tool?.description).toContain('assign');
    });
  });
});
