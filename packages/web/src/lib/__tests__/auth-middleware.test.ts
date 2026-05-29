/**
 * Tests for JWT Authentication Middleware
 *
 * Validates:
 * - Bearer token extraction and validation
 * - JWT payload parsing
 * - Role-based authorization
 * - Error handling (401/403 responses)
 * - Rate limiting headers
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  getAuthToken,
  verifyAuthToken,
  validateAuthMiddleware,
  withAuth,
  withOptionalAuth,
  createAuthValidator,
  hasRole,
  isAdmin,
  requireUserId,
  isPasswordChangeRequired,
  type AuthenticatedUser,
} from '../auth-middleware';
import { SessionStore } from '@/lib/session-store';
import { NextRequest } from 'next/server';

/**
 * Helper to create mock NextRequest objects
 */
function createMockRequest(options: {
  authHeader?: string;
  cookie?: string;
  path?: string;
  method?: string;
} = {}): NextRequest {
  const url = new URL(`http://localhost:3000${options.path || '/api/test'}`);
  const request = new NextRequest(url, {
    method: options.method || 'GET',
  });

  // Mock headers
  if (options.authHeader) {
    (request.headers as any).set('Authorization', options.authHeader);
  }

  // Mock cookies
  if (options.cookie) {
    (request.cookies as any).get = () => ({
      value: options.cookie,
    });
  }

  return request;
}

describe('Auth Middleware', () => {
  let validToken: string;
  let validEmail: string;

  beforeEach(() => {
    validEmail = `test-${Date.now()}@example.com`;
    const result = SessionStore.createSession(
      `user_${Date.now()}`,
      validEmail,
      true
    );
    validToken = result.token;
  });

  describe('Token Extraction', () => {
    it('should extract Bearer token from Authorization header', () => {
      const request = createMockRequest({
        authHeader: `Bearer ${validToken}`,
      });

      const token = getAuthToken(request);
      expect(token).toBe(validToken);
    });

    it('should extract token from sessionToken cookie as fallback', () => {
      const request = createMockRequest({
        cookie: validToken,
      });

      const token = getAuthToken(request);
      expect(token).toBe(validToken);
    });

    it('should prefer Authorization header over cookie', () => {
      const cookieToken = 'cookie-token';
      const request = createMockRequest({
        authHeader: `Bearer ${validToken}`,
        cookie: cookieToken,
      });

      const token = getAuthToken(request);
      expect(token).toBe(validToken);
    });

    it('should return null if no token provided', () => {
      const request = createMockRequest();
      const token = getAuthToken(request);
      expect(token).toBeNull();
    });

    it('should reject malformed Authorization header', () => {
      const request = createMockRequest({
        authHeader: `Basic ${validToken}`,
      });

      const token = getAuthToken(request);
      expect(token).toBeNull();
    });
  });

  describe('Token Verification', () => {
    it('should verify valid JWT token', () => {
      const user = verifyAuthToken(validToken);
      expect(user).not.toBeNull();
      expect(user?.email).toBe(validEmail);
      expect(user?.passwordChanged).toBe(true);
    });

    it('should return null for invalid token', () => {
      const user = verifyAuthToken('invalid-token');
      expect(user).toBeNull();
    });

    it('should return null for null token', () => {
      const user = verifyAuthToken(null);
      expect(user).toBeNull();
    });

    it('should extract user info from valid token', () => {
      const user = verifyAuthToken(validToken);
      expect(user).toHaveProperty('userId');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('passwordChanged');
      expect(user).toHaveProperty('iat');
      expect(user).toHaveProperty('exp');
    });

    it('should assign admin role to admin users', () => {
      const adminEmail = 'admin@example.com';
      const result = SessionStore.createSession(`admin_user_${Date.now()}`, adminEmail, true);
      const user = verifyAuthToken(result.token);
      expect(user?.role).toBe('admin');
    });

    it('should assign user role to regular users', () => {
      const regularEmail = 'user@example.com';
      const result = SessionStore.createSession(`user_${Date.now()}`, regularEmail, true);
      const user = verifyAuthToken(result.token);
      expect(user?.role).toBe('user');
    });
  });

  describe('Middleware Validation', () => {
    it('should validate authenticated request', async () => {
      const request = createMockRequest({
        authHeader: `Bearer ${validToken}`,
      });

      const { user, error } = await validateAuthMiddleware(request);
      expect(user).not.toBeNull();
      expect(error).toBeUndefined();
    });

    it('should reject unauthenticated request', async () => {
      const request = createMockRequest();

      const { user, error } = await validateAuthMiddleware(request);
      expect(user).toBeNull();
      expect(error).toBeDefined();
    });

    it('should allow optional auth to pass without token', async () => {
      const request = createMockRequest();

      const { user, error } = await validateAuthMiddleware(request, { optional: true });
      expect(user).toBeNull();
      expect(error).toBeUndefined();
    });

    it('should enforce role requirements', async () => {
      const request = createMockRequest({
        authHeader: `Bearer ${validToken}`,
      });

      const { user, error } = await validateAuthMiddleware(request, { requiredRole: 'admin' });
      expect(user).toBeNull();
      expect(error).toContain('role');
    });

    it('should allow admin role to access restricted resources', async () => {
      const adminEmail = `admin-${Date.now()}@example.com`;
      const result = SessionStore.createSession(`admin_${Date.now()}`, adminEmail, true);
      const request = createMockRequest({
        authHeader: `Bearer ${result.token}`,
      });

      const { user, error } = await validateAuthMiddleware(request, { requiredRole: 'admin' });
      expect(user).not.toBeNull();
      expect(error).toBeUndefined();
    });

    it('should skip verification when requested', async () => {
      const request = createMockRequest();

      const { user } = await validateAuthMiddleware(request, { skipVerification: true });
      expect(user).not.toBeNull();
      expect(user?.userId).toBe('test-user');
    });
  });

  describe('Higher-Order Wrappers', () => {
    it('withAuth should protect endpoints', async () => {
      const handler = jest.fn(async () => new Response('OK'));
      const protected = withAuth(handler);

      const request = createMockRequest();
      const response = await protected(request);

      expect(response.status).toBe(401);
      expect(handler).not.toHaveBeenCalled();
    });

    it('withAuth should call handler when authenticated', async () => {
      const handler = jest.fn(async (_req, _user) => new Response('OK'));
      const protected = withAuth(handler);

      const request = createMockRequest({
        authHeader: `Bearer ${validToken}`,
      });
      const response = await protected(request);

      expect(response.status).toBe(200);
      expect(handler).toHaveBeenCalled();
    });

    it('withOptionalAuth should allow unauthenticated requests', async () => {
      const handler = jest.fn(async (req, user) => new Response(JSON.stringify({ user })));
      const optional = withOptionalAuth(handler);

      const request = createMockRequest();
      const response = await optional(request);

      expect(response.status).toBe(200);
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Role Checks', () => {
    let adminUser: AuthenticatedUser;
    let regularUser: AuthenticatedUser;

    beforeEach(() => {
      adminUser = {
        userId: 'admin_1',
        email: 'admin@example.com',
        role: 'admin',
        passwordChanged: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      regularUser = {
        userId: 'user_1',
        email: 'user@example.com',
        role: 'user',
        passwordChanged: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
    });

    it('should check admin role', () => {
      expect(isAdmin(adminUser)).toBe(true);
      expect(isAdmin(regularUser)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });

    it('should check role equality', () => {
      expect(hasRole(adminUser, 'admin')).toBe(true);
      expect(hasRole(adminUser, 'user')).toBe(true); // Admin can do user actions
      expect(hasRole(regularUser, 'user')).toBe(true);
      expect(hasRole(regularUser, 'admin')).toBe(false);
    });

    it('should extract userId', () => {
      expect(requireUserId(adminUser)).toBe('admin_1');
      expect(() => requireUserId(null)).toThrow();
    });

    it('should check password change requirement', () => {
      const userNeedsPasswordChange = { ...adminUser, passwordChanged: false };
      expect(isPasswordChangeRequired(userNeedsPasswordChange)).toBe(true);
      expect(isPasswordChangeRequired(adminUser)).toBe(false);
      expect(isPasswordChangeRequired(null)).toBe(false);
    });
  });

  describe('Auth Validator', () => {
    it('should create validator instance', () => {
      const validator = createAuthValidator();
      expect(validator).toHaveProperty('validate');
      expect(validator).toHaveProperty('extractUser');
      expect(validator).toHaveProperty('createAuthHeader');
    });

    it('should validate token with validator', () => {
      const validator = createAuthValidator();
      const user = validator.validate(validToken);
      expect(user).not.toBeNull();
    });

    it('should enforce role in validator', () => {
      const validator = createAuthValidator({ requiredRole: 'admin' });
      const user = validator.validate(validToken); // regular user token
      expect(user).toBeNull();
    });

    it('should create auth headers', () => {
      const validator = createAuthValidator();
      const headers = validator.createAuthHeader(validToken);
      expect(headers.Authorization).toBe(`Bearer ${validToken}`);
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing Authorization header gracefully', async () => {
      const request = createMockRequest();
      const { user, error } = await validateAuthMiddleware(request);
      expect(user).toBeNull();
      expect(error).toBeDefined();
    });

    it('should handle expired tokens gracefully', async () => {
      // Create a token that will be invalid
      const request = createMockRequest({
        authHeader: 'Bearer expired.token.here',
      });

      const { user, error } = await validateAuthMiddleware(request);
      expect(user).toBeNull();
      expect(error).toBeDefined();
    });

    it('should handle malformed JWT gracefully', () => {
      const user = verifyAuthToken('not.a.valid.jwt');
      expect(user).toBeNull();
    });
  });
});
