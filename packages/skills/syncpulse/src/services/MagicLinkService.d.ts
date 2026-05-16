import EmailService from "./EmailService";
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
export declare class MagicLinkService {
    private emailService;
    private baseUrl;
    private tokenExpiryMinutes;
    private maxAttemptsPerHour;
    private tokens;
    private attemptTracking;
    constructor(config: MagicLinkConfig);
    generateAndSendMagicLink(email: string, recipientName?: string): Promise<{
        success: boolean;
        error?: string;
        tokenLength?: number;
    }>;
    validateMagicLink(token: string): MagicLinkValidation;
    consumeMagicLink(token: string): boolean;
    private generateSecureToken;
    private hashToken;
    getTokenInfo(token: string): MagicLinkToken | null;
    cleanupExpiredTokens(): number;
    getStats(): {
        activeTokens: number;
        trackedEmails: number;
        tokenExpiryMinutes: number;
        maxAttemptsPerHour: number;
    };
}
export default MagicLinkService;
//# sourceMappingURL=MagicLinkService.d.ts.map