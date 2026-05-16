function extractStages(objective) {
    const stagePatterns = [
        /awareness|discovery|research/i,
        /consideration|evaluation|comparison/i,
        /purchase|checkout|transaction/i,
        /delivery|onboarding|setup/i,
        /usage|engagement|daily use/i,
        /support|troubleshooting|help/i,
        /retention|loyalty|advocacy/i,
        /churn|exit|cancellation/i,
    ];
    const defaultStages = [
        "Awareness",
        "Consideration",
        "Decision",
        "Onboarding",
        "Usage",
        "Support",
        "Retention",
    ];
    const mentionedStages = [];
    stagePatterns.forEach((pattern, index) => {
        if (pattern.test(objective)) {
            const stageNames = [
                "Awareness",
                "Consideration",
                "Purchase",
                "Onboarding",
                "Usage",
                "Support",
                "Retention",
                "Churn",
            ];
            mentionedStages.push(stageNames[index]);
        }
    });
    return mentionedStages.length > 0 ? mentionedStages : defaultStages.slice(0, 5);
}
function generateTouchpoints(stage, _objective, _context) {
    const stageLower = stage.toLowerCase();
    const touchpointMap = {
        awareness: [
            "Social media ads",
            "Search engine",
            "Word of mouth",
            "Marketing campaign",
            "Product review site",
        ],
        consideration: [
            "Website landing page",
            "Product comparison",
            "Customer reviews",
            "Sales call",
            "Email newsletter",
        ],
        decision: [
            "Pricing page",
            "Checkout flow",
            "Sales representative",
            "Trial version",
            "Money-back guarantee",
        ],
        purchase: [
            "Payment gateway",
            "Order confirmation",
            "Invoice",
            "Receipt email",
            "Purchase confirmation",
        ],
        onboarding: [
            "Welcome email",
            "Onboarding tutorial",
            "Setup wizard",
            "Documentation",
            "Support chat",
        ],
        usage: [
            "Dashboard",
            "Feature exploration",
            "Mobile app",
            "Help documentation",
            "Community forum",
        ],
        support: [
            "Help center",
            "Chat support",
            "Email support",
            "Knowledge base",
            "Video tutorials",
        ],
        retention: [
            "Personalized recommendations",
            "Loyalty program",
            "Email campaigns",
            "In-app notifications",
            "Premium features",
        ],
    };
    return touchpointMap[stageLower] || [
        "Customer interaction",
        "Digital touchpoint",
        "Service experience",
        "Support channel",
        "Communication point",
    ];
}
function generatePainPoints(stage, _objective) {
    const stageLower = stage.toLowerCase();
    const painPointMap = {
        awareness: [
            "Not finding product online",
            "Competitor visibility",
            "Information overload",
            "Trust concerns",
        ],
        consideration: [
            "Lack of information",
            "Pricing confusion",
            "Comparison difficulty",
            "Customer testimonial absence",
        ],
        decision: [
            "Complex checkout",
            "Payment issues",
            "Cart abandonment",
            "Unclear terms",
        ],
        purchase: [
            "Payment failure",
            "Slow processing",
            "Confirmation delays",
            "Unclear next steps",
        ],
        onboarding: [
            "Complex setup",
            "Lack of guidance",
            "Feature confusion",
            "Initial friction",
        ],
        usage: [
            "Feature discovery",
            "Performance issues",
            "Unclear workflows",
            "Limited customization",
        ],
        support: [
            "Long wait times",
            "Unresolved issues",
            "Poor documentation",
            "Difficult navigation",
        ],
        retention: [
            "Feature stagnation",
            "Poor user engagement",
            "Competitive alternatives",
            "Value erosion",
        ],
    };
    return painPointMap[stageLower] || [
        "User frustration",
        "Process inefficiency",
        "Communication gap",
        "Unmet expectation",
    ];
}
function generateOpportunities(stage, objective, painPoints) {
    const opportunities = [];
    painPoints.forEach((painPoint) => {
        const lower = painPoint.toLowerCase();
        if (lower.includes("complex") ||
            lower.includes("confusion") ||
            lower.includes("unclear")) {
            opportunities.push("Simplify user experience");
            opportunities.push("Improve documentation");
        }
        if (lower.includes("wait") || lower.includes("slow")) {
            opportunities.push("Optimize performance");
            opportunities.push("Reduce friction");
        }
        if (lower.includes("communication") || lower.includes("information")) {
            opportunities.push("Enhance messaging");
            opportunities.push("Provide guidance");
        }
        if (lower.includes("engagement")) {
            opportunities.push("Increase feature adoption");
            opportunities.push("Create engagement hooks");
        }
    });
    opportunities.push("Gather user feedback");
    opportunities.push("Monitor metrics");
    opportunities.push("A/B test improvements");
    return Array.from(new Set(opportunities)).slice(0, 5);
}
function generateEmotions(stage) {
    const emotionMap = {
        awareness: ["Curious", "Interested", "Skeptical"],
        consideration: ["Cautious", "Evaluating", "Hopeful"],
        decision: ["Uncertain", "Decisive", "Excited"],
        purchase: ["Confident", "Satisfied", "Eager"],
        onboarding: ["Hopeful", "Overwhelmed", "Engaged"],
        usage: ["Satisfied", "Productive", "Confident"],
        support: ["Frustrated", "Seeking help", "Grateful"],
        retention: ["Loyal", "Engaged", "Valued"],
    };
    return (emotionMap[stage.toLowerCase()] || [
        "Neutral",
        "Engaged",
        "Positive",
        "Concerned",
    ]);
}
function generateKeyInsights(stages) {
    const insights = [];
    const allPainPoints = stages.flatMap((s) => s.painPoints);
    const commonIssues = allPainPoints.filter((p, i) => allPainPoints.indexOf(p) === i);
    if (commonIssues.length > 0) {
        insights.push(`Key friction points identified: ${commonIssues.slice(0, 2).join(", ")}`);
    }
    const allOpportunities = stages.flatMap((s) => s.opportunities);
    const topOpportunities = Array.from(new Set(allOpportunities.map((o) => o.toLowerCase())));
    if (topOpportunities.length > 0) {
        insights.push(`Primary improvement areas: ${topOpportunities.slice(0, 2).join(", ")}`);
    }
    insights.push("Recommended: Conduct user research interviews");
    insights.push("Recommended: Implement feedback collection mechanisms");
    insights.push("Recommended: Track metrics across journey stages");
    return insights.slice(0, 5);
}
export const MapUserJourneyTool = {
    name: "map-user-journey",
    description: "Create comprehensive UX journey maps with pain points, touchpoints, and opportunities for improvement.",
    inputSchema: {
        type: "object",
        properties: {
            objective: {
                type: "string",
                description: "Description of the user journey to map (e.g., 'E-commerce customer journey from awareness to retention')",
            },
            context: {
                type: "string",
                description: "Optional persona or additional context (e.g., 'Budget-conscious millennial')",
            },
        },
        required: ["objective"],
    },
    async handler(input) {
        try {
            const { objective = "", context = "" } = input;
            if (!objective || objective.trim().length === 0) {
                return {
                    success: false,
                    error: "objective parameter is required and must not be empty",
                };
            }
            const stages = extractStages(objective);
            const journeyStages = stages.map((stage) => {
                const touchpoints = generateTouchpoints(stage, objective, context);
                const painPoints = generatePainPoints(stage, objective);
                const opportunities = generateOpportunities(stage, objective, painPoints);
                const emotions = generateEmotions(stage);
                return {
                    stage,
                    description: `${stage} phase of the customer journey`,
                    touchpoints,
                    emotions,
                    painPoints,
                    opportunities,
                };
            });
            const keyInsights = generateKeyInsights(journeyStages);
            const result = {
                success: true,
                persona: context || "General User",
                goal: objective,
                stages: journeyStages,
                summary: `Journey map for: ${objective}. Identified ${journeyStages.length} key stages with ${journeyStages.reduce((acc, s) => acc + s.touchpoints.length, 0)} total touchpoints.`,
                keyInsights,
            };
            return result;
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: `Failed to generate journey map: ${err}`,
            };
        }
    },
};
//# sourceMappingURL=map-user-journey.js.map