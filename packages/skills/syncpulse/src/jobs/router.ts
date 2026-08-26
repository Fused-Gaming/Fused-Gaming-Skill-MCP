import type { CrossAgentJob, CrossAgentProviderProfile } from "./types";

export interface ProviderMatch {
  provider: CrossAgentProviderProfile;
  score: number;
  preferred: boolean;
}

function supportsAll(required: string[], provided: string[]): boolean {
  const available = new Set(provided);
  return required.every((capability) => available.has(capability));
}

export function routeCrossAgentJob(
  job: CrossAgentJob,
  providers: CrossAgentProviderProfile[],
): ProviderMatch[] {
  const preferred = new Set(job.preferredProviders ?? []);

  return providers
    .filter((provider) => provider.available !== false)
    .filter((provider) => supportsAll(job.capabilities, provider.capabilities))
    .map((provider) => {
      const isPreferred = preferred.has(provider.id);
      const score = (provider.priority ?? 0) + (isPreferred ? 1000 : 0);
      return { provider, score, preferred: isPreferred };
    })
    .sort((a, b) => b.score - a.score || a.provider.id.localeCompare(b.provider.id));
}

export function selectCrossAgentProvider(
  job: CrossAgentJob,
  providers: CrossAgentProviderProfile[],
): CrossAgentProviderProfile | null {
  return routeCrossAgentJob(job, providers)[0]?.provider ?? null;
}
