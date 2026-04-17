import { Task } from "./Task.js";

export type SessionStatus = "active" | "paused" | "completed";

export interface Session {
  id: string;
  startedAt: number;
  status: SessionStatus;
  tasks: Task[];
}
