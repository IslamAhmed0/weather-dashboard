
# Weather API

This project provides a weather API that integrates with the OpenWeatherMap API to fetch current weather and 5-day weather forecast data. It includes caching for optimization and error handling for various edge cases. The application is built using **NestJS** and uses **Redis** for caching.

## 🚀 Features

1. **Current Weather**: Fetch the current weather of a city (temperature, humidity, wind speed, description).
2. **5-Day Forecast**: Get the 5-day weather forecast for a city, with average daily temperature and weather description.
3. **Caching**: Uses Redis caching to minimize repeated API calls.
4. **Error Handling**: Handles invalid city names, API errors, and rate limiting from the weather API.
5. **Unit Tests**: Includes unit tests for API endpoints.

## 🛠️ Tech Stack

- **NestJS** (Backend Framework)
- **Redis** (In-memory caching)
- **OpenWeatherMap API** (Weather data)
- **Jest** (Testing framework)

## 🌱 Setup

### Prerequisites

- **Node.js** (v18 or later)
- **Redis** (for caching)
- `.env` file with required environment variables

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/weather-api.git
cd weather-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory based on `.env.example`.

```bash
cp .env.example .env
```

Fill in the required details:

```env
WEATHER_API_KEY=your_openweather_api_key
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=300
PORT=3000
```

### 4. Run the Application

To start the application in development mode:

```bash
npm run start
```

The app will run on `http://localhost:3000`.

### 5. Run Tests

To run the unit tests:

```bash
npm run test
```

#### Running the Unit Tests with Coverage:

You can also run the unit tests with coverage report:

```bash
npm run test:cov
```

This command will generate a code coverage report that shows how much of your code is covered by tests.

### 6. Docker Support (Optional)

You can also run the application with Docker.

- **Dockerfile**: A Dockerfile is included to build and run the application.
- **docker-compose.yml**: A `docker-compose.yml` file is provided to run both the application and Redis.

To run the application with Docker:

```bash
docker-compose up --build
```

The app will run on `http://localhost:3000` and Redis will be available on port `6379`.

## 🚀 API Endpoints

### 1. Get Current Weather

**GET** `/weather/current/:city`

Fetches the current weather for the specified city.

#### Example Request:

```bash
GET /weather/current/London
```

#### Response:

```json
{
  "city": "London",
  "temperature": 15.5,
  "weatherDescription": "clear sky",
  "humidity": 75,
  "windSpeed": 5.4
}
```

### 2. Get 5-Day Forecast

**GET** `/weather/forecast/:city`

Fetches a 5-day weather forecast for the specified city, with average daily temperature and weather description.

#### Example Request:

```bash
GET /weather/forecast/London
```

#### Response:

```json
[
  {
    "date": "2025-04-17",
    "averageTemperature": 15.3,
    "weatherDescription": "clear sky"
  },
  {
    "date": "2025-04-18",
    "averageTemperature": 14.7,
    "weatherDescription": "few clouds"
  },
  // More days
]
```

## 🧪 Postman Collection (Optional)

You can import the Postman collection to quickly test the API.

### Steps:

1. Open Postman
2. Import the collection from `postman/weather-api.postman_collection.json`
3. Update the `{{base_url}}` variable to `http://localhost:3000`

## 🧾 Swagger API Docs (Optional)

To access interactive API documentation, you can use Swagger. After starting the server, visit:

```
http://localhost:3000/api
```

## 🐳 Docker Support (Optional)

If you want to run the application using Docker, you can build and run it with the following steps:

1. **Dockerfile**: A `Dockerfile` is provided to build the NestJS application.
2. **docker-compose.yml**: It will run both the application and Redis.

To start with Docker:

```bash
docker-compose up --build
```

## 📝 Future Enhancements

- [ ] Add search suggestions (autocomplete) for cities
- [ ] Add user authentication and favorites
- [ ] Store weather history in a database
- [ ] UI Frontend to visualize weather trends

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to reach out if you need any further assistance! 😊