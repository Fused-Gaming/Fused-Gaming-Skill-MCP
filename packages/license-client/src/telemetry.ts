/**
 * Opt-in, anonymous usage telemetry.
 *
 * Disabled by default. Nothing is collected or sent unless a user (or a
 * downstream package embedding this client) explicitly enables it via
 * enableTelemetry() or the SYNCPULSE_TELEMETRY=1 environment variable.
 *
 * Deliberately does NOT collect: hardware identifiers (MAC address, disk
 * serials, etc.), IP-derived geolocation, file paths, environment variables,
 * or any other data that could identify a specific person or machine beyond
 * a random installation ID generated locally and never derived from
 * hardware. SYNCPULSE_TELEMETRY=0 always disables telemetry, even if a
 * config file says otherwise, so it can never become silently mandatory.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';

const TELEMETRY_DIR = path.join(os.homedir(), '.syncpulse');
const TELEMETRY_CONFIG_FILE = path.join(TELEMETRY_DIR, 'telemetry.json');
const DEFAULT_ENDPOINT = 'https://queen.vln.gg/telemetry';

export interface TelemetryConfig {
  enabled: boolean;
  installId: string;
}

export interface TelemetryEvent {
  event: string;
  product: string;
  productVersion: string;
  timestamp: string;
  installId: string;
  nodeVersion: string;
  platform: NodeJS.Platform;
  arch: string;
  properties?: Record<string, string | number | boolean>;
}

function readConfig(): TelemetryConfig | null {
  try {
    const raw = fs.readFileSync(TELEMETRY_CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.enabled === 'boolean' && typeof parsed.installId === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeConfig(config: TelemetryConfig): void {
  if (!fs.existsSync(TELEMETRY_DIR)) {
    fs.mkdirSync(TELEMETRY_DIR, { recursive: true, mode: 0o700 });
  }
  fs.writeFileSync(TELEMETRY_CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
}

/**
 * Explicit user opt-in. Generates and persists a random (not
 * hardware-derived) install ID the first time telemetry is enabled.
 */
export function enableTelemetry(): void {
  const existing = readConfig();
  writeConfig({ enabled: true, installId: existing?.installId ?? randomUUID() });
}

/** Explicit opt-out. Always honored regardless of environment variables. */
export function disableTelemetry(): void {
  const existing = readConfig();
  writeConfig({ enabled: false, installId: existing?.installId ?? randomUUID() });
}

/**
 * Whether telemetry is currently active. SYNCPULSE_TELEMETRY=0 is an
 * unconditional kill switch; SYNCPULSE_TELEMETRY=1 opts in without needing
 * to touch the config file (useful for CI or scripted installs). Absent
 * either, the persisted config decides; absent that, telemetry is off.
 */
export function isTelemetryEnabled(): boolean {
  if (process.env.SYNCPULSE_TELEMETRY === '0') return false;
  if (process.env.SYNCPULSE_TELEMETRY === '1') return true;
  return readConfig()?.enabled ?? false;
}

function getInstallId(): string {
  const existing = readConfig();
  if (existing?.installId) return existing.installId;
  const installId = randomUUID();
  writeConfig({ enabled: readConfig()?.enabled ?? false, installId });
  return installId;
}

/**
 * Records one telemetry event if (and only if) telemetry is enabled.
 * Fire-and-forget: network/storage failures are swallowed so telemetry can
 * never break the calling package's actual functionality or block its exit.
 */
export async function recordEvent(
  event: string,
  product: string,
  productVersion: string,
  properties?: Record<string, string | number | boolean>
): Promise<void> {
  if (!isTelemetryEnabled()) return;

  const payload: TelemetryEvent = {
    event,
    product,
    productVersion,
    timestamp: new Date().toISOString(),
    installId: getInstallId(),
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    ...(properties ? { properties } : {}),
  };

  const endpoint = process.env.SYNCPULSE_TELEMETRY_ENDPOINT || DEFAULT_ENDPOINT;
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort only — never let telemetry delivery affect the caller.
  }
}

export function getTelemetryStoragePath(): string {
  return TELEMETRY_DIR;
}
