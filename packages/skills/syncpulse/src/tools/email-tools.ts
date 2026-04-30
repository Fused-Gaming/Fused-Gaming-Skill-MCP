import { type EmailService, type EmailTemplate, type EmailRecipient } from "../services/EmailService.js";

export interface SendEmailInput {
  recipients: Array<{ email: string; name?: string }>;
  subject: string;
  htmlBody: string;
  textBody?: string;
  variables?: Record<string, string>;
}

export interface SendBulkEmailInput {
  recipients: Array<{
    email: string;
    name?: string;
    variables?: Record<string, string>;
  }>;
  subject: string;
  htmlBody: string;
  textBody?: string;
  globalVariables?: Record<string, string>;
}

export interface SendMarketingCampaignInput {
  campaignName: string;
  recipients: Array<{
    email: string;
    name?: string;
    variables?: Record<string, string>;
  }>;
  subject: string;
  htmlBody: string;
  textBody?: string;
  trackingPixel?: boolean;
}

export function sendEmail(service: EmailService) {
  return async (input: SendEmailInput) => {
    const recipients: EmailRecipient[] = input.recipients.map((r) => ({
      email: r.email,
      name: r.name,
      variables: input.variables,
    }));

    const template: EmailTemplate = {
      subject: input.subject,
      html: input.htmlBody,
      text: input.textBody,
    };

    const result = await service.sendEmail(recipients, template, input.variables);

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      recipientCount: input.recipients.length,
      timestamp: new Date().toISOString(),
    };
  };
}

export function sendBulkEmail(service: EmailService) {
  return async (input: SendBulkEmailInput) => {
    const recipients: EmailRecipient[] = input.recipients.map((r) => ({
      email: r.email,
      name: r.name,
      variables: r.variables,
    }));

    const template: EmailTemplate = {
      subject: input.subject,
      html: input.htmlBody,
      text: input.textBody,
    };

    const result = await service.sendBulk(recipients, template, input.globalVariables);

    return {
      success: result.failed === 0,
      summary: {
        total: input.recipients.length,
        successful: result.success,
        failed: result.failed,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
      timestamp: new Date().toISOString(),
    };
  };
}

export function sendMarketingCampaign(service: EmailService) {
  return async (input: SendMarketingCampaignInput) => {
    const recipients: EmailRecipient[] = input.recipients.map((r) => ({
      email: r.email,
      name: r.name,
      variables: r.variables,
    }));

    let htmlBody = input.htmlBody;
    if (input.trackingPixel) {
      const trackingPixel = `<img src="https://mail.vln.gg/track/${input.campaignName}" alt="" width="1" height="1" style="display:none;" />`;
      htmlBody = htmlBody + trackingPixel;
    }

    const template: EmailTemplate = {
      subject: input.subject,
      html: htmlBody,
      text: input.textBody,
    };

    const result = await service.sendBulk(recipients, template);

    return {
      success: result.failed === 0,
      campaign: {
        name: input.campaignName,
        total: input.recipients.length,
        successful: result.success,
        failed: result.failed,
        trackingEnabled: input.trackingPixel || false,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
      timestamp: new Date().toISOString(),
    };
  };
}

export function verifyEmailConfiguration(service: EmailService) {
  return async () => {
    const isConfigured = service.isConfigured();
    const isConnected = isConfigured ? await service.verifyConnection() : false;
    const config = service.getConfig();

    return {
      configured: isConfigured,
      connected: isConnected,
      config: config
        ? {
            host: config.host,
            port: config.port,
            secure: config.secure,
            from: config.from,
            user: config.auth.user.substring(0, 3) + "***",
          }
        : null,
      status: isConnected ? "ready" : isConfigured ? "configured_not_connected" : "not_configured",
      message: isConnected
        ? "Email service is ready to send messages"
        : isConfigured
          ? "Email service configured but connection failed"
          : "Email service requires configuration via environment variables",
      timestamp: new Date().toISOString(),
    };
  };
}
