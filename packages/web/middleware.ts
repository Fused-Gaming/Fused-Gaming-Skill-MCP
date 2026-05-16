import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Public routes that do NOT require authentication
 * Includes landing/login pages, health checks, and auth callbacks
 */
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/magic-link-request',
  '/auth/magic-link',
  '/landing',
  '/sales',
  '/contact-sales',
  '/api/auth',
  '/api/health',
  '/api/contact-sales',
];

/**
 * Protected API routes that require authentication
 * Routes starting with /api/ that need valid session
 */
const PROTECTED_API_ROUTES = [
  '/api/tasks',
  '/api/swarms',
  '/api/roadmap',
];

/**
 * Protected page routes that require authentication
 */
const PROTECTED_PAGE_ROUTES = ['/dashboard'];

// JWT secret for verifying tokens (in production, load from env)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Base64URL decodes a string (for JWT)
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Verifies a JWT token without requiring session store lookup
 * Suitable for serverless/deployed environments
 * @param token - The JWT token to validate
 * @returns true if token is valid and not expired
 */
function isValidJWT(token: string): boolean {
  if (!token || token.trim().length === 0) {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(message)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      return false;
    }

    // Decode and validate payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a pathname matches any of the allowed routes
 * Supports both exact and prefix matching
 * @param pathname - The path to check
 * @param routes - List of routes to match against
 * @returns true if pathname matches any route
 */
function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Main middleware function
 * Handles authentication, authorization, CORS, and security headers
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get('sessionToken')?.value || '';
  const isAuthenticated = isValidJWT(sessionToken);

  // PROBLEM 3: API route auth enforcement
  // Check authentication FIRST for protected API routes, BEFORE returning CORS headers
  if (pathname.startsWith('/api/')) {
    // Check if this is a protected API route
    const isProtectedApi = matchesRoutes(pathname, PROTECTED_API_ROUTES);

    // Reject protected API routes without authentication
    if (isProtectedApi && !isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Valid session required to access this API endpoint',
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // For all API routes, add CORS and security headers
    const response = NextResponse.next();

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  // PROBLEM 2: Magic link pages not in allowlist
  // Root path (/) handling - special case for landing vs dashboard
  if (pathname === '/') {
    if (isAuthenticated) {
      // Authenticated users go to dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    // Unauthenticated users stay at landing (which is now served by /page.tsx)
    // Falls through to add security headers
  }

  // Check if accessing public auth pages
  const isPublicRoute = matchesRoutes(pathname, PUBLIC_ROUTES);

  // Protected page routes require authentication
  if (matchesRoutes(pathname, PROTECTED_PAGE_ROUTES)) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // PROBLEM 1: Root dashboard is public
  // Prevent access to dashboard without authentication (handled above)
  // Prevent access to other protected content without auth
  if (!isPublicRoute && !isAuthenticated && pathname !== '/') {
    // If not a public route and not authenticated, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Add security headers to all non-API responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
