/**
 * Passport Authentication Strategy
 * Implements JWT-based authentication with role-based access control
 */

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '24h';

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
    'Set JWT_SECRET to a secure random string before running the application. ' +
    'Example: JWT_SECRET=$(openssl rand -base64 32) npm start'
  );
}

/**
 * JWT Strategy for token verification
 */
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    passReqToCallback: true,
  },
  (req: Request, payload: AuthUser, done) => {
    // Validate token expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return done(null, false, { message: 'Token expired' });
    }

    // Attach user to request
    done(null, payload);
  }
);

/**
 * Local Strategy for initial login
 */
export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req: Request, email: string, password: string, done: (err: Error | null, user?: AuthUser | false, info?: { message: string }) => void) => {
    // In production, validate against database
    // This is a simplified example
    if (validateCredentials(email, password)) {
      const user: AuthUser = {
        id: 'user-' + Date.now(),
        email,
        role: 'admin',
        permissions: ['read:agents', 'write:agents', 'read:metrics', 'write:metrics'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      return done(null, user);
    }
    done(null, false, { message: 'Invalid credentials' });
  }
);

/**
 * Role-based access control middleware
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: { status: (code: number) => { json: (data: object) => void } }, next: () => void) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = req.user as AuthUser;
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This endpoint requires one of: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

/**
 * Permission-based access control middleware
 */
export function requirePermission(...permissions: string[]) {
  return (req: Request, res: { status: (code: number) => { json: (data: object) => void } }, next: () => void) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = req.user as AuthUser;
    const hasPermission = permissions.some(p => user.permissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions for this action'
      });
    }

    next();
  };
}

/**
 * Generate JWT token
 */
export function generateToken(user: Partial<AuthUser>): string {
  const payload: AuthUser = {
    id: user.id || 'anonymous',
    email: user.email || 'anonymous@example.com',
    role: user.role || 'viewer',
    permissions: user.permissions || [],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Validate credentials (placeholder - implement against your auth provider)
 */
function validateCredentials(email: string, password: string): boolean {
  // In production, validate against database or identity provider
  // This is a placeholder implementation
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin-password';

  return email === adminEmail && password === adminPassword;
}

/**
 * Token refresh endpoint
 */
export async function refreshToken(oldToken: string): Promise<string | null> {
  const decoded = verifyToken(oldToken);
  if (!decoded) {
    return null;
  }

  // Generate new token with updated expiry
  return generateToken(decoded);
}
