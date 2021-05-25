import NodeCache from 'node-cache';

class CacheUtil {
  protected cacheService;

  constructor() {
    this.cacheService = new NodeCache();
  }

  // TTL in seconds
  public set<T>(key: string, value: T, ttl = 3600): boolean {
    return this.cacheService.set(key, value, ttl);
  }

  public get<T>(key: string): T | undefined {
    return this.cacheService.get<T>(key);
  }

  public remove(key: string): void {
    this.cacheService.del(key);
  }

  public clearAll(): void {
    return this.cacheService.flushAll();
  }
}

export const cache = new CacheUtil();
