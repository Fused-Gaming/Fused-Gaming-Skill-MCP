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
  sendMagicLink,
  sendMFACode,
  sendPasswordReset,
  sendSecurityAlert,
  sendInvoice,
  sendNewsletter,
  sendOutageNotice,
  sendMaintenanceNotice,
  sendTicketUpdate,
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
      // Authentication & Security Workflows
      {
        name: "send_magic_link_login",
        description: "Send magic link login email for passwordless authentication",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Recipient email address" },
            name: { type: "string", description: "Recipient name (optional)" },
            magicLink: { type: "string", description: "Login link URL" },
            expiryMinutes: { type: "string", description: "Link expiry time (default: 30)" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Dashboard URL" },
          },
          required: ["email", "magicLink"],
        },
        handler: sendMagicLink(emailService),
      },
      {
        name: "send_mfa_code",
        description: "Send MFA verification code via email",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Recipient email address" },
            name: { type: "string", description: "Recipient name (optional)" },
            mfaCode: { type: "string", description: "MFA verification code" },
            expiryMinutes: { type: "string", description: "Code expiry time (default: 10)" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Dashboard URL" },
          },
          required: ["email", "mfaCode"],
        },
        handler: sendMFACode(emailService),
      },
      {
        name: "send_password_reset",
        description: "Send password reset email",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Recipient email address" },
            name: { type: "string", description: "Recipient name (optional)" },
            resetLink: { type: "string", description: "Password reset link URL" },
            expiryHours: { type: "string", description: "Link expiry time in hours (default: 24)" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Dashboard URL" },
          },
          required: ["email", "resetLink"],
        },
        handler: sendPasswordReset(emailService),
      },
      {
        name: "send_security_alert",
        description: "Send account security alert notification",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Recipient email address" },
            name: { type: "string", description: "Recipient name (optional)" },
            alertType: { type: "string", description: "Type of security event (e.g., 'Unusual login', 'Password changed')" },
            timestamp: { type: "string", description: "Event timestamp (ISO format)" },
            location: { type: "string", description: "Location of security event (optional)" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Dashboard URL" },
          },
          required: ["email", "alertType"],
        },
        handler: sendSecurityAlert(emailService),
      },
      // Business Workflows
      {
        name: "send_invoice",
        description: "Send invoice email to customer",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Customer email address" },
            name: { type: "string", description: "Customer name (optional)" },
            invoiceNumber: { type: "string", description: "Invoice identifier" },
            amount: { type: "string", description: "Invoice amount with currency (e.g., '$1,234.56')" },
            dueDate: { type: "string", description: "Payment due date" },
            invoiceLink: { type: "string", description: "Link to full invoice" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Billing/support contact email" },
          },
          required: ["email", "invoiceNumber", "amount", "dueDate", "invoiceLink"],
        },
        handler: sendInvoice(emailService),
      },
      {
        name: "send_newsletter",
        description: "Send newsletter to multiple subscribers",
        inputSchema: {
          type: "object",
          properties: {
            recipients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                },
                required: ["email"],
              },
              description: "List of newsletter subscribers",
            },
            title: { type: "string", description: "Newsletter title/subject" },
            contentHtml: { type: "string", description: "HTML newsletter content" },
            unsubscribeLink: { type: "string", description: "Unsubscribe link URL" },
            companyName: { type: "string", description: "Company name for branding" },
            dashboardUrl: { type: "string", description: "Dashboard/settings URL" },
          },
          required: ["recipients", "title", "contentHtml", "unsubscribeLink"],
        },
        handler: sendNewsletter(emailService),
      },
      // Operational Workflows
      {
        name: "send_outage_notice",
        description: "Send service outage notification to team/customers",
        inputSchema: {
          type: "object",
          properties: {
            recipientEmails: { type: "array", items: { type: "string" }, description: "List of recipient email addresses" },
            service: { type: "string", description: "Name of affected service" },
            status: { type: "string", description: "Current status (e.g., 'Investigating', 'Partial Outage')" },
            startTime: { type: "string", description: "Outage start time (ISO format)" },
            estimatedResolution: { type: "string", description: "Estimated resolution time (optional)" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Status page URL" },
          },
          required: ["recipientEmails", "service", "status", "startTime"],
        },
        handler: sendOutageNotice(emailService),
      },
      {
        name: "send_maintenance_notice",
        description: "Send scheduled maintenance notification",
        inputSchema: {
          type: "object",
          properties: {
            recipientEmails: { type: "array", items: { type: "string" }, description: "List of recipient email addresses" },
            service: { type: "string", description: "Name of service undergoing maintenance" },
            startTime: { type: "string", description: "Maintenance window start time (ISO format)" },
            endTime: { type: "string", description: "Maintenance window end time (ISO format)" },
            impact: { type: "string", description: "Expected impact (e.g., 'Service will be unavailable')" },
            companyName: { type: "string", description: "Company name for branding" },
            supportEmail: { type: "string", description: "Support contact email" },
            dashboardUrl: { type: "string", description: "Status page URL" },
          },
          required: ["recipientEmails", "service", "startTime", "endTime", "impact"],
        },
        handler: sendMaintenanceNotice(emailService),
      },
      {
        name: "send_ticket_update",
        description: "Send support ticket status update email",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Customer email address" },
            name: { type: "string", description: "Customer name (optional)" },
            ticketId: { type: "string", description: "Support ticket ID" },
            ticketTitle: { type: "string", description: "Ticket title/subject" },
            status: { type: "string", description: "Current ticket status (e.g., 'In Progress', 'Resolved')" },
            updateMessage: { type: "string", description: "Update message/comment" },
            ticketLink: { type: "string", description: "Link to ticket in support system" },
            supportEmail: { type: "string", description: "Support contact email" },
          },
          required: ["email", "ticketId", "ticketTitle", "status", "updateMessage", "ticketLink"],
        },
        handler: sendTicketUpdate(emailService),
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
