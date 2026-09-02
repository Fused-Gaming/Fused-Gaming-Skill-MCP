/**
 * Opt-in, anonymous usage telemetry.
 *
 * Disabled by default. Nothing is collected or sent unless a user (or a
 * downstream package embedding this client) explicitly enables it via
 * enableTelemetry() or the per-product SYNCPULSE_TELEMETRY_<PRODUCT>=1
 * environment variable.
 *
 * Deliberately does NOT collect: hardware identifiers (MAC address, disk
 * serials, etc.), IP-derived geolocation, file paths, environment variables,
 * or any other data that could identify a specific person or machine beyond
 * a random installation ID generated locally and never derived from
 * hardware. The fixed event schema below (no free-form property bag, and
 * every field format-validated before transmission) is the entire disclosed
 * payload — there is no way for a caller, even a careless one, to smuggle
 * arbitrary data through it. SYNCPULSE_TELEMETRY=0 always disables
 * telemetry for every product, even if a config file says otherwise, so it
 * can never become silently mandatory.
 *
 * Consent and installation IDs are scoped per product (see `product` on
 * every function below): opting in for one product embedding this client
 * must not silently enable telemetry for a different, unrelated product
 * that happens to share the same OS user account.
 */
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';
import { randomUUID, createHash } from 'crypto';

const TELEMETRY_DIR = path.join(os.homedir(), '.syncpulse', 'telemetry');
const LOCK_STALE_MS = 5000; // a lock older than this is assumed abandoned by a dead process
// A lock older than this is reclaimed unconditionally, even if isPidAlive()
// says its recorded owner is alive: PIDs are reused by the OS, and a lock
// file with no way to record the owner's process-start time (there is no
// portable one in Node) can't distinguish "the original owner is still
// running" from "an unrelated later process happens to have the same PID".
// Without this cap, that coincidence would jam a product's lock forever.
// Kept far above LOCK_STALE_MS so it never fires against a merely-paused
// legitimate owner in practice — a real owner holding this lock for a full
// minute indicates a bug of its own, not something this cap should protect.
const LOCK_ABSOLUTE_MAX_MS = 60000;

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

// Filesystem-safe, and collision-resistant: two products differing only in
// characters outside the allowlist (e.g. "foo/bar" vs "foo:bar") must not
// collapse onto the same consent/install-ID file, or opting in for one
// would silently opt in the other. Appending a short hash of the original,
// un-sanitized name makes the mapping effectively injective while keeping
// the filename readable.
function sanitizeProductName(product: string): string {
  if (!product) throw new Error('product name is required');
  const base = product.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60);
  const hash = createHash('sha256').update(product).digest('hex').slice(0, 8);
  return `${base}-${hash}`;
}

function configPath(product: string): string {
  return path.join(TELEMETRY_DIR, `${sanitizeProductName(product)}.json`);
}

function lockPath(product: string): string {
  return `${configPath(product)}.lock`;
}

function ensureDir(): void {
  if (!fs.existsSync(TELEMETRY_DIR)) {
    fs.mkdirSync(TELEMETRY_DIR, { recursive: true, mode: 0o700 });
  }
}

// randomUUID() is what this module ever writes as an installId — anything
// else (a manually edited file, an older/foreign client's config, or plain
// corruption that still happens to parse as valid JSON) is not something
// this module ever intended to transmit. Validating on *read* means a
// bad/oversized value can never reach the network payload, no matter how
// it ended up on disk.
const INSTALL_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseConfig(raw: string): TelemetryConfig | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.enabled === 'boolean') {
      const installId =
        typeof parsed.installId === 'string' && INSTALL_ID_PATTERN.test(parsed.installId)
          ? parsed.installId
          : undefined;
      return { enabled: parsed.enabled, installId };
    }
    return null;
  } catch {
    return null;
  }
}

// Synchronous: used only by the public sync API (enableTelemetry(),
// disableTelemetry(), isTelemetryEnabled()'s persisted-config fallback),
// where blocking briefly on local disk I/O is an accepted, documented
// part of calling a synchronous function. Never called from recordEvent()'s
// own execution path — see readConfigAsync for that.
function readConfig(product: string): TelemetryConfig | null {
  try {
    return parseConfig(fs.readFileSync(configPath(product), 'utf-8'));
  } catch {
    return null;
  }
}

// Async counterpart used exclusively from recordEvent()'s detached path
// (directly, and via getOrCreateInstallId()) so that even a slow or
// unresponsive filesystem (e.g. a home directory on network storage) can
// never stall recordEvent()'s own synchronous execution before it returns
// to the caller — its documented "resolves immediately" guarantee would
// otherwise be violated by the disk read backing the persisted `enabled`
// check and the first-time install-ID lookup.
//
// Known limitation, not fixed here: unlike the network path (sendBeacon
// unrefs its socket), a pending fs/promises operation has no public unref()
// equivalent in Node — there is no supported way to mark it "don't count
// this against process exit." In practice this is a non-issue for local
// disk I/O, which resolves in microseconds and was never the process-exit
// hazard sendBeacon's unref exists for; it only matters on a genuinely
// hung filesystem (e.g. an unresponsive network home directory), where a
// short-lived CLI process could stay alive until that read either
// completes or the OS itself times it out. Working around this would mean
// moving the read onto a worker thread purely to get an unref-able handle
// — disproportionate machinery for an edge case this rare, so this module
// accepts the limitation and documents it here instead.
async function readConfigAsync(product: string): Promise<TelemetryConfig | null> {
  try {
    return parseConfig(await fsp.readFile(configPath(product), 'utf-8'));
  } catch {
    return null;
  }
}

function writeConfig(product: string, config: TelemetryConfig): void {
  ensureDir();
  fs.writeFileSync(configPath(product), JSON.stringify(config, null, 2), { mode: 0o600 });
}

// Lock files carry "<pid>:<random>" as their content — an ownership token,
// not just a marker. Two things depend on it: reclaiming a lock checks
// whether its recorded PID is still alive (not just whether it's old)
// before deleting it, and releasing a lock checks its content still
// matches the token we created it with before deleting it. Without this, a
// process merely paused (SIGSTOP, a debugger, GC, scheduling) longer than
// LOCK_STALE_MS looks identical to a dead one under an age-only check —
// its lock gets reclaimed by someone else, and when it resumes it can
// unlink the new owner's lock (thinking it's releasing its own) or
// overwrite the config with the stale state it read before pausing.
function currentLockToken(): string {
  return `${process.pid}:${randomUUID()}`;
}

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // ESRCH: no such process — genuinely dead. Any other error (e.g.
    // EPERM, meaning it exists but we lack permission to signal it) means
    // it's still alive as far as we can tell.
    return (err as NodeJS.ErrnoException).code !== 'ESRCH';
  }
}

/**
 * Atomically removes `path_`, but only if it still refers to the same file
 * (`expectedIno`) that was inspected to decide it should be reclaimed. A
 * plain `renameSync(path_, ...)` operates on whatever directory entry is
 * *currently* at `path_` when it runs — not what was there when the caller
 * read it and decided the owner was dead. If this process is preempted
 * between that read and the rename, and in that window a genuinely live
 * process fully reclaims `path_` and writes a brand-new lock into it, an
 * unguarded rename would capture and delete that new, live lock by pure
 * bad timing. Re-checking the inode immediately beforehand closes all of
 * that window except the syscalls between the stat and the rename
 * themselves — the smallest gap achievable without a native flock()
 * binding, which Node's stdlib does not expose.
 */
function atomicallyRemoveLockIfInode(path_: string, expectedIno: number): void {
  try {
    if (fs.statSync(path_).ino !== expectedIno) return; // Already replaced by a new, live lock.
  } catch {
    return; // Vanished on its own — nothing to reclaim.
  }
  const tempPath = `${path_}.reclaimed.${process.pid}.${randomUUID()}`;
  try {
    fs.renameSync(path_, tempPath);
  } catch {
    return; // Lost the race, or the lock was already gone — not ours to remove.
  }
  try {
    fs.unlinkSync(tempPath);
  } catch {
    // Already gone somehow — fine, we still safely vacated path_.
  }
}

/**
 * Reclaims a lock if its recorded owner process is confirmed dead, or if
 * the lock is old enough (LOCK_ABSOLUTE_MAX_MS) that an apparently-alive
 * PID is more likely a reused PID than the original owner still holding it
 * — a live-but-paused owner is never reclaimed *before* that point,
 * regardless of ordinary age. Falls back to the shorter age-based check
 * only if the lock's content can't be read/parsed at all (e.g. a lock from
 * a version of this module that didn't write ownership info).
 *
 * Reads through a single open file descriptor (rather than separate
 * `readFileSync(path)` / `statSync(path)` calls) so the content and the
 * inode/mtime used to decide "stale" are guaranteed to describe the exact
 * same file, even if the path is replaced between two path-based calls.
 * The actual removal re-checks that inode immediately before renaming (see
 * atomicallyRemoveLockIfInode) rather than trusting it still applies.
 */
function reclaimStaleLock(path_: string): void {
  let fd: number;
  try {
    fd = fs.openSync(path_, 'r');
  } catch {
    return; // Already gone — nothing to reclaim.
  }
  try {
    const stat = fs.fstatSync(fd);
    const content = fs.readFileSync(fd, 'utf-8');
    const pid = Number(content.split(':')[0]);
    // A positive integer only: Number('') is 0 (Number.isFinite(0) is
    // true), and PID 0 always reads as "alive" via process.kill(0, 0)
    // (POSIX targets the current process group), which would treat an
    // empty/malformed token — e.g. a lock file created but not yet fully
    // written when its owner died mid-write — as permanently alive,
    // jamming that product's lock forever. Anything that isn't a real PID
    // falls through to the age-based fallback below instead.
    if (Number.isInteger(pid) && pid > 0) {
      if (!isPidAlive(pid)) {
        atomicallyRemoveLockIfInode(path_, stat.ino);
      } else if (Date.now() - stat.mtimeMs > LOCK_ABSOLUTE_MAX_MS) {
        // The recorded PID looks alive, but the lock is far older than any
        // legitimate holder should need — most likely explanation is PID
        // reuse (the original owner died and the OS handed its PID to an
        // unrelated later process), not a 60-second-long critical section.
        // Reclaim unconditionally rather than staying jammed forever.
        atomicallyRemoveLockIfInode(path_, stat.ino);
      }
      return;
    }
    if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
      atomicallyRemoveLockIfInode(path_, stat.ino);
    }
  } catch {
    // Unreadable — nothing to reclaim.
  } finally {
    try {
      fs.closeSync(fd);
    } catch {
      // Already closed somehow — fine.
    }
  }
}

// Products for which getOrCreateInstallId() currently holds (or is
// attempting to acquire) the file lock via its async path, *in this same
// process*. Node is single-threaded: acquireLockSync()'s Atomics.wait
// blocks that thread synchronously, with no return to the event loop
// between retries, so a same-process async holder's pending setTimeout can
// never fire — and therefore can never finish and release the lock — while
// a sync acquisition attempt for the *same product* is spinning. Without
// this check that isn't just slow, it's a guaranteed full-timeout stall
// every time it happens (the async side has no chance to make progress
// until the sync side gives up). Cross-process contention has no such
// issue — a lock held by a different process doesn't block this process's
// event loop — so this check is scoped to same-process, same-product only.
//
// A reference count, not a presence-only Set: recordEvent() can be called
// concurrently for the same product (e.g. two events fired back-to-back
// before either's detached block finishes), and each concurrent call adds
// its own hold while racing to create the install ID. With a plain Set,
// whichever call finishes first would delete the marker while the other is
// still mid-acquisition — reopening the exact same-process deadlock this
// tracking exists to prevent, just via a different interleaving.
const inProcessAsyncLockHolders = new Map<string, number>();

function addAsyncLockHolder(product: string): void {
  inProcessAsyncLockHolders.set(product, (inProcessAsyncLockHolders.get(product) ?? 0) + 1);
}

function removeAsyncLockHolder(product: string): void {
  const count = inProcessAsyncLockHolders.get(product) ?? 0;
  if (count <= 1) {
    inProcessAsyncLockHolders.delete(product);
  } else {
    inProcessAsyncLockHolders.set(product, count - 1);
  }
}

/**
 * Synchronous lock acquisition for enableTelemetry()/disableTelemetry(),
 * which are part of this module's public synchronous API. Blocks the
 * event loop only briefly (Atomics.wait, not a CPU-spinning busy loop) and
 * only under real contention; gives up after `timeoutMs` rather than
 * hanging forever on a lock that can't be reclaimed. Returns the ownership
 * token on success (pass it to releaseLock) or null on timeout/failure —
 * including immediately, without ever calling Atomics.wait, if this same
 * process's own async install-ID creation currently holds this product's
 * lock (see inProcessAsyncLockHolders above).
 */
function acquireLockSync(product: string, path_: string, timeoutMs = 2000): string | null {
  if (inProcessAsyncLockHolders.has(product)) return null;
  ensureDir();
  const deadline = Date.now() + timeoutMs;
  const token = currentLockToken();
  for (;;) {
    try {
      fs.writeFileSync(path_, token, { flag: 'wx', mode: 0o600 });
      return token;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') return null;
      // Re-checked every iteration, not just on entry: a same-process
      // async holder could start after we began waiting.
      if (inProcessAsyncLockHolders.has(product)) return null;
      reclaimStaleLock(path_);
      if (Date.now() >= deadline) return null;
      try {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
      } catch {
        // Atomics.wait can be unavailable on the main thread in some
        // embedders; fall through and retry immediately rather than hang.
      }
    }
  }
}

async function acquireLockAsync(path_: string, timeoutMs = 2000): Promise<string | null> {
  ensureDir();
  const deadline = Date.now() + timeoutMs;
  const token = currentLockToken();
  for (;;) {
    try {
      fs.writeFileSync(path_, token, { flag: 'wx', mode: 0o600 });
      return token;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') return null;
      reclaimStaleLock(path_);
      if (Date.now() >= deadline) return null;
      // Unref'd: a short-lived CLI process racing for a contended lock
      // must still be able to exit on its own rather than being kept
      // alive purely by this retry timer for up to `timeoutMs`.
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 10);
        timer.unref();
      });
    }
  }
}

/** Only unlinks the lock if it still holds the token we created it with. */
function releaseLock(path_: string, token: string): void {
  try {
    if (fs.readFileSync(path_, 'utf-8') === token) {
      fs.unlinkSync(path_);
    }
  } catch {
    // Already gone (released concurrently, or reclaimed as stale) — fine.
  }
}

/**
 * Explicit user opt-in for a specific product. Does not mint an install ID.
 * Takes the same per-product lock recordEvent()'s install-ID creation uses,
 * so a consent change can never be silently lost to (or silently lose) a
 * concurrent ID-creation write for the same product.
 */
export function enableTelemetry(product: string): void {
  const path_ = lockPath(product);
  const token = acquireLockSync(product, path_);
  if (!token) {
    throw new Error(
      `enableTelemetry('${product}'): timed out waiting for the telemetry config lock — ` +
        `the opt-in was not recorded, retry`
    );
  }
  try {
    const existing = readConfig(product);
    writeConfig(product, { enabled: true, installId: existing?.installId });
  } finally {
    releaseLock(path_, token);
  }
}

/**
 * Explicit opt-out for a specific product. Always honored regardless of
 * environment variables. Never generates an install ID: a user who has
 * never opted in should not end up with a persisted identifier on disk
 * just because they explicitly (or by default) opted out.
 */
export function disableTelemetry(product: string): void {
  const path_ = lockPath(product);
  const token = acquireLockSync(product, path_);
  if (!token) {
    throw new Error(
      `disableTelemetry('${product}'): timed out waiting for the telemetry config lock — ` +
        `the opt-out was not recorded, retry`
    );
  }
  try {
    const existing = readConfig(product);
    writeConfig(product, { enabled: false, installId: existing?.installId });
  } finally {
    releaseLock(path_, token);
  }
}

// Same collision concern as sanitizeProductName: "foo-bar" and "foo_bar"
// both normalize to FOO_BAR under a naive uppercase-and-replace scheme, so
// opting in via one product's documented env var would silently opt in an
// unrelated product too. The hash suffix is deterministic (derived from the
// product name, not random), so an integrator can still compute and
// document a fixed env var name for their product once.
function envOptInKey(product: string): string {
  const base = product.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const hash = createHash('sha256').update(product).digest('hex').slice(0, 8).toUpperCase();
  return `SYNCPULSE_TELEMETRY_${base}_${hash}`;
}

/**
 * Whether telemetry is currently active for a specific product.
 * SYNCPULSE_TELEMETRY=0 is an unconditional kill switch for every product
 * (a global "off" can only ever reduce collection, so it's always safe to
 * honor). There is no global "on" switch: SYNCPULSE_TELEMETRY_<PRODUCT>=1
 * opts in one specific, named product only — useful for CI or scripted
 * installs — so setting it for one product embedding this client can never
 * cross-enable an unrelated product that happens to inherit the same
 * environment.
 */
export function isTelemetryEnabled(product: string): boolean {
  if (process.env.SYNCPULSE_TELEMETRY === '0') return false;
  if (process.env[envOptInKey(product)] === '1') return true;
  return readConfig(product)?.enabled ?? false;
}

/**
 * Returns the persisted install ID for a product, creating one under the
 * same per-product lock enableTelemetry()/disableTelemetry() use — so a
 * concurrent consent change can't be silently overwritten by a stale
 * `enabled` value read before the lock was acquired, and two processes
 * racing to create the first ID for a product can't each mint a different
 * one. A lock abandoned by a crashed process is reclaimed automatically
 * after LOCK_STALE_MS rather than blocking every future call forever.
 * Never throws: on any filesystem failure it falls back to an ephemeral,
 * non-persisted ID for just this call.
 */
async function getOrCreateInstallId(product: string): Promise<string> {
  try {
    const existing = await readConfigAsync(product);
    if (existing?.installId) return existing.installId;

    const path_ = lockPath(product);
    addAsyncLockHolder(product);
    try {
      const token = await acquireLockAsync(path_);
      if (!token) return randomUUID(); // couldn't get the lock in time — ephemeral fallback
      try {
        const latest = await readConfigAsync(product);
        if (latest?.installId) return latest.installId; // minted by whoever we waited on
        const installId = randomUUID();
        writeConfig(product, { enabled: latest?.enabled ?? existing?.enabled ?? false, installId });
        return installId;
      } finally {
        releaseLock(path_, token);
      }
    } finally {
      removeAsyncLockHolder(product);
    }
  } catch {
    return randomUUID();
  }
}

// Deliberately strict: these are the only formats recordEvent will ever
// transmit, so a caller can't smuggle a file path, command output, or other
// identifying text through an argument that's nominally just "the event
// name" or "the product name". `product` allows npm's own naming grammar
// (scoped packages like "@h4shed/mcp-core").
const EVENT_NAME_PATTERN = /^[A-Za-z0-9_.:-]{1,64}$/;
const PRODUCT_NAME_PATTERN = /^(@[A-Za-z0-9_.-]{1,100}\/)?[A-Za-z0-9_.-]{1,100}$/;
const VERSION_PATTERN = /^[A-Za-z0-9_.+-]{1,32}$/;

function isValidPayload(event: unknown, product: unknown, productVersion: unknown): boolean {
  // typeof checks first, deliberately: RegExp.test() coerces its argument
  // via toString() before matching, so a non-string object with a
  // toString() crafted to return e.g. "valid_event" would pass the pattern
  // test below while its actual enumerable properties — not the coerced
  // string — are what JSON.stringify() later serializes into the payload.
  // A caller bypassing the TypeScript signature (plain JS, or an `any`)
  // could use exactly that to smuggle arbitrary data back in despite the
  // fixed-schema guarantee.
  return (
    typeof event === 'string' &&
    EVENT_NAME_PATTERN.test(event) &&
    typeof product === 'string' &&
    PRODUCT_NAME_PATTERN.test(product) &&
    typeof productVersion === 'string' &&
    VERSION_PATTERN.test(productVersion)
  );
}

/**
 * Sends the event as a detached, unref'd HTTP(S) request. Using the raw
 * http/https modules (rather than fetch, which offers no handle to unref)
 * is deliberate: unref-ing the socket as soon as it's available means a
 * pending telemetry request can never keep Node's event loop alive past a
 * short-lived CLI command's own natural exit. The request still completes
 * normally if the process happens to stay alive for other reasons — unref
 * only stops it from being a reason to stay alive on its own.
 */
function sendBeacon(endpoint: string, payload: TelemetryEvent): void {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return; // Malformed endpoint — nothing to send.
  }
  const client = url.protocol === 'http:' ? http : https;
  const body = Buffer.from(JSON.stringify(payload), 'utf-8');

  const req = client.request(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': body.length },
      timeout: 3000,
    },
    (res) => {
      res.resume(); // Discard the response body; we don't need it.
    }
  );
  // `timeout` above is an *inactivity* timer — it resets on any socket
  // activity, so a receiver that drips bytes just often enough (or a
  // connection that establishes but then never sends a byte at all in a
  // way that still counts as "activity" on some platforms) can hold the
  // request open far longer than 3s. A separate, independently-scheduled
  // absolute deadline guarantees delivery is abandoned within a bounded
  // time no matter what the remote end does. Unref'd for the same reason
  // the socket is: it must never be a reason for a short-lived CLI process
  // to stay alive, and it's cleared as soon as the request is done so it
  // can't fire spuriously after a normal, fast completion.
  const absoluteDeadline = setTimeout(() => req.destroy(), 10000);
  absoluteDeadline.unref();
  req.on('close', () => clearTimeout(absoluteDeadline));
  req.on('socket', (socket) => socket.unref());
  req.on('timeout', () => req.destroy());
  req.on('error', () => {
    // Best-effort only — never let telemetry delivery affect the caller.
  });
  req.end(body);
}

/**
 * Records one telemetry event if (and only if) telemetry is enabled for
 * this product and every field matches its documented format. Fire-and-
 * forget: the returned promise resolves immediately without waiting on
 * network delivery, so a slow or unreachable endpoint can never add
 * latency to the caller's own work. Delivery failures (network,
 * filesystem, or otherwise) are swallowed internally and can never throw
 * or produce an unhandled rejection.
 *
 * There is no free-form "extra data" parameter by design, and the three
 * string arguments are validated against strict formats before anything
 * is sent — the fixed fields below are the entire disclosed payload
 * described in this package's README and license.
 */
export async function recordEvent(
  event: string,
  product: string,
  productVersion: string
): Promise<void> {
  if (!isValidPayload(event, product, productVersion)) return;

  // Only checks that require no I/O run synchronously here. Whether
  // telemetry is enabled can also be decided by the *persisted* config —
  // reading it is a disk access that, on a slow or unresponsive filesystem
  // (e.g. a home directory on network storage), could stall for an
  // unbounded time. That check is deferred into the detached block below
  // so recordEvent() can genuinely always return immediately, matching its
  // documented guarantee, rather than only when the env var opt-in path is
  // used and the persisted-config path happens to be fast.
  if (process.env.SYNCPULSE_TELEMETRY === '0') return;
  const envOptedIn = process.env[envOptInKey(product)] === '1';

  const endpoint = process.env.SYNCPULSE_TELEMETRY_ENDPOINT;
  if (!endpoint) return; // No configured receiver — nothing to send.

  // Detached: intentionally not awaited so delivery can never block or
  // slow down the caller. Errors are caught inside so this can never
  // surface as an unhandled rejection.
  void (async () => {
    try {
      if (!envOptedIn && !((await readConfigAsync(product))?.enabled ?? false)) return;
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
      sendBeacon(endpoint, payload);
    } catch {
      // Best-effort only — never let telemetry delivery affect the caller.
    }
  })();
}

export function getTelemetryStoragePath(): string {
  return TELEMETRY_DIR;
}
