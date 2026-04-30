import { SwarmOrchestrator } from "./services/SwarmOrchestrator.js";
import { MemorySystem } from "./services/MemorySystem.js";
import { TaskOrchestrator } from "./services/TaskOrchestrator.js";
import { CacheService } from "./services/CacheService.js";
import { EmailService } from "./services/EmailService.js";
import {
  synchronizeProjectState,
  queryProjectCache,
  coordinateAgents,
  analyzePerformance,
  sendEmail,
  sendBulkEmail,
  sendMarketingCampaign,
  verifyEmailConfiguration,
} from "./tools/index.js";

export function createSyncPulseSkill() {
  const swarm = new SwarmOrchestrator();
  const memory = new MemorySystem();
  const tasks = new TaskOrchestrator();
  const cache = new CacheService();
  const emailService = new EmailService();

  return {
    name: "syncpulse",
    description: "SyncPulse - Intelligent multi-agent coordination, caching, project state synchronization, and secure email automation for marketing teams",
    version: "1.0.0",
    organization: "Fused-Gaming",
    tools: [
      {
        name: "synchronize_project_state",
        description: "Synchronize and cache current project state across all agents",
        inputSchema: {
          type: "object",
          properties: {
            projectId: { type: "string", description: "Project identifier" },
            includeGit: { type: "boolean", description: "Include git state" },
            cacheTTL: { type: "number", description: "Cache TTL in ms" },
          },
          required: ["projectId"],
        },
        handler: synchronizeProjectState(cache, memory),
      },
      {
        name: "query_cache",
        description: "Query the distributed project cache with vector similarity",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Cache query" },
            limit: { type: "number", description: "Result limit" },
          },
          required: ["query"],
        },
        handler: queryProjectCache(cache, memory),
      },
      {
        name: "coordinate_agents",
        description: "Coordinate multi-agent execution with task routing",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: { type: "string" },
            topology: {
              type: "string",
              enum: ["hierarchical", "mesh", "adaptive"],
            },
            tasks: { type: "array", description: "Task definitions" },
          },
          required: ["workflowId", "topology", "tasks"],
        },
        handler: coordinateAgents(swarm, tasks),
      },
      {
        name: "analyze_performance",
        description: "Analyze swarm and cache performance metrics",
        inputSchema: {
          type: "object",
          properties: {
            timeRange: { type: "string", description: "Time range (e.g., '1h', '24h')" },
            metrics: {
              type: "array",
              items: { type: "string" },
              description: "Metrics to analyze",
            },
          },
          required: ["timeRange"],
        },
        handler: analyzePerformance(swarm, memory),
      },
      {
        name: "send_email",
        description: "Send secure emails using nodemailer with template variable interpolation",
        inputSchema: {
          type: "object",
          properties: {
            recipients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string", description: "Recipient email address" },
                  name: { type: "string", description: "Recipient name (optional)" },
                },
                required: ["email"],
              },
              description: "List of email recipients",
            },
            subject: { type: "string", description: "Email subject" },
            htmlBody: { type: "string", description: "HTML email body with {{variable}} placeholders" },
            textBody: { type: "string", description: "Plain text email body (optional)" },
            variables: {
              type: "object",
              description: "Template variables for subject and body interpolation",
            },
          },
          required: ["recipients", "subject", "htmlBody"],
        },
        handler: sendEmail(emailService),
      },
      {
        name: "send_bulk_email",
        description: "Send bulk emails to multiple recipients with per-recipient and global variables",
        inputSchema: {
          type: "object",
          properties: {
            recipients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string", description: "Recipient email address" },
                  name: { type: "string", description: "Recipient name (optional)" },
                  variables: {
                    type: "object",
                    description: "Per-recipient template variables",
                  },
                },
                required: ["email"],
              },
              description: "List of recipients with optional per-recipient variables",
            },
            subject: { type: "string", description: "Email subject" },
            htmlBody: { type: "string", description: "HTML email body" },
            textBody: { type: "string", description: "Plain text email body (optional)" },
            globalVariables: {
              type: "object",
              description: "Global variables applied to all recipients",
            },
          },
          required: ["recipients", "subject", "htmlBody"],
        },
        handler: sendBulkEmail(emailService),
      },
      {
        name: "send_marketing_campaign",
        description: "Send marketing campaign emails with optional tracking pixel for marketing teams",
        inputSchema: {
          type: "object",
          properties: {
            campaignName: { type: "string", description: "Name of the marketing campaign" },
            recipients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string", description: "Recipient email address" },
                  name: { type: "string", description: "Recipient name (optional)" },
                  variables: {
                    type: "object",
                    description: "Per-recipient template variables",
                  },
                },
                required: ["email"],
              },
              description: "List of campaign recipients",
            },
            subject: { type: "string", description: "Campaign email subject" },
            htmlBody: { type: "string", description: "Campaign HTML email body" },
            textBody: { type: "string", description: "Campaign plain text body (optional)" },
            trackingPixel: {
              type: "boolean",
              description: "Enable tracking pixel for email open analytics (default: false)",
            },
          },
          required: ["campaignName", "recipients", "subject", "htmlBody"],
        },
        handler: sendMarketingCampaign(emailService),
      },
      {
        name: "verify_email_configuration",
        description: "Verify email service configuration and connection status",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: verifyEmailConfiguration(emailService),
      },
    ],
    services: {
      swarm,
      memory,
      tasks,
      cache,
      email: emailService,
    },
  };
}

export { SwarmOrchestrator, MemorySystem, TaskOrchestrator, CacheService, EmailService };
export * from "./types/index.js";
