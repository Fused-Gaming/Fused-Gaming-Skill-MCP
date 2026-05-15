import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/auth', '/api/auth'];

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

/**
 * Validates if a session token exists and is non-empty
 */
function isValidSession(sessionToken: string | undefined): boolean {
  return Boolean(sessionToken && sessionToken.trim().length > 0);
}

/**
 * Checks if a pathname matches any of the allowed routes
 */
function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const isAuthenticated = isValidSession(sessionToken);

  // Handle API routes with CORS headers
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  // Check if accessing protected routes without authentication
  if (matchesRoutes(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      // Redirect to landing page if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
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
