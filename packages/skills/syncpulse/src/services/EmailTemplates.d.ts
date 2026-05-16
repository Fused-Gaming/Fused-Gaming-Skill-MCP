import { type EmailTemplate } from "./EmailService.js";
export interface TemplateContext {
    recipientName?: string;
    companyName?: string;
    supportEmail?: string;
    dashboardUrl?: string;
    [key: string]: string | undefined;
}
export declare function magicLinkLoginTemplate(_context: TemplateContext & {
    magicLink: string;
    expiryMinutes: string;
}): EmailTemplate;
export declare function mfaVerificationTemplate(_context: TemplateContext & {
    mfaCode: string;
    expiryMinutes: string;
}): EmailTemplate;
export declare function passwordResetTemplate(_context: TemplateContext & {
    resetLink: string;
    expiryHours: string;
}): EmailTemplate;
export declare function accountSecurityAlertTemplate(_context: TemplateContext & {
    alertType: string;
    timestamp: string;
    location?: string;
}): EmailTemplate;
export declare function invoiceTemplate(_context: TemplateContext & {
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    invoiceLink: string;
}): EmailTemplate;
export declare function newsletterTemplate(_context: TemplateContext & {
    title: string;
    contentHtml: string;
    unsubscribeLink: string;
}): EmailTemplate;
export declare function developmentOutageTemplate(_context: TemplateContext & {
    service: string;
    status: string;
    startTime: string;
    estimatedResolution?: string;
}): EmailTemplate;
export declare function maintenanceNoticeTemplate(_context: TemplateContext & {
    service: string;
    startTime: string;
    endTime: string;
    impact: string;
}): EmailTemplate;
export declare function ticketUpdateTemplate(_context: TemplateContext & {
    ticketId: string;
    ticketTitle: string;
    status: string;
    updateMessage: string;
    ticketLink: string;
}): EmailTemplate;
export declare const emailTemplates: {
    authentication: {
        magicLink: typeof magicLinkLoginTemplate;
        mfaVerification: typeof mfaVerificationTemplate;
        passwordReset: typeof passwordResetTemplate;
        securityAlert: typeof accountSecurityAlertTemplate;
    };
    business: {
        invoice: typeof invoiceTemplate;
        newsletter: typeof newsletterTemplate;
    };
    operations: {
        developmentOutage: typeof developmentOutageTemplate;
        maintenanceNotice: typeof maintenanceNoticeTemplate;
        ticketUpdate: typeof ticketUpdateTemplate;
    };
};
//# sourceMappingURL=EmailTemplates.d.ts.map