import fs from "fs/promises";
import path from "path";

export class CacheService<T = unknown> {
  private cache = new Map<string, T>();
  private ttlMap = new Map<string, number>();

  constructor(private dir = ".cache") {}

  set(key: string, value: T, ttl?: number) {
    this.cache.set(key, value);
    if (ttl) this.ttlMap.set(key, Date.now() + ttl);
  }

  get(key: string): T | null {
    const expiry = this.ttlMap.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.ttlMap.delete(key);
      return null;
    }
    return this.cache.get(key) ?? null;
  }

  async persist() {
    await fs.mkdir(this.dir, { recursive: true });
    const entries = Array.from(this.cache.entries());
    for (const [key, value] of entries) {
      const file = path.join(this.dir, `${key}.json`);
      await fs.writeFile(file, JSON.stringify(value, null, 2));
    }
  }

  async hydrate() {
    try {
      const files = await fs.readdir(this.dir);
      for (const file of files) {
        const full = path.join(this.dir, file);
        const data = JSON.parse(await fs.readFile(full, "utf-8"));
        this.cache.set(file.replace(".json", ""), data);
      }
    } catch {
      // ignore if directory doesn't exist
    }
  }
}
