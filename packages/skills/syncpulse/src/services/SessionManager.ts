import { CacheService } from "./CacheService.js";
import { Session } from "../types/Session.js";

export class SessionManager {
  constructor(private cache: CacheService<Session>) {}

  createSession(): Session {
    const session: Session = {
      id: Date.now().toString(),
      startedAt: Date.now(),
      status: "active",
      tasks: [],
    };

    this.cache.set(`session-${session.id}`, session);
    return session;
  }

  getSession(id: string): Session | null {
    return this.cache.get(`session-${id}`);
  }

  saveSession(session: Session) {
    this.cache.set(`session-${session.id}`, session);
  }
}
