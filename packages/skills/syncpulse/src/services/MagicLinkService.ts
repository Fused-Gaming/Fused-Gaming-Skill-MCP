import crypto from "crypto";
import EmailService, { EmailTemplate, EmailRecipient } from "./EmailService";

export interface MagicLinkConfig {
  emailService: EmailService;
  baseUrl: string;
  tokenExpiryMinutes?: number;
  maxAttemptsPerHour?: number;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  expiresAt: number;
  hash: string;
  createdAt: number;
  attempts: number;
  lastAttemptAt: number;
}

export interface MagicLinkValidation {
  valid: boolean;
  email?: string;
  error?: string;
}

export class MagicLinkService {
  private emailService: EmailService;
  private baseUrl: string;
  private tokenExpiryMinutes: number;
  private maxAttemptsPerHour: number;
  private tokens = new Map<string, MagicLinkToken>();
  private attemptTracking = new Map<string, Array<{ timestamp: number }>>();

  constructor(config: MagicLinkConfig) {
    this.emailService = config.emailService;
    this.baseUrl = config.baseUrl;
    this.tokenExpiryMinutes = config.tokenExpiryMinutes || 15;
    this.maxAttemptsPerHour = config.maxAttemptsPerHour || 5;
  }

  /**
   * Generate a magic link token and send email
   */
  public async generateAndSendMagicLink(
    email: string,
    recipientName?: string
  ): Promise<{ success: boolean; error?: string; tokenLength?: number }> {
    // Rate limiting check
    const now = Date.now();
    const attempts = this.attemptTracking.get(email) || [];
    const recentAttempts = attempts.filter((a) => now - a.timestamp < 3600000); // 1 hour

    if (recentAttempts.length >= this.maxAttemptsPerHour) {
      return {
        success: false,
        error: `Too many magic link requests. Please try again in ${Math.ceil(
          (recentAttempts[0].timestamp + 3600000 - now) / 60000
        )} minutes.`,
      };
    }

    // Generate secure token
    const token = this.generateSecureToken();
    const hash = this.hashToken(token);
    const expiresAt = now + this.tokenExpiryMinutes * 60 * 1000;

    // Store token
    this.tokens.set(hash, {
      token,
      email,
      expiresAt,
      hash,
      createdAt: now,
      attempts: 0,
      lastAttemptAt: 0,
    });

    // Track attempt
    this.attemptTracking.set(email, [...recentAttempts, { timestamp: now }]);

    // Generate magic link URL
    const magicLinkUrl = `${this.baseUrl}/auth/magic-link?token=${token}`;

    // Send email
    const emailTemplate: EmailTemplate = {
      subject: "🔐 Your SyncPulse Magic Link - {{expiryTime}}",
      html: `
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f8f9fa; padding: 20px; }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                text-decoration: none;
                margin: 20px 0;
              }
              .footer { background: #e9ecef; padding: 15px; color: #666; font-size: 12px; }
              .warning { color: #dc3545; font-size: 12px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚡ SyncPulse Authentication</h1>
              </div>
              <div class="content">
                <p>Hello {{recipientName}},</p>
                <p>You requested a magic link to access your SyncPulse orchestration panel.</p>
                <p>Click the button below to authenticate:</p>
                <a href="${magicLinkUrl}" class="button">Authenticate Now</a>
                <p>Or paste this link in your browser:</p>
                <p><code>${magicLinkUrl}</code></p>
                <div class="warning">
                  ⏰ This magic link expires in {{expiryTime}} minutes.
                </div>
              </div>
              <div class="footer">
                <p>If you didn't request this link, please ignore this email.</p>
                <p>Your magic link is valid for {{expiryTime}} minutes only.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        SyncPulse Authentication

        Hello {{recipientName}},

        You requested a magic link to access your SyncPulse orchestration panel.

        Visit this link to authenticate:
        ${magicLinkUrl}

        This magic link expires in {{expiryTime}} minutes.

        If you didn't request this link, please ignore this email.
      `,
    };

    const recipient: EmailRecipient = {
      email,
      name: recipientName,
      variables: {
        recipientName: recipientName || "User",
        expiryTime: String(this.tokenExpiryMinutes),
      },
    };

    const result = await this.emailService.sendEmail(recipient, emailTemplate);

    return {
      success: result.success,
      error: result.error,
      tokenLength: token.length,
    };
  }

  /**
   * Validate a magic link token
   */
  public validateMagicLink(token: string): MagicLinkValidation {
    const hash = this.hashToken(token);
    const tokenData = this.tokens.get(hash);

    if (!tokenData) {
      return {
        valid: false,
        error: "Invalid or expired magic link",
      };
    }

    // Check expiration
    if (Date.now() > tokenData.expiresAt) {
      this.tokens.delete(hash);
      return {
        valid: false,
        error: "Magic link has expired",
      };
    }

    // Check attempts
    if (tokenData.attempts >= 5) {
      this.tokens.delete(hash);
      return {
        valid: false,
        error: "Too many validation attempts",
      };
    }

    // Update attempts
    tokenData.attempts++;
    tokenData.lastAttemptAt = Date.now();

    return {
      valid: true,
      email: tokenData.email,
    };
  }

  /**
   * Consume a magic link token (remove it after successful authentication)
   */
  public consumeMagicLink(token: string): boolean {
    const hash = this.hashToken(token);
    return this.tokens.delete(hash);
  }

  /**
   * Generate a secure random token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Hash a token for storage
   */
  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Get token info (for debugging/admin)
   */
  public getTokenInfo(token: string): MagicLinkToken | null {
    const hash = this.hashToken(token);
    return this.tokens.get(hash) || null;
  }

  /**
   * Cleanup expired tokens
   */
  public cleanupExpiredTokens(): number {
    const now = Date.now();
    const before = this.tokens.size;

    for (const [hash, tokenData] of this.tokens.entries()) {
      if (now > tokenData.expiresAt) {
        this.tokens.delete(hash);
      }
    }

    return before - this.tokens.size;
  }

  /**
   * Get service statistics
   */
  public getStats() {
    return {
      activeTokens: this.tokens.size,
      trackedEmails: this.attemptTracking.size,
      tokenExpiryMinutes: this.tokenExpiryMinutes,
      maxAttemptsPerHour: this.maxAttemptsPerHour,
    };
  }
}

export default MagicLinkService;
