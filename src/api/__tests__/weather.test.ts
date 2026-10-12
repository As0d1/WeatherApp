import {
  buildForecastUrl,
  fetchForecast,
  parseForecast,
  searchCities,
  type ForecastResponse,
} from '../weather';

function makeResponse(): ForecastResponse {
  const hours = Array.from({ length: 48 }, (_, i) => {
    const day = 12 + Math.floor(i / 24);
    const hour = String(i % 24).padStart(2, '0');
    return `2026-10-${day}T${hour}:00`;
  });
  return {
    current: {
      time: '2026-10-12T14:15',
      temperature_2m: 21.6,
      apparent_temperature: 20.2,
      relative_humidity_2m: 55,
      wind_speed_10m: 12.4,
      weather_code: 2,
      is_day: 1,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, i) => i),
      weather_code: hours.map(() => 0),
      is_day: hours.map((time) => (time.slice(11, 13) >= '18' ? 0 : 1)),
    },
    daily: {
      time: ['2026-10-12', '2026-10-13'],
      weather_code: [2, 61],
      temperature_2m_max: [23, 19],
      temperature_2m_min: [15, 13],
      precipitation_probability_max: [10, null],
    },
  };
}

describe('buildForecastUrl', () => {
  it('requests metric units for celsius', () => {
    const url = new URL(buildForecastUrl(35.18, 129.08, 'celsius'));
    expect(url.searchParams.get('latitude')).toBe('35.18');
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');
    expect(url.searchParams.get('wind_speed_unit')).toBe('kmh');
  });

  it('requests imperial units for fahrenheit', () => {
    const url = new URL(buildForecastUrl(35.18, 129.08, 'fahrenheit'));
    expect(url.searchParams.get('temperature_unit')).toBe('fahrenheit');
    expect(url.searchParams.get('wind_speed_unit')).toBe('mph');
  });
});

describe('parseForecast', () => {
  it('maps current conditions', () => {
    const { current } = parseForecast(makeResponse());
    expect(current).toEqual({
      time: '2026-10-12T14:15',
      temperature: 21.6,
      feelsLike: 20.2,
      humidity: 55,
      windSpeed: 12.4,
      weatherCode: 2,
      isDay: true,
    });
  });

  it('returns the next 24 hours starting from the current hour', () => {
    const { hourly } = parseForecast(makeResponse());
    expect(hourly).toHaveLength(24);
    expect(hourly[0]).toEqual({
      time: '2026-10-12T14:00',
      temperature: 14,
      weatherCode: 0,
      isDay: true,
    });
    expect(hourly[4].isDay).toBe(false);
    expect(hourly[23].time).toBe('2026-10-13T13:00');
  });

  it('maps daily values and keeps missing precipitation as null', () => {
    const { daily } = parseForecast(makeResponse());
    expect(daily[0]).toEqual({
      date: '2026-10-12',
      weatherCode: 2,
      max: 23,
      min: 15,
      precipitationChance: 10,
    });
    expect(daily[1].precipitationChance).toBeNull();
  });
});

describe('network calls', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetch(body: unknown, ok = true, status = 200) {
    const fetchMock = jest.fn().mockResolvedValue({ ok, status, json: async () => body });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  }

  it('fetchForecast parses the API response', async () => {
    mockFetch(makeResponse());
    const forecast = await fetchForecast(35.18, 129.08, 'celsius');
    expect(forecast.current.temperature).toBe(21.6);
    expect(forecast.daily).toHaveLength(2);
  });

  it('fetchForecast throws when the API returns an error status', async () => {
    mockFetch({}, false, 500);
    await expect(fetchForecast(0, 0, 'celsius')).rejects.toThrow('500');
  });

  it('searchCities maps geocoding results to places', async () => {
    const fetchMock = mockFetch({
      results: [
        {
          id: 1838524,
          name: 'Busan',
          latitude: 35.10168,
          longitude: 129.03004,
          country: 'South Korea',
          admin1: 'Busan',
        },
      ],
    });

    const places = await searchCities('  Busan ', 'ko');

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get('name')).toBe('Busan');
    expect(url.searchParams.get('language')).toBe('ko');
    expect(places).toEqual([
      {
        id: '1838524',
        name: 'Busan',
        region: 'Busan',
        country: 'South Korea',
        latitude: 35.10168,
        longitude: 129.03004,
      },
    ]);
  });

  it('searchCities returns an empty list when nothing matches', async () => {
    mockFetch({});
    await expect(searchCities('zzzz', 'en')).resolves.toEqual([]);
  });
});
