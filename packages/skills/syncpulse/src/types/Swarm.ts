import { Agent } from "./Agent.js";

export type SwarmTopology = "hierarchical" | "mesh" | "adaptive" | "ring" | "star";

export interface SwarmConfig {
  topology: SwarmTopology;
  maxAgents: number;
  strategy: "balanced" | "specialized" | "adaptive";
  consensusThreshold: number;
  autoScale: boolean;
}

export interface Swarm {
  id: string;
  name: string;
  config: SwarmConfig;
  agents: Agent[];
  createdAt: number;
  metrics: SwarmMetrics;
}

export interface SwarmMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  avgLatency: number;
  throughput: number;
  healthScore: number;
}
