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
 * payload — there is no hidden field, and no way for a caller, even a
 * careless one, to smuggle extra *structured* data through it via a type
 * trick. That guarantee is about shape, not content: `event`, `product`,
 * and `productVersion` are opaque strings the *integrating package's own
 * code* chooses the values for, the same trust boundary every logging or
 * analytics library has with its caller — this module can validate that a
 * value looks like a well-formed event name, not that whoever wrote the
 * calling code didn't choose to name an event something identifying.
 * SYNCPULSE_TELEMETRY=0 always disables telemetry for every product, even
 * if a config file says otherwise, so it can never become silently
 * mandatory.
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
  // Optional, not defaulted: absence means "no explicit consent decision
  // has ever been persisted for this product" — distinct from `false`,
  // which means disableTelemetry() was actually called. Callers that just
  // need a definite yes/no (e.g. "should I send this event") normalize
  // with `config?.enabled ?? false`; callers that need to distinguish an
  // explicit opt-out from "never decided" (e.g. "does a persisted opt-out
  // exist that should override the environment opt-in") check
  // `config?.enabled === false` specifically. See getOrCreateInstallId,
  // which must be able to persist an installId without ever fabricating
  // an explicit `false` the caller never asked for.
  enabled?: boolean;
  installId?: string;
}

// Mirrors the string union os.platform() actually returns (equivalent to
// NodeJS.Platform), but self-contained: this module's package.json lists
// @types/node only as a devDependency, so a consumer without it installed
// would otherwise fail to resolve TelemetryEvent (a publicly re-exported
// type) with "Cannot find namespace 'NodeJS'" the moment they import it.
export type TelemetryPlatform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd';

export interface TelemetryEvent {
  event: string;
  product: string;
  productVersion: string;
  timestamp: string;
  installId: string;
  nodeVersion: string;
  platform: TelemetryPlatform;
  arch: string;
}

// Filesystem-safe, and collision-resistant: two products differing only in
// characters outside the allowlist (e.g. "foo/bar" vs "foo:bar"), or that
// happen to share the same first 60 sanitized characters, must not
// collapse onto the same consent/install-ID file, or opting in for one
// would silently opt in the other. Appending a hash of the original,
// un-sanitized name makes the mapping effectively injective while keeping
// the filename readable.
//
// The full 64-character hex digest, not a truncated prefix: an earlier
// version used only the first 8 hex characters (32 bits), which keeps
// *accidental* collisions vanishingly unlikely but doesn't resist a
// deliberately constructed one — a 32-bit space is small enough that two
// product names hashing to the same 8-hex-char suffix are realistically
// findable by brute force. Since names sharing the same truncated `base`
// (the >60-char case this hash exists to disambiguate) are exactly the
// case where that matters, and the full digest costs nothing extra to
// compute (already being hashed regardless of how much of it is kept),
// there's no reason to truncate it here.
function sanitizeProductName(product: string): string {
  if (!product) throw new Error('product name is required');
  const base = product.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60);
  const hash = createHash('sha256').update(product).digest('hex');
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
//
// Specifically UUIDv4, not any RFC 4122 UUID shape: the version nibble
// (`4` in the third group) and variant bits (`8`/`9`/`a`/`b` leading the
// fourth group) are checked, not just hex group lengths. A generic
// hex-shape pattern would also accept a UUIDv1 from an older or foreign
// config — UUIDv1 embeds the generating machine's MAC address and a
// timestamp, which is exactly the kind of hardware-derived identifier this
// module promises never to collect or transmit.
const INSTALL_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseConfig(raw: string): TelemetryConfig | null {
  try {
    const parsed = JSON.parse(raw);
    // `enabled` absent (undefined) is valid — a config written purely to
    // persist an installId (see getOrCreateInstallId) with no explicit
    // consent decision yet. Anything present but not a boolean is still
    // treated as corrupt, same as before.
    if (typeof parsed.enabled === 'boolean' || parsed.enabled === undefined) {
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

// A sentinel distinct from both a real persisted config and `null`
// ("genuinely no config exists yet"). readConfig()/readConfigAsync() return
// this when the config file exists but couldn't be read for some reason
// other than "it's not there" (permissions, a stalled network mount, I/O
// error, ...): treating that the same as "no config" (which every caller
// used to do, via a blanket catch) would let the environment opt-in
// silently override an opt-out that's actually sitting on disk, just
// unreadable right now — the opposite of "a persisted opt-out always
// wins". Every caller that reads `.enabled` normalizes this to `false`
// exactly like an explicit disableTelemetry()-written config, since
// refusing to send when we can't confirm consent is the safe default.
const UNREADABLE_CONFIG: TelemetryConfig = { enabled: false };

function classifyReadError(err: unknown): TelemetryConfig | null {
  // ENOENT: the file genuinely doesn't exist — a real "no decision yet".
  // Anything else (EACCES, EIO, a stalled network mount timing out, ...):
  // the file might well exist and hold an explicit opt-out we simply
  // couldn't read — fail closed rather than silently treating it as absent.
  return (err as NodeJS.ErrnoException)?.code === 'ENOENT' ? null : UNREADABLE_CONFIG;
}

// Synchronous: used only by the public sync API (enableTelemetry(),
// disableTelemetry(), isTelemetryEnabled()'s persisted-config fallback),
// where blocking briefly on local disk I/O is an accepted, documented
// part of calling a synchronous function. Never called from recordEvent()'s
// own execution path — see readConfigAsync for that.
function readConfig(product: string): TelemetryConfig | null {
  let raw: string;
  try {
    raw = fs.readFileSync(configPath(product), 'utf-8');
  } catch (err) {
    return classifyReadError(err);
  }
  return parseConfig(raw) ?? UNREADABLE_CONFIG; // Exists but didn't parse — same fail-closed treatment as unreadable.
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
  let raw: string;
  try {
    raw = await fsp.readFile(configPath(product), 'utf-8');
  } catch (err) {
    return classifyReadError(err);
  }
  return parseConfig(raw) ?? UNREADABLE_CONFIG;
}

// Writes to a temp file and renames it into place, rather than writing
// `configPath(product)` directly. A direct write opens with the default
// mode 'w', which truncates the existing file *before* writing the new
// content — if the process crashes, the disk fills, or writeFileSync
// otherwise fails partway through, the previously persisted config (which
// could hold an explicit opt-out) is left destroyed, not merely
// unmodified. Reads would then see a missing/corrupt file and treat it as
// "no decision yet" — silently discarding a real opt-out. Renaming a
// fully-written temp file into place is atomic on the same filesystem
// (see LICENSE-touching comments elsewhere in this file for the general
// rename-atomicity property this relies on), so a reader can only ever see
// the old complete config or the new complete one, never a partial write.
function writeConfig(product: string, config: TelemetryConfig): void {
  ensureDir();
  const finalPath = configPath(product);
  const tempPath = `${finalPath}.tmp.${process.pid}.${randomUUID()}`;
  fs.writeFileSync(tempPath, JSON.stringify(config, null, 2), { mode: 0o600 });
  fs.renameSync(tempPath, finalPath);
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
 * Atomically removes `path_`, but only if it still holds the same content
 * (`expectedContent`) that was inspected to decide it should be reclaimed.
 * A plain `renameSync(path_, ...)` operates on whatever directory entry is
 * *currently* at `path_` when it runs — not what was there when the caller
 * read it and decided the owner was dead. If this process is preempted
 * between that read and the rename, and in that window a genuinely live
 * process fully reclaims `path_` and writes a brand-new lock into it, an
 * unguarded rename would capture and delete that new, live lock by pure
 * bad timing.
 *
 * A check *before* the rename (an earlier version of this function did
 * `statSync(path_)` then `renameSync`) still leaves that exact gap: the two
 * are separate syscalls, so a replacement between them defeats the check.
 * Checking identity *after* the rename instead closes it, because
 * `renameSync` already exclusively captured whatever was actually at
 * `path_` by the time this runs — there's nothing left to race.
 *
 * Compares file *content*, not inode number: an earlier version of this
 * function compared inodes, but a freed inode can be reused by the
 * filesystem for an unrelated new file created shortly after — exactly
 * the pattern this module itself produces (releaseLock unlinks a lock,
 * then a completely different process creates a fresh one at the same
 * path) — which would let two genuinely different locks share an inode
 * number and defeat that check. The lock's content is its ownership token
 * (`<pid>:<random>`), which embeds a fresh random UUID per lock and so
 * can't collide with an unrelated lock's content in practice.
 *
 * If the captured file's content doesn't match what we decided was stale,
 * we didn't grab our stale lock; we grabbed a live one that replaced it in
 * the meantime — but it's left orphaned at `tempPath` rather than restored
 * to `path_`. An earlier version of this function tried to restore it (via
 * `linkSync`, to avoid clobbering an even-newer lock recreated at `path_`
 * in the meantime), reasoning that its displaced owner still needs it back.
 * It doesn't: that owner is protected purely by `lockStillOwned()` checking
 * its own token against whatever is *currently* at `path_` immediately
 * before every write — if that check fails, the owner correctly aborts, no
 * matter whether `path_` was left vacant, restored, or holds something
 * else entirely. Restoring is actively worse: the restore can itself land
 * arbitrarily late, potentially *after* the displaced owner's lock has
 * already been legitimately reclaimed for real, used by a full intervening
 * critical section, and released — at which point restoring the displaced
 * owner's old token would hand it ownership again, well after the fact,
 * letting it resume and pass its own `lockStillOwned()` check against
 * state that's actually newer than what it read. Leaving `path_` vacant
 * has no such failure mode: at worst, a lock legitimately in use gets
 * dropped early (its owner aborts via `lockStillOwned()`, and whoever was
 * genuinely waiting can now acquire sooner) — a liveness cost, not a
 * correctness one.
 */
function atomicallyRemoveLockIfContent(path_: string, expectedContent: string): void {
  const tempPath = `${path_}.reclaimed.${process.pid}.${randomUUID()}`;
  try {
    fs.renameSync(path_, tempPath);
  } catch {
    return; // Lost the race, or the lock was already gone — not ours to remove.
  }
  let capturedContent: string;
  try {
    capturedContent = fs.readFileSync(tempPath, 'utf-8');
  } catch {
    return; // Vanished immediately after our own rename — nothing more to do.
  }
  if (capturedContent !== expectedContent) {
    // We grabbed a live lock instead of our stale target. Leave it at
    // tempPath — see the doc comment above for why this is safe and
    // restoring it would not be. Nothing else ever reads tempPath; it's a
    // small orphaned file, not a correctness problem.
    return;
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
 * mtime used to decide "stale" are guaranteed to describe the exact same
 * file, even if the path is replaced between two path-based calls. The
 * actual removal re-checks that content immediately before renaming (see
 * atomicallyRemoveLockIfContent) rather than trusting it still applies.
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
        atomicallyRemoveLockIfContent(path_, content);
      } else if (Date.now() - stat.mtimeMs > LOCK_ABSOLUTE_MAX_MS) {
        // The recorded PID looks alive, but the lock is far older than any
        // legitimate holder should need — most likely explanation is PID
        // reuse (the original owner died and the OS handed its PID to an
        // unrelated later process), not a 60-second-long critical section.
        // Reclaim unconditionally rather than staying jammed forever.
        atomicallyRemoveLockIfContent(path_, content);
      }
      return;
    }
    if (Date.now() - stat.mtimeMs > LOCK_STALE_MS) {
      atomicallyRemoveLockIfContent(path_, content);
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
        // Atomics.wait/SharedArrayBuffer can be unavailable in some
        // embedders. Retrying immediately here (rather than giving up)
        // would turn into a CPU-spinning busy loop with no delay between
        // attempts for the rest of `timeoutMs` — worse than just failing
        // fast, since there is no synchronous way to sleep without it.
        // Treat "can't sleep" the same as "can't get the lock in time".
        return null;
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

function releaseLock(path_: string, token: string): void {
  // Cheap fast path: if the lock plainly isn't (or is no longer) ours,
  // there's nothing to do and nothing worth touching — this is the common
  // case whenever a caller already detected it lost the lock (e.g.
  // lockStillOwned() just failed) and is releasing from a `finally` block
  // regardless. Skipping straight past this on a mismatch, without ever
  // renaming path_ away, matters: the atomic path below still safely
  // leaves a mismatched capture orphaned rather than deleting it, but
  // "orphaned" means gone from path_ either way — pointlessly vacating a
  // lock that's already known to belong to someone else, on essentially
  // every lost-the-lock cleanup call, would be its own regression.
  try {
    if (fs.readFileSync(path_, 'utf-8') !== token) return;
  } catch {
    return; // Already gone — fine.
  }
  // Reaching here means the lock looked like ours a moment ago — but a
  // separate readFileSync-then-unlinkSync (what this function used to do)
  // still has the exact TOCTOU gap atomicallyRemoveLockIfContent exists to
  // close: if this process is preempted between that check and an
  // unlinkSync(), its lock can cross LOCK_ABSOLUTE_MAX_MS, get reclaimed,
  // and be replaced by a new owner before the paused process resumes and
  // deletes what it thinks is still its own lock — actually deleting that
  // new owner's live one. Delegating to the same atomic capture-then-
  // verify primitive reclaim uses closes that window here too: it removes
  // the lock only if what it atomically captures still matches our token,
  // and safely leaves anything else alone (protected by its own owner's
  // lockStillOwned() check, not by whether the path still exists) rather
  // than risk deleting a live lock.
  atomicallyRemoveLockIfContent(path_, token);
}

// A holder that was preempted (SIGSTOP, a debugger, scheduling, or a stalled
// filesystem) for longer than LOCK_ABSOLUTE_MAX_MS can have its lock
// reclaimed by someone else while process.kill(pid, 0) still correctly
// reports it as alive — that cap exists specifically to bound the PID-reuse
// case, and paying for it with an occasional false reclaim of a genuinely
// live-but-paused owner is the accepted tradeoff (see reclaimStaleLock).
// Without this check, that paused owner would resume with no idea it lost
// the lock and blindly overwrite whatever a legitimate new owner wrote in
// the meantime with the stale `existing` value it read before pausing —
// turning a bounded reclaim into a silent, retroactive consent reversal.
// Checked immediately before every write that happens under a lock, right
// after the read it's protecting, so the window it can't close is only the
// gap between this check and the write syscall itself — not the full
// pause duration.
function lockStillOwned(path_: string, token: string): boolean {
  try {
    return fs.readFileSync(path_, 'utf-8') === token;
  } catch {
    return false;
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
    if (!lockStillOwned(path_, token)) {
      throw new Error(
        `enableTelemetry('${product}'): lost the telemetry config lock mid-call (likely ` +
          `reclaimed after this call was paused past the reclaim threshold) — the opt-in ` +
          `was not recorded, retry`
      );
    }
    writeConfig(product, { enabled: true, installId: existing?.installId });
    consentCache.set(product, true);
    consentGeneration.set(product, (consentGeneration.get(product) ?? 0) + 1);
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
    if (!lockStillOwned(path_, token)) {
      throw new Error(
        `disableTelemetry('${product}'): lost the telemetry config lock mid-call (likely ` +
          `reclaimed after this call was paused past the reclaim threshold) — the opt-out ` +
          `was not recorded, retry`
      );
    }
    writeConfig(product, { enabled: false, installId: existing?.installId });
    consentCache.set(product, false);
    consentGeneration.set(product, (consentGeneration.get(product) ?? 0) + 1);
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
 * honor). An explicit persisted opt-out — i.e. disableTelemetry(product)
 * was called and its result is still on disk — always wins next, even over
 * the environment opt-in below: disableTelemetry()'s own contract promises
 * it's "honored regardless of environment variables", so a scripted/CI
 * SYNCPULSE_TELEMETRY_<PRODUCT>=1 must never silently override a user's
 * explicit local opt-out. Only after that does SYNCPULSE_TELEMETRY_<PRODUCT>=1
 * apply — it opts in one specific, named product only, useful for CI or
 * scripted installs, and setting it for one product can never cross-enable
 * an unrelated product that happens to inherit the same environment.
 */
export function isTelemetryEnabled(product: string): boolean {
  if (process.env.SYNCPULSE_TELEMETRY === '0') return false;
  const config = readConfig(product);
  if (config?.enabled === false) return false;
  if (process.env[envOptInKey(product)] === '1') return true;
  return config?.enabled ?? false;
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
        if (!lockStillOwned(path_, token)) return randomUUID(); // lost the lock mid-call — ephemeral fallback
        const installId = randomUUID();
        // Deliberately no `?? false` fallback: a product enabled *only*
        // via its environment variable (never called enableTelemetry(),
        // so no config file exists yet) reaches this exact path on its
        // first event. Writing `enabled: false` here — even though no one
        // ever explicitly disabled anything — would persist what every
        // later isTelemetryEnabled()/recordEvent() call treats as an
        // explicit opt-out that outranks the environment opt-in, silently
        // disabling that product after exactly one event. Omitting the
        // field (when neither `latest` nor `existing` had one) instead
        // persists "no decision yet", which is what's actually true.
        writeConfig(product, { enabled: latest?.enabled ?? existing?.enabled, installId });
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

// In-memory cache of this process's own view of persisted per-product
// consent, updated synchronously by enableTelemetry()/disableTelemetry()
// right after each successful write, and self-healed by recordEvent()'s
// own disk reads (see recordEvent below) so a stale value can never be
// trusted indefinitely.
const consentCache = new Map<string, boolean>();

// Bumped synchronously, once, by enableTelemetry()/disableTelemetry() each
// time either actually completes — a count of how many in-process consent
// changes have happened for a product so far, not a boolean. Paired with
// consentCache to answer a question neither alone can: recordEvent()
// captures both at invocation; later, once its disk read resolves, if the
// generation is *still* what it captured, no in-process enable/disable call
// completed in between, so the disk read genuinely reflects state that
// existed at-or-before invocation (whether from an earlier process's write,
// or nothing having changed at all) and can be trusted. Only if the
// generation *changed* in between is there real ambiguity — some in-process
// write landed on disk sometime during the wait, and there's no way to tell
// whether the read beat it or not — and only then does recordEvent fall
// back to trusting nothing but a `true` this exact event's own invocation
// already knew about.
//
// This is what actually reconciles two guarantees that a plain boolean
// cache can't hold at once: a fresh process must still honor consent
// persisted by an *earlier* process (the common case — nothing in this
// process ever changes generation, so the disk read is always trusted),
// while a recordEvent() immediately followed by an in-process
// enableTelemetry() call for the same product must still never
// retroactively count that specific event as consented (generation changes
// before the read resolves, so the fallback applies).
//
// Known limitation, not fixed here: this generation counter is process-
// local. If a *different* process calls enableTelemetry() while this
// process's recordEvent() disk read is in flight, that other process's
// write can still land before the read resolves, and this process has no
// way to know — its own generation is untouched, so the read is trusted
// as "unchanged", and the event sends even though it was invoked before
// that cross-process opt-in existed. Closing this would require either a
// synchronous disk read at recordEvent()'s own invocation (which round 8
// deliberately ruled out, so recordEvent() can never block on a slow or
// unresponsive filesystem) or a shared, monotonically-ordered consent
// version both processes agree on without synchronous coordination —
// effectively building real cross-process consensus for anonymous opt-in
// telemetry. Accepted as an inherent limit of file-based IPC latency, the
// same category as the fs/promises-unref limitation documented above.
const consentGeneration = new Map<string, number>();

/**
 * Sends the event as a detached, unref'd HTTP(S) request. Using the raw
 * http/https modules (rather than fetch, which offers no handle to unref)
 * is deliberate: unref-ing the socket as soon as it's available means a
 * pending telemetry request can never keep Node's event loop alive past a
 * short-lived CLI command's own natural exit. The request still completes
 * normally if the process happens to stay alive for other reasons — unref
 * only stops it from being a reason to stay alive on its own.
 *
 * Known limitation, not fixed here: unref-ing the socket doesn't cover DNS
 * resolution. http.request() resolves a hostname via dns.lookup(), which
 * runs on Node's libuv threadpool — the same kind of pending, referenced
 * work as an fs/promises call (see readConfigAsync above), with no public
 * unref() equivalent either. A stalled resolver can hold the process open
 * independent of the socket's own unref() and of the absolute-deadline
 * timer below (itself unref'd, and unable to force early cancellation of
 * threadpool work already dispatched). Accepted for the same reason as
 * the fs/promises limitation: a real fix means bypassing http.request()'s
 * built-in resolution with a custom, cancelable/unref-able DNS strategy,
 * disproportionate for delivery to a small, operator-configured set of
 * telemetry endpoints rather than arbitrary hostnames.
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

  // Captured synchronously, before any awaits: both reflect state exactly
  // as of this call, not whichever state happens to still be current once
  // the detached block below actually runs.
  //
  // - timestamp: otherwise two events fired back-to-back could have their
  //   recorded order reversed by whichever one's lock/config wait happens
  //   to resolve first, corrupting event ordering for time-based analysis.
  // - cachedConsent / generationAtInvocation: see consentCache and
  //   consentGeneration above.
  const timestamp = new Date().toISOString();
  const cachedConsent = consentCache.get(product);
  const generationAtInvocation = consentGeneration.get(product) ?? 0;

  // Detached: intentionally not awaited so delivery can never block or
  // slow down the caller. Errors are caught inside so this can never
  // surface as an unhandled rejection.
  void (async () => {
    try {
      // Always re-read disk, even when a cached value already exists: a
      // cached `true` must never be trusted indefinitely, or a *later*
      // disableTelemetry() call — from this process or another one — would
      // be silently ignored by every subsequent recordEvent() call for as
      // long as the process runs.
      const config = await readConfigAsync(product);
      const diskEnabled = config?.enabled ?? false;
      // Has any in-process enable/disable call *completed* since this
      // event's own invocation? If not (generation unchanged), nothing in
      // this process could have raced ahead of this read, so diskEnabled
      // genuinely reflects state that existed at-or-before invocation —
      // whether that's a persisted opt-in from an *earlier* process/run
      // (the common case for a process-per-command CLI, which must still
      // work) or simply nothing having changed — and can be trusted
      // directly, including to self-heal the cache for every event after
      // this one. Only when the generation *did* change is there real
      // ambiguity: some in-process write landed on disk sometime during
      // this wait, with no way to tell whether this read started before
      // or resolved after it — e.g. this exact read could have opened the
      // file while `enabled: true`, then disableTelemetry() completed
      // (bumping the generation and writing `enabled: false`) before this
      // read's promise actually resolved. In that ambiguous case, this
      // read's result is stale and must not be trusted for anything —
      // not the send decision (falls back to trusting nothing but a
      // `true` this exact event's own invocation already knew about,
      // closing the original pre-consent-event race) and not the cache
      // self-heal either (skipped entirely, leaving whatever the newer
      // synchronous enable/disable call itself already wrote there,
      // rather than clobbering it with this stale read's answer).
      const generationUnchanged = (consentGeneration.get(product) ?? 0) === generationAtInvocation;
      if (generationUnchanged) consentCache.set(product, diskEnabled);
      if (config?.enabled === false) return; // Explicit opt-out always wins, even over env var opt-in.
      const persistedEnabled = generationUnchanged ? diskEnabled : cachedConsent === true;
      if (!envOptedIn && !persistedEnabled) return;
      const installId = await getOrCreateInstallId(product);
      const payload: TelemetryEvent = {
        event,
        product,
        productVersion,
        timestamp,
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
