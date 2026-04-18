export type AgentRole =
  | "coordinator"
  | "executor"
  | "reviewer"
  | "optimizer"
  | "monitor";

export type AgentStatus = "idle" | "busy" | "error" | "offline";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  capacity: number;
  currentLoad: number;
  successRate: number;
  lastHeartbeat: number;
}

export interface AgentMetrics {
  taskCount: number;
  successCount: number;
  failureCount: number;
  avgExecutionTime: number;
  efficiency: number;
}
