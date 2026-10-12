import { MapUserJourneyTool } from '../tools/map-user-journey';
import { validateJourneyMap } from '../validation';
import type { JourneyMapResult } from '../types';

const FIXED_PERSONA = {
  name: 'Maya',
  role: 'Budget-conscious parent',
  goals: ['Buy school supplies quickly', 'Avoid surprise fees'],
  painPoints: ['Hidden shipping costs'],
  techProficiency: 'intermediate',
};

const run = (input: Record<string, unknown>) =>
  MapUserJourneyTool.handler(input) as Promise<JourneyMapResult>;

describe('MapUserJourneyTool', () => {
  describe('happy path', () => {
    it('returns a contract-valid journey map for a plain objective', async () => {
      const result = await run({ objective: 'Product discovery journey' });
      expect(validateJourneyMap(result).ok).toBe(true);
      expect(result).toMatchObject({ success: true, persona: 'General User', goal: 'Product discovery journey' });
    });

    it('uses the free-text context as the persona label', async () => {
      const result = await run({ objective: 'Onboarding journey', context: 'Non-technical user' });
      expect(result).toMatchObject({ success: true, persona: 'Non-technical user' });
    });

    it('uses a structured persona label and echoes the validated profile', async () => {
      const result = await run({
        objective: 'Purchase and checkout process',
        persona: FIXED_PERSONA,
        context: 'ignored when persona is present',
      });
      expect(result).toMatchObject({
        success: true,
        persona: 'Maya (Budget-conscious parent)',
        personaProfile: FIXED_PERSONA,
      });
    });

    it('maps stage keywords to stages in the order they match', async () => {
      const result = await run({
        objective: 'Customer journey from awareness through purchase, onboarding and retention',
      });
      expect(result.success && result.stages.map((s) => s.stage)).toEqual([
        'Awareness',
        'Purchase',
        'Onboarding',
        'Retention',
      ]);
    });

    it('falls back to the default five stages when no keyword matches', async () => {
      const result = await run({ objective: 'Zzz' });
      expect(result.success && result.stages.map((s) => s.stage)).toEqual([
        'Awareness',
        'Consideration',
        'Decision',
        'Onboarding',
        'Usage',
      ]);
    });

    it('is deterministic for identical input', async () => {
      const input = { objective: 'Support and retention journey', persona: FIXED_PERSONA };
      expect(await run(input)).toEqual(await run(input));
    });
  });

  describe('failure path', () => {
    it('rejects an empty objective with structured issues', async () => {
      const result = await run({ objective: '' });
      expect(result).toEqual({
        success: false,
        error: 'objective parameter is required and must not be empty',
        issues: [{ path: 'objective', message: 'must not be empty' }],
      });
    });

    it('rejects a whitespace-only objective', async () => {
      const result = await run({ objective: '   ' });
      expect(result.success).toBe(false);
    });

    it('rejects a non-string objective without throwing', async () => {
      const result = await run({ objective: 42 });
      expect(result).toMatchObject({
        success: false,
        issues: [{ path: 'objective', message: 'must be a string' }],
      });
    });

    it('rejects an invalid persona and returns the persona issues', async () => {
      const result = await run({
        objective: 'Onboarding journey',
        persona: { name: 'Maya', role: 'Parent', goals: [] },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('persona failed validation');
        expect(result.issues).toContainEqual({ path: 'persona.goals', message: 'must contain at least 1 item(s)' });
      }
    });

    it('rejects a persona that is not an object', async () => {
      const result = await run({ objective: 'Onboarding journey', persona: 'Maya' });
      expect(result).toMatchObject({ success: false, error: 'persona must be an object' });
    });

    it('still returns a valid failure contract for every failure', async () => {
      const result = await run({ objective: null });
      expect(validateJourneyMap(result).ok).toBe(true);
    });
  });

  describe('snapshot', () => {
    it('matches the default template output for a fixed persona', async () => {
      const result = await run({
        objective: 'Customer journey from awareness through purchase, onboarding and retention',
        persona: FIXED_PERSONA,
      });
      expect(result).toMatchSnapshot();
    });
  });
});
