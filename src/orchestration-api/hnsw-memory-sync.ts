import fs from 'fs';
import path from 'path';

export interface MemoryVector {
  id: string;
  agentId: string;
  embedding: number[];
  timestamp: number;
  contextSize: number;
  hitCount: number;
}

export interface MemoryIndex {
  vectorCount: number;
  dimensions: number;
  maxMemoryMB: number;
  usedMemoryMB: number;
  vectors: MemoryVector[];
  lastCompaction: number;
}

export interface SearchResult {
  id: string;
  agentId: string;
  distance: number;
  contextSize: number;
}

export class HNSWMemorySynchronizer {
  private indexPath: string;
  private index: MemoryIndex;
  private dimensions: number = 768; // Standard embedding dimension
  private maxVectors: number = 10000;
  private cacheTTLMs: number = 3600000; // 1 hour

  constructor(dataDir: string) {
    this.indexPath = path.join(dataDir, 'hnsw-index.json');
    this.index = this.loadIndex();
  }

  private loadIndex(): MemoryIndex {
    try {
      if (fs.existsSync(this.indexPath)) {
        const data = fs.readFileSync(this.indexPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load HNSW index:', error);
    }

    return {
      vectorCount: 0,
      dimensions: this.dimensions,
      maxMemoryMB: 5000,
      usedMemoryMB: 0,
      vectors: [],
      lastCompaction: Date.now()
    };
  }

  private saveIndex(): void {
    try {
      fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
    } catch (error) {
      console.error('Failed to save HNSW index:', error);
    }
  }

  public addMemoryVector(agentId: string, embedding: number[], contextSize: number = 1): string {
    // Check memory limits and compact if needed
    if (this.index.vectorCount >= this.maxVectors) {
      this.compactIndex();
    }

    const vectorId = `vec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const estimatedMemory = (embedding.length * 8) / 1024 / 1024; // Rough estimate

    const vector: MemoryVector = {
      id: vectorId,
      agentId,
      embedding,
      timestamp: Date.now(),
      contextSize,
      hitCount: 0
    };

    this.index.vectors.push(vector);
    this.index.vectorCount++;
    this.index.usedMemoryMB += estimatedMemory;

    this.saveIndex();
    return vectorId;
  }

  public searchNearest(queryEmbedding: number[], k: number = 5, maxDistance: number = 2.0): SearchResult[] {
    // Implement simplified cosine similarity search
    const results: SearchResult[] = [];

    for (const vector of this.index.vectors) {
      const distance = this.cosineSimilarity(queryEmbedding, vector.embedding);

      if (distance <= maxDistance) {
        results.push({
          id: vector.id,
          agentId: vector.agentId,
          distance,
          contextSize: vector.contextSize
        });

        vector.hitCount++;
      }
    }

    // Sort by distance and return top k
    return results.sort((a, b) => a.distance - b.distance).slice(0, k);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return Number.MAX_VALUE;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 1;

    return 1 - dotProduct / magnitude; // Distance = 1 - similarity
  }

  public synchronizeWithAgent(agentId: string): {
    vectorsStored: number;
    hitRate: number;
    averageDistance: number;
  } {
    const agentVectors = this.index.vectors.filter(v => v.agentId === agentId);
    const totalHits = agentVectors.reduce((sum, v) => sum + v.hitCount, 0);
    const hitRate = agentVectors.length > 0 ? totalHits / agentVectors.length : 0;
    const totalDistance = agentVectors.length > 0
      ? agentVectors.reduce((sum, v) => sum + (v.embedding.reduce((s, x) => s + x * x) ** 0.5), 0)
      : 0;

    return {
      vectorsStored: agentVectors.length,
      hitRate,
      averageDistance: agentVectors.length > 0 ? totalDistance / agentVectors.length : 0
    };
  }

  private compactIndex(): void {
    // Remove expired vectors (older than TTL)
    const now = Date.now();
    const beforeCount = this.index.vectors.length;

    this.index.vectors = this.index.vectors.filter(v => now - v.timestamp < this.cacheTTLMs);
    this.index.vectorCount = this.index.vectors.length;
    this.index.lastCompaction = now;

    // Recalculate used memory
    this.index.usedMemoryMB = this.index.vectors.reduce(
      (sum, v) => sum + (v.embedding.length * 8) / 1024 / 1024,
      0
    );

    this.saveIndex();
    console.log(`Compacted HNSW index: ${beforeCount} -> ${this.index.vectors.length} vectors`);
  }

  public getIndexStatus(): {
    totalVectors: number;
    dimensions: number;
    usedMemoryMB: number;
    maxMemoryMB: number;
    utilizationPercent: number;
    averageHitCount: number;
    lastCompaction: string;
  } {
    const avgHits = this.index.vectors.length > 0
      ? this.index.vectors.reduce((sum, v) => sum + v.hitCount, 0) / this.index.vectors.length
      : 0;

    return {
      totalVectors: this.index.vectorCount,
      dimensions: this.index.dimensions,
      usedMemoryMB: Math.round(this.index.usedMemoryMB * 100) / 100,
      maxMemoryMB: this.index.maxMemoryMB,
      utilizationPercent: Math.round((this.index.usedMemoryMB / this.index.maxMemoryMB) * 10000) / 100,
      averageHitCount: Math.round(avgHits * 100) / 100,
      lastCompaction: new Date(this.index.lastCompaction).toISOString()
    };
  }

  public getAgentMemoryProfile(agentId: string): {
    vectorsStored: number;
    memoryUsageMB: number;
    hitRate: number;
    mostRecentVector: string;
  } {
    const agentVectors = this.index.vectors.filter(v => v.agentId === agentId);
    const memoryUsage = agentVectors.reduce((sum, v) => sum + (v.embedding.length * 8) / 1024 / 1024, 0);
    const totalHits = agentVectors.reduce((sum, v) => sum + v.hitCount, 0);
    const hitRate = agentVectors.length > 0 ? totalHits / agentVectors.length : 0;
    const mostRecent = agentVectors.length > 0
      ? agentVectors.sort((a, b) => b.timestamp - a.timestamp)[0].id
      : '';

    return {
      vectorsStored: agentVectors.length,
      memoryUsageMB: Math.round(memoryUsage * 100) / 100,
      hitRate: Math.round(hitRate * 10000) / 100,
      mostRecentVector: mostRecent
    };
  }
}
