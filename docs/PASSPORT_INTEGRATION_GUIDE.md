# Passport.js Integration Guide

**Status**: Implementation in Progress  
**Related Issues**: #228  
**Date**: 2026-06-13

## Overview

This guide explains how to integrate Passport.js authentication into the Syncpulse orchestration API Express application.

## Installation

First, ensure Passport and required dependencies are installed:

```bash
npm install passport passport-jwt passport-local jsonwebtoken
npm install --save-dev @types/passport-jwt @types/passport-local
```

## Express App Integration

### 1. Initialize Passport in Your Express App

```typescript
import express from 'express';
import passport from 'passport';
import { jwtStrategy, localStrategy } from './src/orchestration-api/passport-auth-strategy.js';
import { createApiRoutes } from './src/orchestration-api/routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Register strategies
passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);

// Mount API routes
app.use('/api', createApiRoutes());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Orchestration API listening on port ${PORT}`);
});
```

### 2. Configure JWT_SECRET Environment Variable

**Required**: Set a secure JWT secret before running the application.

```bash
# Development
export JWT_SECRET=$(openssl rand -base64 32)

# Production - Use strong secret from secrets manager
export JWT_SECRET=your-production-secret-key
```

**Error Handling**: If `JWT_SECRET` is not set, the application will fail at startup with:
```
Error: JWT_SECRET environment variable is not set. 
Set JWT_SECRET to a secure random string before running the application.
```

This "fail closed" behavior ensures authentication cannot be bypassed due to missing configuration.

## Endpoint Protection

### Public Endpoints (No Authentication)
- `GET /api/health` - Health check
- `GET /api/auth/status` - Auth status
- `POST /api/auth/login` - Initial login
- `POST /api/auth/change-password` - Password change

### Protected Endpoints (Requires Authentication)

All endpoints below require valid JWT token in `Authorization: Bearer <token>` header.

#### Permission-Based Protection
- `GET /api/metrics` - Requires `read:metrics` permission
- `GET /api/metrics/history` - Requires `read:metrics` permission
- `GET /api/swarm/agents` - Requires `read:agents` permission
- `POST /api/swarm/scale` - Requires `write:agents` permission
- `GET /api/dashboard/overview` - Requires multiple read permissions

#### Role-Based Protection
- Admin endpoints - Require `admin` role
- Operator endpoints - Require `operator` or higher role
- Viewer endpoints - Require any authenticated user

## Example Usage

### 1. Authenticate and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Use Token to Access Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/metrics \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer <old_token>"
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

## Advanced: Custom Middleware

### Require Specific Role

```typescript
import { requireRole } from './src/orchestration-api/passport-auth-strategy.js';

// Only admins can access this endpoint
router.post('/admin-action', 
  requireRole('admin'), 
  (req, res) => {
    // Admin-only logic
  }
);
```

### Require Multiple Permissions

```typescript
import { requirePermission } from './src/orchestration-api/passport-auth-strategy.js';

// Requires BOTH permissions
router.post('/critical-operation',
  requirePermission('write:agents', 'write:roadmap'),
  (req, res) => {
    // Requires both permissions
  }
);
```

### Custom Authorization Logic

```typescript
function requireTeamAccess(teamId: string) {
  return (req: Request, res: Response, next: () => void) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = req.user as AuthUser;
    
    // Check if user belongs to team
    if (user.teams?.includes(teamId)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Not a team member' });
    }
  };
}
```

## Security Best Practices

### 1. Secret Management
- ✅ Never commit JWT_SECRET to version control
- ✅ Use environment variables or secrets manager
- ✅ Rotate secrets periodically
- ✅ Use strong random secrets (minimum 32 bytes)

### 2. Token Handling
- ✅ Set reasonable expiry times (24 hours default)
- ✅ Implement token refresh mechanism
- ✅ Store tokens in secure storage (not localStorage)
- ✅ Include CSRF protection for token endpoints

### 3. HTTPS Enforcement
- ✅ Always use HTTPS in production
- ✅ Set Secure flag on cookies
- ✅ Use HSTS headers

### 4. Rate Limiting
- ✅ Rate limit login endpoint (`/api/auth/login`)
- ✅ Implement progressive backoff on failed attempts
- ✅ Monitor for brute force attacks

## Testing

### Unit Test Example

```typescript
import { verifyToken, generateToken, AuthUser } from './passport-auth-strategy';

describe('Passport JWT Strategy', () => {
  it('should generate and verify valid tokens', () => {
    const user: AuthUser = {
      id: 'user-1',
      email: 'test@example.com',
      role: 'admin',
      permissions: ['read:agents'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    };

    const token = generateToken(user);
    const verified = verifyToken(token);

    expect(verified).toEqual(user);
  });

  it('should reject expired tokens', () => {
    const expiredUser: AuthUser = {
      id: 'user-1',
      email: 'test@example.com',
      role: 'admin',
      permissions: [],
      iat: Math.floor(Date.now() / 1000) - 86400,
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    };

    const token = generateToken(expiredUser);
    const verified = verifyToken(token);

    expect(verified).toBeNull();
  });
});
```

### Integration Test Example

```typescript
import request from 'supertest';
import app from './app';

describe('Protected Endpoints', () => {
  it('should reject unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/metrics');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should allow authenticated requests with correct role', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });

    const token = loginResponse.body.sessionToken;

    const response = await request(app)
      .get('/api/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('current');
  });
});
```

## Troubleshooting

### "Unauthorized" on Valid Token

1. Check JWT_SECRET is set and consistent across requests
2. Verify token hasn't expired (`exp` claim)
3. Ensure Authorization header format: `Bearer <token>`
4. Check user object is being set on `req.user`

### "Forbidden" on Authenticated Request

1. Check user has required permissions
2. Verify role matches requirements
3. Check permission format matches exactly
4. Review middleware ordering (auth before permission checks)

### Module Not Found: passport-jwt

```bash
npm install passport-jwt
npm install --save-dev @types/passport-jwt
```

## Next Steps

1. ✅ Register Passport strategies in Express app
2. ✅ Add JWT_SECRET to environment configuration
3. ✅ Test authentication endpoints manually
4. ✅ Implement rate limiting on login endpoint
5. ✅ Add comprehensive error handling
6. ✅ Set up audit logging for auth events
7. ✅ Configure HTTPS enforcement in production
8. ✅ Add token revocation mechanism

## References

- [Passport.js Official Documentation](http://www.passportjs.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Express.js Security Guide](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Last Updated**: 2026-06-13  
**Author**: Syncpulse Team  
**Status**: Ready for Implementation
