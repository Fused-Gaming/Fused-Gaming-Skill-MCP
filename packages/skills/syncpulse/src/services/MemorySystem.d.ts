import { MemoryEntry, VectorSearchResult, MemoryStats } from "../types/index.js";
export interface RateLimitConfig {
    queriesPerSecond: number;
    burstSize: number;
}
export declare class MemorySystem {
    private entries;
    private vectorIndex;
    private stats;
    private tokens;
    private lastRefill;
    private rateLimitConfig;
    constructor(rateLimitConfig?: RateLimitConfig);
    private refillTokens;
    private isRateLimited;
    set(key: string, value: unknown, metadata?: Record<string, unknown>): void;
    get(key: string): unknown | null;
    private updateHitRate;
    vectorSearch(query: string, limit?: number): VectorSearchResult[];
    private calculateSimilarity;
    private levenshteinDistance;
    getStats(): MemoryStats;
    clear(): void;
    listEntries(limit?: number): MemoryEntry[];
}
//# sourceMappingURL=MemorySystem.d.ts.map