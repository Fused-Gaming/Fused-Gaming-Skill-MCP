import fs from "fs/promises";
import path from "path";

export interface CacheEntry {
  key: string;
  value: unknown;
  timestamp: number;
  ttl?: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private ttlMap = new Map<string, number>();

  constructor(private dir = ".cache") {}

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    });
    if (ttl) this.ttlMap.set(key, Date.now() + ttl);
  }

  get(key: string): unknown {
    const expiry = this.ttlMap.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.ttlMap.delete(key);
      return null;
    }
    const entry = this.cache.get(key);
    return entry?.value;
  }

  async search(query: string, limit = 10): Promise<CacheEntry[]> {
    const regex = new RegExp(query, "i");
    const results = Array.from(this.cache.values())
      .filter((entry) => regex.test(entry.key))
      .slice(0, limit);
    return results;
  }

  async persist(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const entries = Array.from(this.cache.entries());
    for (const [, entry] of entries) {
      const file = path.join(this.dir, `${entry.key}.json`);
      await fs.writeFile(file, JSON.stringify(entry.value, null, 2));
    }
  }

  async hydrate(): Promise<void> {
    try {
      const files = await fs.readdir(this.dir);
      for (const file of files) {
        const full = path.join(this.dir, file);
        const data = JSON.parse(await fs.readFile(full, "utf-8"));
        this.cache.set(file.replace(".json", ""), {
          key: file.replace(".json", ""),
          value: data,
          timestamp: Date.now(),
        });
      }
    } catch {
      // ignore if directory doesn't exist
    }
  }
}
