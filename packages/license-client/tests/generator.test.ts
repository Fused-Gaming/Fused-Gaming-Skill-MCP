/**
 * License Generator Tests
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import jwt from 'jsonwebtoken';
import { LicenseGenerator } from '../src/generator.js';
import { LicenseValidator } from '../src/validator.js';
import { LicensePayload } from '../src/types.js';
import { LicenseStorage } from '../src/storage.js';

describe('LicenseGenerator', () => {
  let testStorageDir: string;

  // Test private key for signing licenses in tests
  const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC83ValQN0h3vBe
fdf9qce6WTY5h8rafRbIG+KWmaG9bB5D50ymLBFXRyx2Eruxnp08f1VIBD86dZ0c
evAS6VL3UHnpCtNFbfIHJUTg+/UHXB68CFFSBu23zBLgmx1Ur0QcEikHwm2NR16F
32ObNBMOgleWQFq+f6X0UmgWNT1wISkCbPba7iUehKyhh0uFhHiINaEgENz/w05f
eIOIjGOooKh0Jj0h34oSuQaR/cA/BdjV6dmNOVb1S6Zc0UnOltlasuNPUy9eqTAM
ZfkvXzw4T+x9WsYrgYMm+6yv8zdf4FZVd9eRSpVQmhvuNRC5+kO6G3jaNYBGgZks
HmxHou8TAgMBAAECggEAOPKAesmpI9pmHgfSBdGYwK6/s+8nEmRfZy1JUGG4rDYa
lhz7NqvY+rkiReP2JmOOQ7ydSV7Gdeka24iSNRGXi6z/ZW53L9sr/E2XjENMqdB0
D/xuEM64BRCKrKD44h0K62/qYUWV5OCdNr6Z+SVljZ1trYdwFTrGHnpumiupf9Jq
TPfVCptWZ7Oj+tjtIJ4eK1Lccmvgag7HJAHTIwHM2u3o0kxbBwJTNAmIraEFCZoQ
uY6Ukpd2K4dvzHQznS9l6XYKkWLEj0AG4JAjnk1NaLJMVfFnWQEwo7CGibUkw+W3
0YdiXHInpP8lCMw4plIOtoQV8x8gck+optXf3KAeSQKBgQD37CYQJG++AX0dGC3b
RPxnQSYkJgWfOBtHsnO6j5GyaR9PKsiN0DrJBeVwsJEKg8DKpToPapbpB+o4q7Wv
vNWqDOBycLxW1j50XjGxXayx04x+6NQTc5WEQzszF2qZamA4SyNAdxTarTrVfnPi
vdS1oUcAb7TECVspNJ9Mn5oc/QKBgQDDBJrZKAz7t673hLnIor0exVFT12/65SOW
I+R5UMz9Vc21KM7n2Vc0MBEmgYYroAzkYH+5vsdDVPw79bDJ3hqIaLQw5/ODJcIp
2n8a7MzHIDKHME+mPNgdWRTYwkPmCf0b6Z3tyQPxSuS/hqEmSGO5ij0tlhuW+aQq
DmTUTgMBTwKBgQDsf3uryGZD1X25JFiSI5O3F8G/l/mi8c2sLkIRhGUS0Q7J4WEh
TrLVEmfVgMlLQ3XEmaryC9bbgu5ekwYlFzinF9N/t6UiHQvEzBoRPO/BTrFmWsn7
qDXHzq6JRVwt7vjMmniNRUtCcx99izwW3skrXiax9t10aAxrGUSgvlswLQKBgGU1
kpd4raRFY8yZWUHDE5tQlDCK8lanbJyS7BP51yjyyttl3lt89EDlYUE2n0csvQQZ
ALCJTiinhnAnxiQ93E9G550qA7rgca/+8VAr7Oq6zv5SGEQR96bjgGouB8bvECjY
SVoKpL0pPSYY3LFdiEPWdoGeEZt827Hn3nRAOFcJAoGAfKdWurM7RuN4pF/XtX9I
rRC8+ifBQHv6J1RaZUDp1cO8uGDLaI41OTZINh1VLqLMbvOkxjq5AdrBTCrRtPo0
HRCGZ/goclpVCyeH6ZdSrG2JPDuQxYXe3Oe1e3Mm+ev0Zwp0nLsAtHoTmjK7lYHh
DsXz9GMRESdSNrsBPDzQA0E=
-----END PRIVATE KEY-----`;

  beforeEach(() => {
    // Create a temporary directory for testing
    testStorageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'license-test-'));
    LicenseStorage.setStoragePath(testStorageDir);

    // Set test private key for signing
    LicenseGenerator.setPrivateKey(testPrivateKey);

    // Reset to defaults
    LicenseGenerator.setProductMetadata('syncpulse-cli', '1.0.0');
  });

  afterEach(() => {
    // Reset to default storage path
    LicenseStorage.setStoragePath(null);
    // Clean up temporary directory
    if (fs.existsSync(testStorageDir)) {
      fs.rmSync(testStorageDir, { recursive: true, force: true });
    }
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

      const decoded = jwt.decode(token) as LicensePayload | null;
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
