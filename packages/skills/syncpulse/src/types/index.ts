export * from "./Task.js";
export * from "./Session.js";
export * from "./Agent.js";
export * from "./Swarm.js";
export * from "./Memory.js";

export interface ProjectState {
  id: string;
  name: string;
  path: string;
  gitHash?: string;
  fileCount: number;
  fileSize: number;
  lastSyncAt: number;
  metadata: Record<string, unknown>;
}

export interface SyncPulseConfig {
  cacheDir: string;
  memoryBackend: "hybrid" | "disk" | "memory";
  maxCacheSize: number;
  defaultTTL: number;
  enableVectorSearch: boolean;
  enableAutoLearning: boolean;
}
