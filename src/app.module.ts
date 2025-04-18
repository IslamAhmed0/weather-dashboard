import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigCustomModule } from './config/config.module';
import { WeatherModule } from './weather/weather.module';
import { CacheModule } from './shared/cache/cache.module';
import { CacheService } from './shared/cache/cache.service';
import { redisClientProvider } from './config/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigCustomModule,
    CacheModule,
    WeatherModule,
  ],
  providers: [
    CacheService,
    redisClientProvider,
  ],
})
export class AppModule {}
