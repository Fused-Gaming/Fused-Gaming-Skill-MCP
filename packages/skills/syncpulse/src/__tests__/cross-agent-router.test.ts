import { routeCrossAgentJob, selectCrossAgentProvider } from "../jobs/router";
import type { CrossAgentJob, CrossAgentProviderProfile } from "../jobs/types";

const baseJob: CrossAgentJob = {
  id: "job_test",
  status: "pending",
  capabilities: ["visual-mockup", "image-processing"],
  preferredProviders: ["codex"],
  instructions: "Generate a mobile product card mockup",
  provenance: { createdBy: "test" },
  attempt: 0,
  maxAttempts: 3,
  createdAt: "2026-08-26T00:00:00.000Z",
  updatedAt: "2026-08-26T00:00:00.000Z",
};

const providers: CrossAgentProviderProfile[] = [
  {
    id: "claude",
    capabilities: ["planning", "parallel-agents", "frontend-implementation"],
    priority: 50,
  },
  {
    id: "codex",
    capabilities: ["visual-mockup", "image-processing", "frontend-implementation"],
    priority: 10,
  },
  {
    id: "generic-vision",
    capabilities: ["visual-mockup", "image-processing"],
    priority: 100,
  },
];

describe("SyncPulse cross-agent provider routing", () => {
  it("filters providers that do not satisfy every required capability", () => {
    const matches = routeCrossAgentJob(baseJob, providers);
    expect(matches.map((match) => match.provider.id)).not.toContain("claude");
  });

  it("honors preferred providers without making them a protocol requirement", () => {
    const selected = selectCrossAgentProvider(baseJob, providers);
    expect(selected?.id).toBe("codex");
  });

  it("falls back to the highest-priority capable provider", () => {
    const job = { ...baseJob, preferredProviders: [] };
    const selected = selectCrossAgentProvider(job, providers);
    expect(selected?.id).toBe("generic-vision");
  });
});
