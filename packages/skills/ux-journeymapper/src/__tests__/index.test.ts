import { UxJourneymapperSkill } from '../index';
import { MapUserJourneyTool } from '../tools/map-user-journey';

describe('UxJourneymapperSkill', () => {
  it('exposes the map-user-journey tool', () => {
    expect(UxJourneymapperSkill.name).toBe('ux-journeymapper');
    expect(UxJourneymapperSkill.tools).toEqual([MapUserJourneyTool]);
  });

  it('initializes and cleans up without throwing', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      await expect(UxJourneymapperSkill.initialize({})).resolves.toBeUndefined();
      await expect(UxJourneymapperSkill.cleanup?.()).resolves.toBeUndefined();
      expect(log).toHaveBeenCalledWith('[UX Journeymapper] Skill initialized');
    } finally {
      log.mockRestore();
    }
  });
});

describe('public validation exports', () => {
  it('re-exports the documented validators from the package root', async () => {
    const root = await import('../index');
    expect(typeof root.validatePersona).toBe('function');
    expect(typeof root.validateJourneyMap).toBe('function');
    expect(typeof root.isJourneyMapResult).toBe('function');
  });
});

describe('persona label length', () => {
  it('keeps a 120-character name and role within the output contract', async () => {
    const { MapUserJourneyTool: tool } = await import('../tools/map-user-journey');
    const { validateJourneyMap } = await import('../index');
    const longName = 'N'.repeat(120);
    const longRole = 'R'.repeat(120);
    const result = (await tool.handler({
      objective: 'Long label journey',
      persona: { name: longName, role: longRole, goals: ['Finish a task'] },
    })) as Record<string, unknown>;
    expect(result.success).toBe(true);
    expect(String(result.persona).length).toBeLessThanOrEqual(120);
    expect(validateJourneyMap(result).ok).toBe(true);
  });
});

describe('free-text output limits', () => {
  it('clips a long free-text context and objective within the contract', async () => {
    const { MapUserJourneyTool: tool } = await import('../tools/map-user-journey');
    const { validateJourneyMap } = await import('../index');
    const result = (await tool.handler({
      objective: 'O'.repeat(400),
      context: 'C'.repeat(400),
    })) as Record<string, unknown>;
    expect(result.success).toBe(true);
    expect(String(result.persona).length).toBeLessThanOrEqual(120);
    expect(String(result.goal).length).toBeLessThanOrEqual(300);
    expect(validateJourneyMap(result).ok).toBe(true);
  });

  it('rejects a success result whose personaProfile is malformed', async () => {
    const { validateJourneyMap } = await import('../index');
    const { MapUserJourneyTool: tool } = await import('../tools/map-user-journey');
    const good = (await tool.handler({ objective: 'Checkout' })) as Record<string, unknown>;
    expect(validateJourneyMap({ ...good, personaProfile: null }).ok).toBe(false);
    expect(validateJourneyMap({ ...good, personaProfile: { name: 'x', role: 'y', goals: [] } }).ok).toBe(false);
  });
});

describe('failure issues and summary limits', () => {
  it('rejects a failure result whose issues are not a validation-issue list', async () => {
    const { validateJourneyMap } = await import('../index');
    expect(validateJourneyMap({ success: false, error: 'x', issues: null }).ok).toBe(false);
    expect(validateJourneyMap({ success: false, error: 'x', issues: [{ path: 'a' }] }).ok).toBe(false);
    expect(validateJourneyMap({ success: false, error: 'x', issues: [{ path: 'a', message: 'b' }] }).ok).toBe(true);
  });

  it('keeps the summary within 1,000 characters for a very long objective', async () => {
    const { MapUserJourneyTool: tool } = await import('../tools/map-user-journey');
    const { validateJourneyMap } = await import('../index');
    const result = (await tool.handler({ objective: 'Long '.repeat(400) })) as Record<string, unknown>;
    expect(result.success).toBe(true);
    expect(String(result.summary).length).toBeLessThanOrEqual(1000);
    expect(validateJourneyMap(result).ok).toBe(true);
  });
});
