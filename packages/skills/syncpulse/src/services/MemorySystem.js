import { VectorIndex } from "./VectorIndex.js";
export class MemorySystem {
    constructor(rateLimitConfig = { queriesPerSecond: 1000, burstSize: 100 }) {
        this.entries = new Map();
        this.vectorIndex = new VectorIndex();
        this.stats = {
            totalEntries: 0,
            cacheHits: 0,
            cacheMisses: 0,
            hitRate: 0,
            avgRetrievalTime: 0,
        };
        this.rateLimitConfig = rateLimitConfig;
        this.tokens = rateLimitConfig.burstSize;
        this.lastRefill = Date.now();
    }
    refillTokens() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        const tokensToAdd = elapsed * this.rateLimitConfig.queriesPerSecond;
        this.tokens = Math.min(this.rateLimitConfig.burstSize, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
    isRateLimited() {
        this.refillTokens();
        if (this.tokens < 1) {
            return true;
        }
        this.tokens -= 1;
        return false;
    }
    set(key, value, metadata = {}) {
        const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.entries.set(key, {
            id,
            key,
            value,
            metadata,
            createdAt: Date.now(),
            accessCount: 0,
            lastAccessed: Date.now(),
        });
        this.vectorIndex.add(key);
        this.stats.totalEntries += 1;
    }
    get(key) {
        const startTime = Date.now();
        const entry = this.entries.get(key);
        if (!entry) {
            this.stats.cacheMisses += 1;
            this.updateHitRate();
            return null;
        }
        if (entry.ttl && Date.now() - entry.createdAt > entry.ttl) {
            this.entries.delete(key);
            this.vectorIndex.remove(key);
            this.stats.cacheMisses += 1;
            this.updateHitRate();
            return null;
        }
        entry.accessCount += 1;
        entry.lastAccessed = Date.now();
        this.stats.cacheHits += 1;
        this.updateHitRate();
        const retrievalTime = Date.now() - startTime;
        this.stats.avgRetrievalTime =
            (this.stats.avgRetrievalTime * (this.stats.cacheHits - 1) + retrievalTime) /
                this.stats.cacheHits;
        return entry.value;
    }
    updateHitRate() {
        const total = this.stats.cacheHits + this.stats.cacheMisses;
        this.stats.hitRate = total > 0 ? this.stats.cacheHits / total : 0;
    }
    vectorSearch(query, limit = 10) {
        if (this.isRateLimited()) {
            console.warn("[MemorySystem] Rate limit exceeded; returning empty results");
            return [];
        }
        const indexResults = this.vectorIndex.search(query, limit, 0.3);
        return indexResults.map((result) => ({
            entry: this.entries.get(result.key),
            similarity: result.similarity,
        }));
    }
    calculateSimilarity(a, b) {
        const longer = a.length > b.length ? a : b;
        const shorter = a.length > b.length ? b : a;
        if (longer.length === 0)
            return 1.0;
        const editDistance = this.levenshteinDistance(longer, shorter);
        return 1.0 - editDistance / longer.length;
    }
    levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[b.length][a.length];
    }
    getStats() {
        return { ...this.stats };
    }
    clear() {
        this.entries.clear();
        this.vectorIndex.clear();
        this.stats = {
            totalEntries: 0,
            cacheHits: 0,
            cacheMisses: 0,
            hitRate: 0,
            avgRetrievalTime: 0,
        };
    }
    listEntries(limit = 100) {
        return Array.from(this.entries.values())
            .sort((a, b) => b.lastAccessed - a.lastAccessed)
            .slice(0, limit);
    }
}
//# sourceMappingURL=MemorySystem.js.map