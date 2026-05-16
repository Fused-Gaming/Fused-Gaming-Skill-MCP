import { SwarmOrchestrator } from "./services/SwarmOrchestrator.js";
import { MemorySystem } from "./services/MemorySystem.js";
import { TaskOrchestrator } from "./services/TaskOrchestrator.js";
import { CacheService } from "./services/CacheService.js";
import { EmailService } from "./services/EmailService.js";
export declare function createSyncPulseSkill(): {
    name: string;
    description: string;
    version: string;
    organization: string;
    tools: ({
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                projectId: {
                    type: string;
                    description: string;
                };
                includeGit: {
                    type: string;
                    description: string;
                };
                cacheTTL: {
                    type: string;
                    description: string;
                };
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: {
            projectId: string;
            includeGit?: boolean;
            cacheTTL?: number;
        }) => Promise<{
            success: boolean;
            projectId: string;
            message: string;
            state: {
                projectId: string;
                synchronized: boolean;
                timestamp: number;
                gitIncluded: boolean;
            };
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                query: {
                    type: string;
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: {
            query: string;
            limit?: number;
        }) => Promise<{
            success: boolean;
            query: string;
            resultCount: number;
            results: {
                key: string;
                value: unknown;
                similarity: string;
            }[];
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                workflowId: {
                    type: string;
                };
                topology: {
                    type: string;
                    enum: string[];
                };
                tasks: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: {
            workflowId: string;
            topology: "hierarchical" | "mesh" | "adaptive";
            tasks: Array<{
                id: string;
                name: string;
                priority: number;
            }>;
        }) => Promise<{
            success: boolean;
            workflowId: string;
            topology: "hierarchical" | "mesh" | "adaptive";
            tasksCompleted: number;
            tasksFailed: number;
            metrics: {
                queueImbalance: number;
                predictedCompletion: number;
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                avgLatency: number;
                throughput: number;
                healthScore: number;
            } | null;
            results: {
                taskId: string;
                success: boolean;
                status: import("./index.js").TaskStatus;
            }[];
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                timeRange: {
                    type: string;
                    description: string;
                };
                metrics: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: {
            timeRange: string;
            metrics?: string[];
        }) => Promise<{
            success: boolean;
            timeRange: string;
            analysis: {
                memoryMetrics: {
                    totalEntries: number;
                    cacheHitRate: string;
                    avgRetrievalTime: string;
                };
                swarmMetrics: {
                    swarmId: string;
                    agentCount: number;
                    topology: import("./index.js").SwarmTopology;
                    healthScore: string;
                    completedTasks: number;
                    failedTasks: number;
                    throughput: string;
                }[];
            };
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                recipients: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                description: string;
                            };
                            name: {
                                type: string;
                                description: string;
                            };
                            variables?: undefined;
                        };
                        required: string[];
                    };
                    description: string;
                };
                subject: {
                    type: string;
                    description: string;
                };
                htmlBody: {
                    type: string;
                    description: string;
                };
                textBody: {
                    type: string;
                    description: string;
                };
                variables: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-tools.js").SendEmailInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            error: string | undefined;
            recipientCount: number;
            timestamp: string;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                recipients: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                description: string;
                            };
                            name: {
                                type: string;
                                description: string;
                            };
                            variables: {
                                type: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                    description: string;
                };
                subject: {
                    type: string;
                    description: string;
                };
                htmlBody: {
                    type: string;
                    description: string;
                };
                textBody: {
                    type: string;
                    description: string;
                };
                globalVariables: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                variables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-tools.js").SendBulkEmailInput) => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                campaignName: {
                    type: string;
                    description: string;
                };
                recipients: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                description: string;
                            };
                            name: {
                                type: string;
                                description: string;
                            };
                            variables: {
                                type: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                    description: string;
                };
                subject: {
                    type: string;
                    description: string;
                };
                htmlBody: {
                    type: string;
                    description: string;
                };
                textBody: {
                    type: string;
                    description: string;
                };
                trackingPixel: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-tools.js").SendMarketingCampaignInput) => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                supportEmail?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required?: undefined;
        };
        handler: () => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                magicLink: {
                    type: string;
                    description: string;
                };
                expiryMinutes: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendMagicLinkInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            type: string;
            timestamp: string;
            error: string | undefined;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                mfaCode: {
                    type: string;
                    description: string;
                };
                expiryMinutes: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                magicLink?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendMFACodeInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            type: string;
            timestamp: string;
            error: string | undefined;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                resetLink: {
                    type: string;
                    description: string;
                };
                expiryHours: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                mfaCode?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendPasswordResetInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            type: string;
            timestamp: string;
            error: string | undefined;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                alertType: {
                    type: string;
                    description: string;
                };
                timestamp: {
                    type: string;
                    description: string;
                };
                location: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendSecurityAlertInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            type: string;
            alertType: string;
            timestamp: string;
            error: string | undefined;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                invoiceNumber: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                dueDate: {
                    type: string;
                    description: string;
                };
                invoiceLink: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendInvoiceInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            invoiceNumber: string;
            type: string;
            timestamp: string;
            error: string | undefined;
        }>;
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                recipients: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                description?: undefined;
                            };
                            name: {
                                type: string;
                                description?: undefined;
                            };
                            variables?: undefined;
                        };
                        required: string[];
                    };
                    description: string;
                };
                title: {
                    type: string;
                    description: string;
                };
                contentHtml: {
                    type: string;
                    description: string;
                };
                unsubscribeLink: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                supportEmail?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                status?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendNewsletterInput) => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                recipientEmails: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                service: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    description: string;
                };
                startTime: {
                    type: string;
                    description: string;
                };
                estimatedResolution: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                endTime?: undefined;
                impact?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendOutageNoticeInput) => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                recipientEmails: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                service: {
                    type: string;
                    description: string;
                };
                startTime: {
                    type: string;
                    description: string;
                };
                endTime: {
                    type: string;
                    description: string;
                };
                impact: {
                    type: string;
                    description: string;
                };
                companyName: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                dashboardUrl: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                email?: undefined;
                name?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                status?: undefined;
                estimatedResolution?: undefined;
                ticketId?: undefined;
                ticketTitle?: undefined;
                updateMessage?: undefined;
                ticketLink?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendMaintenanceNoticeInput) => Promise<{
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
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                email: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                ticketId: {
                    type: string;
                    description: string;
                };
                ticketTitle: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    description: string;
                };
                updateMessage: {
                    type: string;
                    description: string;
                };
                ticketLink: {
                    type: string;
                    description: string;
                };
                supportEmail: {
                    type: string;
                    description: string;
                };
                projectId?: undefined;
                includeGit?: undefined;
                cacheTTL?: undefined;
                query?: undefined;
                limit?: undefined;
                workflowId?: undefined;
                topology?: undefined;
                tasks?: undefined;
                timeRange?: undefined;
                metrics?: undefined;
                recipients?: undefined;
                subject?: undefined;
                htmlBody?: undefined;
                textBody?: undefined;
                variables?: undefined;
                globalVariables?: undefined;
                campaignName?: undefined;
                trackingPixel?: undefined;
                magicLink?: undefined;
                expiryMinutes?: undefined;
                companyName?: undefined;
                dashboardUrl?: undefined;
                mfaCode?: undefined;
                resetLink?: undefined;
                expiryHours?: undefined;
                alertType?: undefined;
                timestamp?: undefined;
                location?: undefined;
                invoiceNumber?: undefined;
                amount?: undefined;
                dueDate?: undefined;
                invoiceLink?: undefined;
                title?: undefined;
                contentHtml?: undefined;
                unsubscribeLink?: undefined;
                recipientEmails?: undefined;
                service?: undefined;
                startTime?: undefined;
                estimatedResolution?: undefined;
                endTime?: undefined;
                impact?: undefined;
            };
            required: string[];
        };
        handler: (input: import("./tools/email-workflows.js").SendTicketUpdateInput) => Promise<{
            success: boolean;
            messageId: string | undefined;
            email: string;
            ticketId: string;
            type: string;
            status: string;
            timestamp: string;
            error: string | undefined;
        }>;
    })[];
    services: {
        swarm: SwarmOrchestrator;
        memory: MemorySystem;
        tasks: TaskOrchestrator;
        cache: CacheService<unknown>;
        email: EmailService;
    };
};
export { SwarmOrchestrator, MemorySystem, TaskOrchestrator, CacheService, EmailService };
export * from "./types/index.js";
//# sourceMappingURL=index.d.ts.map