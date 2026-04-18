export interface MemoryEntry {
  id: string;
  key: string;
  value: unknown;
  embedding?: number[];
  metadata: Record<string, unknown>;
  ttl?: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}

export interface VectorSearchResult {
  entry: MemoryEntry;
  similarity: number;
}

export interface MemoryStats {
  totalEntries: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  avgRetrievalTime: number;
}
