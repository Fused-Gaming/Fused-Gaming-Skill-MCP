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
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const isAuthenticated = isValidSession(sessionToken);

  // PROBLEM 3: API route auth enforcement
  // Check authentication FIRST for protected API routes, BEFORE returning CORS headers
  if (pathname.startsWith('/api/')) {
    // Allow CORS preflight requests to reach their handlers
    if (request.method === 'OPTIONS') {
      const response = NextResponse.next();
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return response;
    }

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
