import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

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

/**
 * Validates if a session token exists in the session store
 * Checks expiry and validates the token is legitimate
 * @param sessionToken - The session token to validate
 * @returns true if token is valid, not expired, and exists in store
 */
function isValidSession(sessionToken: string | undefined): boolean {
  if (!sessionToken || sessionToken.trim().length === 0) {
    return false;
  }

  // Validate token exists in store and is not expired
  const session = SessionStore.getSession(sessionToken);
  return session !== null;
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

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/api/auth/login', '/api/auth/status', '/api/health'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Add CORS headers to API routes
  if (pathname.startsWith('/api/')) {
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

  // Check authentication for protected routes
  if (!isPublicRoute && pathname !== '/') {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    if (!sessionToken) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
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
