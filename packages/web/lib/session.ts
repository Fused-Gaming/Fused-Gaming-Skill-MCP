/**
 * Session validation and management utilities
 * Handles authentication token validation and session checks
 */

import { SessionStore } from './session-store';

/**
 * Session token type definition
 * Used for type-safe session validation
 */
export interface SessionToken {
  value: string;
  expiresAt?: Date;
  userId?: string;
  email?: string;
  passwordChanged?: boolean;
}

/**
 * Auth check result for API routes
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;
  sessionToken?: SessionToken;
  error?: string;
}

/**
 * Session validation result
 */
export interface SessionValidationResult {
  isValid: boolean;
  token?: SessionToken;
  error?: string;
}

/**
 * Validates if a session token string is valid and non-empty
 * @param token - The session token to validate
 * @returns true if token is valid, false otherwise
 */
export function isValidSessionToken(token: string | undefined | null): token is string {
  return Boolean(token && typeof token === 'string' && token.trim().length > 0);
}

/**
 * Parses session token from cookie string
 * @param cookieString - The cookie string containing sessionToken
 * @returns SessionToken or undefined if not found or invalid
 */
export function parseSessionToken(cookieString: string): SessionToken | undefined {
  const match = cookieString.match(/sessionToken=([^;]+)/);
  if (!match || !match[1]) return undefined;

  const token = decodeURIComponent(match[1]);
  if (!isValidSessionToken(token)) return undefined;

  return {
    value: token,
  };
}

/**
 * Creates a session token cookie string
 * @param token - The token value
 * @param expiresIn - Optional expiration time in milliseconds
 * @returns Cookie string
 */
export function createSessionTokenCookie(
  token: string,
  expiresIn?: number
): string {
  const encodedToken = encodeURIComponent(token);
  let cookieString = `sessionToken=${encodedToken}; path=/; SameSite=Strict`;

  if (expiresIn) {
    const expirationDate = new Date(Date.now() + expiresIn);
    cookieString += `; expires=${expirationDate.toUTCString()}`;
  }

  return cookieString;
}

/**
 * Creates a logout cookie (expires immediately)
 * @returns Cookie string that clears the sessionToken
 */
export function createLogoutCookie(): string {
  return 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict';
}

/**
 * Validates complete session
 * @param sessionToken - The session token to validate
 * @returns SessionValidationResult with validation details
 */
export function validateSession(sessionToken?: string): SessionValidationResult {
  if (!isValidSessionToken(sessionToken)) {
    return {
      isValid: false,
      error: 'Invalid or missing session token',
    };
  }

  return {
    isValid: true,
    token: {
      value: sessionToken,
    },
  };
}

/**
 * Gets session token from document cookies (client-side only)
 * @returns Session token value or undefined
 */
export function getSessionTokenFromCookies(): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const match = document.cookie.match(/sessionToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Clears session token from cookies (client-side only)
 */
export function clearSessionCookie(): void {
  if (typeof document === 'undefined') return;

  document.cookie = createLogoutCookie();
}

/**
 * Sets session token in cookies (client-side only)
 * @param token - The token value
 * @param expiresIn - Optional expiration time in milliseconds
 */
export function setSessionCookie(token: string, expiresIn?: number): void {
  if (typeof document === 'undefined') return;

  document.cookie = createSessionTokenCookie(token, expiresIn);
}

/**
 * Validates JWT token from Authorization header
 * Used by API routes to check authentication
 * @param authorizationHeader - The Authorization header value (e.g., "Bearer token")
 * @returns AuthCheckResult with session details if valid
 */
export function validateJWTToken(authorizationHeader?: string): AuthCheckResult {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return {
      isAuthenticated: false,
      error: 'Missing or invalid Authorization header',
    };
  }

  const token = authorizationHeader.substring(7); // Remove 'Bearer ' prefix

  if (!isValidSessionToken(token)) {
    return {
      isAuthenticated: false,
      error: 'Invalid token format',
    };
  }

  const session = SessionStore.getSession(token);

  if (!session) {
    return {
      isAuthenticated: false,
      error: 'Invalid or expired token',
    };
  }

  return {
    isAuthenticated: true,
    sessionToken: {
      value: token,
      userId: session.userId,
      email: session.email,
      passwordChanged: session.passwordChanged,
      expiresAt: session.expiresAt,
    },
  };
}
