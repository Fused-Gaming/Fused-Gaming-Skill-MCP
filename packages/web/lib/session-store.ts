/**
 * Session Store - Unified authentication and session state management
 * Handles user sessions, magic link tokens, and password changes
 *
 * NOTE: In production, this should be backed by a persistent database.
 * This implementation uses in-memory storage for development/demo purposes.
 */

interface SessionData {
  token: string;
  email: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  passwordChanged: boolean;
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
}

// In-memory storage (replace with database in production)
const sessionsMap = new Map<string, SessionData>();
const magicLinksMap = new Map<string, MagicLinkToken>();
const usersMap = new Map<string, UserData>();

// Initialize demo user
const DEMO_USER_EMAIL = 'demo@example.com';
const DEMO_USER_PASSWORD = 'demo';
const DEMO_USER_ID = 'user_demo';

usersMap.set(DEMO_USER_EMAIL, {
  email: DEMO_USER_EMAIL,
  userId: DEMO_USER_ID,
  password: DEMO_USER_PASSWORD,
  passwordChanged: false,
});

/**
 * Generates a random token
 */
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Public SessionStore API
 */
export const SessionStore = {
  /**
   * Creates a new session for a user
   */
  createSession(
    userId: string,
    email: string,
    passwordChanged: boolean = false
  ): { token: string; expiresIn: number } {
    const token = generateToken();
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn);

    const session: SessionData = {
      token,
      email,
      userId,
      createdAt: now,
      expiresAt,
      passwordChanged,
    };

    sessionsMap.set(token, session);
    return { token, expiresIn };
  },

  /**
   * Retrieves session information
   */
  getSession(token: string): SessionData | null {
    const session = sessionsMap.get(token);
    if (!session) return null;

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      sessionsMap.delete(token);
      return null;
    }

    return session;
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
   * Updates a user's password
   */
  updatePassword(email: string, newPassword: string): boolean {
    const user = usersMap.get(email);
    if (!user) return false;

    user.password = newPassword;
    user.passwordChanged = true;
    return true;
  },

  /**
   * Validates a user's email/password combination
   * Accepts both one-time password (first login) and changed password (subsequent logins)
   */
  validatePassword(email: string, password: string): boolean {
    const user = usersMap.get(email);
    if (!user) return false;

    // Match against stored password (works for both initial and changed passwords)
    return user.password === password;
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

    const token = generateToken();
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
      password,
      passwordChanged: false,
    });

    return { userId };
  },

  /**
   * Deletes a session
   */
  deleteSession(token: string): boolean {
    return sessionsMap.delete(token);
  },

  /**
   * Gets magic link token info (for testing/dev)
   */
  getMagicLinkToken(token: string): MagicLinkToken | null {
    return magicLinksMap.get(token) || null;
  },
};
