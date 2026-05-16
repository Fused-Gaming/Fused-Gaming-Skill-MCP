import fs from "fs/promises";
import path from "path";
export class CacheService {
    constructor(dir = ".cache", maxSize = 100000, batchSize = 100) {
        this.dir = dir;
        this.cache = new Map();
        this.ttlMap = new Map();
        this.accessOrder = new Map();
        this.accessCounter = 0;
        this.stats = {
            hitCount: 0,
            missCount: 0,
            evictionCount: 0,
        };
        this.maxSize = maxSize;
        this.batchSize = batchSize;
    }
    set(key, value, ttl) {
        this.cache.set(key, value);
        this.accessOrder.set(key, this.accessCounter++);
        if (ttl)
            this.ttlMap.set(key, Date.now() + ttl);
        if (this.cache.size > this.maxSize) {
            this.evictLRU();
        }
    }
    get(key) {
        const expiry = this.ttlMap.get(key);
        if (expiry && Date.now() > expiry) {
            this.cache.delete(key);
            this.ttlMap.delete(key);
            this.accessOrder.delete(key);
            this.stats.missCount++;
            return null;
        }
        const value = this.cache.get(key);
        if (value === undefined) {
            this.stats.missCount++;
            return null;
        }
        this.accessOrder.set(key, this.accessCounter++);
        this.stats.hitCount++;
        return value;
    }
    evictLRU() {
        let lruKey = null;
        let minAccess = Infinity;
        for (const [key, accessTime] of this.accessOrder.entries()) {
            if (accessTime < minAccess) {
                minAccess = accessTime;
                lruKey = key;
            }
        }
        if (lruKey) {
            this.cache.delete(lruKey);
            this.ttlMap.delete(lruKey);
            this.accessOrder.delete(lruKey);
            this.stats.evictionCount++;
        }
    }
    getStats() {
        const total = this.stats.hitCount + this.stats.missCount;
        return {
            size: this.cache.size,
            hitCount: this.stats.hitCount,
            missCount: this.stats.missCount,
            evictionCount: this.stats.evictionCount,
            hitRate: total > 0 ? this.stats.hitCount / total : 0,
        };
    }
    async persist() {
        await fs.mkdir(this.dir, { recursive: true });
        const entries = Array.from(this.cache.entries());
        const batchCount = Math.ceil(entries.length / this.batchSize);
        const files = await fs.readdir(this.dir);
        for (const file of files) {
            if (!file.startsWith("batch-") || !file.endsWith(".jsonl"))
                continue;
            const match = file.match(/batch-(\d+)\.jsonl/);
            if (match) {
                const batchNum = parseInt(match[1], 10);
                if (batchNum >= batchCount) {
                    await fs.unlink(path.join(this.dir, file));
                }
            }
        }
        for (let i = 0; i < entries.length; i += this.batchSize) {
            const batch = entries.slice(i, i + this.batchSize);
            const batchPath = path.join(this.dir, `batch-${Math.floor(i / this.batchSize)}.jsonl`);
            const lines = batch
                .map(([key, value]) => JSON.stringify({ key, value }))
                .join("\n");
            await fs.writeFile(batchPath, lines);
        }
    }
    async hydrate() {
        try {
            const files = await fs.readdir(this.dir);
            for (const file of files) {
                if (!file.endsWith(".jsonl"))
                    continue;
                const full = path.join(this.dir, file);
                const content = await fs.readFile(full, "utf-8");
                const lines = content.split("\n").filter((l) => l.trim());
                for (const line of lines) {
                    const { key, value } = JSON.parse(line);
                    this.cache.set(key, value);
                    this.accessOrder.set(key, this.accessCounter++);
                    if (this.cache.size > this.maxSize) {
                        this.evictLRU();
                    }
                }
            }
        }
        catch {
        }
    }
    size() {
        return this.cache.size;
    }
    clear() {
        this.cache.clear();
        this.ttlMap.clear();
        this.accessOrder.clear();
        this.stats = { hitCount: 0, missCount: 0, evictionCount: 0 };
    }
}
//# sourceMappingURL=CacheService.js.map