import { magicLinkLoginTemplate, mfaVerificationTemplate, passwordResetTemplate, accountSecurityAlertTemplate, invoiceTemplate, newsletterTemplate, developmentOutageTemplate, maintenanceNoticeTemplate, ticketUpdateTemplate, } from "../services/EmailTemplates.js";
export function sendMagicLink(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "User",
            magicLink: input.magicLink,
            expiryMinutes: input.expiryMinutes || "30",
            companyName: input.companyName || "Our",
            supportEmail: input.supportEmail || "support@example.com",
            dashboardUrl: input.dashboardUrl || "https://app.example.com",
        };
        const template = magicLinkLoginTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
export function sendMFACode(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "User",
            mfaCode: input.mfaCode,
            expiryMinutes: input.expiryMinutes || "10",
            companyName: input.companyName || "Our",
            supportEmail: input.supportEmail || "support@example.com",
            dashboardUrl: input.dashboardUrl || "https://app.example.com",
        };
        const template = mfaVerificationTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
export function sendPasswordReset(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "User",
            resetLink: input.resetLink,
            expiryHours: input.expiryHours || "24",
            companyName: input.companyName || "Our",
            supportEmail: input.supportEmail || "support@example.com",
            dashboardUrl: input.dashboardUrl || "https://app.example.com",
        };
        const template = passwordResetTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
export function sendSecurityAlert(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "User",
            alertType: input.alertType,
            timestamp: input.timestamp || new Date().toISOString(),
            location: input.location || "",
            companyName: input.companyName || "Our",
            supportEmail: input.supportEmail || "support@example.com",
            dashboardUrl: input.dashboardUrl || "https://app.example.com",
        };
        const template = accountSecurityAlertTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
export function sendInvoice(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "Customer",
            invoiceNumber: input.invoiceNumber,
            amount: input.amount,
            dueDate: input.dueDate,
            invoiceLink: input.invoiceLink,
            companyName: input.companyName || "Our",
            supportEmail: input.supportEmail || "billing@example.com",
            dashboardUrl: input.invoiceLink.split("/invoice")[0],
        };
        const template = invoiceTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
export function sendNewsletter(service) {
    return async (input) => {
        const emailRecipients = input.recipients.map((r) => ({
            email: r.email,
            name: r.name,
        }));
        const results = {
            successful: 0,
            failed: 0,
            messageIds: [],
            errors: [],
        };
        for (const recipient of emailRecipients) {
            const variables = {
                recipientName: recipient.name || "Reader",
                title: input.title,
                contentHtml: input.contentHtml,
                unsubscribeLink: input.unsubscribeLink,
                companyName: input.companyName || "Our",
                dashboardUrl: input.dashboardUrl || "https://app.example.com",
            };
            const template = newsletterTemplate(variables);
            const result = await service.sendEmail(recipient, template, variables);
            if (result.success) {
                results.successful++;
                if (result.messageId) {
                    results.messageIds.push(result.messageId);
                }
            }
            else {
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
export function sendOutageNotice(service) {
    return async (input) => {
        const results = {
            successful: 0,
            failed: 0,
            errors: [],
        };
        for (const email of input.recipientEmails) {
            const variables = {
                recipientName: "Team Member",
                service: input.service,
                status: input.status,
                startTime: input.startTime,
                estimatedResolution: input.estimatedResolution || "",
                companyName: input.companyName || "Our",
                supportEmail: input.supportEmail || "support@example.com",
                dashboardUrl: input.dashboardUrl || "https://status.example.com",
            };
            const template = developmentOutageTemplate(variables);
            const result = await service.sendEmail({ email }, template, variables);
            if (result.success) {
                results.successful++;
            }
            else {
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
export function sendMaintenanceNotice(service) {
    return async (input) => {
        const results = {
            successful: 0,
            failed: 0,
            errors: [],
        };
        for (const email of input.recipientEmails) {
            const variables = {
                recipientName: "Team Member",
                service: input.service,
                startTime: input.startTime,
                endTime: input.endTime,
                impact: input.impact,
                companyName: input.companyName || "Our",
                supportEmail: input.supportEmail || "support@example.com",
                dashboardUrl: input.dashboardUrl || "https://status.example.com",
            };
            const template = maintenanceNoticeTemplate(variables);
            const result = await service.sendEmail({ email }, template, variables);
            if (result.success) {
                results.successful++;
            }
            else {
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
export function sendTicketUpdate(service) {
    return async (input) => {
        const variables = {
            recipientName: input.name || "User",
            ticketId: input.ticketId,
            ticketTitle: input.ticketTitle,
            status: input.status,
            updateMessage: input.updateMessage,
            ticketLink: input.ticketLink,
            companyName: "Our",
            supportEmail: input.supportEmail || "support@example.com",
            dashboardUrl: input.ticketLink.split("/ticket")[0],
        };
        const template = ticketUpdateTemplate(variables);
        const result = await service.sendEmail({ email: input.email, name: input.name }, template, variables);
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
//# sourceMappingURL=email-workflows.js.map