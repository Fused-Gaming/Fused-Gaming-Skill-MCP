export class SessionManager {
    constructor(cache) {
        this.cache = cache;
        this.sessions = new Map();
    }
    generateSecureId() {
        const array = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(array);
        }
        else {
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    createSession(id) {
        const sessionId = id || `session-${Date.now()}-${this.generateSecureId()}`;
        const session = {
            id: sessionId,
            startedAt: Date.now(),
            status: "active",
            tasks: [],
        };
        this.sessions.set(sessionId, session);
        if (this.cache) {
            this.cache.set(`session-${sessionId}`, session);
        }
        return session;
    }
    addTask(sessionId, task) {
        const session = this.sessions.get(sessionId);
        if (!session && this.cache) {
            const cached = this.cache.get(`session-${sessionId}`);
            if (!cached)
                return false;
            this.sessions.set(sessionId, cached);
        }
        const finalSession = this.sessions.get(sessionId);
        if (!finalSession)
            return false;
        finalSession.tasks.push(task);
        if (this.cache) {
            this.cache.set(`session-${sessionId}`, finalSession);
        }
        return true;
    }
    completeSession(sessionId) {
        const session = this.getSession(sessionId);
        if (!session)
            return null;
        session.status = "completed";
        if (this.cache) {
            this.cache.set(`session-${sessionId}`, session);
        }
        return session;
    }
    pauseSession(sessionId) {
        const session = this.getSession(sessionId);
        if (!session)
            return null;
        session.status = "paused";
        if (this.cache) {
            this.cache.set(`session-${sessionId}`, session);
        }
        return session;
    }
    resumeSession(sessionId) {
        const session = this.getSession(sessionId);
        if (!session)
            return null;
        session.status = "active";
        if (this.cache) {
            this.cache.set(`session-${sessionId}`, session);
        }
        return session;
    }
    getSession(sessionId) {
        let session = this.sessions.get(sessionId);
        if (!session && this.cache) {
            const cached = this.cache.get(`session-${sessionId}`);
            if (cached) {
                session = cached;
                this.sessions.set(sessionId, session);
            }
        }
        return session;
    }
    listSessions(status) {
        return Array.from(this.sessions.values()).filter((s) => !status || s.status === status);
    }
    saveSession(session) {
        this.sessions.set(session.id, session);
        if (this.cache) {
            this.cache.set(`session-${session.id}`, session);
        }
    }
}
//# sourceMappingURL=SessionManager.js.map