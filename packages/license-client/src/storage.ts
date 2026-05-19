import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createHash } from 'crypto';

const LICENSE_DIR = path.join(os.homedir(), '.syncpulse');
const LICENSE_FILE = path.join(LICENSE_DIR, 'license.jwt');
const LICENSE_CACHE = path.join(LICENSE_DIR, 'license.json');

export class LicenseStorage {
  static ensureDirectory(): void {
    if (!fs.existsSync(LICENSE_DIR)) {
      fs.mkdirSync(LICENSE_DIR, { recursive: true, mode: 0o700 });
    }
  }

  static saveLicense(token: string): void {
    this.ensureDirectory();
    fs.writeFileSync(LICENSE_FILE, token, { mode: 0o600 });
  }

  static loadLicense(): string | null {
    if (!fs.existsSync(LICENSE_FILE)) {
      return null;
    }
    return fs.readFileSync(LICENSE_FILE, 'utf-8');
  }

  static deleteLicense(): void {
    if (fs.existsSync(LICENSE_FILE)) {
      fs.unlinkSync(LICENSE_FILE);
    }
  }

  static hasLicense(): boolean {
    return fs.existsSync(LICENSE_FILE);
  }

  static saveLicenseCache(cacheData: Record<string, unknown>): void {
    this.ensureDirectory();
    fs.writeFileSync(LICENSE_CACHE, JSON.stringify(cacheData, null, 2), { mode: 0o600 });
  }

  static loadLicenseCache(): Record<string, unknown> | null {
    if (!fs.existsSync(LICENSE_CACHE)) {
      return null;
    }
    try {
      const data = fs.readFileSync(LICENSE_CACHE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static getMachineId(): string {
    return this.generateMachineId();
  }

  private static generateMachineId(): string {
    const hostname = os.hostname();
    const platform = os.platform();

    // Get MAC address of first non-loopback interface for hardware-specific binding
    // Sort by interface name to ensure deterministic ordering across reboots
    const networkInterfaces = os.networkInterfaces();
    const sortedInterfaceNames = Object.keys(networkInterfaces).sort();
    let macAddress = '';

    for (const name of sortedInterfaceNames) {
      const addresses = networkInterfaces[name];
      if (!addresses) continue;
      for (const addr of addresses) {
        if (addr.family === 'IPv4' && !addr.internal) {
          macAddress = addr.mac;
          break;
        }
      }
      if (macAddress) break;
    }

    // Derive from hardware identifiers; don't use timestamp (which changes on each call)
    const combined = `${hostname}-${platform}-${macAddress}`;
    return createHash('sha256').update(combined).digest('hex').substring(0, 16);
  }

  static clearCache(): void {
    if (fs.existsSync(LICENSE_CACHE)) {
      fs.unlinkSync(LICENSE_CACHE);
    }
  }

  static getStoragePath(): string {
    return LICENSE_DIR;
  }

  static ensureStorageDirectory(): void {
    this.ensureDirectory();
  }
}
