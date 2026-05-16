# Release Notes - v1.0.6

**Release Date**: May 16, 2026

## Overview

This release adds enhanced authentication and security features, including JWT-based session management for serverless deployments, improved form wiring for contact and signup pages, and public route accessibility for marketing pages.

## Features

### Authentication & Security
- **JWT-Based Sessions**: Implemented serverless-compatible JWT session tokens with signature verification and expiration handling
- **Rate Limiting**: Added rate limiting middleware for API endpoints (`/api/contact-sales`, `/api/auth/signup`)
- **Cryptographic Randomness**: Enhanced token generation using secure crypto randomness via `crypto.getRandomValues()`
- **Session Store**: Improved in-memory session management with user creation and authentication capabilities

### Forms & Public Routes
- **Contact Sales Form**: Wire form submission to `/api/contact-sales` endpoint with name, email, company, message, and agent count fields
- **Signup Form**: Fully wired signup page that creates user accounts and redirects to login on success
- **Public Routes**: Added `/sales`, `/contact-sales` to accessible marketing pages without authentication
- **API Accessibility**: Public endpoints for contact inquiries and user signup

### API Endpoints
- **POST /api/contact-sales**: Accepts contact inquiries with validation and in-memory storage
- **POST /api/auth/signup**: Creates new user accounts with password validation and JWT session token generation
- **Middleware Protection**: Updated `middleware.ts` with proper route allowlisting for public pages and APIs

## Migration Guide

### For Users
1. No breaking changes to existing functionality
2. Session tokens now work across serverless deployments
3. Marketing pages (`/sales`, `/contact-sales`) are now publicly accessible

### For Developers
1. **Session Management**: Use JWT tokens stored in `sessionToken` cookie (httpOnly recommended in production)
2. **Rate Limiting**: Check `@/lib/rate-limiter` for configuring rate limits by endpoint
3. **Auth Flows**: 
   - Signup: POST to `/api/auth/signup` with `name`, `email`, `password`
   - Login: Existing `/api/auth/login` endpoint
   - Session Verification: Middleware validates JWT signature and expiration

### Environment Setup
- Ensure `JWT_SECRET` environment variable is set (uses `dev-secret-change-in-production` as fallback)
- For production, set strong JWT secret and use secure cookie flags
- Rate limiter uses memory storage; consider Redis for distributed deployments

## Technical Details

### JWT Implementation
- **Algorithm**: HMAC-SHA256 for token signing
- **Structure**: Header.Payload.Signature (standard JWT format)
- **Validation**: Signature verification + expiration time check
- **Payload**: User ID, email, and standard JWT claims (iat, exp)

### Session Token Lifecycle
1. User signs up or logs in
2. Server generates JWT with 1-hour expiration
3. Token stored in `sessionToken` cookie
4. Middleware verifies token on each request
5. Expired tokens redirect to login

### Rate Limiting
- **Contact Sales**: Limited per IP/user to prevent abuse
- **Signup**: Limited per IP to prevent account enumeration
- **Configuration**: Adjustable per endpoint in `lib/rate-limiter.ts`

## Files Modified

- `VERSION.json` - Updated to v1.0.6
- `package.json` - Updated to v1.0.6
- `packages/web/middleware.ts` - Enhanced PUBLIC_ROUTES configuration
- `packages/web/components/ContactForm.tsx` - Added form submission to API
- `packages/web/app/auth/signup/page.tsx` - Wired signup form to `/api/auth/signup`
- `packages/web/app/api/contact-sales/route.ts` - Enhanced with rate limiting
- `packages/web/app/api/auth/signup/route.ts` - Complete implementation with JWT

## Security Considerations

- All sessions use secure JWT signatures
- Rate limiting prevents brute force and enumeration attacks
- Middleware enforces authentication on protected routes
- Public routes explicitly allowlisted for clarity
- CORS and security headers configured for API endpoints

## Performance Improvements

- Serverless-compatible JWT validation (no database lookup required)
- In-memory session storage for single-instance deployments
- Efficient rate limiter using memory-based tracking

## Known Limitations

- In-memory storage for contact submissions (not persistent)
- Rate limiter uses memory (consider Redis for scaled deployments)
- Default JWT secret in development only

## Next Steps

1. **Database Integration**: Replace in-memory storage with persistent database
2. **Email Notifications**: Connect contact form to email service
3. **Redis Rate Limiter**: Implement distributed rate limiting for multi-instance deployments
4. **Analytics**: Track signup and contact form conversion metrics
5. **A/B Testing**: Test marketing page variants and forms

## Contributors

This release includes improvements from the PR #166 auth and security enhancement work.

## Support

For issues or questions:
- GitHub Issues: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues
- Documentation: `/docs` directory
- Security: support@vln.gg

---

**Build Number**: 1007  
**Node Minimum**: 20.0.0  
**NPM Minimum**: 8.0.0  
**TypeScript**: 5.3.2
