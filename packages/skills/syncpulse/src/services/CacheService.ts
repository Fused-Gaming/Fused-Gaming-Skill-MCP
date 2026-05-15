import fs from "fs/promises";
import path from "path";

export interface CacheStats {
  size: number;
  hitCount: number;
  missCount: number;
  evictionCount: number;
  hitRate: number;
}

export class CacheService<T = unknown> {
  private cache = new Map<string, T>();
  private ttlMap = new Map<string, number>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  private stats = {
    hitCount: 0,
    missCount: 0,
    evictionCount: 0,
  };

  private readonly maxSize: number;
  private readonly batchSize: number;

  constructor(
    private dir = ".cache",
    maxSize = 100_000,
    batchSize = 100
  ) {
    this.maxSize = maxSize;
    this.batchSize = batchSize;
  }

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value);
    this.accessOrder.set(key, this.accessCounter++);
    if (ttl) this.ttlMap.set(key, Date.now() + ttl);

    if (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  get(key: string): T | null {
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

  private evictLRU(): void {
    let lruKey: string | null = null;
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

  getStats(): CacheStats {
    const total = this.stats.hitCount + this.stats.missCount;
    return {
      size: this.cache.size,
      hitCount: this.stats.hitCount,
      missCount: this.stats.missCount,
      evictionCount: this.stats.evictionCount,
      hitRate: total > 0 ? this.stats.hitCount / total : 0,
    };
  }

  async persist(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const entries = Array.from(this.cache.entries());
    const batchCount = Math.ceil(entries.length / this.batchSize);

    // Delete old batch files that are no longer needed
    const files = await fs.readdir(this.dir);
    for (const file of files) {
      if (!file.startsWith("batch-") || !file.endsWith(".jsonl")) continue;
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
      const batchPath = path.join(
        this.dir,
        `batch-${Math.floor(i / this.batchSize)}.jsonl`
      );

      const lines = batch
        .map(([key, value]) => JSON.stringify({ key, value }))
        .join("\n");

      await fs.writeFile(batchPath, lines);
    }
  }

  async hydrate(): Promise<void> {
    try {
      const files = await fs.readdir(this.dir);
      for (const file of files) {
        const full = path.join(this.dir, file);

        // Handle new .jsonl format
        if (file.endsWith(".jsonl")) {
          const content = await fs.readFile(full, "utf-8");
          const lines = content.split("\n").filter((l) => l.trim());

          for (const line of lines) {
            const { key, value } = JSON.parse(line);
            this.cache.set(key, value);
            this.accessOrder.set(key, this.accessCounter++);

            // Enforce maxSize cap during hydration
            if (this.cache.size > this.maxSize) {
              this.evictLRU();
            }
          }
        }
        // Handle legacy .json format for backward compatibility
        else if (file.endsWith(".json")) {
          try {
            const content = await fs.readFile(full, "utf-8");
            const data = JSON.parse(content);

            // Legacy format: filename (without .json) is the cache key, entire content is the value
            const key = file.replace(/\.json$/, "");
            this.cache.set(key, data);
            this.accessOrder.set(key, this.accessCounter++);

            // Enforce maxSize cap during hydration
            if (this.cache.size > this.maxSize) {
              this.evictLRU();
            }
          } catch (parseError) {
            // Log but continue if a legacy file is malformed
            console.warn(`Failed to parse legacy cache file ${file}:`, parseError);
          }
        }
      }
    } catch {
      // ignore if directory doesn't exist
    }
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
    this.ttlMap.clear();
    this.accessOrder.clear();
    this.stats = { hitCount: 0, missCount: 0, evictionCount: 0 };
  }
}
