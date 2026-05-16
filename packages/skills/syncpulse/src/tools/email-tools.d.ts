import { type EmailService } from "../services/EmailService.js";
export interface SendEmailInput {
    recipients: Array<{
        email: string;
        name?: string;
    }>;
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
export declare function sendEmail(service: EmailService): (input: SendEmailInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    error: string | undefined;
    recipientCount: number;
    timestamp: string;
}>;
export declare function sendBulkEmail(service: EmailService): (input: SendBulkEmailInput) => Promise<{
    success: boolean;
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
    errors: {
        email: string;
        error: string;
    }[] | undefined;
    timestamp: string;
}>;
export declare function sendMarketingCampaign(service: EmailService): (input: SendMarketingCampaignInput) => Promise<{
    success: boolean;
    campaign: {
        name: string;
        total: number;
        successful: number;
        failed: number;
        trackingEnabled: boolean;
    };
    errors: {
        email: string;
        error: string;
    }[] | undefined;
    timestamp: string;
}>;
export declare function verifyEmailConfiguration(service: EmailService): () => Promise<{
    configured: boolean;
    connected: boolean;
    config: {
        host: string;
        port: number;
        secure: boolean;
        from: string;
        user: string;
    } | null;
    status: string;
    message: string;
    timestamp: string;
}>;
//# sourceMappingURL=email-tools.d.ts.map