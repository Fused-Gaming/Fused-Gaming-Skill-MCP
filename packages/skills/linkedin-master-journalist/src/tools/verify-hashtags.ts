/**
 * Verify Hashtags Tool
 * Validates hashtag strategy against volume data and best practices.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

interface HashtagData {
  [key: string]: {
    volume: string;
    tier: "high" | "medium" | "niche";
    recommended: boolean;
  };
}

const HASHTAG_DATABASE: HashtagData = {
  "#AI": { volume: "2.5M+", tier: "high", recommended: true },
  "#Leadership": { volume: "1.8M+", tier: "high", recommended: true },
  "#Startups": { volume: "1.6M+", tier: "high", recommended: true },
  "#Technology": { volume: "1.4M+", tier: "high", recommended: true },
  "#Innovation": { volume: "1.2M+", tier: "high", recommended: true },
  "#LegalTech": { volume: "320K", tier: "medium", recommended: true },
  "#BlockchainSecurity": { volume: "280K", tier: "medium", recommended: true },
  "#SaaS": { volume: "950K", tier: "medium", recommended: true },
  "#FounderLife": { volume: "620K", tier: "medium", recommended: true },
  "#StartupStory": { volume: "540K", tier: "medium", recommended: true },
  "#ArbitrationLaw": { volume: "45K", tier: "niche", recommended: true },
  "#Web3Gaming": { volume: "78K", tier: "niche", recommended: true },
  "#FederalHousing": { volume: "32K", tier: "niche", recommended: true },
};

export const VerifyHashtagsTool: ToolDefinition = {
  name: "verify-hashtags",
  description: "Validates hashtag strategy against volume data and LinkedIn best practices.",
  inputSchema: {
    type: "object",
    properties: {
      hashtags: {
        type: "array",
        items: { type: "string" },
        description: "List of hashtags to verify (e.g., ['#AI', '#Leadership'])",
      },
      strategy: {
        type: "string",
        enum: ["balanced", "reach", "niche"],
        description: "Strategy type: balanced (3 high + 2 medium), reach (5+ high), niche (2+ niche)",
        default: "balanced",
      },
    },
    required: ["hashtags"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const hashtags = (input.hashtags as string[]) || [];
    const strategy = (input.strategy as string) || "balanced";

    const verification = {
      total: hashtags.length,
      valid: 0,
      unknownCount: 0,
      byTier: { high: 0, medium: 0, niche: 0 } as Record<string, number>,
      recommendations: [] as string[],
      strategyMatch: false,
      details: [] as Array<{ hashtag: string; volume?: string; tier?: string; found: boolean }>,
    };

    for (const tag of hashtags) {
      const normalizedTag = tag.startsWith("#") ? tag : `#${tag}`;
      const data = HASHTAG_DATABASE[normalizedTag];

      if (data) {
        verification.valid++;
        verification.byTier[data.tier]++;
        verification.details.push({
          hashtag: normalizedTag,
          volume: data.volume,
          tier: data.tier,
          found: true,
        });
      } else {
        verification.unknownCount++;
        verification.details.push({
          hashtag: normalizedTag,
          found: false,
        });
      }
    }

    // Check strategy alignment
    const tierCounts = verification.byTier;
    if (strategy === "balanced") {
      verification.strategyMatch = tierCounts.high >= 3 && tierCounts.medium >= 2;
      if (!verification.strategyMatch) {
        verification.recommendations.push("Add at least 3 high-volume hashtags for broad reach");
        verification.recommendations.push("Add 2-3 medium-volume hashtags for targeted reach");
      }
    } else if (strategy === "reach") {
      verification.strategyMatch = tierCounts.high >= 5;
      if (!verification.strategyMatch) {
        verification.recommendations.push("Add more high-volume hashtags (aim for 5+)");
      }
    } else if (strategy === "niche") {
      verification.strategyMatch = tierCounts.niche >= 2;
      if (!verification.strategyMatch) {
        verification.recommendations.push("Add 2+ niche hashtags for community focus");
      }
    }

    if (verification.unknownCount > 0) {
      verification.recommendations.push(
        `${verification.unknownCount} hashtags not in our database. Research recent LinkedIn trends for these.`
      );
    }

    return {
      success: true,
      verification,
      summary: {
        validCount: verification.valid,
        totalCount: hashtags.length,
        coverage: `${Math.round((verification.valid / hashtags.length) * 100)}%`,
        strategyAlignment: verification.strategyMatch ? "✓ Matched" : "⚠ Needs adjustment",
      },
    };
  },
};
