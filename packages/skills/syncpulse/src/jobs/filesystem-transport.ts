import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import type {
  ClaimJobInput,
  CrossAgentJob,
  CrossAgentJobFailure,
  CrossAgentJobResult,
  SubmitCrossAgentJobInput,
} from "./types";
import type { CrossAgentJobTransport, JobListFilter } from "./transport";

const DEFAULT_LEASE_MS = 5 * 60 * 1000;

function nowIso(): string {
  return new Date().toISOString();
}

function supports(required: string[], available: string[]): boolean {
  const set = new Set(available);
  return required.every((capability) => set.has(capability));
}

export class FilesystemCrossAgentJobTransport implements CrossAgentJobTransport {
  constructor(private readonly rootDir: string) {}

  private async ensureRoot(): Promise<void> {
    await mkdir(this.rootDir, { recursive: true });
  }

  private pathFor(jobId: string): string {
    return join(this.rootDir, `${jobId}.json`);
  }

  private async writeAtomic(job: CrossAgentJob): Promise<void> {
    await this.ensureRoot();
    const destination = this.pathFor(job.id);
    const temp = `${destination}.${randomUUID()}.tmp`;
    await writeFile(temp, `${JSON.stringify(job, null, 2)}\n`, "utf8");
    await rename(temp, destination);
  }

  async submit(input: SubmitCrossAgentJobInput): Promise<CrossAgentJob> {
    const timestamp = nowIso();
    const job: CrossAgentJob = {
      id: input.id ?? `job_${randomUUID()}`,
      workflowId: input.workflowId,
      status: "pending",
      capabilities: [...input.capabilities],
      preferredProviders: input.preferredProviders ? [...input.preferredProviders] : undefined,
      inputs: input.inputs ? [...input.inputs] : undefined,
      instructions: input.instructions,
      acceptanceCriteria: input.acceptanceCriteria ? [...input.acceptanceCriteria] : undefined,
      artifacts: [],
      claim: null,
      provenance: input.provenance,
      attempt: 0,
      maxAttempts: input.maxAttempts ?? 3,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.writeAtomic(job);
    return job;
  }

  async get(jobId: string): Promise<CrossAgentJob | null> {
    try {
      return JSON.parse(await readFile(this.pathFor(jobId), "utf8")) as CrossAgentJob;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return null;
      throw error;
    }
  }

  async list(filter: JobListFilter = {}): Promise<CrossAgentJob[]> {
    await this.ensureRoot();
    const files = (await readdir(this.rootDir)).filter((file) => file.endsWith(".json"));
    const jobs = await Promise.all(
      files.map(async (file) => JSON.parse(await readFile(join(this.rootDir, file), "utf8")) as CrossAgentJob),
    );

    return jobs
      .filter((job) => !filter.statuses || filter.statuses.includes(job.status))
      .filter((job) => !filter.workflowId || job.workflowId === filter.workflowId)
      .filter((job) => !filter.capabilities || supports(filter.capabilities, job.capabilities))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async claim(jobId: string, input: ClaimJobInput): Promise<CrossAgentJob | null> {
    const job = await this.get(jobId);
    if (!job || job.status !== "pending" || !supports(job.capabilities, input.capabilities)) return null;

    const timestamp = new Date();
    job.status = "claimed";
    job.attempt += 1;
    job.claim = {
      providerId: input.providerId,
      workerId: input.workerId,
      claimedAt: timestamp.toISOString(),
      leaseExpiresAt: new Date(timestamp.getTime() + (input.leaseMs ?? DEFAULT_LEASE_MS)).toISOString(),
    };
    job.updatedAt = timestamp.toISOString();
    await this.writeAtomic(job);
    return job;
  }

  async heartbeat(jobId: string, workerId: string, leaseMs = DEFAULT_LEASE_MS): Promise<CrossAgentJob> {
    const job = await this.requireClaim(jobId, workerId);
    const timestamp = new Date();
    job.claim!.heartbeatAt = timestamp.toISOString();
    job.claim!.leaseExpiresAt = new Date(timestamp.getTime() + leaseMs).toISOString();
    job.updatedAt = timestamp.toISOString();
    await this.writeAtomic(job);
    return job;
  }

  async markRunning(jobId: string, workerId: string): Promise<CrossAgentJob> {
    const job = await this.requireClaim(jobId, workerId);
    job.status = "running";
    job.updatedAt = nowIso();
    await this.writeAtomic(job);
    return job;
  }

  async complete(jobId: string, workerId: string, result: CrossAgentJobResult): Promise<CrossAgentJob> {
    const job = await this.requireClaim(jobId, workerId);
    job.status = "completed";
    job.result = result;
    job.artifacts = result.artifacts;
    job.updatedAt = nowIso();
    await this.writeAtomic(job);
    return job;
  }

  async fail(
    jobId: string,
    workerId: string,
    failure: Omit<CrossAgentJobFailure, "failedAt">,
  ): Promise<CrossAgentJob> {
    const job = await this.requireClaim(jobId, workerId);
    const canRetry = failure.retryable && job.attempt < job.maxAttempts;
    job.failure = { ...failure, failedAt: nowIso() };
    job.status = canRetry ? "retryable" : "failed";
    job.claim = null;
    job.updatedAt = nowIso();

    if (canRetry) job.status = "pending";

    await this.writeAtomic(job);
    return job;
  }

  async releaseExpiredClaims(now = new Date()): Promise<CrossAgentJob[]> {
    const jobs = await this.list({ statuses: ["claimed", "running"] });
    const released: CrossAgentJob[] = [];

    for (const job of jobs) {
      if (!job.claim || new Date(job.claim.leaseExpiresAt) > now) continue;
      job.status = job.attempt < job.maxAttempts ? "pending" : "failed";
      job.claim = null;
      job.updatedAt = now.toISOString();
      await this.writeAtomic(job);
      released.push(job);
    }

    return released;
  }

  private async requireClaim(jobId: string, workerId: string): Promise<CrossAgentJob> {
    const job = await this.get(jobId);
    if (!job) throw new Error(`Cross-agent job not found: ${jobId}`);
    if (!job.claim || job.claim.workerId !== workerId) {
      throw new Error(`Cross-agent job ${jobId} is not claimed by worker ${workerId}`);
    }
    return job;
  }
}
