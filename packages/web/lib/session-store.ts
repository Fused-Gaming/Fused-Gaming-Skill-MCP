/**
 * Session Store - JWT-based authentication and session state management
 * Handles user sessions using stateless JWT tokens
 * Magic link tokens and password metadata stored in-memory for auth flow
 *
 * JWT provides stateless sessions suitable for serverless/deployed contexts.
 * In production, magic link tokens should be stored in a database with TTL.
 */

import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

interface SessionData {
  token: string;
  email: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  passwordChanged: boolean;
  role: 'admin' | 'user';
}

interface MagicLinkToken {
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

interface UserData {
  email: string;
  userId: string;
  password?: string;
  passwordChanged?: boolean;
  role?: 'admin' | 'user';
}

// In-memory storage (replace with database in production)
const magicLinksMap = new Map<string, MagicLinkToken>();
const usersMap = new Map<string, UserData>();

// JWT secret for signing tokens (in production, load from env)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

// Initialize demo user
const DEMO_USER_EMAIL = 'demo@example.com';
const DEMO_USER_PASSWORD = 'demo';
const DEMO_USER_ID = 'user_demo';

// Hash the demo password with bcrypt (12 salt rounds for security per OWASP)
const hashedDemoPassword = bcryptjs.hashSync(DEMO_USER_PASSWORD, 12);

usersMap.set(DEMO_USER_EMAIL, {
  email: DEMO_USER_EMAIL,
  userId: DEMO_USER_ID,
  password: hashedDemoPassword,
  passwordChanged: false,
  role: 'admin',
});

/**
 * Generates a cryptographically secure random token for one-time use (magic links, etc)
 * Uses crypto.getRandomValues for secure randomness
 */
function generateSecureToken(): string {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Base64URL encodes a string (for JWT)
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64URL decodes a string (for JWT)
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Creates a JWT token for session authentication
 * Token is stateless and verifiable without session store lookup
 */
function createJWT(userId: string, email: string, passwordChanged: boolean, role: 'admin' | 'user' = 'user'): { token: string; expiresIn: number } {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + JWT_EXPIRY;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: userId,
    email,
    passwordChanged,
    role,
    iat: now,
    exp: expiresAt,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  // Sign with HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(message)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const token = `${message}.${signature}`;
  return { token, expiresIn: JWT_EXPIRY * 1000 }; // Return expiresIn in milliseconds
}

/**
 * Verifies and decodes a JWT token
 * Returns null if invalid or expired
 */
function verifyJWT(token: string): { userId: string; email: string; passwordChanged: boolean; role: 'admin' | 'user' } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(message)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode and validate payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      passwordChanged: payload.passwordChanged,
      role: payload.role || 'user',
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Public SessionStore API
 */
export const SessionStore = {
  /**
   * Creates a new JWT session for a user
   * JWT tokens are stateless and don't require server-side storage
   * Role is retrieved from user data if not explicitly provided
   */
  createSession(
    userId: string,
    email: string,
    passwordChanged: boolean = false,
    role?: 'admin' | 'user'
  ): { token: string; expiresIn: number } {
    // Retrieve role from user data if not explicitly provided
    const userRole = role ?? usersMap.get(email)?.role ?? 'user';
    return createJWT(userId, email, passwordChanged, userRole);
  },

  /**
   * Verifies and decodes a JWT token
   * Returns session data if token is valid, null otherwise
   */
  getSession(token: string): SessionData | null {
    const decoded = verifyJWT(token);
    if (!decoded) return null;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + JWT_EXPIRY * 1000);

    return {
      token,
      email: decoded.email,
      userId: decoded.userId,
      createdAt: now,
      expiresAt,
      passwordChanged: decoded.passwordChanged,
      role: decoded.role,
    };
  },

  /**
   * Updates a session to mark password as changed
   */
  markPasswordChanged(token: string): boolean {
    const session = this.getSession(token);
    if (!session) return false;

    session.passwordChanged = true;

    // Also update the user record
    const user = usersMap.get(session.email);
    if (user) {
      user.passwordChanged = true;
    }

    return true;
  },

  /**
   * Updates a user's password with secure bcrypt hashing
   */
  updatePassword(email: string, newPassword: string): boolean {
    const user = usersMap.get(email);
    if (!user) return false;

    // Hash password with bcrypt (12 salt rounds per OWASP)
    user.password = bcryptjs.hashSync(newPassword, 12);
    user.passwordChanged = true;
    return true;
  },

  /**
   * Validates a user's email/password combination using bcrypt
   * Accepts both one-time password (first login) and changed password (subsequent logins)
   */
  validatePassword(email: string, password: string): boolean {
    const user = usersMap.get(email);
    if (!user || !user.password) return false;

    // Compare password using bcrypt safe comparison
    return bcryptjs.compareSync(password, user.password);
  },

  /**
   * Checks if a user has changed their password
   */
  hasChangedPassword(email: string): boolean {
    const user = usersMap.get(email);
    return user?.passwordChanged || false;
  },

  /**
   * Creates a magic link token for email-based authentication
   * Uses cryptographically secure random token generation
   */
  createMagicLinkToken(email: string): { token: string; expiresIn: number } {
    // Create user if doesn't exist
    if (!usersMap.has(email)) {
      usersMap.set(email, {
        email,
        userId: `user_${Date.now()}`,
        passwordChanged: false,
      });
    }

    const token = generateSecureToken();
    const expiresIn = 15 * 60 * 1000; // 15 minutes in milliseconds
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn);

    const magicLink: MagicLinkToken = {
      token,
      email,
      createdAt: now,
      expiresAt,
      used: false,
    };

    magicLinksMap.set(token, magicLink);
    return { token, expiresIn };
  },

  /**
   * Verifies and consumes a magic link token
   */
  verifyMagicLinkToken(token: string): { email: string; isValid: boolean } {
    const magicLink = magicLinksMap.get(token);

    if (!magicLink) {
      return { email: '', isValid: false };
    }

    // Check if expired
    if (new Date() > magicLink.expiresAt) {
      magicLinksMap.delete(token);
      return { email: '', isValid: false };
    }

    // Check if already used
    if (magicLink.used) {
      return { email: '', isValid: false };
    }

    // Mark as used
    magicLink.used = true;

    return { email: magicLink.email, isValid: true };
  },

  /**
   * Gets user information by email
   */
  getUserByEmail(email: string): UserData | null {
    return usersMap.get(email) || null;
  },

  /**
   * Creates a new user with email and password
   * Returns userId if created, null if email already exists
   */
  createUser(email: string, password: string): { userId: string } | null {
    // Check if user already exists
    if (usersMap.has(email)) {
      return null;
    }

    const userId = `user_${Date.now()}`;
    usersMap.set(email, {
      email,
      userId,
      password: bcryptjs.hashSync(password, 12),
      passwordChanged: true, // Password was set during signup
    });

    return { userId };
  },

  /**
   * Deletes a session (stateless JWT - no actual deletion needed)
   * Returns true for compatibility
   */
  deleteSession(_token: string): boolean {
    // JWTs are stateless, so there's nothing to delete server-side
    // Just return true for API compatibility
    return true;
  },

  /**
   * Gets magic link token info (for testing/dev)
   */
  getMagicLinkToken(token: string): MagicLinkToken | null {
    return magicLinksMap.get(token) || null;
  },
};
