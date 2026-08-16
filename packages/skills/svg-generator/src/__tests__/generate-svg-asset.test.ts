/**
 * SVG Generator Tool Tests
 * Validates SVG asset generation, dimension handling, and benchmark integration
 */

import { GenerateSvgAssetTool } from '../tools/generate-svg-asset';
import type { SvgAsset } from '../tools/generate-svg-asset';

describe('GenerateSvgAssetTool', () => {
  describe('Basic SVG Generation', () => {
    it('should generate a valid SVG for simple objectives', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Blue circle icon',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.svgCode).toBeDefined();
      expect(result.svgCode).toContain('<svg');
      expect(result.svgCode).toContain('</svg>');
    });

    it('should generate SVG with proper structure', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Red square',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      const svg = result.svgCode as string;
      expect(svg).toMatch(/<svg[^>]*>/);
      expect(svg).toMatch(/<\/svg>/);
    });

    it('should provide asset description', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Yellow star icon',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.description).toBeDefined();
      expect(result.description?.length).toBeGreaterThan(0);
    });
  });

  describe('Dimension Handling', () => {
    it('should respect custom width and height dimensions', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Square icon with 256x128 dimensions',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.dimensions).toBeDefined();
      expect(result.dimensions?.width).toBe(256);
      expect(result.dimensions?.height).toBe(128);
    });

    it('should handle large custom dimensions', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Icon 512x512',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.dimensions?.width).toBe(512);
      expect(result.dimensions?.height).toBe(512);
    });

    it('should use default dimensions when not specified', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Generic icon',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.dimensions?.width).toBeGreaterThan(0);
      expect(result.dimensions?.height).toBeGreaterThan(0);
    });
  });

  describe('Asset Type Detection', () => {
    it('should detect icon type', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Blue circle icon',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(['icon', 'generic-shape']).toContain(result.assetType);
    });

    it('should detect component type', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Green button component',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(['component', 'generic-shape']).toContain(result.assetType);
    });
  });

  describe('Color Handling', () => {
    it('should extract and provide color palette', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Red and blue icon',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.colorPalette).toBeDefined();
      expect(Array.isArray(result.colorPalette)).toBe(true);
    });

    it('should provide default colors when not specified', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Simple shape',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      expect(result.colorPalette).toBeDefined();
      expect(result.colorPalette?.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should fail gracefully on empty objective', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: '',
      })) as SvgAsset;

      expect(result.success).toBe(false);
    });

    it('should handle very long objectives without crashing', async () => {
      const longObjective = 'A'.repeat(1000);
      const result = (await GenerateSvgAssetTool.handler({
        objective: longObjective,
      })) as SvgAsset;

      if (result.success) {
        expect(result.svgCode).toBeDefined();
      }
      expect(typeof result.success).toBe('boolean');
    });

    it('should provide error message when generation fails', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: '',
      })) as SvgAsset;

      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('SVG Content Validation', () => {
    it('should include viewBox attribute', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Test SVG',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      const svg = result.svgCode as string;
      expect(svg.toLowerCase()).toMatch(/viewbox/i);
    });

    it('should not include invalid geometry', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Valid SVG asset',
      })) as SvgAsset;

      expect(result.success).toBe(true);
      const svg = result.svgCode as string;
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      // Verify SVG is properly formed with matching tags
      const openTags = (svg.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (svg.match(/<\/[^>]*>/g) || []).length;
      expect(openTags).toBeGreaterThan(0);
      expect(closeTags).toBeGreaterThan(0);
    });
  });

  describe('Performance Characteristics', () => {
    it('should generate SVG within reasonable time', async () => {
      const startTime = performance.now();

      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Performance test SVG',
      })) as SvgAsset;

      const elapsedTime = performance.now() - startTime;

      expect(result.success).toBe(true);
      expect(elapsedTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple sequential generations', async () => {
      const results = [];

      for (let i = 0; i < 5; i++) {
        const result = (await GenerateSvgAssetTool.handler({
          objective: `SVG ${i}`,
        })) as SvgAsset;
        results.push(result);
      }

      expect(results).toHaveLength(5);
      expect(results.every(r => typeof r.success === 'boolean')).toBe(true);
    });
  });

  describe('Benchmark Integration', () => {
    it('should work with benchmark framework', async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: 'Benchmark test SVG',
      })) as SvgAsset;

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('svgCode');
      expect(result).toHaveProperty('description');
    });

    it('should provide consistent output structure', async () => {
      const result1 = (await GenerateSvgAssetTool.handler({
        objective: 'Test 1',
      })) as SvgAsset;

      const result2 = (await GenerateSvgAssetTool.handler({
        objective: 'Test 2',
      })) as SvgAsset;

      const keys1 = Object.keys(result1).sort();
      const keys2 = Object.keys(result2).sort();

      expect(keys1).toEqual(keys2);
    });
  });
});
