import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomConfigService {
  get(key: string): string | undefined {
    return process.env[key];
  }

  getWeatherApiKey(): string {
    return this.get('WEATHER_API_KEY') || '';
  }

  getCacheTTL(): number {
    return parseInt(this.get('CACHE_TTL') || '300', 10);
  }

  getPort(): number {
    return parseInt(this.get('PORT') || '3000', 10);
  }

  getRedisHost(): string {
    return this.get('REDIS_HOST') || 'localhost';
  }

  getRedisPort(): number {
    return parseInt(this.get('REDIS_PORT') || '6379', 10);
  }
}
