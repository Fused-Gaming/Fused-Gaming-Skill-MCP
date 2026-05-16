export * from './types.js';
export { aggregateSessions, formatUnifiedReview } from './tools/session-aggregation.js';
export declare const skillTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            date: {
                type: string;
                description: string;
            };
            accountSessions: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        account_id: {
                            type: string;
                        };
                        email: {
                            type: string;
                        };
                        web_chat_sessions: {
                            type: string;
                        };
                        code_sessions: {
                            type: string;
                        };
                        github_activities: {
                            type: string;
                        };
                    };
                };
            };
            review?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            reviews?: undefined;
            accountId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            review: {
                type: string;
                description: string;
            };
            date?: undefined;
            accountSessions?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            reviews?: undefined;
            accountId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            accountSessions: {
                type: string;
                description: string;
                items?: undefined;
            };
            date?: undefined;
            review?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            reviews?: undefined;
            accountId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            startDate: {
                type: string;
                description: string;
            };
            endDate: {
                type: string;
                description: string;
            };
            reviews: {
                type: string;
                description: string;
            };
            date?: undefined;
            accountSessions?: undefined;
            review?: undefined;
            accountId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            accountId: {
                type: string;
                description: string;
            };
            reviews: {
                type: string;
                description: string;
            };
            date?: undefined;
            accountSessions?: undefined;
            review?: undefined;
            startDate?: undefined;
            endDate?: undefined;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=index.d.ts.map