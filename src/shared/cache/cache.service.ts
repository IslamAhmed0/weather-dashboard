// src/shared/cache/cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cachedData = await this.redis.get(key);
    return cachedData ? (JSON.parse(cachedData) as T) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    console.log(`Saving to Redis cache: ${key}`);
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl); // 'EX' to set TTL (in seconds)
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
