import type {
  ClaimJobInput,
  CrossAgentJob,
  CrossAgentJobFailure,
  CrossAgentJobResult,
  SubmitCrossAgentJobInput,
} from "./types";

export interface JobListFilter {
  statuses?: CrossAgentJob["status"][];
  workflowId?: string;
  capabilities?: string[];
}

export interface CrossAgentJobTransport {
  submit(input: SubmitCrossAgentJobInput): Promise<CrossAgentJob>;
  get(jobId: string): Promise<CrossAgentJob | null>;
  list(filter?: JobListFilter): Promise<CrossAgentJob[]>;
  claim(jobId: string, input: ClaimJobInput): Promise<CrossAgentJob | null>;
  heartbeat(jobId: string, workerId: string, leaseMs?: number): Promise<CrossAgentJob>;
  markRunning(jobId: string, workerId: string): Promise<CrossAgentJob>;
  complete(jobId: string, workerId: string, result: CrossAgentJobResult): Promise<CrossAgentJob>;
  fail(jobId: string, workerId: string, failure: Omit<CrossAgentJobFailure, "failedAt">): Promise<CrossAgentJob>;
  releaseExpiredClaims(now?: Date): Promise<CrossAgentJob[]>;
}
