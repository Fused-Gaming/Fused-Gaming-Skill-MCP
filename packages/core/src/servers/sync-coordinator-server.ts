/**
 * Sync Coordinator MCP Server
 * HTTP-based MCP server for synchronization and task coordination
 * Endpoint: https://sync.vln.gg/mcp
 */

import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { type Transport } from "@modelcontextprotocol/sdk/shared/types.js";
import type { Skill } from "../types.js";
import { SkillRegistry } from "../skill-registry.js";
import { loadConfig } from "../config.js";

interface SyncTaskRequest {
  taskId: string;
  type: "sync" | "coordinate" | "workflow-state";
  payload: unknown;
  agentId?: string;
  priority?: "low" | "normal" | "high";
}

interface CoordinationEvent {
  type: string;
  agentId: string;
  timestamp: number;
  data: unknown;
}

export class SyncCoordinatorServer {
  private app: express.Application;
  private server: Server;
  private registry: SkillRegistry;
  private taskQueue: Map<string, SyncTaskRequest> = new Map();
  private eventBus: CoordinationEvent[] = [];
  private port: number;
  private apiKey: string;

  constructor(port: number = 3002, apiKey: string = "") {
    this.app = express();
    this.port = port;
    this.apiKey = apiKey || process.env.SYNC_MCP_API_KEY || "default-dev-key";
    this.server = new Server(
      {
        name: "sync-coordinator-mcp",
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
    this.app.use((req, res, next) => {
      const auth = req.headers.authorization;
      if (this.apiKey && auth !== `Bearer ${this.apiKey}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    });

    // Error handling middleware
    this.app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("[SyncCoordinator] Error:", err.message);
      res.status(500).json({ error: err.message });
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get("/mcp/health", (_req, res) => {
      res.json({
        status: "healthy",
        service: "sync-coordinator-mcp",
        timestamp: new Date().toISOString(),
      });
    });

    // MCP SSE endpoint
    this.app.get("/mcp", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const messageId = Math.random().toString(36).substr(2, 9);
      console.log(`[SyncCoordinator] SSE client connected: ${messageId}`);

      // Send server info
      res.write(`data: ${JSON.stringify({
        type: "server-info",
        name: "sync-coordinator-mcp",
        version: "1.0.0",
      })}\n\n`);

      // Handle client disconnect
      req.on("close", () => {
        console.log(`[SyncCoordinator] SSE client disconnected: ${messageId}`);
        res.end();
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        res.write(": keep-alive\n\n");
      }, 30000);

      req.on("close", () => clearInterval(keepAlive));
    });

    // Sync tasks endpoint
    this.app.post("/mcp/tasks/sync", (req, res) => {
      const taskRequest = req.body as SyncTaskRequest;

      if (!taskRequest.taskId || !taskRequest.type) {
        return res.status(400).json({ error: "Missing taskId or type" });
      }

      this.taskQueue.set(taskRequest.taskId, taskRequest);

      console.log(`[SyncCoordinator] Task synced: ${taskRequest.taskId} (${taskRequest.type})`);

      res.json({
        success: true,
        taskId: taskRequest.taskId,
        timestamp: new Date().toISOString(),
      });
    });

    // Get sync status
    this.app.get("/mcp/sync/status", (_req, res) => {
      res.json({
        pendingTasks: this.taskQueue.size,
        eventQueueSize: this.eventBus.length,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    // Coordination event publication
    this.app.post("/mcp/events/publish", (req, res) => {
      const event = req.body as CoordinationEvent;

      if (!event.type || !event.agentId) {
        return res.status(400).json({ error: "Missing event type or agentId" });
      }

      event.timestamp = event.timestamp || Date.now();
      this.eventBus.push(event);

      console.log(`[SyncCoordinator] Event published: ${event.type} from agent ${event.agentId}`);

      res.json({
        success: true,
        eventId: `${event.agentId}-${event.timestamp}`,
        timestamp: new Date().toISOString(),
      });
    });

    // Get coordination events
    this.app.get("/mcp/events", (req, res) => {
      const agentId = req.query.agentId as string;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);

      let events = this.eventBus;
      if (agentId) {
        events = events.filter((e) => e.agentId === agentId);
      }

      res.json({
        events: events.slice(-limit),
        total: events.length,
        timestamp: new Date().toISOString(),
      });
    });

    // Get task by ID
    this.app.get("/mcp/tasks/:taskId", (req, res) => {
      const task = this.taskQueue.get(req.params.taskId);

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    });

    // Tools listing
    this.app.get("/mcp/tools", (_req, res) => {
      res.json({
        tools: [
          {
            name: "sync-tasks",
            description: "Synchronize task execution across agents",
          },
          {
            name: "coordinate-agents",
            description: "Coordinate actions between multiple agents",
          },
          {
            name: "manage-workflow-state",
            description: "Manage and track workflow state",
          },
          {
            name: "publish-coordination-event",
            description: "Publish coordination events to the bus",
          },
          {
            name: "subscribe-to-events",
            description: "Subscribe to coordination events",
          },
          {
            name: "get-sync-status",
            description: "Get current synchronization status",
          },
        ],
      });
    });
  }

  async initialize(): Promise<void> {
    const config = loadConfig();

    // Load coordination-related skills if available
    const skillsToLoad = config.skills.enabled || ["claude-flow"];

    console.log(`[SyncCoordinator] Initializing ${skillsToLoad.length} skill(s)...`);

    for (const skillName of skillsToLoad) {
      const skill = await this.registry.loadSkill(skillName, config.auth);
      if (skill) {
        this.registerSkillTools(skill);
      }
    }

    console.log(
      `[SyncCoordinator] ✓ Server initialized with ${this.registry.listSkills().length} skill(s)`
    );
  }

  private registerSkillTools(skill: Skill): void {
    if (!skill.tools || skill.tools.length === 0) {
      console.warn(`[SyncCoordinator] Skill '${skill.name}' has no tools`);
      return;
    }

    console.log(`[SyncCoordinator] Registered ${skill.tools.length} tool(s) from '${skill.name}'`);
  }

  async start(): Promise<void> {
    await this.initialize();

    this.app.listen(this.port, () => {
      console.log(`[SyncCoordinator] ✓ Server running on port ${this.port}`);
      console.log(`[SyncCoordinator] Available at: http://localhost:${this.port}/mcp`);
    });
  }
}

// Export for direct instantiation
export default SyncCoordinatorServer;
