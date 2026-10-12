import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * Like useState, but the value is saved to AsyncStorage and restored on the next launch.
 * `loaded` is false until the saved value has been read.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((stored) => {
        if (cancelled || stored === null) return;
        const parsed: unknown = JSON.parse(stored);
        if (isValid(parsed)) setValue(parsed);
      })
      .catch(() => {
        // Corrupt or unreadable storage: keep the initial value.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
    // Only read storage once per key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
    },
    [key],
  );

  return [value, update, loaded];
}
