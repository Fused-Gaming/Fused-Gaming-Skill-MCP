import { CacheService } from "./CacheService.js";
import { Session, SessionStatus, Task } from "../types/index.js";
export declare class SessionManager {
    private cache?;
    private sessions;
    constructor(cache?: CacheService<Session> | undefined);
    private generateSecureId;
    createSession(id?: string): Session;
    addTask(sessionId: string, task: Task): boolean;
    completeSession(sessionId: string): Session | null;
    pauseSession(sessionId: string): Session | null;
    resumeSession(sessionId: string): Session | null;
    getSession(sessionId: string): Session | undefined;
    listSessions(status?: SessionStatus): Session[];
    saveSession(session: Session): void;
}
//# sourceMappingURL=SessionManager.d.ts.map