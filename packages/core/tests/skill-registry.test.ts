import { SkillRegistry } from '../src/skill-registry.js';
import type { Skill } from '../src/types.js';

function makeSkill(name: string, overrides: Partial<Skill> = {}): Skill {
  return {
    name,
    version: '1.0.0',
    description: 'test skill',
    tools: [],
    initialize: async () => {},
    ...overrides,
  };
}

describe('SkillRegistry', () => {
  it('registers and retrieves a skill', () => {
    const registry = new SkillRegistry(() => {});
    const skill = makeSkill('alpha');
    registry.registerSkill(skill);
    expect(registry.getSkill('alpha')).toBe(skill);
  });

  it('lists all registered skill names', () => {
    const registry = new SkillRegistry(() => {});
    registry.registerSkill(makeSkill('alpha'));
    registry.registerSkill(makeSkill('beta'));
    expect(registry.listSkills().sort()).toEqual(['alpha', 'beta']);
  });

  it('rejects registering a skill without a name', () => {
    const registry = new SkillRegistry(() => {});
    expect(() => registry.registerSkill(makeSkill(''))).toThrow('must have a name');
  });

  it('calls cleanup and removes the skill on unload', async () => {
    const registry = new SkillRegistry(() => {});
    let cleaned = false;
    registry.registerSkill(makeSkill('alpha', { cleanup: async () => { cleaned = true; } }));
    await registry.unloadSkill('alpha');
    expect(cleaned).toBe(true);
    expect(registry.getSkill('alpha')).toBeUndefined();
    expect(registry.listSkills()).toEqual([]);
  });

  it('unloadAll clears every registered skill', async () => {
    const registry = new SkillRegistry(() => {});
    registry.registerSkill(makeSkill('alpha'));
    registry.registerSkill(makeSkill('beta'));
    await registry.unloadAll();
    expect(registry.listSkills()).toEqual([]);
  });

  it('returns null when loading a skill package that does not exist', async () => {
    const registry = new SkillRegistry(() => {});
    const result = await registry.loadSkill('does-not-exist-anywhere');
    expect(result).toBeNull();
  });
});
