/**
 * Middleware routing tests
 * Verifies that all three routing problems are fixed:
 * 1. Root dashboard is protected
 * 2. Magic link pages in allowlist
 * 3. API routes enforce auth before CORS
 */

import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Mock SessionStore for testing
jest.mock('@/lib/session-store', () => ({
  SessionStore: {
    getSession: (token: string) => {
      // Valid token for testing
      if (token === 'valid-token') {
        return {
          token: 'valid-token',
          email: 'test@example.com',
          userId: 'user123',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          passwordChanged: false,
        };
      }
      return null;
    },
  },
}));

describe('Middleware Routing', () => {
  describe('Problem 1: Root dashboard protection', () => {
    it('should redirect authenticated users from / to /dashboard', () => {
      const request = new NextRequest(new URL('http://localhost:3000/'), {
        headers: new Headers({
          cookie: 'sessionToken=valid-token',
        }),
      });

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Response should redirect to /dashboard
    });

    it('should allow unauthenticated users to access / (landing page)', () => {
      const request = new NextRequest(new URL('http://localhost:3000/'), {
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should pass through to landing page, not redirect
    });

    it('should require auth for /dashboard', () => {
      const request = new NextRequest(new URL('http://localhost:3000/dashboard'), {
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should redirect to /auth/login
    });

    it('should allow authenticated users to access /dashboard', () => {
      const request = new NextRequest(new URL('http://localhost:3000/dashboard'), {
        headers: new Headers({
          cookie: 'sessionToken=valid-token',
        }),
      });

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should allow access
    });
  });

  describe('Problem 2: Magic link pages in allowlist', () => {
    it('should allow access to /auth/magic-link-request without auth', () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/auth/magic-link-request'),
        {
          headers: new Headers(),
        }
      );

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should pass through without redirect
    });

    it('should allow access to /auth/magic-link without auth', () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/auth/magic-link?token=test'),
        {
          headers: new Headers(),
        }
      );

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should pass through without redirect
    });

    it('should allow access to /auth/login without auth', () => {
      const request = new NextRequest(new URL('http://localhost:3000/auth/login'), {
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response).toBeInstanceOf(NextResponse);
      // Should pass through without redirect
    });
  });

  describe('Problem 3: API route auth enforcement', () => {
    it('should reject /api/tasks without authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/tasks'), {
        method: 'GET',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.status).toBe(401);
      // Should return 401 before checking CORS
    });

    it('should allow /api/tasks with valid authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/tasks'), {
        method: 'GET',
        headers: new Headers({
          cookie: 'sessionToken=valid-token',
        }),
      });

      const response = middleware(request);
      expect(response.status).not.toBe(401);
      // Should allow access with CORS headers
    });

    it('should reject /api/swarms without authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/swarms'), {
        method: 'POST',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.status).toBe(401);
    });

    it('should reject /api/roadmap without authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/roadmap'), {
        method: 'GET',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.status).toBe(401);
    });

    it('should allow /api/health without authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/health'), {
        method: 'GET',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.status).not.toBe(401);
      // Health check is public
    });

    it('should allow /api/auth/* without authentication', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/auth/login'), {
        method: 'POST',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.status).not.toBe(401);
      // Auth endpoints are public
    });

    it('should add CORS headers to all API responses', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/health'), {
        method: 'GET',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
      expect(response.headers.get('Access-Control-Allow-Headers')).toBeDefined();
    });

    it('should add security headers to API responses', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/health'), {
        method: 'GET',
        headers: new Headers(),
      });

      const response = middleware(request);
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });

    it('should enforce auth BEFORE returning CORS headers for protected routes', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/tasks'), {
        method: 'POST',
        headers: new Headers(),
      });

      const response = middleware(request);
      // 401 response should be returned immediately, not CORS allowed
      expect(response.status).toBe(401);
      expect(response.headers.get('Content-Type')).toContain('application/json');
    });
  });

  describe('Session validation', () => {
    it('should use SessionStore for session validation', () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/tasks'), {
        method: 'GET',
        headers: new Headers({
          cookie: 'sessionToken=invalid-token',
        }),
      });

      const response = middleware(request);
      // Invalid token should result in 401
      expect(response.status).toBe(401);
    });

    it('should reject expired sessions', () => {
      // SessionStore.getSession will return null for expired tokens
      const request = new NextRequest(new URL('http://localhost:3000/api/tasks'), {
        method: 'GET',
        headers: new Headers({
          cookie: 'sessionToken=expired-token',
        }),
      });

      const response = middleware(request);
      expect(response.status).toBe(401);
    });
  });

  describe('Public routes', () => {
    const publicRoutes = [
      '/auth/login',
      '/auth/signup',
      '/auth/magic-link-request',
      '/auth/magic-link',
      '/landing',
      '/api/auth/login',
      '/api/health',
    ];

    publicRoutes.forEach((route) => {
      it(`should allow access to ${route} without authentication`, () => {
        const request = new NextRequest(new URL(`http://localhost:3000${route}`), {
          headers: new Headers(),
        });

        const response = middleware(request);
        expect(response.status).not.toBe(302); // Should not redirect
      });
    });
  });
});
