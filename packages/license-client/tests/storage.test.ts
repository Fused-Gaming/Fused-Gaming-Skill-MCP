/**
 * License Storage Tests
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { LicenseStorage } from '../src/storage.js';
import { LicensePayload } from '../src/types.js';

describe('LicenseStorage', () => {
  let testStorageDir: string;

  beforeEach(() => {
    // Create a temporary directory for testing
    testStorageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'license-test-'));
  });

  afterEach(() => {
    // Clean up temporary directory
    if (fs.existsSync(testStorageDir)) {
      fs.rmSync(testStorageDir, { recursive: true, force: true });
    }
  });

  describe('getStoragePath', () => {
    it('should return the storage directory path', () => {
      const storagePath = LicenseStorage.getStoragePath();
      expect(storagePath).toContain('.syncpulse');
      expect(storagePath).toContain(os.homedir());
    });
  });

  describe('ensureStorageDirectory', () => {
    it('should create storage directory if it does not exist', () => {
      LicenseStorage.ensureStorageDirectory();
      const storagePath = LicenseStorage.getStoragePath();
      expect(fs.existsSync(storagePath)).toBe(true);
    });

    it('should have restrictive permissions', () => {
      LicenseStorage.ensureStorageDirectory();
      const storagePath = LicenseStorage.getStoragePath();
      const stats = fs.statSync(storagePath);
      // Check that directory has user-only permissions (0700)
      const mode = stats.mode & parseInt('0777', 8);
      expect(mode).toBe(parseInt('0700', 8));
    });
  });

  describe('saveLicense', () => {
    it('should save license token to file', () => {
      const token = 'test.jwt.token';
      LicenseStorage.saveLicense(token);

      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');
      expect(fs.existsSync(licensePath)).toBe(true);

      const content = fs.readFileSync(licensePath, 'utf-8');
      expect(content).toBe(token);
    });

    it('should have restrictive file permissions', () => {
      const token = 'test.jwt.token';
      LicenseStorage.saveLicense(token);

      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');
      const stats = fs.statSync(licensePath);
      // Check that file has user-only read/write permissions (0600)
      const mode = stats.mode & parseInt('0777', 8);
      expect(mode).toBe(parseInt('0600', 8));
    });
  });

  describe('loadLicense', () => {
    it('should return null if no license file exists', () => {
      const license = LicenseStorage.loadLicense();
      expect(license).toBeNull();
    });

    it('should load saved license token', () => {
      const token = 'test.jwt.token';
      LicenseStorage.saveLicense(token);

      const loaded = LicenseStorage.loadLicense();
      expect(loaded).toBe(token);
    });

    it('should trim whitespace from loaded license', () => {
      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');
      LicenseStorage.ensureStorageDirectory();

      fs.writeFileSync(licensePath, '  test.jwt.token  \n', { mode: 0o600 });

      const loaded = LicenseStorage.loadLicense();
      expect(loaded).toBe('test.jwt.token');
    });
  });

  describe('saveLicenseCache', () => {
    it('should save license cache as JSON', () => {
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

      LicenseStorage.saveLicenseCache(payload);

      const storagePath = LicenseStorage.getStoragePath();
      const cachePath = path.join(storagePath, 'license.json');
      expect(fs.existsSync(cachePath)).toBe(true);

      const content = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      expect(content.payload.type).toBe('trial');
      expect(content.cache_version).toBe(1);
    });
  });

  describe('loadLicenseCache', () => {
    it('should return null if no cache exists', () => {
      const cache = LicenseStorage.loadLicenseCache();
      expect(cache).toBeNull();
    });

    it('should load saved license cache', () => {
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

      LicenseStorage.saveLicenseCache(payload);
      const loaded = LicenseStorage.loadLicenseCache();

      expect(loaded).not.toBeNull();
      expect(loaded?.type).toBe('trial');
      expect(loaded?.product).toBe('syncpulse-cli');
    });

    it('should return null if cache is invalid', () => {
      const storagePath = LicenseStorage.getStoragePath();
      const cachePath = path.join(storagePath, 'license.json');
      LicenseStorage.ensureStorageDirectory();

      fs.writeFileSync(cachePath, 'invalid json', { mode: 0o600 });

      const cache = LicenseStorage.loadLicenseCache();
      expect(cache).toBeNull();
    });
  });

  describe('clearLicense', () => {
    it('should remove license files', () => {
      const token = 'test.jwt.token';
      LicenseStorage.saveLicense(token);

      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');
      expect(fs.existsSync(licensePath)).toBe(true);

      LicenseStorage.clearLicense();
      expect(fs.existsSync(licensePath)).toBe(false);
    });

    it('should remove cache files', () => {
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

      LicenseStorage.saveLicenseCache(payload);
      LicenseStorage.clearLicense();

      const storagePath = LicenseStorage.getStoragePath();
      const cachePath = path.join(storagePath, 'license.json');
      expect(fs.existsSync(cachePath)).toBe(false);
    });
  });

  describe('getMachineId', () => {
    it('should return a consistent machine ID', () => {
      const machineId1 = LicenseStorage.getMachineId();
      const machineId2 = LicenseStorage.getMachineId();

      expect(machineId1).toBe(machineId2);
      expect(machineId1).toMatch(/^machine_/);
    });

    it('should persist machine ID to file', () => {
      const machineId = LicenseStorage.getMachineId();

      const storagePath = LicenseStorage.getStoragePath();
      const machineIdPath = path.join(storagePath, 'machine-id');
      expect(fs.existsSync(machineIdPath)).toBe(true);

      const saved = fs.readFileSync(machineIdPath, 'utf-8').trim();
      expect(saved).toBe(machineId);
    });
  });

  describe('hasLicense', () => {
    it('should return false if no license exists', () => {
      expect(LicenseStorage.hasLicense()).toBe(false);
    });

    it('should return true if license exists', () => {
      LicenseStorage.saveLicense('test.jwt.token');
      expect(LicenseStorage.hasLicense()).toBe(true);
    });
  });

  describe('getLicenseModificationTime', () => {
    it('should return null if no license exists', () => {
      const mtime = LicenseStorage.getLicenseModificationTime();
      expect(mtime).toBeNull();
    });

    it('should return modification time of license file', () => {
      LicenseStorage.saveLicense('test.jwt.token');
      const mtime = LicenseStorage.getLicenseModificationTime();

      expect(mtime).not.toBeNull();
      expect(mtime).toBeInstanceOf(Date);
      expect(mtime!.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });
});
