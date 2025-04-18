// src/shared/cache/cache.module.ts
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { redisClientProvider } from '../../config/cache.config';
import { ConfigCustomModule } from '../../config/config.module';


@Module({
  imports: [ConfigCustomModule],
  providers: [redisClientProvider, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
