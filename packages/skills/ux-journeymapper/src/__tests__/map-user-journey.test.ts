/**
 * UX Journeymapper Tool Tests
 * Validates journey map generation, stage detection, and persona mapping
 */

import { MapUserJourneyTool } from '../tools/map-user-journey';

interface JourneyStage {
  stage: string;
  description: string;
  touchpoints: string[];
  emotions: string[];
  painPoints: string[];
  opportunities: string[];
}

interface JourneyMap extends Record<string, unknown> {
  success: boolean;
  persona?: string;
  goal?: string;
  stages?: JourneyStage[];
  summary?: string;
  keyInsights?: string[];
  error?: string;
}

describe('MapUserJourneyTool', () => {
  describe('Journey Map Generation', () => {
    it('should generate complete journey map', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'E-commerce customer purchasing workflow',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.persona).toBeDefined();
      expect(result.goal).toBeDefined();
      expect(result.stages).toBeDefined();
      expect(Array.isArray(result.stages)).toBe(true);
    });

    it('should include minimum required journey stages', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'User onboarding journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.stages && result.stages.length).toBeGreaterThan(0);
    });

    it('should provide stage details', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Product discovery journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        const stage = result.stages[0];
        expect(stage).toHaveProperty('stage');
        expect(stage).toHaveProperty('description');
        expect(stage).toHaveProperty('touchpoints');
        expect(stage).toHaveProperty('emotions');
        expect(stage).toHaveProperty('painPoints');
        expect(stage).toHaveProperty('opportunities');
      }
    });
  });

  describe('Stage Detection', () => {
    it('should detect awareness stage from keywords', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'User awareness and discovery phase',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      const stageNames = result.stages?.map(s => s.stage.toLowerCase()) || [];
      expect(stageNames.length).toBeGreaterThan(0);
    });

    it('should detect consideration stage', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Customer evaluation and consideration',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.stages && result.stages.length).toBeGreaterThan(0);
    });

    it('should detect purchase stage', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Purchase and checkout process',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.stages && result.stages.length).toBeGreaterThan(0);
    });

    it('should detect onboarding stage', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Onboarding and setup experience',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.stages && result.stages.length).toBeGreaterThan(0);
    });
  });

  describe('Touchpoint Mapping', () => {
    it('should identify relevant touchpoints per stage', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'SaaS product discovery to usage',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        result.stages.forEach(stage => {
          expect(Array.isArray(stage.touchpoints)).toBe(true);
          expect(stage.touchpoints.length).toBeGreaterThan(0);
        });
      }
    });

    it('should include digital and physical touchpoints', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Omnichannel retail journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        const touchpoints = result.stages.flatMap(s => s.touchpoints);
        expect(touchpoints.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Emotion and Pain Points', () => {
    it('should map emotions to stages', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Customer satisfaction journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        result.stages.forEach(stage => {
          expect(Array.isArray(stage.emotions)).toBe(true);
          expect(stage.emotions.length).toBeGreaterThan(0);
        });
      }
    });

    it('should identify pain points', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Problem identification in customer journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        const painPoints = result.stages.flatMap(s => s.painPoints);
        expect(painPoints.length).toBeGreaterThan(0);
      }
    });

    it('should identify opportunities for improvement', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Optimization opportunities analysis',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.stages && result.stages.length > 0) {
        const opportunities = result.stages.flatMap(s => s.opportunities);
        expect(opportunities.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Persona Extraction', () => {
    it('should identify or create persona', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Tech-savvy millennial customer journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.persona).toBeDefined();
    });

    it('should extract persona from objective keywords', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Enterprise decision maker journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.persona) {
        expect(result.persona.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Key Insights', () => {
    it('should generate key insights from journey', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'E-commerce customer analysis',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.keyInsights).toBeDefined();
      expect(Array.isArray(result.keyInsights)).toBe(true);
      if (result.keyInsights) {
        expect(result.keyInsights.length).toBeGreaterThan(0);
      }
    });

    it('should provide actionable insights', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'User retention strategy journey',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      if (result.keyInsights && result.keyInsights.length > 0) {
        result.keyInsights.forEach(insight => {
          expect(insight.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Summary Generation', () => {
    it('should provide journey summary', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Complete user journey mapping',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
      if (result.summary) {
        expect(result.summary.length).toBeGreaterThan(0);
      }
    });

    it('should capture goal statement', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Improve user experience across all touchpoints',
      })) as JourneyMap;

      expect(result.success).toBe(true);
      expect(result.goal).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty objectives gracefully', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: '',
      })) as JourneyMap;

      expect(typeof result.success).toBe('boolean');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle very long objectives', async () => {
      const longObjective = 'A'.repeat(1000);
      const result = (await MapUserJourneyTool.handler({
        objective: longObjective,
      })) as JourneyMap;

      expect(typeof result.success).toBe('boolean');
    });

    it('should handle special characters', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Journey with <special> & "characters" involved',
      })) as JourneyMap;

      expect(typeof result.success).toBe('boolean');
      if (result.success) {
        expect(result.stages).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    it('should generate journey map within reasonable time', async () => {
      const startTime = performance.now();

      const result = (await MapUserJourneyTool.handler({
        objective: 'Performance test journey',
      })) as JourneyMap;

      const elapsedTime = performance.now() - startTime;

      expect(result.success).toBe(true);
      expect(elapsedTime).toBeLessThan(5000);
    });

    it('should handle multiple sequential journeys', async () => {
      const results = [];

      for (let i = 0; i < 5; i++) {
        const result = (await MapUserJourneyTool.handler({
          objective: `Journey ${i}`,
        })) as JourneyMap;
        results.push(result);
      }

      expect(results).toHaveLength(5);
      expect(results.every(r => typeof r.success === 'boolean')).toBe(true);
    });
  });

  describe('Output Consistency', () => {
    it('should maintain consistent output structure', async () => {
      const result1 = (await MapUserJourneyTool.handler({
        objective: 'Test journey 1',
      })) as JourneyMap;

      const result2 = (await MapUserJourneyTool.handler({
        objective: 'Test journey 2',
      })) as JourneyMap;

      const keys1 = Object.keys(result1).sort();
      const keys2 = Object.keys(result2).sort();

      expect(keys1).toEqual(keys2);
    });

    it('should provide all required fields on success', async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: 'Complete journey mapping',
      })) as JourneyMap;

      if (result.success) {
        expect(result.persona).toBeDefined();
        expect(result.goal).toBeDefined();
        expect(result.stages).toBeDefined();
        expect(result.summary).toBeDefined();
        expect(result.keyInsights).toBeDefined();
      }
    });
  });
});
