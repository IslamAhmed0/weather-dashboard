import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomConfigService } from '../config/config.service';
import { CacheService } from '../shared/cache/cache.service';
import axios from 'axios';
import {
  WeatherForecastDto,
  WeatherResponseDto,
} from './dto/weather-response.dto';
import {
  OpenWeatherForecastResponse,
  OpenWeatherResponse,
} from './interfaces/openweather.interface';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: CustomConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async getCurrentWeather(city: string): Promise<WeatherResponseDto> {
    const cacheKey = `weather-current-${city}`;
    const cached = await this.cacheService.get<WeatherResponseDto>(cacheKey);
    if (cached) return cached;
    const apiKey = this.configService.getWeatherApiKey();
    const apiUrl = this.configService.get('WEATHER_API_URL');
    const url = `${apiUrl}/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const res = await axios.get<OpenWeatherResponse>(url);
      const data: WeatherResponseDto = {
        city: res.data.name,
        temperature: res.data.main.temp,
        description: res.data.weather[0].description,
        humidity: res.data.main.humidity,
        windSpeed: res.data.wind.speed,
      };

      await this.cacheService.set(
        cacheKey,
        data,
        this.configService.getCacheTTL(),
      );
      return data;
    } catch (err) {
      throw new NotFoundException('City not found or API error');
    }
  }

  async getFiveDayForecast(city: string): Promise<WeatherForecastDto[]> {
    const cacheKey = `weather-forecast-${city}`;
    const cached = await this.cacheService.get<WeatherForecastDto[]>(cacheKey);

    if (cached) return cached;

    const apiKey = this.configService.getWeatherApiKey();
    const apiUrl = this.configService.get('WEATHER_API_URL');

    const url = `${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await axios.get<OpenWeatherForecastResponse>(url);

      const grouped: Record<
        string,
        { temps: number[]; descriptions: string[] }
      > = {};

      for (const item of res.data.list) {
        const date = item.dt_txt.split(' ')[0];
        if (!grouped[date]) grouped[date] = { temps: [], descriptions: [] };

        grouped[date].temps.push(item.main.temp);
        grouped[date].descriptions.push(item.weather[0].description);
      }

      const result: WeatherForecastDto[] = Object.keys(grouped).map((date) => {
        const temps = grouped[date].temps;
        const descriptions = grouped[date].descriptions;

        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const weatherDesc = descriptions.join(', ');

        return {
          date,
          averageTemperature: Number(avgTemp.toFixed(1)),
          weatherDescription: weatherDesc,
        };
      });

      await this.cacheService.set(
        cacheKey,
        result,
        this.configService.getCacheTTL(),
      );
      return result;
    } catch (err) {
      throw new NotFoundException('City not found or API error');
    }
  }
}
