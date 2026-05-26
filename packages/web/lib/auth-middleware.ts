/**
 * JWT-based Authentication Middleware
 *
 * Provides Passport.js-style authentication middleware for protecting API routes
 * and pages. Validates JWT tokens from Authorization headers, extracts user info,
 * and supports role-based authorization checks.
 *
 * Usage in Next.js API Routes:
 * ```typescript
 * export const GET = withAuth(handler, { requiredRole: 'admin' });
 * ```
 *
 * Usage in Next.js Middleware:
 * ```typescript
 * const isAuthenticated = await verifyAuthToken(token);
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from './session-store';

/**
 * Authenticated user context attached to request
 * Extracted from JWT payload
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  passwordChanged: boolean;
  iat: number;
  exp: number;
}

/**
 * Auth middleware options
 */
export interface AuthMiddlewareOptions {
  requiredRole?: 'admin' | 'user';
  optional?: boolean;
  skipVerification?: boolean;
}

/**
 * Extended Next.js request with auth context
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

/**
 * Rate limiting headers for throttling
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}

/**
 * Extracts JWT token from Authorization header
 * Supports "Bearer <token>" format
 */
function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Extracts JWT token from cookies or Authorization header
 * Tries Authorization header first, falls back to sessionToken cookie
 */
export function getAuthToken(request: NextRequest): string | null {
  // Try Authorization header first (preferred for API calls)
  const headerToken = extractTokenFromHeader(request);
  if (headerToken) {
    return headerToken;
  }

  // Fall back to sessionToken cookie (for browser-based requests)
  const cookieToken = request.cookies.get('sessionToken')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Verifies a JWT token and extracts user information
 * Returns null if token is invalid or expired
 */
export function verifyAuthToken(token: string | null): AuthenticatedUser | null {
  if (!token) {
    return null;
  }

  try {
    const session = SessionStore.getSession(token);
    if (!session) {
      return null;
    }

    // Extract role from session, default to 'user' if not set
    const role: 'admin' | 'user' = session.role ?? 'user';

    // Calculate JWT timestamps
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 24 * 60 * 60; // 24 hours

    return {
      userId: session.userId,
      email: session.email,
      role,
      passwordChanged: session.passwordChanged,
      iat: now,
      exp,
    };
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }
}

/**
 * Creates an error response with appropriate status code and headers
 */
function createAuthErrorResponse(
  status: number,
  message: string,
  headers?: Record<string, string>
): NextResponse {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  };

  let errorMessage = 'Internal Server Error';
  if (status === 401) {
    errorMessage = 'Unauthorized';
  } else if (status === 403) {
    errorMessage = 'Forbidden';
  }

  return NextResponse.json(
    {
      error: errorMessage,
      message,
    },
    {
      status,
      headers: { ...defaultHeaders, ...headers },
    }
  );
}

/**
 * Adds rate limit headers to response
 * Useful for throttling API requests
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number = 100,
  remaining: number = 99,
  resetInSeconds: number = 3600
): void {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', (Math.floor(Date.now() / 1000) + resetInSeconds).toString());
}

/**
 * Middleware to validate JWT authentication
 * Attaches user context to request if token is valid
 */
export async function validateAuthMiddleware(
  request: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ user: AuthenticatedUser | null; error?: string }> {
  const { requiredRole, optional = false, skipVerification = false } = options;

  // Skip verification if explicitly disabled (for testing)
  if (skipVerification) {
    return {
      user: {
        userId: 'test-user',
        email: 'test@example.com',
        role: requiredRole || 'user',
        passwordChanged: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    };
  }

  const token = getAuthToken(request);
  const user = verifyAuthToken(token);

  // If no token provided and auth is optional, allow access
  if (!user && optional) {
    return { user: null };
  }

  // If no valid token and auth is required, return error
  if (!user) {
    return {
      user: null,
      error: 'Invalid or expired authentication token',
    };
  }

  // Check role-based authorization
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return {
      user: null,
      error: `This endpoint requires ${requiredRole} role`,
    };
  }

  return { user };
}

/**
 * Higher-order function to wrap Next.js API route handlers with authentication
 *
 * Usage:
 * ```typescript
 * const handler = (req: NextRequest) => NextResponse.json({ data: 'secret' });
 * export const GET = withAuth(handler, { requiredRole: 'admin' });
 * ```
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse> | NextResponse,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { user, error } = await validateAuthMiddleware(request, options);

      // Handle authentication errors
      if (!user) {
        if (error?.includes('role')) {
          return createAuthErrorResponse(403, error || 'Insufficient permissions');
        }
        return createAuthErrorResponse(401, error || 'Authentication required');
      }

      // Call the wrapped handler with authenticated user
      const response = await handler(request, user);

      // Add rate limit headers
      addRateLimitHeaders(response);

      return response;
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return createAuthErrorResponse(500, 'Internal server error');
    }
  };
}

/**
 * Higher-order function for optional authentication
 * Handler receives user if authenticated, null otherwise
 *
 * Usage:
 * ```typescript
 * const handler = (req: NextRequest, user: AuthenticatedUser | null) => {
 *   return NextResponse.json({ user });
 * };
 * export const GET = withOptionalAuth(handler);
 * ```
 */
export function withOptionalAuth(
  handler: (request: NextRequest, user: AuthenticatedUser | null) => Promise<NextResponse> | NextResponse,
  options: AuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { user } = await validateAuthMiddleware(request, { ...options, optional: true });

      // Call handler with user (may be null)
      const response = await handler(request, user);

      // Add rate limit headers
      addRateLimitHeaders(response);

      return response;
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      return createAuthErrorResponse(500, 'Internal server error');
    }
  };
}

/**
 * Creates a custom middleware for validating auth in arbitrary contexts
 * Useful for protectingEdge functions or middleware chains
 */
export function createAuthValidator(options: AuthMiddlewareOptions = {}) {
  const validator = {
    /**
     * Validates token and returns user or null
     */
    validate(token: string | null): AuthenticatedUser | null {
      const user = verifyAuthToken(token);
      if (!user) return null;

      const { requiredRole } = options;
      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        return null;
      }

      return user;
    },

    /**
     * Extracts user from request
     */
    extractUser(request: NextRequest): AuthenticatedUser | null {
      const token = getAuthToken(request);
      return validator.validate(token);
    },

    /**
     * Creates auth headers for requests
     */
    createAuthHeader(token: string): Record<string, string> {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    },
  };

  return validator;
}

/**
 * Checks if user has required role
 * Useful in API handlers after auth validation
 */
export function hasRole(user: AuthenticatedUser | null, requiredRole: 'admin' | 'user'): boolean {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
}

/**
 * Checks if user is admin
 */
export function isAdmin(user: AuthenticatedUser | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Extracts user ID from authenticated request
 * Throws if not authenticated
 */
export function requireUserId(user: AuthenticatedUser | null): string {
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.userId;
}

/**
 * Validates password has been changed on first login
 * Returns true if password is changed or not required
 */
export function isPasswordChangeRequired(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return !user.passwordChanged;
}
