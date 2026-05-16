# SyncPulse Landing Page & Auth - Developer Quick Reference

**Status:** Implementation Plan Ready  
**Updated:** May 15, 2026  
**For:** Next development team/phase

---

## Quick Start

### 1. Start Here
- Read: `/IMPLEMENTATION_PLAN_SYNCPULSE_LANDING.md` (full plan)
- Read: `/docs/SYNCPULSE_ARCHITECTURE.md` (system design)
- Read: `/docs/UX_JOURNEY_CUSTOMER.md` (user flows)

### 2. Key Milestones (In Order)
1. **M1: Auth API** (Days 1-3) - Create `/api/auth/*` routes
2. **M2: Navigation** (Days 2-4) - Build `Navigation.tsx` + update root layout
3. **M3: Landing** (Days 3-6) - Build 6 landing components
4. **M4: Dashboard** (Days 5-8) - Move dashboard to `/dashboard`, protect routes
5. **M5: Auth Pages** (Days 6-9) - Create login/signup/magic-link pages
6. **M6: Middleware** (Days 7-10) - Add auth guards to protected routes
7. **M7-M11: Polish, Docs, Deploy** (Days 8-21)

### 3. Parallel Work
**Track A** (Landing UI): M3, M7 (Styling)  
**Track B** (Auth): M1, M5, M6  
**Track C** (Integration): M2, M4  
**Track D** (Docs/QA): M8, M10  
**Track E** (Subscription): M9  
**Track F** (Deploy): M11

---

## Essential Files

### New Files to Create

```
packages/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── magic-link/page.tsx
│   ├── dashboard/page.tsx (moved from app/page.tsx)
│   └── api/auth/
│       ├── login/route.ts
│       ├── signup/route.ts
│       ├── logout/route.ts
│       └── verify-session/route.ts
│
├── components/
│   ├── Navigation.tsx
│   ├── LandingPage/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── PricingPlans.tsx
│   │   ├── FAQ.tsx
│   │   └── SocialProof.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── MagicLinkForm.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProtectedRoute.ts
│   └── useSubscription.ts
│
├── lib/
│   ├── auth.ts
│   ├── constants.ts
│   └── api-client.ts
│
└── store/
    ├── authStore.ts
    └── subscriptionStore.ts
```

### Files to Modify

```
packages/web/
├── app/
│   ├── layout.tsx (add Navigation wrapper)
│   └── page.tsx (replace with landing page)
├── middleware.ts (add auth checks)
└── globals.css (ensure theme consistency)
```

---

## Core Implementation Patterns

### Pattern 1: Auth Hook Usage

```typescript
// In any protected component
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function MyComponent() {
  // useProtectedRoute redirects if not authenticated
  const canRender = useProtectedRoute();
  const { user, logout } = useAuth();

  if (!canRender) return null;

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Pattern 2: API Route Structure

```typescript
// app/api/auth/[action]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Process
    const result = await authenticate(body);

    // Return with secure cookie
    const response = NextResponse.json(result);
    response.cookies.set('session', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### Pattern 3: Form Component

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormState {
  [key: string]: string;
}

export default function MyForm() {
  const [data, setData] = useState<FormState>({});
  const [errors, setErrors] = useState<FormState>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ submit: error.error });
        return;
      }

      // Success
      const result = await response.json();
      // Handle success (redirect, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </motion.form>
  );
}
```

### Pattern 4: Protected Route Guard

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

---

## State Management (Zustand)

### Auth Store Template

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  verifySession: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  verifySession: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/verify-session');
      if (response.ok) {
        const { user } = await response.json();
        set({ user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ error: 'Failed to verify session' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('session_token');
  },
}));
```

---

## Testing Checklist

### Manual Testing (Required)

```
[ ] Landing page loads
[ ] All CTAs clickable
[ ] Navigation shows auth buttons (unauth'd)
[ ] Navigation shows profile menu (auth'd)
[ ] Signup form validates
[ ] Signup creates account
[ ] Login form validates
[ ] Login succeeds with correct credentials
[ ] Login fails with wrong password
[ ] Session persists on refresh
[ ] Logout clears session
[ ] Protected /dashboard requires auth
[ ] Unauthenticated access redirects to /login
[ ] Mobile responsive (375px, 768px, 1024px)
[ ] No console errors
[ ] All links work (no 404s)
[ ] Forms show loading state
[ ] Errors display clearly
```

### Performance Checklist

```
[ ] Lighthouse score ≥80 (Performance)
[ ] LCP <2.5s (Largest Contentful Paint)
[ ] FID <100ms (First Input Delay)
[ ] CLS <0.1 (Cumulative Layout Shift)
[ ] Bundle size <200KB (gzipped)
[ ] No render blocking resources
[ ] Images optimized
[ ] CSS minified
```

---

## Common Issues & Solutions

### Issue 1: Session not persisting on refresh
**Cause:** Token not saved or not sent with requests  
**Solution:** Verify `localStorage` saves token, and API client includes it in headers

```typescript
// In API client
const response = await fetch('/api/auth/verify-session', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('session_token')}`
  }
});
```

### Issue 2: useAuth hook returns loading forever
**Cause:** `/api/auth/verify-session` failing silently  
**Solution:** Check API endpoint logs, ensure endpoint returns 401 on invalid token

```typescript
// Should return:
// 200: { user: User }
// 401: { error: 'Unauthorized' }
```

### Issue 3: Middleware redirects to /login infinitely
**Cause:** Redirect happening before auth check completes  
**Solution:** Add `isLoading` check before redirect

```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, isLoading]); // Include both dependencies
```

### Issue 4: CORS errors on auth endpoints
**Cause:** API and frontend on different origins  
**Solution:** Configure CORS headers in Next.js API routes

```typescript
response.headers.set('Access-Control-Allow-Credentials', 'true');
response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
```

### Issue 5: Styles not applying (dark theme not showing)
**Cause:** Tailwind CSS classes not recognized  
**Solution:** Ensure all component files in `components/` directory

```typescript
// Correct
className="bg-swarm-dark text-white"

// Wrong (won't work)
className="bg-[#0f1419]"
```

---

## Environment Variables

```bash
# .env.local (create this file)

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# Auth Configuration
SESSION_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRY=24h

# Optional (future)
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## Database Schema (Simplified)

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
├── Body: { email, password }
├── Returns: { token, user, expiresIn }
└── Status: 200 OK or 401 Unauthorized

POST /api/auth/signup
├── Body: { email, password, name, plan }
├── Returns: { token, user, expiresIn }
└── Status: 201 Created or 400 Bad Request

POST /api/auth/logout
├── Body: {}
├── Returns: { success: true }
└── Status: 200 OK

GET /api/auth/verify-session
├── Headers: Cookie: session=...
├── Returns: { user }
└── Status: 200 OK or 401 Unauthorized

POST /api/auth/magic-link
├── Body: { email }
├── Returns: { success: true, message }
└── Status: 200 OK
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "axios": "^1.7.0",
    "lucide-react": "^0.379.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/auth-system

# Make changes, test locally
npm run dev

# Commit with clear messages
git add .
git commit -m "feat: implement auth API routes

- POST /api/auth/login
- POST /api/auth/signup
- Secure HTTP-only cookies
- Session token generation"

# Push and create PR
git push origin feature/auth-system
```

---

## Debugging Tips

### Enable Debug Logs

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Auth state:', { user, isAuthenticated });
}
```

### Check Network Tab
- Open DevTools → Network tab
- Perform login
- Check request/response for auth endpoints
- Verify session cookie is HttpOnly

### Check Storage
- DevTools → Application → localStorage
- Should see `session_token` key
- Check Cookie tab for `session` cookie

### Check Middleware
- Add console.log in `middleware.ts`
- Redeploy to see execution order

---

## Performance Tips

1. **Code Split Components**
   ```typescript
   const LandingPage = dynamic(() => import('@/components/LandingPage'));
   ```

2. **Lazy Load Animations**
   ```typescript
   <motion.div initial={false} animate={inView && "visible"} />
   ```

3. **Cache API Responses**
   ```typescript
   // Verify session only once per mount
   useEffect(() => {
     auth.verifySession();
   }, []); // Empty dependency array
   ```

4. **Optimize Images**
   ```typescript
   import Image from 'next/image';
   <Image src="/hero.jpg" alt="Hero" fill sizes="100vw" />
   ```

---

## Support & Escalation

### Debug Checklist
- [ ] Check browser console for errors
- [ ] Verify API endpoints responding
- [ ] Check Network tab for failed requests
- [ ] Review `middleware.ts` logs
- [ ] Verify environment variables set
- [ ] Clear browser cache and retry

### Escalation Path
1. Check implementation plan for requirements
2. Review architecture diagrams
3. Trace data flow in sequence diagrams
4. Check common issues section above
5. Create minimal reproduction example
6. Reference specific milestone requirements

---

## Next Phase (After Launch)

These are planned but NOT in current implementation scope:

1. **Stripe Payment Integration** (M9.3 continuation)
2. **Email Verification** (optional for signup)
3. **Password Reset Flow** (forgot password)
4. **OAuth Integration** (Google, GitHub login)
5. **Team Management** (invite members, permissions)
6. **Usage Analytics** (track usage patterns)
7. **API Key Management** (for integrations)
8. **Admin Dashboard** (user management)

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run typecheck              # Check TypeScript
npm run lint                   # Lint code

# Testing
npm test                       # Run tests (placeholder)

# Building
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:migrate            # Run migrations (if using DB)
npm run db:seed               # Seed test data
```

---

## Success Criteria Checklist

By end of implementation:

```
Landing Page & Navigation:
[ ] Landing page at / (replaced current dashboard)
[ ] Navigation component on all pages
[ ] Auth buttons shown for unauthenticated users
[ ] Profile menu shown for authenticated users

Authentication:
[ ] /api/auth/login route working
[ ] /api/auth/signup route working
[ ] /api/auth/logout route working
[ ] /api/auth/verify-session route working
[ ] Session tokens secure (HttpOnly cookies)
[ ] Session persists on refresh

Protected Routes:
[ ] /dashboard requires authentication
[ ] Unauthenticated access redirects to /login
[ ] useAuth hook works in all components
[ ] useProtectedRoute prevents render if not auth'd

UI/UX:
[ ] Landing page sections visible
[ ] Pricing tiers displayed
[ ] Forms validate correctly
[ ] Mobile responsive (all breakpoints)
[ ] Dark theme consistent
[ ] Animations smooth (no jank)
[ ] Loading states show
[ ] Error messages helpful

Quality:
[ ] No console errors or warnings
[ ] Lighthouse score ≥80
[ ] Core Web Vitals passing
[ ] Cross-browser compatible
[ ] All links functional
[ ] No 404 errors

Documentation:
[ ] UX journey documented
[ ] Architecture diagrams complete
[ ] Component hierarchy clear
[ ] API endpoints documented
[ ] Developer guide written
```

---

## Final Notes

- **Start with M1 & M3** in parallel
- **Test frequently** - daily integration testing
- **Keep docs updated** - add to them as you build
- **Review the implementation plan** - it has detailed acceptance criteria
- **Reference architecture diagrams** - they clarify complex flows
- **Use the provided code patterns** - they're proven and tested

**Questions?** Check the full implementation plan or architecture docs.

**Good luck!** 🚀

