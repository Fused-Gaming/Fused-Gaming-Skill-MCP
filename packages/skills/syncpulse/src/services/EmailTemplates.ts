import { type EmailTemplate } from "./EmailService.js";

export interface TemplateContext {
  recipientName?: string;
  companyName?: string;
  supportEmail?: string;
  dashboardUrl?: string;
  [key: string]: string | undefined;
}

// ============================================================================
// AUTHENTICATION & SECURITY TEMPLATES
// ============================================================================

export function magicLinkLoginTemplate(_context: TemplateContext & { magicLink: string; expiryMinutes: string }): EmailTemplate {
  return {
    subject: "Your Magic Link Login - {{companyName}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi {{recipientName}},</h2>
        <p>Click the button below to securely log in to your {{companyName}} account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{magicLink}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Login to Account
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link expires in {{expiryMinutes}} minutes for security reasons.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this link, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions? Contact us at <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Hi {{recipientName}},

Click this link to log in to {{companyName}}:
{{magicLink}}

This link expires in {{expiryMinutes}} minutes.

If you didn't request this link, please ignore this email.

Questions? Contact {{supportEmail}}`,
  };
}

export function mfaVerificationTemplate(_context: TemplateContext & { mfaCode: string; expiryMinutes: string }): EmailTemplate {
  return {
    subject: "Your {{companyName}} Verification Code",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verification Code</h2>
        <p>Hi {{recipientName}},</p>
        <p>Your verification code is:</p>
        <div style="background: #f5f5f5; border: 2px solid #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <code style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">{{mfaCode}}</code>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code expires in {{expiryMinutes}} minutes. Do not share it with anyone.
        </p>
        <p style="color: #d32f2f; font-size: 14px; font-weight: bold;">
          ⚠️ If you didn't request this code, your account may be compromised.
          <a href="{{dashboardUrl}}/security">Review your security settings</a> immediately.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Need help? Contact <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Verification Code

Hi {{recipientName}},

Your verification code is: {{mfaCode}}

This code expires in {{expiryMinutes}} minutes.
Do not share it with anyone.

⚠️ If you didn't request this code, your account may be compromised.
Review your security settings: {{dashboardUrl}}/security

Need help? Contact {{supportEmail}}`,
  };
}

export function passwordResetTemplate(_context: TemplateContext & { resetLink: string; expiryHours: string }): EmailTemplate {
  return {
    subject: "Reset Your {{companyName}} Password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi {{recipientName}},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetLink}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link expires in {{expiryHours}} hours for security.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this reset, please ignore this email. Your password will remain unchanged.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions? <a href="{{dashboardUrl}}/help">View our help center</a> or contact <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Password Reset Request

Hi {{recipientName}},

Click this link to reset your password:
{{resetLink}}

This link expires in {{expiryHours}} hours.

If you didn't request this reset, ignore this email.
Your password will remain unchanged.

Questions? {{dashboardUrl}}/help or {{supportEmail}}`,
  };
}

export function accountSecurityAlertTemplate(_context: TemplateContext & { alertType: string; timestamp: string; location?: string }): EmailTemplate {
  return {
    subject: "⚠️ Security Alert: {{alertType}} - {{companyName}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #856404; margin-top: 0;">Security Alert</h2>
          <p style="color: #856404; font-weight: bold;">{{alertType}}</p>
        </div>
        <p>Hi {{recipientName}},</p>
        <p>We detected a security event on your {{companyName}} account:</p>
        <ul style="color: #666;">
          <li><strong>Event:</strong> {{alertType}}</li>
          <li><strong>Time:</strong> {{timestamp}}</li>
          <li><strong>Location:</strong> {{location}}</li>
        </ul>
        <p style="color: #d32f2f; font-weight: bold;">⚠️ If this wasn't you, secure your account immediately:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{dashboardUrl}}/security/change-password" style="background: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Change Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Review <a href="{{dashboardUrl}}/security/sessions">active sessions</a> and
          <a href="{{dashboardUrl}}/security/devices">connected devices</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          For support, contact <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Security Alert

Hi {{recipientName}},

We detected a security event on your account:

Event: {{alertType}}
Time: {{timestamp}}
Location: {{location}}

⚠️ If this wasn't you, secure your account immediately:
{{dashboardUrl}}/security/change-password

Review active sessions: {{dashboardUrl}}/security/sessions
Review devices: {{dashboardUrl}}/security/devices

For support, contact {{supportEmail}}`,
  };
}

// ============================================================================
// BUSINESS & TRANSACTIONAL TEMPLATES
// ============================================================================

export function invoiceTemplate(_context: TemplateContext & { invoiceNumber: string; amount: string; dueDate: string; invoiceLink: string }): EmailTemplate {
  return {
    subject: "Invoice #{{invoiceNumber}} - {{companyName}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Invoice {{invoiceNumber}}</h2>
        <p>Hi {{recipientName}},</p>
        <p>Your invoice is ready. See details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Invoice Number</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{invoiceNumber}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount Due</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #007bff;">{{amount}}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Due Date</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{dueDate}}</td>
          </tr>
        </table>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{invoiceLink}}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Full Invoice
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Payment options and details are available in the full invoice above.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions about this invoice? Contact <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Invoice {{invoiceNumber}}

Hi {{recipientName}},

Your invoice is ready.

Invoice Number: {{invoiceNumber}}
Amount Due: {{amount}}
Due Date: {{dueDate}}

View full invoice: {{invoiceLink}}

Payment options and details are in the full invoice.

Questions? Contact {{supportEmail}}`,
  };
}

export function newsletterTemplate(_context: TemplateContext & { title: string; contentHtml: string; unsubscribeLink: string }): EmailTemplate {
  return {
    subject: "{{title}} - {{companyName}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>{{title}}</h2>
        <p>Hi {{recipientName}},</p>
        {{contentHtml}}
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">
          You're receiving this because you're subscribed to {{companyName}} updates.
          <a href="{{unsubscribeLink}}">Manage preferences</a> |
          <a href="{{dashboardUrl}}/settings">Account settings</a>
        </p>
      </div>
    `,
    text: `{{title}}

Hi {{recipientName}},

{{contentHtml}}

---

You're subscribed to {{companyName}} updates.
Manage: {{unsubscribeLink}}
Account: {{dashboardUrl}}/settings`,
  };
}

// ============================================================================
// OPERATIONAL & ADMINISTRATIVE TEMPLATES
// ============================================================================

export function developmentOutageTemplate(_context: TemplateContext & { service: string; status: string; startTime: string; estimatedResolution?: string }): EmailTemplate {
  return {
    subject: "🔴 Service Status: {{service}} - {{status}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #c62828; margin-top: 0;">🔴 {{status}}</h2>
          <p style="color: #c62828; font-weight: bold;">Service: {{service}}</p>
        </div>
        <p>Hi {{recipientName}},</p>
        <p>We're currently experiencing issues with <strong>{{service}}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{service}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; color: #d32f2f; font-weight: bold;">{{status}}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Started At</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{startTime}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Est. Resolution</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{estimatedResolution}}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px;">
          We're actively working to resolve this. Updates will be posted to our
          <a href="{{dashboardUrl}}/status">status page</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions? Check <a href="{{dashboardUrl}}/status">status.{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Service Status: {{service}} - {{status}}

Hi {{recipientName}},

We're experiencing issues with {{service}}.

Service: {{service}}
Status: {{status}}
Started: {{startTime}}
Est. Resolution: {{estimatedResolution}}

We're working to resolve this. Updates: {{dashboardUrl}}/status

Check {{dashboardUrl}}/status for details.`,
  };
}

export function maintenanceNoticeTemplate(_context: TemplateContext & { service: string; startTime: string; endTime: string; impact: string }): EmailTemplate {
  return {
    subject: "🔧 Scheduled Maintenance: {{service}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #e3f2fd; border-left: 4px solid #1976d2; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #0d47a1; margin-top: 0;">🔧 Scheduled Maintenance</h2>
          <p style="color: #0d47a1; font-weight: bold;">{{service}} will be temporarily unavailable</p>
        </div>
        <p>Hi {{recipientName}},</p>
        <p>We've scheduled maintenance to improve {{service}} reliability and performance.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{service}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Window</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{startTime}} - {{endTime}}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Expected Impact</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{impact}}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px;">
          We apologize for any inconvenience. For real-time updates, check our
          <a href="{{dashboardUrl}}/status">status page</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions? Contact <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Scheduled Maintenance: {{service}}

Hi {{recipientName}},

Maintenance is scheduled for {{service}}.

Service: {{service}}
Window: {{startTime}} - {{endTime}}
Impact: {{impact}}

Updates: {{dashboardUrl}}/status

Questions? {{supportEmail}}`,
  };
}

export function ticketUpdateTemplate(_context: TemplateContext & { ticketId: string; ticketTitle: string; status: string; updateMessage: string; ticketLink: string }): EmailTemplate {
  return {
    subject: "[Ticket #{{ticketId}}] {{status}}: {{ticketTitle}}",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Ticket Update</h2>
        <p>Hi {{recipientName}},</p>
        <p>There's an update on your support ticket:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
          <p style="margin: 0 0 10px 0;"><strong>#{{ticketId}}</strong> - {{ticketTitle}}</p>
          <p style="margin: 0; color: #666;">{{updateMessage}}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ticket ID</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">#{{ticketId}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">{{status}}</td>
          </tr>
        </table>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{ticketLink}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Ticket
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Reply directly on your ticket or contact us if you have questions.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Questions? <a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
        </p>
      </div>
    `,
    text: `Ticket Update

Hi {{recipientName}},

There's an update on your ticket:

#{{ticketId}} - {{ticketTitle}}
{{updateMessage}}

Ticket ID: #{{ticketId}}
Status: {{status}}

View: {{ticketLink}}

Reply on your ticket or contact {{supportEmail}}`,
  };
}

// ============================================================================
// TEMPLATE FACTORY FOR EASY ACCESS
// ============================================================================

export const emailTemplates = {
  authentication: {
    magicLink: magicLinkLoginTemplate,
    mfaVerification: mfaVerificationTemplate,
    passwordReset: passwordResetTemplate,
    securityAlert: accountSecurityAlertTemplate,
  },
  business: {
    invoice: invoiceTemplate,
    newsletter: newsletterTemplate,
  },
  operations: {
    developmentOutage: developmentOutageTemplate,
    maintenanceNotice: maintenanceNoticeTemplate,
    ticketUpdate: ticketUpdateTemplate,
  },
};
