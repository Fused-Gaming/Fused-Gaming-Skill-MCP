import { CacheService } from "../services/CacheService.js";
import { MemorySystem } from "../services/MemorySystem.js";
import { SwarmOrchestrator } from "../services/SwarmOrchestrator.js";
import { TaskOrchestrator } from "../services/TaskOrchestrator.js";
export { sendEmail, sendBulkEmail, sendMarketingCampaign, verifyEmailConfiguration, } from "./email-tools.js";
export { sendMagicLink, sendMFACode, sendPasswordReset, sendSecurityAlert, sendInvoice, sendNewsletter, sendOutageNotice, sendMaintenanceNotice, sendTicketUpdate, } from "./email-workflows.js";
export declare function synchronizeProjectState(cache: CacheService, memory: MemorySystem): (input: {
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
export declare function queryProjectCache(cache: CacheService, memory: MemorySystem): (input: {
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
export declare function coordinateAgents(swarm: SwarmOrchestrator, tasks: TaskOrchestrator): (input: {
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
        status: import("../index.js").TaskStatus;
    }[];
}>;
export declare function analyzePerformance(swarm: SwarmOrchestrator, memory: MemorySystem): (input: {
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
            topology: import("../index.js").SwarmTopology;
            healthScore: string;
            completedTasks: number;
            failedTasks: number;
            throughput: string;
        }[];
    };
}>;
//# sourceMappingURL=index.d.ts.map