/**
 * Track Content Performance Tool
 * Tracks LIMJ-generated content performance metrics across LinkedIn platforms.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

interface PerformanceEntry {
  contentId: string;
  platform: "linkedin-personal" | "linkedin-company";
  contentType: "article" | "post" | "cover";
  title: string;
  publishDate: string;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
  };
}

// In-memory storage (would be database in production)
const performanceLog: PerformanceEntry[] = [];

function calculateEngagementRate(entry: PerformanceEntry): number {
  if (!entry.metrics || !entry.metrics.views || entry.metrics.views === 0) return 0;
  const totalEngagement =
    (entry.metrics.likes || 0) +
    (entry.metrics.comments || 0) +
    (entry.metrics.shares || 0) +
    (entry.metrics.saves || 0);
  return (totalEngagement / entry.metrics.views) * 100;
}

function calculateClickThroughRate(entry: PerformanceEntry): number {
  if (!entry.metrics || !entry.metrics.views || entry.metrics.views === 0) return 0;
  return ((entry.metrics.clicks || 0) / entry.metrics.views) * 100;
}

export const TrackContentPerformanceTool: ToolDefinition = {
  name: "track-content-performance",
  description: "Tracks and analyzes LIMJ-generated content performance metrics on LinkedIn platforms.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["record", "analyze", "compare"],
        description: "Action: record new metrics, analyze trends, or compare content variants",
      },
      entry: {
        type: "object",
        description: "Performance entry to record (required for 'record' action)",
      },
      contentIds: {
        type: "array",
        items: { type: "string" },
        description: "Content IDs to analyze (required for 'analyze' action)",
      },
      timeframe: {
        type: "string",
        enum: ["week", "month", "quarter"],
        description: "Timeframe for analysis (defaults to month)",
      },
    },
    required: ["action"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const action = (input.action as string) || "analyze";
    const entry = input.entry as PerformanceEntry | undefined;
    const contentIds = (input.contentIds as string[]) || [];
    const timeframe = (input.timeframe as string) || "month";

    let result = {
      success: false,
      action,
      message: "",
      data: null as unknown,
    };

    if (action === "record" && entry) {
      // Record new performance entry
      const newEntry: PerformanceEntry = {
        ...entry,
        contentId: entry.contentId || `content-${Date.now()}`,
      };
      performanceLog.push(newEntry);
      result.success = true;
      result.message = `Performance metrics recorded for ${newEntry.title}`;
      result.data = {
        contentId: newEntry.contentId,
        engagementRate: calculateEngagementRate(newEntry),
        ctr: calculateClickThroughRate(newEntry),
      };
    } else if (action === "analyze" && contentIds.length > 0) {
      // Analyze specific content
      const analyzed = performanceLog.filter((e) => contentIds.includes(e.contentId));

      if (analyzed.length === 0) {
        result.message = `No performance data found for provided content IDs`;
        return result;
      }

      const analysis = {
        totalContent: analyzed.length,
        byPlatform: {
          "linkedin-personal": analyzed.filter((e) => e.platform === "linkedin-personal").length,
          "linkedin-company": analyzed.filter((e) => e.platform === "linkedin-company").length,
        },
        avgMetrics: {
          views: Math.round(analyzed.reduce((sum, e) => sum + (e.metrics?.views || 0), 0) / analyzed.length),
          likes: Math.round(analyzed.reduce((sum, e) => sum + (e.metrics?.likes || 0), 0) / analyzed.length),
          comments: Math.round(analyzed.reduce((sum, e) => sum + (e.metrics?.comments || 0), 0) / analyzed.length),
          shares: Math.round(analyzed.reduce((sum, e) => sum + (e.metrics?.shares || 0), 0) / analyzed.length),
          avgEngagementRate: (
            analyzed.reduce((sum, e) => sum + calculateEngagementRate(e), 0) / analyzed.length
          ).toFixed(2),
        },
        topPerformer: analyzed.reduce(
          (best, current) => {
            const currentRate = calculateEngagementRate(current);
            const bestRate = calculateEngagementRate(best);
            return currentRate > bestRate ? current : best;
          },
          analyzed[0]
        ),
      };

      result.success = true;
      result.message = `Analyzed ${analyzed.length} content items (${timeframe})`;
      result.data = analysis;
    } else if (action === "compare") {
      // Compare content variants
      const personalPosts = performanceLog.filter((e) => e.platform === "linkedin-personal");
      const companyPosts = performanceLog.filter((e) => e.platform === "linkedin-company");

      const comparison = {
        personalPostMetrics: {
          count: personalPosts.length,
          avgEngagementRate: personalPosts.length
            ? (personalPosts.reduce((sum, e) => sum + calculateEngagementRate(e), 0) / personalPosts.length).toFixed(
                2
              )
            : 0,
          avgViewsPerPost: personalPosts.length
            ? Math.round(personalPosts.reduce((sum, e) => sum + (e.metrics?.views || 0), 0) / personalPosts.length)
            : 0,
        },
        companyPostMetrics: {
          count: companyPosts.length,
          avgEngagementRate: companyPosts.length
            ? (companyPosts.reduce((sum, e) => sum + calculateEngagementRate(e), 0) / companyPosts.length).toFixed(
                2
              )
            : 0,
          avgViewsPerPost: companyPosts.length
            ? Math.round(companyPosts.reduce((sum, e) => sum + (e.metrics?.views || 0), 0) / companyPosts.length)
            : 0,
        },
        recommendation:
          personalPosts.length && companyPosts.length
            ? personalPosts.reduce((sum, e) => sum + calculateEngagementRate(e), 0) / personalPosts.length >
              companyPosts.reduce((sum, e) => sum + calculateEngagementRate(e), 0) / companyPosts.length
              ? "Personal posts show higher engagement. Consider emphasizing personal perspective."
              : "Company posts show higher engagement. Lean into company voice and narrative."
            : "Insufficient data for comparison",
      };

      result.success = true;
      result.message = `Compared ${personalPosts.length} personal vs ${companyPosts.length} company posts`;
      result.data = comparison;
    }

    return result;
  },
};
