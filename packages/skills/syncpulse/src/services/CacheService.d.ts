export interface CacheStats {
    size: number;
    hitCount: number;
    missCount: number;
    evictionCount: number;
    hitRate: number;
}
export declare class CacheService<T = unknown> {
    private dir;
    private cache;
    private ttlMap;
    private accessOrder;
    private accessCounter;
    private stats;
    private readonly maxSize;
    private readonly batchSize;
    constructor(dir?: string, maxSize?: number, batchSize?: number);
    set(key: string, value: T, ttl?: number): void;
    get(key: string): T | null;
    private evictLRU;
    getStats(): CacheStats;
    persist(): Promise<void>;
    hydrate(): Promise<void>;
    size(): number;
    clear(): void;
}
//# sourceMappingURL=CacheService.d.ts.map