/**
 * Analyze Content Quality Tool
 * Validates generated content against LIMJ quality gates and brand voice guidelines.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

const BANNED_WORDS = [
  "In today's world",
  "It's important to note",
  "This begs the question",
  "At the end of the day",
  "Moving forward",
  "Going forward",
  "Utilize",
  "Implement",
  "Robust",
  "Seamless",
  "Cutting-edge",
  "Game-changing",
  "Groundbreaking",
  "Synergy",
  "Leverage",
  "Ecosystem",
  "Disrupt",
  "Disruption",
  "Stakeholders",
  "Best practices",
];

export const AnalyzeContentQualityTool: ToolDefinition = {
  name: "analyze-content-quality",
  description: "Validates content against LIMJ quality gates, banned vocabulary, and brand voice guidelines.",
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "Content to analyze (article text or post)",
      },
      contentType: {
        type: "string",
        enum: ["article", "post"],
        description: "Type of content being analyzed",
      },
      wordCountTarget: {
        type: "object",
        properties: {
          min: { type: "number" },
          max: { type: "number" },
        },
        description: "Target word count range (defaults: article 1200-1800, post 100-300)",
      },
    },
    required: ["content", "contentType"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const content = (input.content as string) || "";
    const contentType = (input.contentType as string) || "article";
    const wordCountTarget = input.wordCountTarget as { min: number; max: number } | undefined;

    const analysis = {
      passed: true,
      issues: [] as string[],
      warnings: [] as string[],
      metrics: {
        wordCount: 0,
        paragraphs: 0,
        sentences: 0,
        avgSentenceLength: 0,
        bannedWordInstances: [] as { word: string; count: number }[],
      },
      qualityGates: {
        noBannedVocabulary: true,
        withinWordCount: true,
        paragraphVariety: true,
        sentenceVariety: true,
      },
    };

    // Word count
    const words = content.trim().split(/\s+/);
    analysis.metrics.wordCount = words.length;

    // Paragraph analysis
    const paragraphs = content
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0);
    analysis.metrics.paragraphs = paragraphs.length;

    // Sentence analysis
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    analysis.metrics.sentences = sentences.length;
    analysis.metrics.avgSentenceLength = Math.round(words.length / sentences.length);

    // Word count validation
    const targetMin = wordCountTarget?.min || (contentType === "article" ? 1200 : 100);
    const targetMax = wordCountTarget?.max || (contentType === "article" ? 1800 : 300);

    if (analysis.metrics.wordCount < targetMin) {
      analysis.issues.push(`Content too short (${analysis.metrics.wordCount} words, need ${targetMin}+)`);
      analysis.qualityGates.withinWordCount = false;
      analysis.passed = false;
    } else if (analysis.metrics.wordCount > targetMax) {
      analysis.warnings.push(`Content exceeds target length (${analysis.metrics.wordCount} words, max ${targetMax})`);
    }

    // Banned vocabulary check
    const lowerContent = content.toLowerCase();
    for (const bannedWord of BANNED_WORDS) {
      const regex = new RegExp(`\\b${bannedWord.toLowerCase()}\\b`, "gi");
      const matches = lowerContent.match(regex);
      if (matches && matches.length > 0) {
        analysis.metrics.bannedWordInstances.push({
          word: bannedWord,
          count: matches.length,
        });
        analysis.qualityGates.noBannedVocabulary = false;
        analysis.issues.push(`Banned word "${bannedWord}" found ${matches.length} time(s)`);
        analysis.passed = false;
      }
    }

    // Paragraph variety
    const singleWordParagraphs = paragraphs.filter((p) => p.split(/\s+/).length <= 2).length;
    if (singleWordParagraphs > paragraphs.length * 0.2) {
      analysis.warnings.push("Multiple single-sentence paragraphs detected. Consider consolidating for better flow.");
    }

    // Sentence variety
    const avgLength = analysis.metrics.avgSentenceLength;
    if (avgLength > 25) {
      analysis.warnings.push("Average sentence length is high (>25 words). Consider breaking up complex sentences.");
      analysis.qualityGates.sentenceVariety = false;
    }

    // Determine quality score
    const qualityScore = Object.values(analysis.qualityGates).filter(Boolean).length;
    const maxScore = Object.keys(analysis.qualityGates).length;

    return {
      success: analysis.passed,
      analysis,
      recommendation: analysis.passed
        ? "✓ Content passes all quality gates. Ready for publication."
        : "⚠ Content has issues. Review and resolve before publishing.",
      qualityScore: `${qualityScore}/${maxScore}`,
      nextSteps: analysis.issues.length > 0
        ? [`Fix ${analysis.issues.length} issue(s) before publishing`]
        : analysis.warnings.length > 0
          ? ["Optional: Address warnings for better readability"]
          : ["Content is publication-ready"],
    };
  },
};
