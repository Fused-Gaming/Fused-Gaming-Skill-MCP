import { type EmailService } from "../services/EmailService.js";
import {
  magicLinkLoginTemplate,
  mfaVerificationTemplate,
  passwordResetTemplate,
  accountSecurityAlertTemplate,
  invoiceTemplate,
  newsletterTemplate,
  developmentOutageTemplate,
  maintenanceNoticeTemplate,
  ticketUpdateTemplate,
  type TemplateContext,
} from "../services/EmailTemplates.js";

// ============================================================================
// AUTHENTICATION WORKFLOWS
// ============================================================================

export interface SendMagicLinkInput {
  email: string;
  name?: string;
  magicLink: string;
  expiryMinutes?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendMagicLink(service: EmailService) {
  return async (input: SendMagicLinkInput) => {
    const template = magicLinkLoginTemplate({
      recipientName: input.name || "User",
      magicLink: input.magicLink,
      expiryMinutes: input.expiryMinutes || "30",
      companyName: input.companyName || "Our",
      supportEmail: input.supportEmail || "support@example.com",
      dashboardUrl: input.dashboardUrl || "https://app.example.com",
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      type: "magic_link_login",
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}

export interface SendMFACodeInput {
  email: string;
  name?: string;
  mfaCode: string;
  expiryMinutes?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendMFACode(service: EmailService) {
  return async (input: SendMFACodeInput) => {
    const template = mfaVerificationTemplate({
      recipientName: input.name || "User",
      mfaCode: input.mfaCode,
      expiryMinutes: input.expiryMinutes || "10",
      companyName: input.companyName || "Our",
      supportEmail: input.supportEmail || "support@example.com",
      dashboardUrl: input.dashboardUrl || "https://app.example.com",
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      type: "mfa_verification",
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}

export interface SendPasswordResetInput {
  email: string;
  name?: string;
  resetLink: string;
  expiryHours?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendPasswordReset(service: EmailService) {
  return async (input: SendPasswordResetInput) => {
    const template = passwordResetTemplate({
      recipientName: input.name || "User",
      resetLink: input.resetLink,
      expiryHours: input.expiryHours || "24",
      companyName: input.companyName || "Our",
      supportEmail: input.supportEmail || "support@example.com",
      dashboardUrl: input.dashboardUrl || "https://app.example.com",
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      type: "password_reset",
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}

export interface SendSecurityAlertInput {
  email: string;
  name?: string;
  alertType: string;
  timestamp?: string;
  location?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendSecurityAlert(service: EmailService) {
  return async (input: SendSecurityAlertInput) => {
    const template = accountSecurityAlertTemplate({
      recipientName: input.name || "User",
      alertType: input.alertType,
      timestamp: input.timestamp || new Date().toISOString(),
      location: input.location,
      companyName: input.companyName || "Our",
      supportEmail: input.supportEmail || "support@example.com",
      dashboardUrl: input.dashboardUrl || "https://app.example.com",
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      type: "security_alert",
      alertType: input.alertType,
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}

// ============================================================================
// BUSINESS WORKFLOWS
// ============================================================================

export interface SendInvoiceInput {
  email: string;
  name?: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  invoiceLink: string;
  companyName?: string;
  supportEmail?: string;
}

export function sendInvoice(service: EmailService) {
  return async (input: SendInvoiceInput) => {
    const template = invoiceTemplate({
      recipientName: input.name || "Customer",
      invoiceNumber: input.invoiceNumber,
      amount: input.amount,
      dueDate: input.dueDate,
      invoiceLink: input.invoiceLink,
      companyName: input.companyName || "Our",
      supportEmail: input.supportEmail || "billing@example.com",
      dashboardUrl: input.invoiceLink.split("/invoice")[0],
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      invoiceNumber: input.invoiceNumber,
      type: "invoice",
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}

export interface SendNewsletterInput {
  recipients: Array<{ email: string; name?: string }>;
  title: string;
  contentHtml: string;
  unsubscribeLink: string;
  companyName?: string;
  dashboardUrl?: string;
}

export function sendNewsletter(service: EmailService) {
  return async (input: SendNewsletterInput) => {
    const emailRecipients = input.recipients.map((r) => ({
      email: r.email,
      name: r.name,
    }));

    const results = {
      successful: 0,
      failed: 0,
      messageIds: [] as string[],
      errors: [] as Array<{ email: string; error: string }>,
    };

    for (const recipient of emailRecipients) {
      const template = newsletterTemplate({
        recipientName: recipient.name || "Reader",
        title: input.title,
        contentHtml: input.contentHtml,
        unsubscribeLink: input.unsubscribeLink,
        companyName: input.companyName || "Our",
        dashboardUrl: input.dashboardUrl || "https://app.example.com",
      });

      const result = await service.sendEmail(recipient, template);

      if (result.success) {
        results.successful++;
        if (result.messageId) {
          results.messageIds.push(result.messageId);
        }
      } else {
        results.failed++;
        results.errors.push({
          email: recipient.email,
          error: result.error || "Unknown error",
        });
      }
    }

    return {
      success: results.failed === 0,
      summary: {
        total: input.recipients.length,
        successful: results.successful,
        failed: results.failed,
      },
      type: "newsletter",
      title: input.title,
      messageIds: results.messageIds.length > 0 ? results.messageIds : undefined,
      errors: results.errors.length > 0 ? results.errors : undefined,
      timestamp: new Date().toISOString(),
    };
  };
}

// ============================================================================
// OPERATIONAL WORKFLOWS
// ============================================================================

export interface SendOutageNoticeInput {
  recipientEmails: string[];
  service: string;
  status: string;
  startTime: string;
  estimatedResolution?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendOutageNotice(service: EmailService) {
  return async (input: SendOutageNoticeInput) => {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    for (const email of input.recipientEmails) {
      const template = developmentOutageTemplate({
        recipientName: "Team Member",
        service: input.service,
        status: input.status,
        startTime: input.startTime,
        estimatedResolution: input.estimatedResolution,
        companyName: input.companyName || "Our",
        supportEmail: input.supportEmail || "support@example.com",
        dashboardUrl: input.dashboardUrl || "https://status.example.com",
      });

      const result = await service.sendEmail({ email }, template);

      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          email,
          error: result.error || "Unknown error",
        });
      }
    }

    return {
      success: results.failed === 0,
      summary: {
        total: input.recipientEmails.length,
        successful: results.successful,
        failed: results.failed,
      },
      type: "outage_notice",
      service: input.service,
      status: input.status,
      errors: results.errors.length > 0 ? results.errors : undefined,
      timestamp: new Date().toISOString(),
    };
  };
}

export interface SendMaintenanceNoticeInput {
  recipientEmails: string[];
  service: string;
  startTime: string;
  endTime: string;
  impact: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
}

export function sendMaintenanceNotice(service: EmailService) {
  return async (input: SendMaintenanceNoticeInput) => {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    for (const email of input.recipientEmails) {
      const template = maintenanceNoticeTemplate({
        recipientName: "Team Member",
        service: input.service,
        startTime: input.startTime,
        endTime: input.endTime,
        impact: input.impact,
        companyName: input.companyName || "Our",
        supportEmail: input.supportEmail || "support@example.com",
        dashboardUrl: input.dashboardUrl || "https://status.example.com",
      });

      const result = await service.sendEmail({ email }, template);

      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          email,
          error: result.error || "Unknown error",
        });
      }
    }

    return {
      success: results.failed === 0,
      summary: {
        total: input.recipientEmails.length,
        successful: results.successful,
        failed: results.failed,
      },
      type: "maintenance_notice",
      service: input.service,
      startTime: input.startTime,
      endTime: input.endTime,
      errors: results.errors.length > 0 ? results.errors : undefined,
      timestamp: new Date().toISOString(),
    };
  };
}

export interface SendTicketUpdateInput {
  email: string;
  name?: string;
  ticketId: string;
  ticketTitle: string;
  status: string;
  updateMessage: string;
  ticketLink: string;
  supportEmail?: string;
}

export function sendTicketUpdate(service: EmailService) {
  return async (input: SendTicketUpdateInput) => {
    const template = ticketUpdateTemplate({
      recipientName: input.name || "User",
      ticketId: input.ticketId,
      ticketTitle: input.ticketTitle,
      status: input.status,
      updateMessage: input.updateMessage,
      ticketLink: input.ticketLink,
      companyName: "Our",
      supportEmail: input.supportEmail || "support@example.com",
      dashboardUrl: input.ticketLink.split("/ticket")[0],
    });

    const result = await service.sendEmail(
      { email: input.email, name: input.name },
      template
    );

    return {
      success: result.success,
      messageId: result.messageId,
      email: input.email,
      ticketId: input.ticketId,
      type: "ticket_update",
      status: input.status,
      timestamp: new Date().toISOString(),
      error: result.error,
    };
  };
}
