// Open-Meteo is free and needs no API key: https://open-meteo.com/en/docs
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export type Unit = 'celsius' | 'fahrenheit';

export interface Place {
  id: string;
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentConditions {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
  precipitationChance: number | null;
}

export interface Forecast {
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}

// Shape of the raw Open-Meteo forecast response (only the fields we request).
export interface ForecastResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

interface GeocodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }[];
}

const HOURS_TO_SHOW = 24;

export function buildForecastUrl(latitude: number, longitude: number, unit: Unit): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    hourly: 'temperature_2m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: unit,
    wind_speed_unit: unit === 'fahrenheit' ? 'mph' : 'kmh',
  });
  return `${FORECAST_URL}?${params.toString()}`;
}

export function parseForecast(data: ForecastResponse): Forecast {
  const { current, hourly, daily } = data;

  // Times are local to the place (timezone=auto), e.g. "2026-10-12T14:15".
  // Start the hourly list at the beginning of the current hour.
  const currentHour = `${current.time.slice(0, 13)}:00`;
  const start = Math.max(
    0,
    hourly.time.findIndex((time) => time >= currentHour),
  );

  return {
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.slice(start, start + HOURS_TO_SHOW).map((time, i) => ({
      time,
      temperature: hourly.temperature_2m[start + i],
      weatherCode: hourly.weather_code[start + i],
      isDay: hourly.is_day[start + i] === 1,
    })),
    daily: daily.time.map((date, i) => ({
      date,
      weatherCode: daily.weather_code[i],
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      precipitationChance: daily.precipitation_probability_max[i] ?? null,
    })),
  };
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
  signal?: AbortSignal,
): Promise<Forecast> {
  const data = await getJson<ForecastResponse>(buildForecastUrl(latitude, longitude, unit), signal);
  return parseForecast(data);
}

export async function searchCities(
  query: string,
  language: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    language,
    format: 'json',
  });
  const data = await getJson<GeocodingResponse>(`${GEOCODING_URL}?${params.toString()}`, signal);
  return (data.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    region: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
