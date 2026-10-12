import { validatePersona, validateJourneyMap, isJourneyMapResult } from '../validation';

const validPersona = {
  name: 'Ada',
  role: 'Operations lead',
  goals: ['Ship weekly reports'],
  painPoints: ['Manual data entry'],
  techProficiency: 'intermediate',
};

describe('validatePersona', () => {
  it('accepts a complete persona', () => {
    const result = validatePersona(validPersona);
    expect(result).toEqual({ ok: true, value: validPersona });
  });

  it('accepts a minimal persona with only required fields', () => {
    const result = validatePersona({ name: 'Ben', role: 'Founder', goals: ['Grow revenue'] });
    expect(result.ok).toBe(true);
  });

  it('returns structured issues instead of throwing for non-object input', () => {
    expect(validatePersona('Ada')).toEqual({
      ok: false,
      error: 'persona must be an object',
      issues: [{ path: 'persona', message: 'must be an object' }],
    });
    expect(validatePersona(null).ok).toBe(false);
    expect(validatePersona([]).ok).toBe(false);
  });

  it('reports missing required fields with paths', () => {
    const result = validatePersona({ goals: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('persona failed validation');
      const paths = result.issues.map((i) => i.path);
      expect(paths).toEqual(expect.arrayContaining(['persona.name', 'persona.role', 'persona.goals']));
    }
  });

  it('rejects empty or whitespace-only strings', () => {
    const result = validatePersona({ ...validPersona, name: '   ' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({ path: 'persona.name', message: 'must not be empty' });
    }
  });

  it('rejects goals that are not a non-empty string array', () => {
    const notArray = validatePersona({ ...validPersona, goals: 'Ship' });
    expect(notArray.ok).toBe(false);
    const emptyArray = validatePersona({ ...validPersona, goals: [] });
    expect(emptyArray.ok).toBe(false);
    const nonString = validatePersona({ ...validPersona, goals: [42] });
    expect(nonString.ok).toBe(false);
    if (!nonString.ok) {
      expect(nonString.issues).toContainEqual({ path: 'persona.goals[0]', message: 'must be a string' });
    }
  });

  it('rejects an unknown techProficiency value', () => {
    const result = validatePersona({ ...validPersona, techProficiency: 'guru' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0].path).toBe('persona.techProficiency');
    }
  });

  it('flags unknown fields so typos do not pass silently', () => {
    const result = validatePersona({ ...validPersona, painPoint: 'typo' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({ path: 'persona.painPoint', message: 'unknown field' });
    }
  });

  it('rejects overly long names', () => {
    const result = validatePersona({ ...validPersona, name: 'x'.repeat(121) });
    expect(result.ok).toBe(false);
  });
});

describe('validateJourneyMap (output contract)', () => {
  const stage = {
    stage: 'Awareness',
    description: 'Awareness phase of the customer journey',
    touchpoints: ['Search engine'],
    emotions: ['Curious'],
    painPoints: ['Trust concerns'],
    opportunities: ['Gather user feedback'],
  };
  const success = {
    success: true,
    persona: 'General User',
    goal: 'Map awareness',
    stages: [stage],
    summary: 'Journey map for: Map awareness.',
    keyInsights: ['Recommended: Track metrics across journey stages'],
  };

  it('accepts a well-formed success result', () => {
    expect(validateJourneyMap(success).ok).toBe(true);
    expect(isJourneyMapResult(success)).toBe(true);
  });

  it('accepts a well-formed failure result', () => {
    expect(validateJourneyMap({ success: false, error: 'objective is required' }).ok).toBe(true);
  });

  it('rejects non-object values and missing success flags', () => {
    expect(validateJourneyMap(undefined).ok).toBe(false);
    const noFlag = validateJourneyMap({ persona: 'x' });
    expect(noFlag).toMatchObject({ ok: false, issues: [{ path: 'success' }] });
  });

  it('rejects failure results without an error message', () => {
    expect(validateJourneyMap({ success: false }).ok).toBe(false);
  });

  it('rejects success results with no stages', () => {
    const result = validateJourneyMap({ ...success, stages: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({ path: 'stages', message: 'must be a non-empty array' });
    }
  });

  it('reports the path of a stage missing touchpoints', () => {
    const broken = { ...stage, touchpoints: [] };
    const result = validateJourneyMap({ ...success, stages: [broken] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({
        path: 'stages[0].touchpoints',
        message: 'must contain at least 1 item(s)',
      });
    }
    expect(isJourneyMapResult({ ...success, stages: [broken] })).toBe(false);
  });

  it('rejects a non-object stage', () => {
    const result = validateJourneyMap({ ...success, stages: ['Awareness'] });
    expect(result.ok).toBe(false);
  });
});
