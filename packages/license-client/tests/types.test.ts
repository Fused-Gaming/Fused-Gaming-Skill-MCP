/**
 * License Types Tests
 */

import { LicenseType, LicensePayload, ValidationResult, LicenseFeatures, GracePeriodDays } from '../src/types.js';

describe('License Types', () => {
  describe('LicenseType', () => {
    it('should have valid license type values', () => {
      const types: LicenseType[] = ['trial', 'commercial', 'team', 'enterprise'];
      expect(types).toHaveLength(4);
    });
  });

  describe('LicensePayload', () => {
    it('should create a valid license payload', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const payload: LicensePayload = {
        type: 'trial',
        issued_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      expect(payload.type).toBe('trial');
      expect(payload.product).toBe('syncpulse-cli');
      expect(payload.features.concurrent_agents).toBe(1);
    });
  });

  describe('LicenseFeatures', () => {
    it('should have all required feature fields', () => {
      const features: LicenseFeatures = {
        concurrent_agents: 5,
        storage_gb: 100,
        team_members: 3,
        priority_support: true,
        custom_branding: false
      };

      expect(features.concurrent_agents).toBe(5);
      expect(features.storage_gb).toBe(100);
      expect(features.team_members).toBe(3);
      expect(features.priority_support).toBe(true);
      expect(features.custom_branding).toBe(false);
    });
  });

  describe('GracePeriodDays', () => {
    it('should have correct grace period values', () => {
      expect(GracePeriodDays.TRIAL_GRACE).toBe(7);
      expect(GracePeriodDays.COMMERCIAL_GRACE).toBe(14);
    });
  });

  describe('ValidationResult', () => {
    it('should represent successful validation', () => {
      const result: ValidationResult = {
        valid: true,
        daysRemaining: 10,
        inGracePeriod: false
      };

      expect(result.valid).toBe(true);
      expect(result.daysRemaining).toBe(10);
    });

    it('should represent failed validation', () => {
      const result: ValidationResult = {
        valid: false,
        error: 'License expired'
      };

      expect(result.valid).toBe(false);
      expect(result.error).toBe('License expired');
    });
  });
});
