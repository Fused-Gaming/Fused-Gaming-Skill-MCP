export class VectorIndex {
    constructor() {
        this.entries = new Map();
        this.tokenIndex = new Map();
        this.lengthBuckets = new Map();
    }
    add(key) {
        const tokens = this.tokenize(key);
        const entry = {
            key,
            tokens,
            length: key.length,
        };
        this.entries.set(key, entry);
        for (const token of tokens) {
            if (!this.tokenIndex.has(token)) {
                this.tokenIndex.set(token, new Set());
            }
            this.tokenIndex.get(token).add(key);
        }
        const bucketSize = Math.ceil(key.length / 10) * 10;
        if (!this.lengthBuckets.has(bucketSize)) {
            this.lengthBuckets.set(bucketSize, new Set());
        }
        this.lengthBuckets.get(bucketSize).add(key);
    }
    remove(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return;
        for (const token of entry.tokens) {
            const set = this.tokenIndex.get(token);
            if (set) {
                set.delete(key);
                if (set.size === 0) {
                    this.tokenIndex.delete(token);
                }
            }
        }
        const bucketSize = Math.ceil(entry.length / 10) * 10;
        const bucket = this.lengthBuckets.get(bucketSize);
        if (bucket) {
            bucket.delete(key);
            if (bucket.size === 0) {
                this.lengthBuckets.delete(bucketSize);
            }
        }
        this.entries.delete(key);
    }
    search(query, limit = 10, threshold = 0.3) {
        const queryTokens = this.tokenize(query);
        const queryLength = query.length;
        const candidates = new Set();
        for (const token of queryTokens) {
            const matches = this.tokenIndex.get(token);
            if (matches) {
                for (const key of matches) {
                    candidates.add(key);
                }
            }
        }
        if (candidates.size < limit * 2) {
            for (const [bucketSize, keys] of this.lengthBuckets.entries()) {
                if (Math.abs(bucketSize - queryLength) <= queryLength * 0.5) {
                    for (const key of keys) {
                        candidates.add(key);
                    }
                }
            }
        }
        const results = [];
        for (const key of candidates) {
            const similarity = this.fastSimilarity(query, key);
            if (similarity >= threshold) {
                results.push({ key, similarity });
            }
        }
        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }
    tokenize(str) {
        const tokens = new Set();
        str = str.toLowerCase();
        for (let i = 0; i < str.length; i++) {
            for (let len = 1; len <= 3 && i + len <= str.length; len++) {
                tokens.add(str.substring(i, i + len));
            }
        }
        return tokens;
    }
    fastSimilarity(a, b) {
        if (a === b)
            return 1.0;
        const aTokens = this.tokenize(a);
        const bTokens = this.tokenize(b);
        let intersection = 0;
        for (const token of aTokens) {
            if (bTokens.has(token)) {
                intersection++;
            }
        }
        const union = aTokens.size + bTokens.size - intersection;
        return union > 0 ? intersection / union : 0;
    }
    clear() {
        this.entries.clear();
        this.tokenIndex.clear();
        this.lengthBuckets.clear();
    }
    size() {
        return this.entries.size;
    }
}
//# sourceMappingURL=VectorIndex.js.map