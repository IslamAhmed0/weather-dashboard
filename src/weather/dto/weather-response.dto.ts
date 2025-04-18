export class WeatherResponseDto {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}


export class WeatherForecastDto {
  date: string;
  averageTemperature: number;
  weatherDescription: string;
}