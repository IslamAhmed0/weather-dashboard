import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ConfigCustomModule } from '../config/config.module';
import { CacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [ConfigCustomModule,CacheModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
