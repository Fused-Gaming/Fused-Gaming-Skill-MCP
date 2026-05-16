/**
 * In-memory Token Bucket Rate Limiter
 * Simple but effective rate limiting for API endpoints
 * In production, this should use Redis or similar distributed cache
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  tokensPerWindow: number; // Number of requests allowed
  windowSizeMs: number; // Time window in milliseconds
}

// Default rate limit configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  auth: { tokensPerWindow: 5, windowSizeMs: 60 * 1000 }, // 5 requests per minute (signup, etc)
  login: { tokensPerWindow: 5, windowSizeMs: 60 * 1000 }, // 5 login attempts per minute
  magicLink: { tokensPerWindow: 3, windowSizeMs: 60 * 1000 }, // 3 magic link requests per minute
  changePassword: { tokensPerWindow: 3, windowSizeMs: 60 * 1000 }, // 3 attempts per minute
  contactForm: { tokensPerWindow: 10, windowSizeMs: 60 * 1000 }, // 10 submissions per minute
};

/**
 * Checks if a request should be allowed based on rate limit
 * Returns { allowed: true } if request is allowed
 * Returns { allowed: false, retryAfterSeconds: number } if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  let bucket = buckets.get(identifier);

  if (!bucket) {
    // Create new bucket for this identifier
    bucket = {
      tokens: config.tokensPerWindow,
      lastRefill: now,
    };
    buckets.set(identifier, bucket);
    return { allowed: true };
  }

  // Refill tokens based on elapsed time
  const elapsedMs = now - bucket.lastRefill;
  const tokensToAdd = (elapsedMs / config.windowSizeMs) * config.tokensPerWindow;

  bucket.tokens = Math.min(config.tokensPerWindow, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  // Check if we have tokens available
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true };
  }

  // Calculate retry after time
  const timeToNextToken = (config.windowSizeMs / config.tokensPerWindow);
  const retryAfterSeconds = Math.ceil(timeToNextToken / 1000);

  return {
    allowed: false,
    retryAfterSeconds,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or user ID if authenticated
 */
export function getClientIdentifier(
  ip: string | null,
  userId?: string
): string {
  return userId || ip || 'unknown';
}

/**
 * Clean up old buckets periodically (runs every 5 minutes)
 * Prevents memory leaks from accumulating identifiers
 */
export function cleanupOldBuckets(maxAgeMs: number = 30 * 60 * 1000): void {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > maxAgeMs) {
      entriesToDelete.push(key);
    }
  }

  for (const key of entriesToDelete) {
    buckets.delete(key);
  }
}

// Schedule cleanup every 5 minutes
if (typeof global !== 'undefined' && !(global as any)._rateLimiterCleanupScheduled) {
  (global as any)._rateLimiterCleanupScheduled = true;
  setInterval(() => cleanupOldBuckets(), 5 * 60 * 1000);
}
