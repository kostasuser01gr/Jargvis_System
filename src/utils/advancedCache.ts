interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  key: string;
}

type EvictionStrategy = 'LRU' | 'LFU' | 'FIFO' | 'TTL';

export class AdvancedCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private strategy: EvictionStrategy;
  private accessLog: Map<string, number[]> = new Map();

  constructor(maxSize = 100, strategy: EvictionStrategy = 'LRU') {
    this.maxSize = maxSize;
    this.strategy = strategy;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, data: T, ttl: number = 3600000): void {
    // Evict if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      key
    });

    // Initialize access log
    if (!this.accessLog.has(key)) {
      this.accessLog.set(key, []);
    }
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.logAccess(key, false);
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.logAccess(key, false);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.logAccess(key, true);

    return entry.data as T;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    this.accessLog.delete(key);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessLog.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    const entries = Array.from(this.cache.values());
    const totalAccesses = entries.reduce((sum, e) => sum + e.accessCount, 0);
    const hits = Array.from(this.accessLog.values())
      .reduce((sum, log) => sum + log.filter(a => a === 1).length, 0);
    const misses = Array.from(this.accessLog.values())
      .reduce((sum, log) => sum + log.filter(a => a === 0).length, 0);
    const totalRequests = hits + misses;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
      totalAccesses,
      strategy: this.strategy,
      averageAccessCount: entries.length > 0 
        ? totalAccesses / entries.length 
        : 0
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all values
   */
  values<T>(): T[] {
    return Array.from(this.cache.values()).map(e => e.data);
  }

  /**
   * Get cache entry metadata
   */
  getMetadata(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    return {
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      expiresAt: entry.timestamp + entry.ttl,
      accessCount: entry.accessCount,
      lastAccessed: entry.lastAccessed,
      isExpired: Date.now() - entry.timestamp > entry.ttl
    };
  }

  /**
   * Evict entries based on strategy
   */
  private evict(): void {
    let keyToEvict: string | null = null;
    let minValue = Infinity;

    if (this.strategy === 'LRU') {
      // Least Recently Used
      for (const [key, entry] of this.cache.entries()) {
        if (entry.lastAccessed < minValue) {
          minValue = entry.lastAccessed;
          keyToEvict = key;
        }
      }
    } else if (this.strategy === 'LFU') {
      // Least Frequently Used
      for (const [key, entry] of this.cache.entries()) {
        if (entry.accessCount < minValue) {
          minValue = entry.accessCount;
          keyToEvict = key;
        }
      }
    } else if (this.strategy === 'FIFO') {
      // First In First Out
      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < minValue) {
          minValue = entry.timestamp;
          keyToEvict = key;
        }
      }
    } else if (this.strategy === 'TTL') {
      // Time To Live - evict expired entries first
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        const age = now - entry.timestamp;
        if (age > entry.ttl) {
          keyToEvict = key;
          break;
        }
      }
      // If no expired entries, fall back to LRU
      if (!keyToEvict) {
        for (const [key, entry] of this.cache.entries()) {
          if (entry.lastAccessed < minValue) {
            minValue = entry.lastAccessed;
            keyToEvict = key;
          }
        }
      }
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.accessLog.delete(keyToEvict);
    }
  }

  /**
   * Log access for statistics
   */
  private logAccess(key: string, hit: boolean): void {
    if (!this.accessLog.has(key)) {
      this.accessLog.set(key, []);
    }
    const log = this.accessLog.get(key)!;
    log.push(hit ? 1 : 0);
    // Keep only last 1000 accesses
    if (log.length > 1000) {
      log.shift();
    }
  }

  /**
   * Warm cache with multiple entries
   */
  warm<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl);
    });
  }

  /**
   * Invalidate entries matching pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get entries expiring soon
   */
  getExpiringSoon(threshold: number = 60000): Array<{ key: string; expiresIn: number }> {
    const now = Date.now();
    const expiring: Array<{ key: string; expiresIn: number }> = [];

    for (const [key, entry] of this.cache.entries()) {
      const expiresAt = entry.timestamp + entry.ttl;
      const expiresIn = expiresAt - now;
      if (expiresIn > 0 && expiresIn <= threshold) {
        expiring.push({ key, expiresIn });
      }
    }

    return expiring.sort((a, b) => a.expiresIn - b.expiresIn);
  }
}

// Create singleton instances with different strategies
export const lruCache = new AdvancedCache(1000, 'LRU');
export const lfuCache = new AdvancedCache(1000, 'LFU');
export const fifoCache = new AdvancedCache(1000, 'FIFO');
export const ttlCache = new AdvancedCache(1000, 'TTL');

// Default cache instance
export const cache = lruCache;
