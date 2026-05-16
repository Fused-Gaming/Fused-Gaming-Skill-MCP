import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SkillRegistry } from "./skill-registry.js";
import { loadConfig } from "./config.js";
class FusedGamingMCPServer {
    constructor() {
        this.server = new Server({
            name: "fused-gaming-mcp",
            version: "1.0.0",
        }, {
            capabilities: {},
        });
        this.registry = new SkillRegistry();
    }
    async initialize() {
        const config = loadConfig();
        const skillsToLoad = config.skills.enabled || [
            "algorithmic-art",
            "ascii-mockup",
            "canvas-design",
        ];
        console.log(`[FusedGamingMCP] Initializing ${skillsToLoad.length} skill(s)...`);
        for (const skillName of skillsToLoad) {
            const skill = await this.registry.loadSkill(skillName, config.auth);
            if (skill) {
                this.registerSkillTools(skill);
            }
        }
        console.log(`[FusedGamingMCP] ✓ Server initialized with ${this.registry.listSkills().length} skill(s)`);
    }
    registerSkillTools(skill) {
        if (!skill.tools || skill.tools.length === 0) {
            console.warn(`[FusedGamingMCP] Skill '${skill.name}' has no tools`);
            return;
        }
        for (const tool of skill.tools) {
            this.server.setRequestHandler({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
            }, async (input) => {
                try {
                    const result = await tool.handler(input);
                    return {
                        content: [
                            {
                                type: "text",
                                text: typeof result === "string" ? result : JSON.stringify(result),
                            },
                        ],
                    };
                }
                catch (error) {
                    const err = error instanceof Error ? error.message : String(error);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${err}`,
                            },
                        ],
                        isError: true,
                    };
                }
            });
        }
        console.log(`[FusedGamingMCP] Registered ${skill.tools.length} tool(s) from '${skill.name}'`);
    }
    async run() {
        await this.initialize();
        const transport = new StdioServerTransport();
        console.log("[FusedGamingMCP] Connecting to transport...");
        await this.server.connect(transport);
        console.log("[FusedGamingMCP] ✓ Server running");
    }
    async shutdown() {
        await this.registry.unloadAll();
        console.log("[FusedGamingMCP] Server shutdown complete");
    }
}
const serverInstance = new FusedGamingMCPServer();
process.on("SIGINT", async () => {
    console.log("[FusedGamingMCP] Shutting down gracefully...");
    await serverInstance.shutdown();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("[FusedGamingMCP] Shutting down gracefully...");
    await serverInstance.shutdown();
    process.exit(0);
});
serverInstance.run().catch((error) => {
    console.error("[FusedGamingMCP] Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map