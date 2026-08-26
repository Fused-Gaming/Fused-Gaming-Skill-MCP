export type CrossAgentJobStatus =
  | "pending"
  | "claimed"
  | "running"
  | "completed"
  | "failed"
  | "retryable"
  | "expired";

export interface CrossAgentArtifact {
  name: string;
  path?: string;
  uri?: string;
  mediaType?: string;
  sha256?: string;
  metadata?: Record<string, unknown>;
}

export interface CrossAgentJobClaim {
  providerId: string;
  workerId: string;
  claimedAt: string;
  leaseExpiresAt: string;
  heartbeatAt?: string;
}

export interface CrossAgentJobProvenance {
  createdBy: string;
  project?: string;
  sourceJobId?: string;
  sourceWorkflowId?: string;
  metadata?: Record<string, unknown>;
}

export interface CrossAgentJobResult {
  summary?: string;
  output?: Record<string, unknown>;
  artifacts: CrossAgentArtifact[];
  completedBy?: {
    providerId: string;
    workerId: string;
  };
}

export interface CrossAgentJobFailure {
  code?: string;
  message: string;
  retryable: boolean;
  failedAt: string;
  providerId?: string;
  workerId?: string;
}

export interface CrossAgentJob {
  id: string;
  workflowId?: string;
  status: CrossAgentJobStatus;
  capabilities: string[];
  preferredProviders?: string[];
  inputs?: CrossAgentArtifact[];
  instructions: string;
  acceptanceCriteria?: string[];
  artifacts?: CrossAgentArtifact[];
  claim?: CrossAgentJobClaim | null;
  result?: CrossAgentJobResult;
  failure?: CrossAgentJobFailure;
  provenance: CrossAgentJobProvenance;
  attempt: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitCrossAgentJobInput {
  id?: string;
  workflowId?: string;
  capabilities: string[];
  preferredProviders?: string[];
  inputs?: CrossAgentArtifact[];
  instructions: string;
  acceptanceCriteria?: string[];
  provenance: CrossAgentJobProvenance;
  maxAttempts?: number;
}

export interface ClaimJobInput {
  providerId: string;
  workerId: string;
  capabilities: string[];
  leaseMs?: number;
}

export interface CrossAgentProviderProfile {
  id: string;
  capabilities: string[];
  priority?: number;
  available?: boolean;
  metadata?: Record<string, unknown>;
}
