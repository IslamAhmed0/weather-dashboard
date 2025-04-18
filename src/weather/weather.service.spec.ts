import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { CustomConfigService } from '../config/config.service';
import { CacheService } from '../shared/cache/cache.service';
import axios from 'axios';
import { NotFoundException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;
  let cacheService: CacheService;
  let configService: CustomConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: CustomConfigService,
          useValue: {
            getWeatherApiKey: jest.fn().mockReturnValue('test-api-key'),
            getCacheTTL: jest.fn().mockReturnValue(300),
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'WEATHER_API_URL') return 'http://api';
              return undefined;
            }),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    cacheService = module.get<CacheService>(CacheService);
    configService = module.get<CustomConfigService>(CustomConfigService);
  });

  it('should return cached current weather if available', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue({ city: 'Cairo' });
    const result = await service.getCurrentWeather('Cairo');
    expect(result).toEqual({ city: 'Cairo' });
  });

  it('should fetch current weather from API and cache it', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockResolvedValue({
      data: {
        name: 'Cairo',
        main: { temp: 25, humidity: 50 },
        weather: [{ description: 'sunny' }],
        wind: { speed: 10 },
      },
    });

    const result = await service.getCurrentWeather('Cairo');
    expect(result.city).toBe('Cairo');
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should throw NotFoundException when API fails (current)', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockRejectedValue(new Error('API error'));

    await expect(service.getCurrentWeather('InvalidCity')).rejects.toThrow(NotFoundException);
  });

  it('should return cached forecast if available', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue([{ date: '2025-04-17' }]);
    const result = await service.getFiveDayForecast('Cairo');
    expect(result).toEqual([{ date: '2025-04-17' }]);
  });

  it('should fetch forecast from API and cache it', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockResolvedValue({
      data: {
        list: [
          {
            dt_txt: '2025-04-17 12:00:00',
            main: { temp: 20 },
            weather: [{ description: 'cloudy' }],
          },
          {
            dt_txt: '2025-04-17 15:00:00',
            main: { temp: 22 },
            weather: [{ description: 'partly cloudy' }],
          },
        ],
      },
    });

    const result = await service.getFiveDayForecast('Cairo');
    expect(result[0].date).toBe('2025-04-17');
    expect(result[0].averageTemperature).toBeCloseTo(21);
    expect(result[0].weatherDescription).toContain('cloudy');
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should throw NotFoundException when API fails (forecast)', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(null);
    mockedAxios.get.mockRejectedValue(new Error('API error'));

    await expect(service.getFiveDayForecast('InvalidCity')).rejects.toThrow(NotFoundException);
  });
});