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
export declare class EmailService {
    private transporter;
    private config;
    private isInitialized;
    constructor();
    private initializeFromEnvironment;
    private createTransporter;
    initializeWithConfig(config: EmailConfig): void;
    verifyConnection(): Promise<boolean>;
    sendEmail(recipients: EmailRecipient | EmailRecipient[], template: EmailTemplate, variables?: Record<string, string>): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendBulk(recipients: EmailRecipient[], template: EmailTemplate, globalVariables?: Record<string, string>): Promise<{
        success: number;
        failed: number;
        errors: Array<{
            email: string;
            error: string;
        }>;
    }>;
    private interpolateTemplate;
    getConfig(): EmailConfig | null;
    isConfigured(): boolean;
}
export default EmailService;
//# sourceMappingURL=EmailService.d.ts.map