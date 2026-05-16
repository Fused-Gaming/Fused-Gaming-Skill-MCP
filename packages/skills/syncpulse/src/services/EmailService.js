import nodemailer from "nodemailer";
export class EmailService {
    constructor() {
        this.transporter = null;
        this.config = null;
        this.isInitialized = false;
        this.initializeFromEnvironment();
    }
    initializeFromEnvironment() {
        const required = ["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASS", "MAIL_FROM"];
        const missing = required.filter((key) => !process.env[key]);
        if (missing.length > 0) {
            console.warn(`⚠️  EmailService: Missing environment variables: ${missing.join(", ")}`);
            return;
        }
        this.config = {
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || "587", 10),
            secure: process.env.MAIL_SECURE === "true",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            from: process.env.MAIL_FROM,
        };
        this.createTransporter();
    }
    createTransporter() {
        if (!this.config) {
            throw new Error("EmailService not configured. Call initializeWithConfig() first.");
        }
        this.transporter = nodemailer.createTransport(this.config);
        this.isInitialized = true;
    }
    initializeWithConfig(config) {
        this.config = config;
        this.createTransporter();
    }
    async verifyConnection() {
        if (!this.transporter) {
            return false;
        }
        try {
            await this.transporter.verify();
            return true;
        }
        catch {
            return false;
        }
    }
    async sendEmail(recipients, template, variables) {
        if (!this.isInitialized || !this.transporter || !this.config) {
            return {
                success: false,
                error: "EmailService not initialized. Configure environment variables or call initializeWithConfig().",
            };
        }
        const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
        let firstMessageId;
        const errors = [];
        for (const recipient of recipientArray) {
            const to = recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
            const mergedVariables = {
                ...(variables || {}),
                ...recipient.variables,
            };
            const html = this.interpolateTemplate(template.html, mergedVariables);
            const text = template.text ? this.interpolateTemplate(template.text, mergedVariables) : undefined;
            const mailOptions = {
                from: this.config.from,
                to,
                subject: this.interpolateTemplate(template.subject, mergedVariables),
                html,
                text,
            };
            try {
                const result = await this.transporter.sendMail(mailOptions);
                if (!firstMessageId) {
                    firstMessageId = result.messageId;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                errors.push(`${recipient.email}: ${errorMessage}`);
            }
        }
        if (errors.length === 0) {
            return {
                success: true,
                messageId: firstMessageId,
            };
        }
        return {
            success: false,
            error: errors.join("; "),
        };
    }
    async sendBulk(recipients, template, globalVariables) {
        const results = {
            success: 0,
            failed: 0,
            errors: [],
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
            }
            else {
                results.failed++;
                results.errors.push({
                    email: recipient.email,
                    error: result.error || "Unknown error",
                });
            }
        }
        return results;
    }
    interpolateTemplate(template, variables) {
        return Object.entries(variables).reduce((acc, [key, value]) => {
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return acc.replace(new RegExp(`{{${escapedKey}}}`, "g"), value);
        }, template);
    }
    getConfig() {
        return this.config;
    }
    isConfigured() {
        return this.isInitialized;
    }
}
export default EmailService;
//# sourceMappingURL=EmailService.js.map