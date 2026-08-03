import { AI_CONFIG } from '../../config/ai';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class AICache {
  private cache = new Map<string, CacheEntry<unknown>>();

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > AI_CONFIG.cacheTtlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new AICache();
