# Routing Security and Authentication - PR #160 Fixes

## Overview

This document explains the three critical routing problems fixed in PR #160 and how they ensure the SyncPulse dashboard and APIs are properly protected.

## Problem 1: Root Dashboard Public Access

### Issue
The root path (`/`) was treated as a public route, but it served the landing page via `/page.tsx`. However, there was confusion about what should be publicly accessible.

### Solution
The middleware now implements intelligent root path handling:

```typescript
if (pathname === '/') {
  if (isAuthenticated) {
    // Authenticated users go to dashboard
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  // Unauthenticated users see landing page (served by /page.tsx)
  // Falls through to add security headers
}
```

### Result
- **Authenticated users**: Automatically redirected to `/dashboard` (protected by requiring valid session)
- **Unauthenticated users**: See landing page at `/` via `/app/page.tsx` (LandingPage component)
- **Dashboard access**: Requires valid session token stored in `SessionStore`

### Routes Affected
- `/` → Landing page (public, but redirects authenticated users to dashboard)
- `/dashboard` → Requires authentication

## Problem 2: Magic Link Pages Not in Allowlist

### Issue
Magic link authentication pages were not properly configured in the `PUBLIC_ROUTES` allowlist:
- `/auth/magic-link-request` - Form to request a magic link
- `/auth/magic-link` - Page to verify/consume magic link token

Users receiving magic link emails would be redirected to login before the verification could complete.

### Solution
Added both magic link routes to `PUBLIC_ROUTES`:

```typescript
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/magic-link-request',  // ✓ Added - allows requesting link
  '/auth/magic-link',            // ✓ Added - allows verifying link
  '/landing',
  '/api/auth',
  '/api/health',
];
```

### Implementation
Created two new page components:

1. **`/app/auth/magic-link-request/page.tsx`**
   - Form to request magic link via email
   - Calls `POST /api/auth/magic-link/request`
   - Shows success/error messages
   - Links to login and signup pages

2. **`/app/auth/magic-link/page.tsx`**
   - Verifies magic link token from URL query parameter
   - Calls `POST /api/auth/magic-link/verify`
   - Automatically logs in user on success
   - Redirects to `/dashboard`
   - Shows error handling for expired/used links

### Routes Affected
- `/auth/magic-link-request` - Public, requires email
- `/auth/magic-link` - Public, requires `?token=` query parameter
- `/api/auth/magic-link/request` - Public API endpoint
- `/api/auth/magic-link/verify` - Public API endpoint

## Problem 3: API Routes Bypass Auth Check

### Issue
The middleware was checking API routes for authentication but the implementation had a critical flaw:
- Auth check happened AFTER CORS headers were set
- This could expose API routes to unauthorized access if checks were bypassed

### Solution
Restructured middleware to enforce authentication FIRST, then add security headers:

```typescript
if (pathname.startsWith('/api/')) {
  // Check if this is a protected API route
  const isProtectedApi = matchesRoutes(pathname, PROTECTED_API_ROUTES);

  // FIRST: Reject protected API routes without authentication
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

  // SECOND: Add CORS and security headers for all API routes
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  // ... other headers ...
  return response;
}
```

### Key Features

#### Protected API Routes
These routes require valid session token:
- `POST /api/tasks` - Create/manage tasks
- `POST /api/swarms` - Create/manage swarms
- `POST /api/roadmap` - Create/manage roadmaps

#### Public API Routes
These routes are accessible without authentication:
- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/magic-link/request` - Request magic link
- `POST /api/auth/magic-link/verify` - Verify magic link

#### CORS Headers
All API routes receive:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`

#### Security Headers
All API routes receive:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Session Validation

The middleware now uses robust session validation via `SessionStore`:

```typescript
function isValidSession(sessionToken: string | undefined): boolean {
  if (!sessionToken || sessionToken.trim().length === 0) {
    return false;
  }

  // Validate token exists in store and is not expired
  const session = SessionStore.getSession(sessionToken);
  return session !== null;
}
```

The `SessionStore.getSession()` method validates:
- Token exists in session map
- Session has not expired
- User information is intact
- Password change state is tracked

## Complete Routing Matrix

### Public Page Routes (No Auth Required)
| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/landing` | Explicit landing page |
| `/auth/login` | Email/password login |
| `/auth/signup` | User signup |
| `/auth/magic-link-request` | Request magic link |
| `/auth/magic-link` | Verify magic link |

### Protected Page Routes (Auth Required)
| Route | Purpose |
|-------|---------|
| `/dashboard` | Main dashboard (auto-redirect from `/`) |

### Public API Routes (No Auth Required)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/magic-link/request` | POST | Request magic link |
| `/api/auth/magic-link/verify` | POST | Verify magic link |
| `/api/auth/change-password` | POST | Change password |
| `/api/auth/session` | GET | Get session info |

### Protected API Routes (Auth Required)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tasks` | GET, POST, PUT, DELETE | Task management |
| `/api/swarms` | GET, POST, PUT, DELETE | Swarm management |
| `/api/roadmap` | GET, POST, PUT, DELETE | Roadmap management |

## Testing

Unit tests are provided in `packages/web/__tests__/middleware.test.ts` to verify:

1. **Root path behavior**: Redirects authenticated users to dashboard, serves landing to unauthenticated
2. **Magic link routes**: Both request and verify pages are accessible without auth
3. **API auth enforcement**: Protected routes return 401 without valid session
4. **CORS headers**: All API routes include proper CORS headers
5. **Security headers**: All routes receive security headers
6. **Auth-first pattern**: Authentication is checked before CORS is set

Run tests with:
```bash
npm test -- packages/web/__tests__/middleware.test.ts
```

## Implementation Checklist

- [x] Import `SessionStore` for robust session validation
- [x] Add `/auth/magic-link-request` to PUBLIC_ROUTES
- [x] Add `/auth/magic-link` to PUBLIC_ROUTES
- [x] Implement root path intelligent routing (/ → /dashboard for auth, /landing for unauth)
- [x] Move auth check BEFORE CORS headers in API routes
- [x] Create `/app/auth/magic-link-request/page.tsx`
- [x] Create `/app/auth/magic-link/page.tsx`
- [x] Verify TypeScript compilation passes
- [x] Add comprehensive middleware tests
- [x] Update documentation

## Migration Notes

If upgrading from a previous version:

1. **Cookie-based sessions**: Ensure `sessionToken` cookies are being set correctly by login endpoints
2. **Magic link flows**: Update any documentation linking to `/auth/magic-link-request` and `/auth/magic-link`
3. **API clients**: Ensure protected API calls include `sessionToken` in cookies
4. **CORS clients**: Can now make requests to any API route (CORS is open), but protected routes still require valid session

## Security Considerations

1. **Session expiry**: Sessions expire after 24 hours (configurable in `SessionStore`)
2. **Magic link expiry**: Magic links expire after 15 minutes
3. **CORS**: Open CORS on API routes, but protected by session validation
4. **XSS protection**: All responses include `X-XSS-Protection` header
5. **Clickjacking protection**: All responses include `X-Frame-Options: SAMEORIGIN`
6. **MIME type sniffing**: All responses include `X-Content-Type-Options: nosniff`

## Future Improvements

1. Add request rate limiting for auth endpoints
2. Implement IP-based session locking
3. Add audit logging for auth events
4. Implement password strength requirements
5. Add 2FA support
6. Implement session invalidation on password change
7. Add account lockout after failed login attempts
