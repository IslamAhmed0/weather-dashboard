import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export const redisClientProvider: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const logger = new Logger('RedisClient');

    const options: RedisOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      retryStrategy: (times) => Math.min(times * 100, 3000),
    };
    const redis = new Redis(options);
    redis.on('connect', () => {
      logger.log('Connected to Redis');
    });
    redis.on('error', (err) => {
      logger.error(`Redis connection error: ${err.message}`, err.stack);
    });

    redis.on('ready', () => {
      logger.log(`Redis client ready on ${options.host}:${options.port}`);
    });

    return redis;
  },
  inject: [],
}