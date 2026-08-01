/**
 * Single-fetch Data Caching Layer
 * Prevents duplicate Firestore network reads and enables sub-50ms instant data retrieval.
 */

class CacheService {
  constructor() {
    this.memoryCache = new Map();
  }

  get(key) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    try {
      const stored = localStorage.getItem(`mq_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.memoryCache.set(key, parsed.data);
        return parsed.data;
      }
    } catch (e) {
      console.warn("Cache read error:", e);
    }
    return null;
  }

  set(key, data, ttlSeconds = 600) {
    this.memoryCache.set(key, data);
    try {
      localStorage.setItem(
        `mq_cache_${key}`,
        JSON.stringify({
          data,
          expiry: Date.now() + ttlSeconds * 1000
        })
      );
    } catch (e) {
      console.warn("Cache write error:", e);
    }
  }

  clear(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`mq_cache_${key}`);
    } catch (e) {}
  }
}

export const cacheService = new CacheService();
