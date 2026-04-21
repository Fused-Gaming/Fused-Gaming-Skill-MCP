export interface MemoryEntry {
  key: string;
  value: unknown;
  timestamp: number;
  ttl?: number;
}

export class MemorySystem {
  private memory = new Map<string, MemoryEntry>();

  store(key: string, value: unknown, ttl?: number): void {
    this.memory.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  retrieve(key: string): unknown {
    const entry = this.memory.get(key);
    if (!entry) return null;

    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.memory.delete(key);
      return null;
    }

    return entry.value;
  }

  search(pattern: string): MemoryEntry[] {
    const regex = new RegExp(pattern, "i");
    return Array.from(this.memory.values()).filter((entry) => regex.test(entry.key));
  }

  clear(): void {
    this.memory.clear();
  }

  getStats(): { totalEntries: number; memoryUsage: number } {
    let memoryUsage = 0;
    for (const entry of this.memory.values()) {
      memoryUsage += JSON.stringify(entry).length;
    }
    return {
      totalEntries: this.memory.size,
      memoryUsage,
    };
  }
}
