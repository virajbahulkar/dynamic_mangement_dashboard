interface CacheEntry<T> { value: T; ts: number; hits: number; }

export class TransformCacheService<T=any> {
  private store = new Map<string, CacheEntry<T>>();
  constructor(private maxEntries = 200) {}

  makeKey(parts: (string|undefined|null)[]): string {
    return parts.filter(Boolean).join('::');
  }

  get(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    e.hits++;
    return e.value;
  }

  set(key: string, value: T) {
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      // simple eviction: remove oldest by ts
      let oldestKey: string | undefined; let oldestTs = Infinity;
      for (const [k,v] of this.store) { if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; } }
      if (oldestKey) this.store.delete(oldestKey);
    }
    this.store.set(key, { value, ts: Date.now(), hits: 0 });
  }

  stats() {
    let totalHits = 0; for (const v of this.store.values()) totalHits += v.hits;
    return { size: this.store.size, totalHits };
  }

  clear() { this.store.clear(); }
}

export const transformCache = new TransformCacheService<any>(300);
