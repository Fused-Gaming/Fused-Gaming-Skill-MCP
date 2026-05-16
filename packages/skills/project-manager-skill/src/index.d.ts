export * from './types.js';
export * from './tools/task-management.js';
export declare const skillTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            title: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            projectId: {
                type: string;
                description: string;
            };
            priority: {
                type: string;
                enum: string[];
            };
            assignee: {
                type: string;
                description: string;
            };
            dueDate: {
                type: string;
                description: string;
            };
            estimatedHours: {
                type: string;
                description: string;
            };
            labels: {
                type: string;
                items: {
                    type: string;
                };
            };
            taskId?: undefined;
            status?: undefined;
            hours?: undefined;
            tasks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            taskId: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            title?: undefined;
            description?: undefined;
            projectId?: undefined;
            priority?: undefined;
            assignee?: undefined;
            dueDate?: undefined;
            estimatedHours?: undefined;
            labels?: undefined;
            hours?: undefined;
            tasks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            taskId: {
                type: string;
                description: string;
            };
            assignee: {
                type: string;
                description: string;
            };
            title?: undefined;
            description?: undefined;
            projectId?: undefined;
            priority?: undefined;
            dueDate?: undefined;
            estimatedHours?: undefined;
            labels?: undefined;
            status?: undefined;
            hours?: undefined;
            tasks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            taskId: {
                type: string;
                description: string;
            };
            hours: {
                type: string;
                description: string;
            };
            title?: undefined;
            description?: undefined;
            projectId?: undefined;
            priority?: undefined;
            assignee?: undefined;
            dueDate?: undefined;
            estimatedHours?: undefined;
            labels?: undefined;
            status?: undefined;
            tasks?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            projectId: {
                type: string;
                description: string;
            };
            tasks: {
                type: string;
                description: string;
            };
            title?: undefined;
            description?: undefined;
            priority?: undefined;
            assignee?: undefined;
            dueDate?: undefined;
            estimatedHours?: undefined;
            labels?: undefined;
            taskId?: undefined;
            status?: undefined;
            hours?: undefined;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=index.d.ts.map