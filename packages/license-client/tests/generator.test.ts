/**
 * License Generator Tests
 */

import jwt from 'jsonwebtoken';
import { LicenseGenerator } from '../src/generator.js';
import { LicenseValidator } from '../src/validator.js';
import { LicensePayload } from '../src/types.js';

describe('LicenseGenerator', () => {
  beforeEach(() => {
    // Reset to defaults
    LicenseGenerator.setProductMetadata('syncpulse-cli', '1.0.0');
  });

  describe('generateTrialLicense', () => {
    it('should generate a valid trial license', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3); // Valid JWT has 3 parts
    });

    it('should create trial payload with correct type', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.valid).toBe(true);
      expect(result.payload?.type).toBe('trial');
    });

    it('should set correct expiration date', () => {
      const days = 14;
      const token = LicenseGenerator.generateTrialLicense({ days });
      const result = LicenseValidator.validateLicense(token);

      const expiresAt = new Date(result.payload!.expires_at);
      const expectedExpires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      // Allow 1 second difference due to timing
      expect(Math.abs(expiresAt.getTime() - expectedExpires.getTime())).toBeLessThan(1000);
    });

    it('should include default trial features', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.features.concurrent_agents).toBe(1);
      expect(result.payload?.features.storage_gb).toBe(10);
      expect(result.payload?.features.team_members).toBe(1);
      expect(result.payload?.features.priority_support).toBe(false);
      expect(result.payload?.features.custom_branding).toBe(false);
    });

    it('should have product metadata', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.product).toBe('syncpulse-cli');
      expect(result.payload?.version).toBe('1.0.0');
    });

    it('should be verifiable as JWT', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const parts = token.split('.');

      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      expect(header.alg).toBe('RS256');
      expect(header.kid).toBe('syncpulse-2026');

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      expect(payload.type).toBe('trial');
    });
  });

  describe('generateCommercialLicense', () => {
    it('should generate a valid commercial license', () => {
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });

    it('should set type to commercial', () => {
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.type).toBe('commercial');
    });

    it('should include commercial features', () => {
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.features.concurrent_agents).toBe(5);
      expect(result.payload?.features.storage_gb).toBe(100);
      expect(result.payload?.features.team_members).toBe(1);
      expect(result.payload?.features.priority_support).toBe(true);
    });

    it('should include activation info', () => {
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.activation).toBeDefined();
      expect(result.payload?.activation?.license_key).toBe('syncpulse_abc123');
      expect(result.payload?.activation?.machine_id).toMatch(/^machine_/);
    });

    it('should include customer email as subject', () => {
      const email = 'user@example.com';
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email,
        licenseKey: 'syncpulse_abc123'
      });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.sub).toBe(email);
    });

    it('should accept custom features', () => {
      const token = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123',
        features: {
          concurrent_agents: 20,
          storage_gb: 500
        }
      });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.features.concurrent_agents).toBe(20);
      expect(result.payload?.features.storage_gb).toBe(500);
      // Other features should use defaults
      expect(result.payload?.features.priority_support).toBe(true);
    });
  });

  describe('generateTeamLicense', () => {
    it('should generate a valid team license', () => {
      const token = LicenseGenerator.generateTeamLicense('cust_123', 'team@example.com');

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });

    it('should set type to team', () => {
      const token = LicenseGenerator.generateTeamLicense('cust_123', 'team@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.type).toBe('team');
    });

    it('should include team features', () => {
      const token = LicenseGenerator.generateTeamLicense('cust_123', 'team@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.features.concurrent_agents).toBe(10);
      expect(result.payload?.features.storage_gb).toBe(500);
      expect(result.payload?.features.team_members).toBe(5);
      expect(result.payload?.features.priority_support).toBe(true);
    });

    it('should create team license key', () => {
      const customerId = 'cust_123';
      const token = LicenseGenerator.generateTeamLicense(customerId, 'team@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.activation?.license_key).toBe(`team_${customerId}`);
    });
  });

  describe('generateEnterpriseLicense', () => {
    it('should generate a valid enterprise license', () => {
      const token = LicenseGenerator.generateEnterpriseLicense('cust_123', 'enterprise@example.com');

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });

    it('should set type to enterprise', () => {
      const token = LicenseGenerator.generateEnterpriseLicense('cust_123', 'enterprise@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.type).toBe('enterprise');
    });

    it('should include enterprise features', () => {
      const token = LicenseGenerator.generateEnterpriseLicense('cust_123', 'enterprise@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.features.concurrent_agents).toBe(100);
      expect(result.payload?.features.storage_gb).toBe(5000);
      expect(result.payload?.features.team_members).toBe(1000);
      expect(result.payload?.features.priority_support).toBe(true);
      expect(result.payload?.features.custom_branding).toBe(true);
    });

    it('should create enterprise license key', () => {
      const customerId = 'cust_123';
      const token = LicenseGenerator.generateEnterpriseLicense(customerId, 'enterprise@example.com');
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.activation?.license_key).toBe(`enterprise_${customerId}`);
    });
  });

  describe('signLicense', () => {
    it('should sign a payload correctly', () => {
      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
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

      const token = LicenseGenerator.signLicense(payload);

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);

      const decoded = jwt.decode(token);
      expect(decoded?.type).toBe('trial');
    });

    it('should throw on invalid private key', () => {
      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
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

      expect(() => {
        LicenseGenerator.signLicense(payload, 'invalid-key');
      }).toThrow();
    });
  });

  describe('setProductMetadata', () => {
    it('should update product metadata', () => {
      LicenseGenerator.setProductMetadata('custom-product', '2.0.0');

      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.payload?.product).toBe('custom-product');
      expect(result.payload?.version).toBe('2.0.0');
    });
  });
});
