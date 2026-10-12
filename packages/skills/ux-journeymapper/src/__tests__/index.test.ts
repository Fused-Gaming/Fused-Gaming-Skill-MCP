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
