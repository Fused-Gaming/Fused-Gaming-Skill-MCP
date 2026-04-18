import { MemoryEntry, VectorSearchResult, MemoryStats } from "../types/index.js";

export class MemorySystem {
  private entries = new Map<string, MemoryEntry>();
  private stats: MemoryStats = {
    totalEntries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    avgRetrievalTime: 0,
  };

  set(key: string, value: unknown, metadata: Record<string, unknown> = {}): void {
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
    this.stats.totalEntries += 1;
  }

  get(key: string): unknown | null {
    const startTime = Date.now();
    const entry = this.entries.get(key);

    if (!entry) {
      this.stats.cacheMisses += 1;
      this.updateHitRate();
      return null;
    }

    // Check TTL
    if (entry.ttl && Date.now() - entry.createdAt > entry.ttl) {
      this.entries.delete(key);
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

  private updateHitRate(): void {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    this.stats.hitRate = total > 0 ? this.stats.cacheHits / total : 0;
  }

  vectorSearch(query: string, limit: number = 10): VectorSearchResult[] {
    // Simplified vector search based on string similarity
    const queryLower = query.toLowerCase();
    const results: VectorSearchResult[] = [];

    for (const entry of this.entries.values()) {
      const keyLower = entry.key.toLowerCase();
      const similarity = this.calculateSimilarity(queryLower, keyLower);

      if (similarity > 0.3) {
        results.push({ entry, similarity });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  private calculateSimilarity(a: string, b: string): number {
    // Levenshtein distance based similarity
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return 1.0 - editDistance / longer.length;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

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
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  getStats(): MemoryStats {
    return { ...this.stats };
  }

  clear(): void {
    this.entries.clear();
    this.stats = {
      totalEntries: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      avgRetrievalTime: 0,
    };
  }

  listEntries(limit: number = 100): MemoryEntry[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, limit);
  }
}
