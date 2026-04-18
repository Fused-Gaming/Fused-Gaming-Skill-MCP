import type { ToolDefinition } from "@h4shed/mcp-core";

const buildABRollPlan = (campaign: string, tone: string, beats: string[]) => {
  const aRoll = [
    "Founder or producer on-camera intro framing the core player promise",
    "Narrated elevator line delivery with crisp hook in first 8 seconds",
    "Direct-to-camera confidence close for CTA and launch window",
  ];

  const bRoll = [
    "Gameplay capture clips showing objective loop and progression feedback",
    "Controller, keyboard, and headset tactile closeups for immersion",
    "Reaction shots from QA/playtest sessions for social proof",
    "UI overlays of roadmap milestones and agent orchestration checkpoints",
  ];

  const searchPrompts = [
    `${campaign} gameplay cinematic 4k`,
    `${campaign} esports crowd reaction closeup`,
    `${campaign} development team collaboration b-roll`,
    `${campaign} futuristic hud overlay motion graphics`,
  ];

  return {
    tone,
    beats,
    aRoll,
    bRoll,
    searchPrompts,
    sourcingChecklist: [
      "Confirm usage rights for every stock clip and track license IDs.",
      "Capture 16:9 masters and 9:16 social-safe alternates.",
      "Map each beat to one A-roll line and two supporting B-roll inserts.",
    ],
  };
};

export const PlanTrailerRollsTool: ToolDefinition = {
  name: "plan-trailer-rolls",
  description:
    "Generate A-roll and B-roll sourcing plans for trailer promo elevator pitches.",
  inputSchema: {
    type: "object",
    properties: {
      campaign: {
        type: "string",
        description: "Trailer campaign or game title",
      },
      tone: {
        type: "string",
        description: "Tone direction such as cinematic, gritty, upbeat",
      },
      beats: {
        type: "array",
        items: { type: "string" },
        description: "Key trailer beats in sequence",
      },
    },
    required: ["campaign", "tone", "beats"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { campaign, tone, beats } = input as {
      campaign: string;
      tone: string;
      beats: string[];
    };

    return {
      success: true,
      tool: "plan-trailer-rolls",
      campaign,
      ...buildABRollPlan(campaign, tone, beats),
    };
  },
};
