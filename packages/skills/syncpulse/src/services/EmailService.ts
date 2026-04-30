import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
  variables?: Record<string, string>;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private config: EmailConfig | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeFromEnvironment();
  }

  private initializeFromEnvironment(): void {
    const required = ["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASS", "MAIL_FROM"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      // Fail gracefully - service can be initialized later with explicit config
      console.warn(`⚠️  EmailService: Missing environment variables: ${missing.join(", ")}`);
      return;
    }

    this.config = {
      host: process.env.MAIL_HOST!,
      port: parseInt(process.env.MAIL_PORT || "587", 10),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
      from: process.env.MAIL_FROM!,
    };

    this.createTransporter();
  }

  private createTransporter(): void {
    if (!this.config) {
      throw new Error("EmailService not configured. Call initializeWithConfig() first.");
    }

    this.transporter = nodemailer.createTransport(this.config);
    this.isInitialized = true;
  }

  public initializeWithConfig(config: EmailConfig): void {
    this.config = config;
    this.createTransporter();
  }

  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }

  public async sendEmail(
    recipients: EmailRecipient | EmailRecipient[],
    template: EmailTemplate,
    variables?: Record<string, string>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isInitialized || !this.transporter || !this.config) {
      return {
        success: false,
        error: "EmailService not initialized. Configure environment variables or call initializeWithConfig().",
      };
    }

    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
    const to = recipientArray
      .map((r) => (r.name ? `${r.name} <${r.email}>` : r.email))
      .join(", ");

    const mergedVariables = {
      ...(variables || {}),
      ...recipientArray[0]?.variables,
    };

    const html = this.interpolateTemplate(template.html, mergedVariables);
    const text = template.text ? this.interpolateTemplate(template.text, mergedVariables) : undefined;

    const mailOptions: SendMailOptions = {
      from: this.config.from,
      to,
      subject: this.interpolateTemplate(template.subject, mergedVariables),
      html,
      text,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  public async sendBulk(
    recipients: EmailRecipient[],
    template: EmailTemplate,
    globalVariables?: Record<string, string>
  ): Promise<{ success: number; failed: number; errors: Array<{ email: string; error: string }> }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    for (const recipient of recipients) {
      const variables = {
        ...globalVariables,
        ...(recipient.name ? { name: recipient.name, recipientName: recipient.name } : {}),
        ...recipient.variables,
      };
      const result = await this.sendEmail(recipient, template, variables);

      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          email: recipient.email,
          error: result.error || "Unknown error",
        });
      }
    }

    return results;
  }

  private interpolateTemplate(template: string, variables: Record<string, string>): string {
    return Object.entries(variables).reduce((acc, [key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return acc.replace(new RegExp(`{{${escapedKey}}}`, "g"), value);
    }, template);
  }

  public getConfig(): EmailConfig | null {
    return this.config;
  }

  public isConfigured(): boolean {
    return this.isInitialized;
  }
}

export default EmailService;
