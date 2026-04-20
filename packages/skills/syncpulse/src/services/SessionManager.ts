import { CacheService } from "./CacheService.js";
import { Session, SessionStatus, Task } from "../types/index.js";

export class SessionManager {
  private sessions = new Map<string, Session>();

  constructor(private cache?: CacheService<Session>) {}

  private generateSecureId(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  createSession(id?: string): Session {
    const sessionId = id || `session-${Date.now()}-${this.generateSecureId()}`;
    const session: Session = {
      id: sessionId,
      startedAt: Date.now(),
      status: "active" as SessionStatus,
      tasks: [],
    };

    this.sessions.set(sessionId, session);
    if (this.cache) {
      this.cache.set(`session-${sessionId}`, session);
    }

    return session;
  }

  addTask(sessionId: string, task: Task): boolean {
    const session = this.sessions.get(sessionId);
    if (!session && this.cache) {
      const cached = this.cache.get(`session-${sessionId}`);
      if (!cached) return false;
      this.sessions.set(sessionId, cached as Session);
    }

    const finalSession = this.sessions.get(sessionId);
    if (!finalSession) return false;

    finalSession.tasks.push(task);
    if (this.cache) {
      this.cache.set(`session-${sessionId}`, finalSession);
    }

    return true;
  }

  completeSession(sessionId: string): Session | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.status = "completed";
    if (this.cache) {
      this.cache.set(`session-${sessionId}`, session);
    }

    return session;
  }

  pauseSession(sessionId: string): Session | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.status = "paused";
    if (this.cache) {
      this.cache.set(`session-${sessionId}`, session);
    }

    return session;
  }

  resumeSession(sessionId: string): Session | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.status = "active";
    if (this.cache) {
      this.cache.set(`session-${sessionId}`, session);
    }

    return session;
  }

  getSession(sessionId: string): Session | undefined {
    let session = this.sessions.get(sessionId);

    if (!session && this.cache) {
      const cached = this.cache.get(`session-${sessionId}`);
      if (cached) {
        session = cached as Session;
        this.sessions.set(sessionId, session);
      }
    }

    return session;
  }

  listSessions(status?: SessionStatus): Session[] {
    return Array.from(this.sessions.values()).filter(
      (s) => !status || s.status === status
    );
  }

  saveSession(session: Session): void {
    this.sessions.set(session.id, session);
    if (this.cache) {
      this.cache.set(`session-${session.id}`, session);
    }
  }
}
