import { type EmailService } from "../services/EmailService.js";
export interface SendMagicLinkInput {
    email: string;
    name?: string;
    magicLink: string;
    expiryMinutes?: string;
    companyName?: string;
    supportEmail?: string;
    dashboardUrl?: string;
}
export declare function sendMagicLink(service: EmailService): (input: SendMagicLinkInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    type: string;
    timestamp: string;
    error: string | undefined;
}>;
export interface SendMFACodeInput {
    email: string;
    name?: string;
    mfaCode: string;
    expiryMinutes?: string;
    companyName?: string;
    supportEmail?: string;
    dashboardUrl?: string;
}
export declare function sendMFACode(service: EmailService): (input: SendMFACodeInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    type: string;
    timestamp: string;
    error: string | undefined;
}>;
export interface SendPasswordResetInput {
    email: string;
    name?: string;
    resetLink: string;
    expiryHours?: string;
    companyName?: string;
    supportEmail?: string;
    dashboardUrl?: string;
}
export declare function sendPasswordReset(service: EmailService): (input: SendPasswordResetInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    type: string;
    timestamp: string;
    error: string | undefined;
}>;
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
export declare function sendSecurityAlert(service: EmailService): (input: SendSecurityAlertInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    type: string;
    alertType: string;
    timestamp: string;
    error: string | undefined;
}>;
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
export declare function sendInvoice(service: EmailService): (input: SendInvoiceInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    invoiceNumber: string;
    type: string;
    timestamp: string;
    error: string | undefined;
}>;
export interface SendNewsletterInput {
    recipients: Array<{
        email: string;
        name?: string;
    }>;
    title: string;
    contentHtml: string;
    unsubscribeLink: string;
    companyName?: string;
    dashboardUrl?: string;
}
export declare function sendNewsletter(service: EmailService): (input: SendNewsletterInput) => Promise<{
    success: boolean;
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
    type: string;
    title: string;
    messageIds: string[] | undefined;
    errors: {
        email: string;
        error: string;
    }[] | undefined;
    timestamp: string;
}>;
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
export declare function sendOutageNotice(service: EmailService): (input: SendOutageNoticeInput) => Promise<{
    success: boolean;
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
    type: string;
    service: string;
    status: string;
    errors: {
        email: string;
        error: string;
    }[] | undefined;
    timestamp: string;
}>;
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
export declare function sendMaintenanceNotice(service: EmailService): (input: SendMaintenanceNoticeInput) => Promise<{
    success: boolean;
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
    type: string;
    service: string;
    startTime: string;
    endTime: string;
    errors: {
        email: string;
        error: string;
    }[] | undefined;
    timestamp: string;
}>;
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
export declare function sendTicketUpdate(service: EmailService): (input: SendTicketUpdateInput) => Promise<{
    success: boolean;
    messageId: string | undefined;
    email: string;
    ticketId: string;
    type: string;
    status: string;
    timestamp: string;
    error: string | undefined;
}>;
//# sourceMappingURL=email-workflows.d.ts.map