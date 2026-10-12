import { useCallback, useEffect, useState } from 'react';

import { fetchForecast, type Forecast, type Place, type Unit } from '../api/weather';

interface Result {
  // Identifies which request this result belongs to.
  requestKey: string;
  forecast: Forecast | null;
  error: string | null;
}

export function useWeather(place: Place | null, unit: Unit) {
  const [result, setResult] = useState<Result | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const latitude = place?.latitude;
  const longitude = place?.longitude;
  const requestKey =
    latitude === undefined || longitude === undefined
      ? null
      : `${latitude},${longitude},${unit},${reloadCount}`;

  useEffect(() => {
    if (requestKey === null || latitude === undefined || longitude === undefined) return;

    const controller = new AbortController();
    fetchForecast(latitude, longitude, unit, controller.signal)
      .then((forecast) => setResult({ requestKey, forecast, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : String(error);
        // Keep showing the previous forecast if there is one.
        setResult((previous) => ({ requestKey, forecast: previous?.forecast ?? null, error: message }));
      });

    return () => controller.abort();
  }, [requestKey, latitude, longitude, unit]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  const isCurrent = result?.requestKey === requestKey;
  return {
    // While a new request is loading, keep showing the previous forecast.
    forecast: result?.forecast ?? null,
    loading: requestKey !== null && !isCurrent,
    error: isCurrent ? (result?.error ?? null) : null,
    reload,
  };
}
