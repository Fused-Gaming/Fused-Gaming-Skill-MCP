/**
 * UX Journeymapper Tool
 * Create UX journey maps with pain points, touchpoints, and opportunities.
 */

import type { ToolDefinition } from "@fused-gaming/mcp-core";

type JourneyStage = {
  phase: string;
  userGoal: string;
  touchpoints: string[];
  painPoints: string[];
  opportunities: string[];
  successSignals: string[];
};

const DEFAULT_PHASES = ["Discover", "Plan", "Execute", "Monitor", "Adapt"];

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildGenericStage(phase: string, objective: string, persona: string): JourneyStage {
  return {
    phase,
    userGoal: `${persona} needs to ${objective.toLowerCase()} during ${phase.toLowerCase()}.`,
    touchpoints: [
      `${phase} dashboard`,
      "Contextual guidance panel",
      "Team collaboration timeline",
    ],
    painPoints: [
      "Too many disconnected actions across systems",
      "Low confidence about outcomes before execution",
      "No clear feedback loop after task completion",
    ],
    opportunities: [
      "Provide progressive disclosure for advanced controls",
      "Surface confidence and risk indicators for each action",
      "Add one-click handoff notes for collaborators",
    ],
    successSignals: [
      "Task completion time decreases",
      "Fewer manual retries are needed",
      "Users can explain the next best action clearly",
    ],
  };
}

function buildArmyCommandStage(phase: string): JourneyStage {
  const templates: Record<string, JourneyStage> = {
    Discover: {
      phase,
      userGoal: "Commander identifies mission state and available units in under 10 seconds.",
      touchpoints: ["Mission overview map", "Squad roster panel", "Intel alert feed"],
      painPoints: [
        "Map and roster are separated, forcing context switching",
        "Threat indicators are noisy and not prioritized",
      ],
      opportunities: [
        "Overlay squad readiness directly on the map",
        "Rank alerts by urgency and strategic impact",
      ],
      successSignals: ["Commander can summarize battlefield status quickly"],
    },
    Plan: {
      phase,
      userGoal: "Commander defines formation, objectives, and contingencies before deployment.",
      touchpoints: ["Drag-and-drop formation editor", "Objective queue", "Resource allocation panel"],
      painPoints: [
        "Formation edits are not validated against terrain constraints",
        "No preview of downstream resource conflicts",
      ],
      opportunities: [
        "Add constraint-aware placement hints",
        "Provide what-if simulation before confirming orders",
      ],
      successSignals: ["Orders are approved with fewer revisions"],
    },
    Execute: {
      phase,
      userGoal: "Commander deploys coordinated orders with clear confirmation and rollback options.",
      touchpoints: ["Command center console", "Unit channel broadcast", "Execution confirmation modal"],
      painPoints: [
        "Bulk actions are hard to verify before submission",
        "Rollback steps are unclear during high-pressure moments",
      ],
      opportunities: [
        "Introduce staged command preview",
        "Add two-click rollback and command audit trail",
      ],
      successSignals: ["Execution errors drop and rollback time is under 30 seconds"],
    },
    Monitor: {
      phase,
      userGoal: "Commander tracks progress and health signals without losing strategic context.",
      touchpoints: ["Live telemetry board", "Map heat layers", "Event timeline"],
      painPoints: [
        "Important state changes are buried in event noise",
        "Telemetry lacks link back to active objectives",
      ],
      opportunities: [
        "Group events by objective and squad",
        "Pin KPI thresholds with auto-highlighting",
      ],
      successSignals: ["Critical events are acknowledged within SLA"],
    },
    Adapt: {
      phase,
      userGoal: "Commander rapidly reorients squads using updated intelligence and recovered lessons.",
      touchpoints: ["Adaptive strategy panel", "Retrospective notes", "Recommendation engine"],
      painPoints: [
        "Manual re-planning is slow under changing conditions",
        "Past lessons are not surfaced during replanning",
      ],
      opportunities: [
        "Generate suggested pivots from current telemetry",
        "Auto-inject relevant past playbooks into planning",
      ],
      successSignals: ["Replan-to-execution cycle time improves each mission"],
    },
  };

  return templates[phase] ?? buildGenericStage(phase, "coordinate operations", "the team");
}

export const MapUserJourneyTool: ToolDefinition = {
  name: "map-user-journey",
  description: "Create UX journey maps with pain points, touchpoints, and opportunities.",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description: "Primary objective for this tool invocation",
      },
      context: {
        type: "string",
        description: "Optional contextual details",
      },
      persona: {
        type: "string",
        description: "Primary user persona (for example: commander, squad lead, player)",
      },
      phases: {
        type: "string",
        description: "Optional comma-separated list of journey phases to map",
      },
    },
    required: ["objective"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const objective = normalize(input.objective);
    const context = normalize(input.context);
    const persona = normalize(input.persona) || "User";
    const phaseInput = normalize(input.phases);

    if (!objective) {
      return {
        success: false,
        tool: "map-user-journey",
        error: "objective is required and must be a non-empty string.",
      };
    }

    const phases = phaseInput ? splitCsv(phaseInput) : DEFAULT_PHASES;
    const armyContext = `${objective} ${context}`.toLowerCase();
    const isArmyOrchestration = ["army", "squad", "troop", "commander", "orchestrate"].some((token) =>
      armyContext.includes(token),
    );

    const stages = phases.map((phase) =>
      isArmyOrchestration ? buildArmyCommandStage(phase) : buildGenericStage(phase, objective, persona),
    );

    return {
      success: true,
      tool: "map-user-journey",
      objective,
      context,
      persona,
      journeyType: isArmyOrchestration ? "command-and-control" : "general-ux",
      stages,
      summary: {
        phaseCount: stages.length,
        topThemes: isArmyOrchestration
          ? ["situational awareness", "command confidence", "rapid adaptation"]
          : ["clarity", "feedback loops", "collaboration"],
        recommendedNextStep: "Prioritize the highest-risk pain point and prototype one interface improvement.",
      },
    };
  },
};
