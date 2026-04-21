import { CacheService } from "./CacheService.js";
import type { Session } from "../types/Session.js";

export interface SessionConfig {
  sessionId?: string;
  agentId?: string;
  timestamp: number;
}

export class SessionManager {
  private cache: CacheService;
  private sessions = new Map<string, Session>();

  constructor(cache?: CacheService) {
    this.cache = cache || new CacheService();
  }

  createSession(): Session {
    const session: Session = {
      id: Date.now().toString(),
      startedAt: Date.now(),
      status: "active",
      tasks: [],
    };

    this.sessions.set(session.id, session);
    this.cache.set(`session-${session.id}`, session);
    return session;
  }

  getSession(id: string): Session | null {
    return this.sessions.get(id) || null;
  }

  saveSession(session: Session): void {
    this.sessions.set(session.id, session);
    this.cache.set(`session-${session.id}`, session);
  }

  async manage(action: "create" | "resume" | "save" | "close", config: SessionConfig): Promise<Session | null> {
    switch (action) {
      case "create":
        return this.createSession();

      case "resume":
        return this.getSession(config.sessionId || "") || this.createSession();

      case "save":
        if (config.sessionId) {
          const session = this.getSession(config.sessionId);
          if (session) {
            this.saveSession(session);
            return session;
          }
        }
        return null;

      case "close":
        if (config.sessionId) {
          const session = this.getSession(config.sessionId);
          if (session) {
            session.status = "completed";
            this.saveSession(session);
            return session;
          }
        }
        return null;

      default:
        return null;
    }
  }
}
