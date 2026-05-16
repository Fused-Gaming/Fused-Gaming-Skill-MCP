# Routing & Authentication Architecture

This document outlines the routing structure, middleware configuration, and authentication flow for the SyncPulse application.

## Routing Structure

### Public Routes
- **`/`** - Landing page (public, no authentication required)
  - Component: `LandingPage` (`/app/page.tsx`)
  - Shows product features and call-to-action buttons
  - Includes navigation to `/auth/login` and `/auth/signup`

### Authentication Routes
- **`/auth/login`** - User login page
  - Component: `LoginPage` (`/app/auth/login/page.tsx`)
  - Accepts email and password
  - Demo credentials: `demo@example.com` / `demo`
  - Submits to `/api/auth/login`

- **`/auth/signup`** - User registration page
  - Component: `SignupPage` (`/app/auth/signup/page.tsx`)
  - Accepts name, email, password, and confirmation
  - Form validation before submission
  - TODO: Implement actual signup backend

### Protected Routes
- **`/dashboard`** - Main application dashboard
  - Component: `Dashboard` (`/app/dashboard/page.tsx`)
  - Requires valid `sessionToken` cookie
  - Middleware redirects unauthenticated users to `/`
  - Contains swarm visualizer, task monitor, and control panels

### API Routes
All API routes preserve existing CORS and security headers.

#### Authentication Endpoints
- **`POST /api/auth/login`** - User authentication
  - Request body: `{ email: string, password: string }`
  - Response: `{ sessionToken: string, expiresIn: number, user: {...} }`
  - Sets `sessionToken` cookie automatically

- **`POST /api/auth/logout`** - User logout
  - Clears the `sessionToken` cookie
  - Returns success message

- **`GET /api/auth/session`** - Session validation
  - Checks validity of current `sessionToken`
  - Returns user info if valid
  - Returns 401 if invalid

#### Existing API Routes
- `GET /api/health` - Health check
- `GET /api/swarms` - Swarm data
- `GET /api/tasks` - Task data
- `GET /api/roadmap` - Roadmap data

## Middleware Configuration

File: `/middleware.ts`

### Features
1. **Session Token Validation**
   - Checks for `sessionToken` cookie on protected routes
   - Uses `isValidSession()` helper function

2. **Protected Route Access**
   - Routes matching `/dashboard/*` require authentication
   - Unauthenticated users are redirected to `/`

3. **CORS Headers**
   - Applied to all `/api/*` routes
   - Allows cross-origin requests with proper headers

4. **Security Headers**
   - Applied to all responses
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

5. **Cache Control**
   - API routes explicitly disable caching
   - Prevents stale data issues

### Session Validation
```typescript
function isValidSession(sessionToken: string | undefined): boolean {
  return Boolean(sessionToken && sessionToken.trim().length > 0);
}
```

## Session Management

### Session Utilities (`/lib/session.ts`)

Provides TypeScript-safe session handling utilities:

- `isValidSessionToken(token)` - Validates token format
- `parseSessionToken(cookieString)` - Extracts token from cookies
- `createSessionTokenCookie(token, expiresIn)` - Creates cookie header
- `createLogoutCookie()` - Creates logout cookie
- `validateSession(token)` - Full session validation
- `getSessionTokenFromCookies()` - Retrieves token from document cookies
- `clearSessionCookie()` - Clears session cookie
- `setSessionCookie(token, expiresIn)` - Sets session cookie

### useSession Hook (`/hooks/useSession.ts`)

React hook for managing authentication state in client components:

```typescript
const { isAuthenticated, isLoading, sessionToken, login, logout } = useSession();
```

**Properties:**
- `isAuthenticated` - Boolean indicating if user is logged in
- `isLoading` - Boolean indicating if session check is in progress
- `sessionToken` - Current session token string
- `login(token, expiresIn?)` - Sets session and updates state
- `logout()` - Clears session and redirects to home

## Components

### Navigation (`/components/Navigation.tsx`)

Global navigation component with context-aware rendering:

- **Landing Page View**: Shows "Sign In" and "Get Started" buttons
- **Dashboard View**: Shows "Dashboard" and "Logout" buttons
- Sticky header with scroll-based styling
- Uses `usePathname()` to determine current route

Add to root layout: `<Navigation />`

### LandingPage (`/components/LandingPage.tsx`)

Home page component with:
- Hero section with product overview
- Feature cards highlighting key benefits
- Call-to-action buttons for signup/login
- Auto-redirect to dashboard if already authenticated
- Loading state with animated spinner

## Session Token Cookie

The session token is stored in a secure cookie with the following properties:

```
sessionToken=<token>; path=/; SameSite=Strict; expires=<date>
```

**Validation Rules:**
- Must be non-empty string
- Must be present on all protected routes
- Automatically checked by middleware
- Client-side validation via `useSession()` hook

## Authentication Flow

### Login Flow
1. User navigates to `/auth/login`
2. Enters credentials (email, password)
3. Form submission to `POST /api/auth/login`
4. API validates credentials
5. Server sets `sessionToken` cookie
6. Client receives token and updates session state
7. User is redirected to `/dashboard`

### Protected Route Access
1. User attempts to access `/dashboard`
2. Middleware checks for `sessionToken` cookie
3. If valid: Request proceeds normally
4. If invalid: Middleware redirects to `/`
5. Navigation component renders appropriate UI based on auth state

### Logout Flow
1. User clicks "Logout" button in navigation
2. Client-side cookie clearing via `document.cookie`
3. Session state is updated
4. User is redirected to landing page `/`
5. Navigation component re-renders without auth buttons

## TypeScript Types

### SessionToken
```typescript
interface SessionToken {
  value: string;
  expiresAt?: Date;
  userId?: string;
}
```

### SessionValidationResult
```typescript
interface SessionValidationResult {
  isValid: boolean;
  token?: SessionToken;
  error?: string;
}
```

## Environment & Security Considerations

1. **Cookie Security**
   - Tokens should be HTTP-only in production
   - Use `SameSite=Strict` to prevent CSRF
   - Set secure flag for HTTPS-only transmission

2. **Token Generation**
   - Should be cryptographically secure in production
   - Current implementation is a placeholder
   - Implement proper JWT or session token generation

3. **Password Handling**
   - Never log or expose passwords
   - Use HTTPS in production
   - Implement rate limiting on auth endpoints

4. **CORS Policy**
   - Current config allows all origins for development
   - Restrict to specific domains in production

## Development Guide

### Testing Local Authentication

1. **Login with demo credentials:**
   - Email: `demo@example.com`
   - Password: `demo`

2. **Session Cookie Format:**
   ```javascript
   // Check in browser DevTools > Application > Cookies
   sessionToken=token_<timestamp>_<random>
   ```

3. **Testing Protected Routes:**
   ```bash
   # Clear cookies and try accessing /dashboard
   # Should redirect to /
   ```

### Adding New Protected Routes

1. Add route matcher to middleware `PROTECTED_ROUTES` array
2. Create route component at `/app/<route>/page.tsx`
3. Component automatically gets protection from middleware
4. User will be redirected to `/` if not authenticated

### Extending Session Utilities

All session management is centralized in `/lib/session.ts`:
- Add new validation functions here
- Update types as needed
- Keep hook in sync with utility changes

## Migration Notes

This routing structure maintains backward compatibility with existing API routes while introducing:
- New landing page at `/` (replaces old dashboard)
- Dashboard moved to `/dashboard` (protected)
- Full authentication middleware
- Session management utilities
- Reusable components and hooks
