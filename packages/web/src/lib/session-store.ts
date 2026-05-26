/**
 * Session Store
 *
 * In-memory session storage for JWT tokens during development.
 * For production, integrate with Redis or a persistent store.
 */

import type { AuthenticatedUser } from './auth-middleware';

interface StoredSession {
  token: string;
  user: AuthenticatedUser;
  expiresAt: number;
}

class SessionStoreImpl {
  private sessions: Map<string, StoredSession> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup of expired sessions every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60000);
  }

  /**
   * Store a new session
   */
  setSession(token: string, user: AuthenticatedUser, expiresAt: number): void {
    this.sessions.set(token, {
      token,
      user,
      expiresAt,
    });
  }

  /**
   * Retrieve a session by token
   */
  getSession(token: string): AuthenticatedUser | null {
    const session = this.sessions.get(token);

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session.user;
  }

  /**
   * Remove a session
   */
  removeSession(token: string): void {
    this.sessions.delete(token);
  }

  /**
   * Clear all sessions (useful for testing)
   */
  clearAll(): void {
    this.sessions.clear();
  }

  /**
   * Cleanup expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token);
      }
    }
  }

  /**
   * Destroy the session store and cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.sessions.clear();
  }
}

// Export singleton instance
export const SessionStore = new SessionStoreImpl();

// Export the class for testing
export type { StoredSession };
