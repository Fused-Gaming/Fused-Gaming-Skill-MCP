export interface VectorIndexEntry {
    key: string;
    tokens: Set<string>;
    length: number;
}
export interface SearchResult {
    key: string;
    similarity: number;
}
export declare class VectorIndex {
    private entries;
    private tokenIndex;
    private lengthBuckets;
    add(key: string): void;
    remove(key: string): void;
    search(query: string, limit?: number, threshold?: number): SearchResult[];
    private tokenize;
    private fastSimilarity;
    clear(): void;
    size(): number;
}
//# sourceMappingURL=VectorIndex.d.ts.map