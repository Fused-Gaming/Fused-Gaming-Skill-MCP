/**
 * License Storage Handler
 * Manages license file persistence in ~/.syncpulse directory
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { LicensePayload } from './types.js';
import crypto from 'crypto';

const STORAGE_DIR = path.join(os.homedir(), '.syncpulse');
const LICENSE_FILE = path.join(STORAGE_DIR, 'license.jwt');
const LICENSE_CACHE_FILE = path.join(STORAGE_DIR, 'license.json');
const MACHINE_ID_FILE = path.join(STORAGE_DIR, 'machine-id');

export class LicenseStorage {
  /**
   * Get the storage directory path
   */
  static getStoragePath(): string {
    return STORAGE_DIR;
  }

  /**
   * Ensure storage directory exists with proper permissions
   */
  static ensureStorageDirectory(): void {
    try {
      if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true, mode: 0o700 });
      }

      // Ensure directory has restrictive permissions (0700 = rwx------)
      fs.chmodSync(STORAGE_DIR, 0o700);
    } catch (error) {
      throw new Error(`Failed to create license storage directory: ${error}`);
    }
  }

  /**
   * Save license JWT token to storage
   */
  static saveLicense(token: string): void {
    try {
      this.ensureStorageDirectory();

      // Write with restrictive permissions (0600 = rw-------)
      fs.writeFileSync(LICENSE_FILE, token, {
        mode: 0o600,
        encoding: 'utf-8'
      });
    } catch (error) {
      throw new Error(`Failed to save license: ${error}`);
    }
  }

  /**
   * Load license JWT token from storage
   */
  static loadLicense(): string | null {
    try {
      if (!fs.existsSync(LICENSE_FILE)) {
        return null;
      }

      const token = fs.readFileSync(LICENSE_FILE, 'utf-8').trim();
      return token || null;
    } catch (error) {
      throw new Error(`Failed to load license: ${error}`);
    }
  }

  /**
   * Save parsed license cache for offline validation
   */
  static saveLicenseCache(payload: LicensePayload): void {
    try {
      this.ensureStorageDirectory();

      const cacheData = {
        payload,
        cached_at: new Date().toISOString(),
        cache_version: 1
      };

      fs.writeFileSync(LICENSE_CACHE_FILE, JSON.stringify(cacheData, null, 2), {
        mode: 0o600,
        encoding: 'utf-8'
      });
    } catch (error) {
      throw new Error(`Failed to save license cache: ${error}`);
    }
  }

  /**
   * Load parsed license cache
   */
  static loadLicenseCache(): LicensePayload | null {
    try {
      if (!fs.existsSync(LICENSE_CACHE_FILE)) {
        return null;
      }

      const data = fs.readFileSync(LICENSE_CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(data);

      if (parsed.payload) {
        return parsed.payload;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all license files and cache
   */
  static clearLicense(): void {
    try {
      if (fs.existsSync(LICENSE_FILE)) {
        fs.unlinkSync(LICENSE_FILE);
      }

      if (fs.existsSync(LICENSE_CACHE_FILE)) {
        fs.unlinkSync(LICENSE_CACHE_FILE);
      }
    } catch (error) {
      throw new Error(`Failed to clear license: ${error}`);
    }
  }

  /**
   * Get or generate a consistent machine ID for this device
   */
  static getMachineId(): string {
    try {
      // Try to load existing machine ID
      if (fs.existsSync(MACHINE_ID_FILE)) {
        const machineId = fs.readFileSync(MACHINE_ID_FILE, 'utf-8').trim();
        if (machineId) {
          return machineId;
        }
      }

      // Generate new machine ID based on system info
      const machineId = this.generateMachineId();

      // Save it for future use
      this.ensureStorageDirectory();
      fs.writeFileSync(MACHINE_ID_FILE, machineId, {
        mode: 0o600,
        encoding: 'utf-8'
      });

      return machineId;
    } catch (error) {
      // If we can't persist, generate and return a temporary one
      return this.generateMachineId();
    }
  }

  /**
   * Generate a unique machine ID based on system information
   */
  private static generateMachineId(): string {
    try {
      const hostname = os.hostname();
      const platform = os.platform();
      const arch = os.arch();
      const userInfo = os.userInfo();

      // Combine system identifiers
      const identifier = `${hostname}-${platform}-${arch}-${userInfo.uid}`;

      // Hash it to create a consistent but anonymized ID
      const hash = crypto
        .createHash('sha256')
        .update(identifier)
        .digest('hex')
        .substring(0, 32);

      return `machine_${hash}`;
    } catch (_error) {
      // Fallback: generate random ID
      return `machine_${crypto.randomBytes(16).toString('hex')}`;
    }
  }

  /**
   * Check if license file exists
   */
  static hasLicense(): boolean {
    return fs.existsSync(LICENSE_FILE);
  }

  /**
   * Get license file modification time
   */
  static getLicenseModificationTime(): Date | null {
    try {
      if (fs.existsSync(LICENSE_FILE)) {
        const stats = fs.statSync(LICENSE_FILE);
        return stats.mtime;
      }
      return null;
    } catch (_error) {
      return null;
    }
  }
}
