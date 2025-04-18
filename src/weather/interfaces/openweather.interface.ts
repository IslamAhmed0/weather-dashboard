export interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
    }
  ];
  wind: {
    speed: number;
  };
  name: string;
}


export interface OpenWeatherForecastResponse {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: [
      {
        description: string;
      }
    ];
  }>;
}
