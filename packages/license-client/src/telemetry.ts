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
 * hardware. The fixed event schema below (no free-form property bag) is
 * the entire disclosed payload — there is no field a caller could use to
 * smuggle additional data through. SYNCPULSE_TELEMETRY=0 always disables
 * telemetry, even if a config file says otherwise, so it can never become
 * silently mandatory.
 *
 * Consent and installation IDs are scoped per product (see `product` on
 * every function below): opting in for one product embedding this client
 * must not silently enable telemetry for a different, unrelated product
 * that happens to share the same OS user account.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';

const TELEMETRY_DIR = path.join(os.homedir(), '.syncpulse', 'telemetry');

export interface TelemetryConfig {
  enabled: boolean;
  installId?: string;
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
}

function sanitizeProductName(product: string): string {
  const sanitized = product.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!sanitized) throw new Error('recordEvent/enableTelemetry/disableTelemetry: product name is required');
  return sanitized;
}

function configPath(product: string): string {
  return path.join(TELEMETRY_DIR, `${sanitizeProductName(product)}.json`);
}

function readConfig(product: string): TelemetryConfig | null {
  try {
    const raw = fs.readFileSync(configPath(product), 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.enabled === 'boolean') {
      return { enabled: parsed.enabled, installId: parsed.installId };
    }
    return null;
  } catch {
    return null;
  }
}

function writeConfig(product: string, config: TelemetryConfig): void {
  if (!fs.existsSync(TELEMETRY_DIR)) {
    fs.mkdirSync(TELEMETRY_DIR, { recursive: true, mode: 0o700 });
  }
  fs.writeFileSync(configPath(product), JSON.stringify(config, null, 2), { mode: 0o600 });
}

/** Explicit user opt-in for a specific product. Does not mint an install ID. */
export function enableTelemetry(product: string): void {
  const existing = readConfig(product);
  writeConfig(product, { enabled: true, installId: existing?.installId });
}

/**
 * Explicit opt-out for a specific product. Always honored regardless of
 * environment variables. Never generates an install ID: a user who has
 * never opted in should not end up with a persisted identifier on disk
 * just because they explicitly (or by default) opted out.
 */
export function disableTelemetry(product: string): void {
  const existing = readConfig(product);
  writeConfig(product, { enabled: false, installId: existing?.installId });
}

/**
 * Whether telemetry is currently active for a specific product.
 * SYNCPULSE_TELEMETRY=0 is an unconditional kill switch; SYNCPULSE_TELEMETRY=1
 * opts in without needing to touch the config file (useful for CI or
 * scripted installs) — but only for a caller that explicitly names its
 * product, so it can't cross-enable an unrelated product's telemetry.
 */
export function isTelemetryEnabled(product: string): boolean {
  if (process.env.SYNCPULSE_TELEMETRY === '0') return false;
  if (process.env.SYNCPULSE_TELEMETRY === '1') return true;
  return readConfig(product)?.enabled ?? false;
}

/**
 * Returns the persisted install ID for a product, creating one atomically
 * if none exists yet — whether the config file is entirely new or already
 * exists with `enabled` set but no ID (the common case: enableTelemetry()
 * runs before the first recordEvent() call). A dedicated lock file (created
 * with exclusive 'wx') ensures only one process mints the ID; a process
 * that loses the race waits briefly for the winner and adopts its value
 * instead of minting a second, conflicting one that would split a single
 * installation across two analytics identities. Never throws: on any
 * filesystem failure (unwritable home directory, a stuck lock, etc.) it
 * falls back to an ephemeral, non-persisted ID for just this call.
 */
async function getOrCreateInstallId(product: string): Promise<string> {
  try {
    const existing = readConfig(product);
    if (existing?.installId) return existing.installId;

    if (!fs.existsSync(TELEMETRY_DIR)) {
      fs.mkdirSync(TELEMETRY_DIR, { recursive: true, mode: 0o700 });
    }

    const lockPath = `${configPath(product)}.lock`;
    try {
      fs.closeSync(fs.openSync(lockPath, 'wx'));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        // Another process is minting the ID right now — wait briefly for
        // it to finish rather than racing to write a second, different ID.
        for (let attempt = 0; attempt < 20; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          const winner = readConfig(product);
          if (winner?.installId) return winner.installId;
        }
        return randomUUID(); // gave up waiting — ephemeral fallback for just this call
      }
      throw err;
    }

    try {
      const installId = randomUUID();
      // Re-read: enabled state may have changed while we were creating the lock.
      const latest = readConfig(product);
      writeConfig(product, { enabled: latest?.enabled ?? existing?.enabled ?? false, installId });
      return installId;
    } finally {
      try {
        fs.unlinkSync(lockPath);
      } catch {
        // Best-effort cleanup; a stale lock only delays the next call's
        // race resolution, it doesn't corrupt anything.
      }
    }
  } catch {
    return randomUUID();
  }
}

/**
 * Records one telemetry event if (and only if) telemetry is enabled for
 * this product. Fire-and-forget: the returned promise resolves immediately
 * without waiting on network delivery, so a slow or unreachable endpoint
 * can never add latency to the caller's own work. Delivery failures
 * (network, filesystem, or otherwise) are swallowed internally and can
 * never throw or produce an unhandled rejection.
 *
 * There is no free-form "extra data" parameter by design — the fixed
 * fields below are the entire disclosed payload described in this
 * package's README and license.
 */
export async function recordEvent(
  event: string,
  product: string,
  productVersion: string
): Promise<void> {
  if (!isTelemetryEnabled(product)) return;

  const endpoint = process.env.SYNCPULSE_TELEMETRY_ENDPOINT;
  if (!endpoint) return; // No configured receiver — nothing to send.

  // Detached: intentionally not awaited so delivery can never block or
  // slow down the caller. Errors are caught inside so this can never
  // surface as an unhandled rejection.
  void (async () => {
    try {
      const installId = await getOrCreateInstallId(product);
      const payload: TelemetryEvent = {
        event,
        product,
        productVersion,
        timestamp: new Date().toISOString(),
        installId,
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
      };
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Best-effort only — never let telemetry delivery affect the caller.
    }
  })();
}

export function getTelemetryStoragePath(): string {
  return TELEMETRY_DIR;
}
