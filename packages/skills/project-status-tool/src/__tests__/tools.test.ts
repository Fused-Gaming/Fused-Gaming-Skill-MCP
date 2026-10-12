import { describe, expect, it } from '@jest/globals';
import { createProject, updateProjectProgress, updateProjectStatus } from '../tools/create-project.js';
import { generateDashboard } from '../tools/dashboard.js';
import { summarizeProjectStatus } from '../tools/summarize-project-status.js';
import { makeProject } from './fixtures.js';

const DAY = 24 * 60 * 60 * 1000;

describe('createProject', () => {
  it('generates unique ids and does not mutate its input array', () => {
    const team = ['a', 'b'];
    const p1 = createProject({ name: 'X', owner: 'o', teamMembers: team });
    const p2 = createProject({ name: 'Y', owner: 'o' });
    expect(p1.id).not.toBe(p2.id);
    expect(p1.team).toHaveLength(2);
    expect(team).toEqual(['a', 'b']);
  });
});

describe('updateProjectProgress', () => {
  it('throws RangeError when completed exceeds total', () => {
    expect(() => updateProjectProgress(makeProject(), 3, 2)).toThrow(RangeError);
  });

  it('does not mutate the input project', () => {
    const project = makeProject();
    const before = JSON.stringify(project);
    updateProjectProgress(project, 1, 4);
    expect(JSON.stringify(project)).toBe(before);
  });

  it('marks a project poor when under 30% with the target date under a week away', () => {
    const soon = new Date(Date.now() + 2 * DAY).toISOString().slice(0, 10);
    const updated = updateProjectProgress(makeProject({ targetDate: soon }), 1, 10);
    expect(updated.health).toBe('poor');
  });
});

describe('updateProjectStatus', () => {
  it('stamps completionDate when completed and clears it when reopened', () => {
    const completed = updateProjectStatus(makeProject(), 'completed');
    expect(completed.completionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const reopened = updateProjectStatus(completed, 'in-progress');
    expect(reopened.completionDate).toBeUndefined();
    expect('completionDate' in reopened).toBe(false);
  });

  it('keeps an existing completionDate when re-completed', () => {
    const project = makeProject({ status: 'completed', completionDate: '2026-02-02' });
    expect(updateProjectStatus(project, 'completed').completionDate).toBe('2026-02-02');
  });
});

describe('generateDashboard', () => {
  it('does not alias the caller projects array', () => {
    const projects = [makeProject()];
    const dashboard = generateDashboard({ projects });
    expect(dashboard.projects).not.toBe(projects);
    expect(dashboard.projects).toEqual(projects);
  });

  it('returns excellent for an empty portfolio', () => {
    expect(generateDashboard({ projects: [] }).overallHealth).toBe('excellent');
  });
});

describe('summarizeProjectStatus', () => {
  const now = Date.parse('2026-06-01T12:00:00Z');

  it('flags a project as overdue only after its target day has fully passed', () => {
    const dueToday = makeProject({ targetDate: '2026-06-01' });
    const pastDue = makeProject({ id: 'p2', name: 'Beta', targetDate: '2026-05-31' });
    const out = summarizeProjectStatus({ objective: 'o', projects: [dueToday, pastDue] }, now);
    const actions = out.summary.nextActions;
    expect(actions.some((a) => a.includes('"Beta"'))).toBe(true);
    expect(actions.some((a) => a.includes('"Alpha"') && a.includes('target date'))).toBe(false);
  });

  it('never flags completed projects as overdue', () => {
    const done = makeProject({ status: 'completed', targetDate: '2026-01-01' });
    const out = summarizeProjectStatus({ objective: 'o', projects: [done] }, now);
    expect(out.summary.nextActions).toEqual(['No immediate actions required.']);
  });

  it('lists open blockers and ignores resolved ones', () => {
    const project = makeProject({
      blockers: [
        {
          id: 'b1',
          title: 'Vendor outage',
          description: '',
          impact: 'high',
          reportedBy: 'ann',
          reportedAt: '2026-05-01',
          status: 'open',
        },
        {
          id: 'b2',
          title: 'Minor',
          description: '',
          impact: 'low',
          reportedBy: 'ann',
          reportedAt: '2026-05-01',
          status: 'resolved',
        },
      ],
    });
    const out = summarizeProjectStatus({ objective: 'o', projects: [project] }, now);
    expect(out.summary.openBlockerTitles).toEqual(['Vendor outage']);
    expect(out.summary.nextActions).toContain('Resolve high-impact blocker "Vendor outage" in "Alpha"');
  });

  it('computes headline and average progress', () => {
    const out = summarizeProjectStatus(
      { objective: 'o', projects: [makeProject({ progress: 20 }), makeProject({ id: 'p2', progress: 60 })] },
      now
    );
    expect(out.summary.averageProgress).toBe(40);
    expect(out.summary.headline).toContain('2 project(s)');
  });
});
