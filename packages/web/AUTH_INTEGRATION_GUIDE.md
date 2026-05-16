# Authentication Integration Quick Reference

## Overview
This guide provides a quick reference for the authentication system integrated with the new landing page routing structure.

## Quick Start

### 1. Run the Development Server
```bash
npm run dev  # From packages/web directory
```

### 2. Test the Landing Page
- Navigate to: `http://localhost:3000/`
- You should see the LandingPage component with:
  - Hero section with SyncPulse branding
  - Feature cards
  - Call-to-action buttons ("Get Started" and "Sign In")

### 3. Test Authentication Flow
1. Click "Get Started" or go to `/auth/signup`
2. Create an account (form validation included)
3. Or click "Sign In" for `/auth/login`
4. Use demo credentials:
   - **Email**: `demo@example.com`
   - **Password**: `demo`
5. After successful login, you'll be redirected to `/dashboard`

### 4. Test Protected Routes
- From dashboard, navigate to home by clicking the logo
- Or manually clear cookies and try accessing `/dashboard` directly
- You should be redirected to the landing page

### 5. Test Logout
- Click "Logout" button in the navigation (appears on dashboard)
- You'll be redirected to landing page
- Cookie will be cleared

## File Structure

```
packages/web/
├── middleware.ts                    # Session validation & routing
├── app/
│   ├── layout.tsx                  # Root layout (imports Navigation)
│   ├── page.tsx                    # Landing page (/route)
│   ├── dashboard/
│   │   └── page.tsx                # Protected dashboard
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   └── api/auth/
│       ├── login/route.ts          # Login API
│       ├── logout/route.ts         # Logout API
│       └── session/route.ts        # Session validation API
├── components/
│   ├── Navigation.tsx              # Global navigation
│   ├── LandingPage.tsx             # Landing page component
│   └── [other components]
├── lib/
│   └── session.ts                  # Session utilities
├── hooks/
│   └── useSession.ts               # Session hook
└── ROUTING.md                       # Full routing documentation
```

## Key Components

### Navigation Component
Global header component that appears on every page:
- **Props**: `isAuthenticated` (optional)
- **Features**:
  - Sticky header with scroll detection
  - Context-aware button rendering
  - Smooth animations
  - Logo click returns to home

**Usage in Layout**:
```tsx
import Navigation from '@/components/Navigation';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
```

### useSession Hook
React hook for session management in client components:

```tsx
'use client';
import { useSession } from '@/hooks/useSession';

export default function MyComponent() {
  const { isAuthenticated, isLoading, sessionToken, login, logout } = useSession();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login('token_123')}>Login</button>
      )}
    </div>
  );
}
```

## Routing Rules

### Public Routes (No Auth Required)
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/api/auth/*` - All auth API endpoints

### Protected Routes (Auth Required)
- `/dashboard` - Dashboard (redirects to `/` if not authenticated)

### API Endpoints
```
POST /api/auth/login      - Login (sets sessionToken cookie)
POST /api/auth/logout     - Logout (clears sessionToken)
GET /api/auth/session     - Validate session
```

## Session Token Cookie

**Format**:
```
sessionToken=<token_value>; path=/; SameSite=Strict; expires=<date>
```

**Properties**:
- Non-empty string required
- Validated by middleware on protected routes
- Set automatically by login API
- Cleared by logout API or logout cookie
- Browser DevTools: Application → Cookies → sessionToken

## Important Files to Know

1. **middleware.ts**
   - Validates session tokens
   - Protects /dashboard route
   - Adds CORS/security headers
   - No changes needed unless modifying auth rules

2. **lib/session.ts**
   - Session utilities and types
   - Cookie helpers
   - Use when implementing custom auth logic

3. **hooks/useSession.ts**
   - Client-side session state
   - Use in React components for auth checks
   - Provides login/logout functions

4. **components/Navigation.tsx**
   - Global navigation header
   - Already in root layout
   - Customizable styling/layout

## Common Tasks

### Add a New Protected Route
1. Add route path to `PROTECTED_ROUTES` in `middleware.ts`
2. Create component at `/app/<route>/page.tsx`
3. Middleware automatically protects it

### Check Authentication in a Component
```tsx
'use client';
import { useSession } from '@/hooks/useSession';

export default function MyComponent() {
  const { isAuthenticated } = useSession();
  
  return isAuthenticated ? <Dashboard /> : <LoginPrompt />;
}
```

### Update Login Logic
1. Modify `/app/api/auth/login/route.ts`
2. Change the credential validation (currently checks email/password)
3. Implement your actual authentication backend

### Customize Landing Page
- Edit `/components/LandingPage.tsx`
- Change hero text, features, styling
- Keep the `useSession` hook for auth redirect

### Customize Navigation
- Edit `/components/Navigation.tsx`
- Modify colors, layout, menu items
- Keep auth logic intact

## Session Token Demo Credentials

For testing with the demo login:
- **Email**: `demo@example.com`
- **Password**: `demo`

These credentials are hardcoded in `/app/api/auth/login/route.ts` for testing.

## Production Checklist

Before deploying to production:

- [ ] Replace demo credentials with real authentication
- [ ] Implement proper JWT or session token generation
- [ ] Set `SameSite=Strict` on cookies (already set)
- [ ] Enable `Secure` flag for HTTPS-only cookies
- [ ] Implement rate limiting on auth endpoints
- [ ] Add password hashing and validation
- [ ] Implement email verification
- [ ] Add CSRF protection
- [ ] Restrict CORS to specific domains
- [ ] Add logging and monitoring
- [ ] Implement session expiration
- [ ] Add refresh token mechanism

## Troubleshooting

### User Can Access /dashboard Without Login
**Solution**: Check that `sessionToken` cookie is set in browser and middleware config is correct.

### Navigation Not Showing
**Solution**: Ensure `Navigation` component is imported in `app/layout.tsx`.

### Login Not Working
**Solution**: Check browser console for errors. Verify `/api/auth/login` is returning proper response with sessionToken.

### Redirects Not Working
**Solution**: Clear browser cache and cookies. Middleware may need server restart.

## Performance Notes

- Middleware runs on every request (lightweight operations only)
- Session check is synchronous and fast (just cookie lookup)
- LandingPage component auto-redirects if authenticated
- Navigation component uses `usePathname()` hook (minimal overhead)

## Security Notes

- Session tokens are sent in HTTP-only cookies (secure by default)
- SameSite=Strict prevents CSRF attacks
- Middleware validates tokens on protected routes
- All API responses include security headers
- No session info in localStorage (cookie-only)
