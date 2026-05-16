# Authentication Testing Guide

Complete guide for testing the authentication and routing system.

## Pre-Testing Setup

### 1. Clean Build
```bash
cd packages/web
npm install
npm run typecheck
npm run build
```

### 2. Start Dev Server
```bash
npm run dev
```

Server should start at `http://localhost:3000`

## Manual Testing Scenarios

### Test 1: Landing Page Access

**Steps:**
1. Navigate to `http://localhost:3000/`
2. Browser should load without redirects

**Expected Results:**
- LandingPage component displays
- Hero section visible with "⚡ SyncPulse" title
- Three feature cards visible
- Two CTA buttons: "Get Started Free" and "Sign In"
- Navigation header at top with logo and buttons

**Verification:**
```javascript
// In browser console
document.querySelector('.glow-accent') // Should select SyncPulse title
document.querySelectorAll('[role="button"]').length // Should be >= 2
```

---

### Test 2: Unauthenticated Dashboard Access

**Steps:**
1. Clear all cookies: `DevTools → Application → Cookies → Clear All`
2. Navigate to `http://localhost:3000/dashboard`

**Expected Results:**
- User should be redirected to `/` (landing page)
- URL changes from `/dashboard` to `/`
- No errors in console

**Verification:**
```bash
# In network tab, look for:
# 1. GET /dashboard (status varies)
# 2. Redirect response (3xx status)
# 3. GET / (final page load)
```

---

### Test 3: Login Flow

**Steps:**
1. Click "Sign In" button on landing page
2. Enter demo credentials:
   - Email: `demo@example.com`
   - Password: `demo`
3. Click "Sign In" button

**Expected Results:**
- Form submission to `/api/auth/login`
- Response includes `sessionToken`
- User redirected to `/dashboard`
- Dashboard loads with all components (SwarmVisualizer, TaskMonitor, etc.)
- Navigation shows "Dashboard" and "Logout" buttons

**Verification:**
```javascript
// In browser console on dashboard
document.cookie // Should contain sessionToken=...
document.querySelector('h1.glow-accent').textContent // Should be "⚡ SyncPulse"
```

---

### Test 4: Session Persistence

**Steps:**
1. Login successfully (from Test 3)
2. Close browser tab/window
3. Reopen same URL and navigate to `/dashboard`

**Expected Results:**
- Dashboard loads directly without login page
- sessionToken cookie is persistent
- User remains logged in

**Verification:**
```javascript
// Check sessionToken exists
document.cookie.includes('sessionToken')
```

---

### Test 5: Logout Flow

**Steps:**
1. Login to dashboard (from Test 3)
2. Click "Logout" button in navigation
3. Observe page and cookies

**Expected Results:**
- User redirected to `/` (landing page)
- sessionToken cookie removed
- Navigation shows "Sign In" and "Get Started" buttons
- No console errors

**Verification:**
```javascript
// After logout
document.cookie.includes('sessionToken') // Should be false
// URL should be /
window.location.pathname // Should be "/"
```

---

### Test 6: Protected Route After Logout

**Steps:**
1. Complete logout (from Test 5)
2. Navigate to `/dashboard`

**Expected Results:**
- Immediately redirected to `/`
- No dashboard components load
- Middleware prevents access

---

### Test 7: Sign Up Page

**Steps:**
1. Click "Get Started" button on landing page
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPassword123"
   - Confirm: "TestPassword123"
3. Click "Create Account"

**Expected Results:**
- Form validation passes
- User redirected to login page
- Can login with new credentials (if backend implemented)

**Test Validation Errors:**
1. Leave fields empty → Shows "All fields are required"
2. Mismatched passwords → Shows "Passwords do not match"
3. Password < 8 chars → Shows "Password must be at least 8 characters"

---

### Test 8: Navigation Context Awareness

**On Landing Page:**
- Navigation shows "Sign In" and "Get Started" buttons
- Logo click navigates to `/`

**On Dashboard:**
- Navigation shows "Dashboard" and "Logout" buttons
- Logo click navigates to `/`
- "Dashboard" link functional

**Verification:**
```javascript
// Check nav buttons
document.querySelectorAll('nav button').forEach(btn => console.log(btn.textContent))
```

---

### Test 9: API Endpoints

**Test `/api/auth/login`:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo"}' \
  -i  # Show headers

# Expected:
# Status: 200 OK
# Set-Cookie header with sessionToken
# JSON body: { success: true, sessionToken, expiresIn, user }
```

**Test `/api/auth/session`:**
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: sessionToken=<your_token>" \
  -i

# Expected:
# Status: 200 OK
# JSON body: { isValid: true, sessionToken, user }
```

**Test `/api/auth/logout`:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sessionToken=<your_token>" \
  -i

# Expected:
# Status: 200 OK
# Set-Cookie header clearing sessionToken
```

---

### Test 10: CORS Headers on API Routes

**Steps:**
1. Open browser DevTools → Network tab
2. Make a request to any `/api/*` endpoint
3. Check response headers

**Expected Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

### Test 11: Security Headers

**Steps:**
1. Load any page (landing page, dashboard, etc.)
2. Check response headers in DevTools → Network

**Expected Security Headers (all non-API responses):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

### Test 12: Component Animations

**Landing Page:**
1. Hero section fades in
2. Feature cards slide in with stagger effect
3. CTA buttons animate on hover

**Dashboard:**
1. SwarmVisualizer, TaskMonitor, RoadmapEditor fade in with stagger

**Navigation:**
1. Logo and buttons fade in smoothly
2. Header background appears/disappears on scroll

---

## Automated Testing Checklist

### Environment Setup
- [ ] Node.js 20+ installed
- [ ] npm dependencies installed
- [ ] TypeScript compilation successful
- [ ] Build completes without errors

### Landing Page
- [ ] Page loads at `/`
- [ ] All components render
- [ ] CTA buttons present and functional
- [ ] Navigation shows auth buttons

### Authentication
- [ ] Login form displays
- [ ] Demo credentials work
- [ ] Invalid credentials show error
- [ ] Successful login redirects to dashboard
- [ ] Signup form validation works

### Protected Routes
- [ ] Dashboard inaccessible without login
- [ ] Redirect to `/` when accessing `/dashboard` unauthenticated
- [ ] Dashboard accessible after login
- [ ] Dashboard keeps session on page refresh

### Session Management
- [ ] sessionToken cookie set after login
- [ ] Cookie persists across page refreshes
- [ ] Cookie cleared on logout
- [ ] `/api/auth/session` validates token correctly

### Navigation
- [ ] Navigation present on all pages
- [ ] Auth/logout buttons context-aware
- [ ] Logo navigation works
- [ ] Scroll effects work

### API Routes
- [ ] `/api/auth/login` returns sessionToken
- [ ] `/api/auth/logout` clears token
- [ ] `/api/auth/session` validates token
- [ ] CORS headers present on all API responses
- [ ] Security headers present on all responses

### Security
- [ ] No session info in localStorage
- [ ] No passwords sent in clear text
- [ ] XSS headers present
- [ ] CSRF protection (SameSite cookie)
- [ ] No sensitive data in URLs

---

## Browser DevTools Testing

### Application Tab
1. Open DevTools → Application
2. Go to Cookies
3. Look for `sessionToken` cookie

**When logged in:**
```
Name: sessionToken
Value: token_<timestamp>_<random>
Domain: localhost
Path: /
Expires: <24 hours from now>
HttpOnly: (if configured)
Secure: (if HTTPS)
SameSite: Strict
```

### Network Tab
1. Open DevTools → Network
2. Perform login
3. Check requests:

**Expected sequence:**
1. POST /auth/login - 200 OK
2. Redirect response
3. GET /dashboard - 200 OK

### Console Tab
1. No errors should appear
2. Check for warnings related to animations or hydration
3. Test session validation:
```javascript
// Check current session
document.cookie

// Check authenticated status
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

---

## Performance Baseline

Record these metrics for comparison:

### Landing Page Load
```javascript
// In console
performance.measure('landing-load')
const entries = performance.getEntriesByType('measure')
```

### Dashboard Load
```javascript
// In console after dashboard loads
performance.measure('dashboard-load')
```

### API Response Times
```bash
# Time login request
time curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo"}'
```

---

## Common Test Failures & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot find sessionToken" | Cookie not set | Check login response has Set-Cookie header |
| Infinite redirect loop | Middleware misconfigured | Verify PROTECTED_ROUTES array in middleware |
| Page won't load | TypeScript errors | Run `npm run typecheck` |
| Navigation not showing | Component not imported | Verify Navigation import in layout.tsx |
| Login always fails | API route issue | Check /api/auth/login/route.ts |
| Animations jerky | Performance issue | Check browser DevTools performance tab |

---

## Success Criteria

All of the following should pass:

1. Landing page loads without auth
2. Dashboard requires auth
3. Login/signup forms work
4. Logout clears session
5. Cookies persist correctly
6. Navigation updates contextually
7. API endpoints return correct responses
8. Security headers present
9. No console errors
10. Redirects work correctly
