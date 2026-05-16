# SyncPulse Landing Page & Subscription - Architecture Documentation

## System Overview

```mermaid
graph TB
    subgraph "User Browser"
        Navigation["Navigation Component"]
        Landing["Landing Page"]
        Auth["Auth Pages<br/>(Login/Signup)"]
        Dashboard["Dashboard<br/>(Protected)"]
    end

    subgraph "Frontend State Management"
        AuthStore["Auth Store<br/>(Zustand)"]
        SubStore["Subscription Store<br/>(Zustand)"]
        Hooks["useAuth<br/>useSubscription<br/>useProtectedRoute"]
    end

    subgraph "Next.js Routes & Middleware"
        Middleware["Middleware<br/>(Auth Guards)"]
        Pages["Page Routes<br/>(/,/auth,/dashboard)"]
        APIRoutes["API Routes<br/>(/api/auth/*)"]
    end

    subgraph "Backend Services"
        AuthService["Authentication Service<br/>(Email/Password/MagicLink)"]
        SessionMgr["Session Manager<br/>(JWT/Tokens)"]
        UserDB["User Database<br/>(Email, Plan, Status)"]
    end

    subgraph "External Services (Future)"
        Stripe["Stripe Payment<br/>(Hooks Ready)"]
        Email["Email Service<br/>(Magic Links)"]
    end

    Navigation -->|reads| AuthStore
    Landing -->|reads| SubStore
    Auth -->|dispatches| Hooks
    Dashboard -->|uses| Hooks
    
    Hooks -->|updates| AuthStore
    Hooks -->|updates| SubStore
    
    AuthStore -->|mounted| Middleware
    
    Pages -->|protected by| Middleware
    APIRoutes -->|verify| SessionMgr
    APIRoutes -->|query| UserDB
    
    SessionMgr -->|validates tokens| AuthService
    AuthService -->|stores/retrieves| UserDB
    
    AuthService -->|sends| Email
    Email -->|magic links| Navigation
    
    Stripe -.->|future| APIRoutes
```

---

## Component Hierarchy

```mermaid
graph TD
    Root["RootLayout<br/>(app/layout.tsx)"]
    
    Root -->|wraps| Navigation["Navigation.tsx<br/>(Sticky Header)"]
    Root -->|wraps| MainContent["Routes<br/>(page.tsx variants)"]
    
    Navigation -->|shows/hides| AuthButtons["Login/Signup Buttons<br/>(unauthenticated)"]
    Navigation -->|shows/hides| UserMenu["Profile Menu<br/>(authenticated)"]
    
    MainContent -->|renders| LandingRoute["/ Landing Page<br/>(app/page.tsx)"]
    MainContent -->|renders| AuthRoutes["Auth Routes<br/>(app/auth/*)"]
    MainContent -->|renders| DashboardRoute["Dashboard<br/>(app/dashboard/page.tsx)"]
    
    LandingRoute -->|composed of| Hero["Hero.tsx"]
    LandingRoute -->|composed of| Features["Features.tsx"]
    LandingRoute -->|composed of| Pricing["PricingPlans.tsx<br/>(Free/Pro/Enterprise)"]
    LandingRoute -->|composed of| FAQ["FAQ.tsx"]
    LandingRoute -->|composed of| Social["SocialProof.tsx"]
    LandingRoute -->|composed of| Newsletter["Newsletter.tsx"]
    
    AuthRoutes -->|contains| LoginPage["Login Page<br/>(app/auth/login/page.tsx)"]
    AuthRoutes -->|contains| SignupPage["Signup Page<br/>(app/auth/signup/page.tsx)"]
    AuthRoutes -->|contains| MagicLink["Magic Link Page<br/>(app/auth/magic-link/page.tsx)"]
    
    LoginPage -->|uses| LoginForm["LoginForm.tsx"]
    SignupPage -->|uses| SignupForm["SignupForm.tsx"]
    MagicLink -->|uses| MagicLinkForm["MagicLinkForm.tsx"]
    
    DashboardRoute -->|protected by| ProtectedRoute["useProtectedRoute<br/>(redirect if no auth)"]
    DashboardRoute -->|contains| Swarm["SwarmVisualizer"]
    DashboardRoute -->|contains| TaskMon["TaskMonitor"]
    DashboardRoute -->|contains| Control["ControlPanel"]
    DashboardRoute -->|contains| Roadmap["RoadmapEditor"]
    DashboardRoute -->|contains| Terminal["TerminalLivestream"]
```

---

## Data Flow - Signup Journey

```mermaid
sequenceDiagram
    participant User
    participant LandingPage
    participant SignupForm
    participant AuthAPI as /api/auth/signup
    participant AuthService
    participant UserDB
    participant SignupPage
    participant Dashboard

    User->>LandingPage: Visit landing page
    LandingPage->>User: Display pricing tiers
    User->>LandingPage: Click "Get Started"
    LandingPage->>SignupPage: Redirect to /signup?plan=pro
    SignupPage->>SignupForm: Render form with plan pre-filled
    User->>SignupForm: Fill email, password
    SignupForm->>AuthAPI: POST { email, password, plan }
    AuthAPI->>AuthService: Validate email, hash password
    AuthService->>UserDB: Create user with plan
    UserDB-->>AuthService: User created, return user ID
    AuthService-->>AuthAPI: Return JWT token + user
    AuthAPI-->>SignupForm: { token, user, expiresIn }
    SignupForm->>SignupForm: Save token to localStorage
    SignupForm->>SignupForm: Update authStore
    SignupForm->>Dashboard: Redirect to /dashboard
    Dashboard->>Dashboard: useProtectedRoute succeeds
    Dashboard->>User: Display swarm visualizer
```

---

## Data Flow - Login Journey

```mermaid
sequenceDiagram
    participant User
    participant LandingPage
    participant LoginForm
    participant AuthAPI as /api/auth/login
    participant SessionMgr
    participant UserDB
    participant Dashboard

    User->>LandingPage: Visit landing page
    User->>LandingPage: Click "Login"
    LandingPage->>LoginForm: Redirect to /login
    LoginForm->>User: Display form
    User->>LoginForm: Enter email + password
    LoginForm->>AuthAPI: POST { email, password }
    AuthAPI->>SessionMgr: Verify credentials
    SessionMgr->>UserDB: Query user
    UserDB-->>SessionMgr: User found, verify password
    SessionMgr->>SessionMgr: Password valid?
    alt Password Valid
        SessionMgr->>SessionMgr: Generate JWT token
        SessionMgr-->>AuthAPI: Return token + user
        AuthAPI-->>LoginForm: { token, user, expiresIn }
        LoginForm->>LoginForm: Save token, update store
        LoginForm->>Dashboard: Redirect to /dashboard
    else Password Invalid
        SessionMgr-->>AuthAPI: 401 Unauthorized
        AuthAPI-->>LoginForm: { error: "Invalid credentials" }
        LoginForm->>User: Show error message
    end
```

---

## Data Flow - Dashboard Access

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Middleware
    participant useAuth
    participant SessionAPI as /api/auth/verify-session
    participant SessionMgr
    participant Dashboard

    User->>Browser: Navigate to /dashboard
    Browser->>Middleware: Route request
    Middleware->>Middleware: Has session cookie?
    alt Session Exists
        Middleware->>Dashboard: Allow access
        Dashboard->>Dashboard: Component mounts
        Dashboard->>useAuth: Call useAuth hook
        useAuth->>SessionAPI: GET /api/auth/verify-session
        SessionAPI->>SessionMgr: Validate token
        SessionMgr->>SessionMgr: Token valid?
        alt Token Valid
            SessionMgr-->>SessionAPI: { user }
            SessionAPI-->>useAuth: { user, isAuthenticated: true }
            useAuth->>useAuth: Update authStore
            Dashboard->>User: Render content
        else Token Expired
            SessionMgr-->>SessionAPI: 401 Unauthorized
            SessionAPI-->>useAuth: { error, status: 401 }
            useAuth->>Dashboard: Return isAuthenticated: false
            Dashboard->>Browser: Redirect to /login
        end
    else No Session
        Middleware->>Browser: Redirect to /login
    end
```

---

## Authentication State Machine

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: Page load,<br/>no session

    Unauthenticated --> Verifying: useAuth mounts
    Verifying --> Authenticated: Session valid
    Verifying --> Unauthenticated: No session/invalid
    
    Unauthenticated --> SigningUp: User submits signup
    SigningUp --> Authenticated: Account created
    SigningUp --> Unauthenticated: Signup failed
    
    Unauthenticated --> LoggingIn: User submits login
    LoggingIn --> Authenticated: Credentials valid
    LoggingIn --> Unauthenticated: Invalid credentials
    
    Authenticated --> LoggingOut: User clicks logout
    LoggingOut --> Unauthenticated: Session cleared
    
    Authenticated --> TokenExpired: Token expires
    TokenExpired --> Unauthenticated: Need re-login
    
    Unauthenticated --> MagicLink: User requests magic link
    MagicLink --> Authenticated: Email link clicked
```

---

## Pricing Tier Data Model

```mermaid
graph TD
    subgraph "Pricing Tiers"
        Free["FREE<br/>$0/month"]
        Pro["PRO<br/>$29/month"]
        Enterprise["ENTERPRISE<br/>Custom"]
    end

    subgraph "Features"
        F1["Up to N Agents"]
        F2["Monitoring"]
        F3["Logs Retention"]
        F4["Support"]
        F5["Custom Workflows"]
        F6["Dedicated Support"]
    end

    subgraph "Limits"
        L1["Max Agents: 2"]
        L2["Max Agents: 20"]
        L3["Max Agents: Unlimited"]
        L4["Logs: 24 hours"]
        L5["Logs: 90 days"]
        L6["Logs: Unlimited"]
    end

    Free -->|features| F1
    Free -->|features| F2
    Free -->|features| F4
    Free -->|limits| L1
    Free -->|limits| L4

    Pro -->|features| F1
    Pro -->|features| F2
    Pro -->|features| F3
    Pro -->|features| F5
    Pro -->|features| F4
    Pro -->|limits| L2
    Pro -->|limits| L5

    Enterprise -->|features| F1
    Enterprise -->|features| F2
    Enterprise -->|features| F3
    Enterprise -->|features| F5
    Enterprise -->|features| F6
    Enterprise -->|features| F4
    Enterprise -->|limits| L3
    Enterprise -->|limits| L6
```

---

## File Structure - New Files

```
packages/web/
├── app/
│   ├── layout.tsx (MODIFIED - add Navigation wrapper)
│   ├── page.tsx (REPLACED - landing page)
│   │
│   ├── (auth)/ (NEW - auth routes group)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── magic-link/
│   │       └── page.tsx
│   │
│   ├── dashboard/ (NEW - protected route)
│   │   └── page.tsx (OLD: app/page.tsx content)
│   │
│   └── api/
│       └── auth/ (NEW)
│           ├── login/route.ts
│           ├── signup/route.ts
│           ├── logout/route.ts
│           ├── verify-session/route.ts
│           └── magic-link/route.ts
│
├── components/
│   ├── Navigation.tsx (NEW)
│   ├── Navigation/
│   │   ├── NavLinks.tsx (NEW)
│   │   ├── AuthMenu.tsx (NEW)
│   │   └── MobileMenu.tsx (NEW)
│   │
│   ├── LandingPage/ (NEW)
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── PricingPlans.tsx
│   │   ├── FAQ.tsx
│   │   ├── SocialProof.tsx
│   │   └── Newsletter.tsx
│   │
│   ├── auth/ (NEW)
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── MagicLinkForm.tsx
│   │
│   ├── common/ (NEW)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Spinner.tsx
│   │
│   └── Dashboard/ (NEW - optional wrapper)
│       └── DashboardLayout.tsx
│
├── hooks/
│   ├── useAuth.ts (NEW)
│   ├── useSession.ts (NEW)
│   ├── useProtectedRoute.ts (NEW)
│   └── useSubscription.ts (NEW)
│
├── lib/
│   ├── auth.ts (NEW)
│   ├── api-client.ts (NEW)
│   └── constants.ts (NEW - pricing tiers, features)
│
├── store/
│   ├── authStore.ts (NEW)
│   └── subscriptionStore.ts (NEW)
│
├── types/
│   ├── auth.ts (NEW)
│   ├── subscription.ts (NEW)
│   └── api.ts (NEW)
│
├── middleware.ts (MODIFIED - add auth checks)
└── globals.css (MODIFIED - ensure consistency)
```

---

## Authentication Token Flow

```mermaid
graph LR
    User["User"]
    Client["Client<br/>(Browser)"]
    API["API<br/>(Next.js)"]
    Auth["Auth Service"]
    DB["Database"]

    User -->|email + password| Client
    Client -->|POST /api/auth/login| API
    API -->|validate| Auth
    Auth -->|hash + compare| DB
    DB -->|user record| Auth
    Auth -->|generate JWT| API
    API -->|httpOnly cookie| Client
    Client -->|stores token| Client
    
    Client -->|GET /dashboard| Client
    Client -->|cookie included| API
    API -->|verify JWT| Auth
    Auth -->|extract user ID| API
    API -->|render protected content| Client
```

---

## Session Lifecycle

```mermaid
timeline
    title Session Lifecycle (24 hour expiry)
    
    Login : User logs in
         : JWT generated
         : Cookie set to max 24h
         
    Hour 1-23 : User browses dashboard
              : Requests include valid token
              : Session maintained
              
    Page Refresh : Token read from cookie
               : Verify endpoint called
               : User stays authenticated
               
    Hour 24 : Token expires
           : Logout required
           : Redirect to /login
           
    Before Expiry : Optional token refresh
               : Get new 24h token
               : (Future enhancement)
               
    Explicit Logout : User clicks logout
                    : DELETE /api/auth/logout
                    : Cookie cleared
                    : Redirect to /
```

---

## Responsive Design Breakpoints

```
Mobile (xs): 320px - 640px
  - Single column layout
  - Hamburger menu for navigation
  - Large touch targets (44px min)
  - Stack all cards vertically

Tablet (md): 768px - 1024px
  - Two column layout
  - Simplified navigation
  - Larger text

Desktop (lg): 1024px+
  - Three column layout
  - Full navigation visible
  - Optimal spacing

Tailwind Classes:
  sm: 640px   (not used in this design)
  md: 768px   (tablets)
  lg: 1024px  (desktop)
  xl: 1280px  (large desktop)
```

---

## Performance Optimization Strategy

```mermaid
graph TD
    Code["Code Splitting"]
    Images["Image Optimization"]
    Cache["Caching Strategy"]
    Fonts["Font Loading"]
    API["API Optimization"]
    
    Code -->|Next.js dynamic imports| DynImport["Lazy load components"]
    Code -->|Route-based splitting| RouteCode["Each route minimal JS"]
    
    Images -->|next/image| ResponsiveImg["Responsive images"]
    Images -->|WebP format| WebP["Modern formats"]
    Images -->|Lazy loading| LazyImg["Load on scroll"]
    
    Cache -->|Static generation| Static["Pre-build landing page"]
    Cache -->|Browser cache| BrowserCache["Long-lived assets"]
    Cache -->|CDN cache| CDNCache["Serve from edge"]
    
    Fonts -->|System fonts| SysFonts["Avoid external fonts"]
    Fonts -->|Font subsetting| Subset["Load only used chars"]
    
    API -->|Query optimization| Query["Minimal queries"]
    API -->|Caching| APICach["Cache auth verify"]
    API -->|Compression| Compress["gzip responses"]
```

---

## Security Architecture

```mermaid
graph TB
    HTTPS["HTTPS/TLS<br/>Encrypted transport"]
    CSRF["CSRF Protection<br/>(SameSite cookies)"]
    XSS["XSS Protection<br/>(Content-Security-Policy)"]
    Auth["Authentication<br/>(JWT + HttpOnly)"]
    Validation["Input Validation<br/>(Client + Server)"]
    RateLimit["Rate Limiting<br/>(/api/auth endpoints)"]
    CORS["CORS Configuration<br/>(restricted origins)"]
    
    HTTPS -->|implements| TLS["Encrypt all traffic"]
    CSRF -->|implements| SameSite["SameSite=Lax cookies"]
    XSS -->|implements| CSP["CSP headers"]
    Auth -->|implements| HTTPOnly["HttpOnly + Secure flags"]
    Validation -->|client| ClientVal["Sanitize inputs"]
    Validation -->|server| ServerVal["Verify on backend"]
    RateLimit -->|implements| Throttle["Max 5 attempts/min"]
    CORS -->|implements| AllowOrigin["Only trusted domains"]
    
    style HTTPS fill:#c8e6c9
    style Auth fill:#c8e6c9
    style ServerVal fill:#c8e6c9
```

---

## Error Handling Flow

```mermaid
graph TD
    Error["Error Occurs"]
    
    Error -->|Network Error| NetError["Show retry message"]
    NetError -->|User clicks retry| Retry["Resend request"]
    
    Error -->|Auth Error| AuthError["401/403"]
    AuthError -->|redirect| Login["/login"]
    
    Error -->|Validation Error| ValError["Show form error"]
    ValError -->|User corrects| Retry
    
    Error -->|Server Error| SrvError["500+"]
    SrvError -->|Show generic message| Support["Show support link"]
    
    Error -->|Console| Console["Log to console<br/>in dev mode"]
    
    style NetError fill:#fff3cd
    style AuthError fill:#f8d7da
    style ValError fill:#fff3cd
    style SrvError fill:#f8d7da
```

---

## Future Enhancements (Post-Launch)

```mermaid
graph TD
    Phase1["Phase 1<br/>(Current)"]
    Phase2["Phase 2<br/>(Months 2-3)"]
    Phase3["Phase 3<br/>(Months 4-6)"]
    
    Phase1 -->|Landing + Auth| Content["Landing page<br/>Auth system<br/>Basic dashboard"]
    
    Phase2 -->|Payments| Payment["Stripe integration<br/>Invoice system<br/>Usage tracking"]
    Phase2 -->|Features| Features["Team management<br/>API keys<br/>Webhooks"]
    
    Phase3 -->|Analytics| Analytics["GA4 integration<br/>Conversion tracking<br/>Funnel analysis"]
    Phase3 -->|Advanced| Advanced["Custom domains<br/>SSO<br/>Export features"]
    
    style Phase1 fill:#c8e6c9
    style Phase2 fill:#bbdefb
    style Phase3 fill:#ffe0b2
```

---

## Key Metrics to Track

```
Performance Metrics:
├── Lighthouse Score (target: ≥80)
├── Core Web Vitals
│   ├── LCP (Largest Contentful Paint): <2.5s
│   ├── FID (First Input Delay): <100ms
│   └── CLS (Cumulative Layout Shift): <0.1
├── Bundle Size: <200KB (gzipped)
└── Time to Interactive: <3s

Business Metrics:
├── Signup Conversion Rate (target: >5%)
├── Login Success Rate (target: >98%)
├── Plan Selection Distribution
│   ├── Free: 60%
│   ├── Pro: 35%
│   └── Enterprise: 5%
├── Session Duration
└── Churn Rate

User Experience Metrics:
├── Form Abandonment Rate (target: <20%)
├── Error Rate (target: <0.1%)
├── Mobile vs Desktop split
└── Browser compatibility
```

---

## Team Coordination

```mermaid
graph TB
    FrontendLead["Frontend Lead"]
    BackendLead["Backend Lead"]
    
    FrontendLead -->|owns| Components["Landing Components<br/>Navigation<br/>Auth Forms<br/>Dashboard"]
    FrontendLead -->|owns| State["State Management<br/>useAuth Hook<br/>Session Handling"]
    FrontendLead -->|owns| Styling["Tailwind Styles<br/>Framer Motion<br/>Responsive Design"]
    
    BackendLead -->|owns| API["Auth Routes<br/>Session Management<br/>Email Service"]
    BackendLead -->|owns| Database["User Schema<br/>Session Tokens<br/>Audit Logs"]
    BackendLead -->|owns| Security["Password Hashing<br/>JWT Generation<br/>CSRF Protection"]
    
    FrontendLead -->|collaborates with| BackendLead
    BackendLead -->|collaborates with| FrontendLead
    
    FrontendLead -->|integrates| API
    BackendLead -->|provides| API
```

---

## Summary

This architecture provides:

1. **Clear Separation of Concerns** - Frontend, state, API, backend clearly separated
2. **Secure Authentication** - JWT tokens, HttpOnly cookies, CSRF protection
3. **Responsive Design** - Mobile-first approach with breakpoints
4. **Performance Optimized** - Code splitting, image optimization, caching
5. **Scalable Structure** - Easy to add features and extend
6. **Error Handling** - Graceful failures with user feedback
7. **Future-Ready** - Hooks and stubs for Stripe, analytics, advanced features

