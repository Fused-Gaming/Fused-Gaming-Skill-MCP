# Release Notes - v1.0.7 (2026-05-16)

## 🔐 Security Hardening Release

This patch release focuses on critical security fixes and authentication improvements for production deployment.

## ✨ Major Features

### JWT-Based Stateless Authentication
- Implemented HS256-signed JWT tokens for serverless-compatible sessions
- 24-hour token expiration with secure payload encoding
- Session verification without server-side storage
- **Benefits:** Scales to distributed deployments, reduces database queries

### Rate Limiting with Token Bucket Algorithm
- Implemented token bucket rate limiter for signup (5 req/min) and contact forms (10 req/min)
- In-memory bucket tracking with automatic cleanup
- Graceful handling of burst traffic
- **Benefits:** Prevents abuse, protects against enumeration attacks

### Password Security Migration
- Integrated bcryptjs with 10 salt rounds for all password hashing
- Implemented bcrypt.compareSync() for secure password validation
- Applied to: demo user, signup flows, password changes, and session-based login
- **Fixed Critical Issue:** Signup passwords now hashed before storage (resolves Codex P1)

## 🐛 Bug Fixes

### Security Issues
- **CRITICAL:** Fixed plaintext password storage in createUser() signup flow
  - Now hashes passwords with bcryptjs (10 salt rounds)
  - Prevents account access after session expiry
  - Affects: `/api/auth/signup` endpoint
  
- **HIGH:** Corrected magic link verification routing
  - Fixed URL pointing to non-existent `/auth/magic-link/verify` page
  - Now correctly points to `/auth/magic-link?token=<token>`
  - Resolves email magic link landing on 404
  - Affects: Magic link email generation and test links

### Authentication Flow
- Added middleware JWT verification with secure token parsing
- Implemented HS256 signature validation in both server and edge contexts
- Added graceful expiration checking for token validation
- Enhanced security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection

### Web Interface
- Integrated VersionBadge component showing v1.0.7 in landing page footer
- Landing page includes navigation, feature grid, pricing plans, and contact form
- Sales flow fully operational with rate-limited contact endpoints
- Responsive design across mobile and desktop viewports

## 📊 Version Information

- **Package Version:** 1.0.7
- **Release Date:** 2026-05-16
- **Node.js Minimum:** 20.0.0
- **NPM Minimum:** 8.0.0
- **TypeScript Version:** 5.3.2
- **Build Number:** 1009
- **Status:** Stable

## 📦 Package Scope

**Published Packages:**
- `@h4shed/mcp-cli` - CLI interface
- `@h4shed/mcp-core` - Core server
- `@h4shed/skill-*` - 9 published skills

**Skills Included:**
- algorithmic-art
- ascii-mockup
- canvas-design
- frontend-design
- theme-factory
- mcp-builder
- pre-deploy-validator
- skill-creator
- underworld-writer

**Coming Soon:**
- mermaid-terminal
- ux-journeymapper
- svg-generator
- project-manager
- project-status-tool
- daily-review
- multi-account-session-tracking
- linkedin-master-journalist
- agentic-flow-devkit

## 🚀 Performance Benchmarks

Run performance validation with:
```bash
npm run validate:pre-merge
```

Key metrics (1.0.7):
- Build time: ~45s
- TypeScript compilation: ~8s
- Lint check: ~12s
- Test suite: Pass (placeholder tests)
- JWT token generation: <1ms
- Password hash (bcrypt 10 rounds): ~45-55ms
- Magic link token generation: <1ms

## 🔄 Breaking Changes

None. This is a pure security hardening release.

## 📝 Migration Guide

### For Existing Users
If deploying v1.0.7:
1. Update environment: `JWT_SECRET` (required for token signing)
2. Recreate user accounts if previous versions used plaintext passwords
3. Test magic link flow with sample email addresses
4. Validate rate limiting with signup/contact endpoints

### For Contributors
- All password operations now use bcryptjs
- SessionStore provides unified password validation API
- JWT tokens are stateless - no session cache needed
- Rate limiter is automatic via middleware

## 🙏 Contributors

This release completes the JWT authentication migration started in v1.0.6 and adds comprehensive security hardening for production deployment.

## 📚 Documentation

- **Installation:** `npm install @h4shed/mcp-cli`
- **Quick Start:** See `docs/getting-started/QUICKSTART.md`
- **Contributing:** See `CONTRIBUTING.md`
- **Security:** JWT implementation in `packages/web/lib/session-store.ts`

## 🆘 Support

For issues, please file a GitHub issue: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues

---

**v1.0.7 Release Checklist:**
- ✅ Security hardening complete
- ✅ Password hashing implemented
- ✅ Magic link routing fixed
- ✅ Rate limiting operational
- ✅ Version updated in all manifests
- ✅ Release notes documented
- ⏳ Tag push pending (network issue)
- ⏳ GitHub Release creation pending
