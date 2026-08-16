/**
 * Skill Repository MCP Server
 * HTTP-based MCP server for skill management and tooling
 * Endpoint: https://skill.vln.gg/mcp
 */

import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { Skill } from "../types.js";
import { SkillRegistry } from "../skill-registry.js";
import { loadConfig } from "../config.js";

interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;
  tags?: string[];
  toolCount: number;
}

interface ToolDefinition {
  name: string;
  description: string;
  skillName: string;
  inputSchema?: unknown;
}

export class SkillRepositoryServer {
  private app: express.Application;
  private server: Server;
  private registry: SkillRegistry;
  private skillCache: Map<string, SkillMetadata> = new Map();
  private toolCache: Map<string, ToolDefinition> = new Map();
  private port: number;
  private apiKey: string;

  constructor(port: number = 3003, apiKey: string = "") {
    this.app = express();
    this.port = port;
    this.apiKey = apiKey || process.env.SKILL_MCP_API_KEY || "default-dev-key";
    this.server = new Server(
      {
        name: "skill-repository-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );
    this.registry = new SkillRegistry();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());

    // Authentication middleware
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const auth = req.headers.authorization;
      if (this.apiKey && auth !== `Bearer ${this.apiKey}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    });

    // Error handling middleware
    this.app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("[SkillRepository] Error:", err.message);
      res.status(500).json({ error: err.message });
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get("/mcp/health", (_req: express.Request, res: express.Response) => {
      res.json({
        status: "healthy",
        service: "skill-repository-mcp",
        timestamp: new Date().toISOString(),
      });
    });

    // MCP SSE endpoint
    this.app.get("/mcp", (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const messageId = Math.random().toString(36).substr(2, 9);
      console.log(`[SkillRepository] SSE client connected: ${messageId}`);

      // Send server info
      res.write(`data: ${JSON.stringify({
        type: "server-info",
        name: "skill-repository-mcp",
        version: "1.0.0",
      })}\n\n`);

      // Handle client disconnect
      req.on("close", () => {
        console.log(`[SkillRepository] SSE client disconnected: ${messageId}`);
        res.end();
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        res.write(": keep-alive\n\n");
      }, 30000);

      req.on("close", () => clearInterval(keepAlive));
    });

    // List all skills
    this.app.get("/mcp/skills", (_req: express.Request, res: express.Response) => {
      const skills = Array.from(this.skillCache.values());

      res.json({
        skills,
        total: skills.length,
        timestamp: new Date().toISOString(),
      });
    });

    // Get skill by name
    this.app.get("/mcp/skills/:skillName", (req: express.Request, res: express.Response) => {
      const skill = this.skillCache.get(req.params.skillName);

      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json(skill);
    });

    // Search skills
    this.app.get("/mcp/skills/search", (req: express.Request, res: express.Response) => {
      const query = (req.query.q as string || "").toLowerCase();
      const tag = req.query.tag as string;

      let results = Array.from(this.skillCache.values());

      if (query) {
        results = results.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        );
      }

      if (tag) {
        results = results.filter((s) => s.tags?.includes(tag));
      }

      res.json({
        results,
        total: results.length,
        timestamp: new Date().toISOString(),
      });
    });

    // Register skill
    this.app.post("/mcp/skills/register", (req: express.Request, res: express.Response) => {
      const { name, version, description, author, license, tags } = req.body;

      if (!name || !version) {
        return res.status(400).json({ error: "Missing name or version" });
      }

      const metadata: SkillMetadata = {
        name,
        version,
        description: description || "",
        author,
        license,
        tags: tags || [],
        toolCount: 0,
      };

      this.skillCache.set(name, metadata);

      console.log(`[SkillRepository] Skill registered: ${name} (${version})`);

      res.json({
        success: true,
        skill: metadata,
        timestamp: new Date().toISOString(),
      });
    });

    // List all tools
    this.app.get("/mcp/tools", (req: express.Request, res: express.Response) => {
      const skillName = req.query.skill as string;
      let tools = Array.from(this.toolCache.values());

      if (skillName) {
        tools = tools.filter((t) => t.skillName === skillName);
      }

      res.json({
        tools,
        total: tools.length,
        timestamp: new Date().toISOString(),
      });
    });

    // Get tool by name
    this.app.get("/mcp/tools/:toolName", (req: express.Request, res: express.Response) => {
      const tool = this.toolCache.get(req.params.toolName);

      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.json(tool);
    });

    // Search tools
    this.app.get("/mcp/tools/search", (req: express.Request, res: express.Response) => {
      const query = (req.query.q as string || "").toLowerCase();
      const skillName = req.query.skill as string;

      let results = Array.from(this.toolCache.values());

      if (query) {
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
        );
      }

      if (skillName) {
        results = results.filter((t) => t.skillName === skillName);
      }

      res.json({
        results,
        total: results.length,
        timestamp: new Date().toISOString(),
      });
    });

    // Register tool
    this.app.post("/mcp/tools/register", (req: express.Request, res: express.Response) => {
      const { name, description, skillName, inputSchema } = req.body;

      if (!name || !skillName) {
        return res.status(400).json({ error: "Missing name or skillName" });
      }

      const tool: ToolDefinition = {
        name,
        description: description || "",
        skillName,
        inputSchema,
      };

      this.toolCache.set(name, tool);

      console.log(`[SkillRepository] Tool registered: ${name} (from ${skillName})`);

      res.json({
        success: true,
        tool,
        timestamp: new Date().toISOString(),
      });
    });

    // Execute skill (placeholder)
    this.app.post("/mcp/skills/:skillName/execute", (req: express.Request, res: express.Response) => {
      const skillName = req.params.skillName;
      const { tool, input } = req.body;

      if (!tool || !input) {
        return res.status(400).json({ error: "Missing tool or input" });
      }

      console.log(`[SkillRepository] Executing tool: ${tool} from skill: ${skillName}`);

      res.json({
        success: true,
        skillName,
        tool,
        result: { message: "Tool execution started" },
        timestamp: new Date().toISOString(),
      });
    });

    // Get metadata for all registered skills
    this.app.get("/mcp/metadata/skills", (_req: express.Request, res: express.Response) => {
      res.json({
        availableSkills: Array.from(this.skillCache.values()).map((s) => ({
          name: s.name,
          version: s.version,
        })),
        totalSkills: this.skillCache.size,
        totalTools: this.toolCache.size,
        timestamp: new Date().toISOString(),
      });
    });
  }

  async initialize(): Promise<void> {
    const config = loadConfig();

    // Load enabled skills
    const skillsToLoad = config.skills.enabled || [];

    console.log(`[SkillRepository] Initializing ${skillsToLoad.length} skill(s)...`);

    for (const skillName of skillsToLoad) {
      const skill = await this.registry.loadSkill(skillName, config.auth);
      if (skill) {
        this.registerSkillInCache(skill);
      }
    }

    console.log(
      `[SkillRepository] ✓ Server initialized with ${this.registry.listSkills().length} skill(s)`
    );
  }

  private registerSkillInCache(skill: Skill): void {
    if (!skill.tools || skill.tools.length === 0) {
      console.warn(`[SkillRepository] Skill '${skill.name}' has no tools`);
      return;
    }

    const metadata: SkillMetadata = {
      name: skill.name,
      version: skill.version || "1.0.0",
      description: skill.description || "",
      tags: skill.tags || [],
      toolCount: skill.tools.length,
    };

    this.skillCache.set(skill.name, metadata);

    // Cache tools
    for (const tool of skill.tools) {
      const toolDef: ToolDefinition = {
        name: tool.name,
        description: tool.description || "",
        skillName: skill.name,
        inputSchema: tool.inputSchema,
      };
      this.toolCache.set(tool.name, toolDef);
    }

    console.log(`[SkillRepository] Cached ${skill.tools.length} tool(s) from '${skill.name}'`);
  }

  async start(): Promise<void> {
    await this.initialize();

    this.app.listen(this.port, () => {
      console.log(`[SkillRepository] ✓ Server running on port ${this.port}`);
      console.log(`[SkillRepository] Available at: http://localhost:${this.port}/mcp`);
    });
  }
}

// Export for direct instantiation
export default SkillRepositoryServer;
