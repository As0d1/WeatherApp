import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import type { Place, Unit } from '../api/weather';
import { CitySearch } from '../components/CitySearch';
import { CurrentWeather } from '../components/CurrentWeather';
import { DailyForecast } from '../components/DailyForecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { SettingsBar } from '../components/SettingsBar';
import { usePersistentState } from '../hooks/usePersistentState';
import { useWeather } from '../hooks/useWeather';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/translations';
import { CURRENT_LOCATION_ID, getDevicePlace } from '../utils/deviceLocation';
import { themeFor } from '../utils/weatherCodes';

// Shown when location access is not available on first launch.
const DEFAULT_PLACE: Place = {
  id: 'default-busan',
  name: 'Busan',
  country: 'South Korea',
  latitude: 35.1796,
  longitude: 129.0756,
};

function isPlaceOrNull(value: unknown): value is Place | null {
  if (value === null) return true;
  const place = value as Place;
  return (
    typeof place === 'object' &&
    typeof place.id === 'string' &&
    typeof place.name === 'string' &&
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number'
  );
}

function isUnit(value: unknown): value is Unit {
  return value === 'celsius' || value === 'fahrenheit';
}

export function WeatherScreen() {
  const { t } = useLanguage();
  const [place, setPlace, placeLoaded] = usePersistentState<Place | null>(
    'place',
    null,
    isPlaceOrNull,
  );
  const [unit, setUnit] = usePersistentState<Unit>('unit', 'celsius', isUnit);
  const [noticeKey, setNoticeKey] = useState<TranslationKey | null>(null);
  const { forecast, loading, error, reload } = useWeather(place, unit);

  const locate = useCallback(
    (fallback: Place | null) =>
      getDevicePlace()
        .catch(() => null)
        .then((devicePlace) => {
          if (devicePlace) {
            setPlace(devicePlace);
            setNoticeKey(null);
          } else {
            setNoticeKey('locationDenied');
            if (fallback) setPlace(fallback);
          }
        }),
    [setPlace],
  );

  // On launch: find the device location if nothing is saved yet,
  // or refresh it if the user was last looking at their own location.
  const startedRef = useRef(false);
  useEffect(() => {
    if (!placeLoaded || startedRef.current) return;
    startedRef.current = true;
    if (!place) locate(DEFAULT_PLACE);
    else if (place.id === CURRENT_LOCATION_ID) locate(null);
  }, [placeLoaded, place, locate]);

  const selectPlace = (selected: Place) => {
    setPlace(selected);
    setNoticeKey(null);
  };

  const theme = themeFor(forecast?.current.weatherCode, forecast?.current.isDay);
  const placeName = place?.name || t('myLocation');

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={loading && forecast !== null}
            onRefresh={reload}
            tintColor={theme.text}
          />
        }
      >
        <SettingsBar unit={unit} onUnitChange={setUnit} theme={theme} />
        <CitySearch theme={theme} onSelect={selectPlace} onUseMyLocation={() => locate(null)} />

        {noticeKey && <Text style={[styles.notice, { color: theme.muted }]}>{t(noticeKey)}</Text>}

        {error && (
          <View style={[styles.error, { backgroundColor: theme.card }]}>
            <Text style={[styles.errorText, { color: theme.text }]}>{t('errorTitle')}</Text>
            <Pressable onPress={reload} accessibilityRole="button" style={styles.retry}>
              <Text style={[styles.retryText, { color: theme.text }]}>{t('retry')}</Text>
            </Pressable>
          </View>
        )}

        {forecast ? (
          <>
            <CurrentWeather
              placeName={placeName}
              current={forecast.current}
              today={forecast.daily[0]}
              unit={unit}
              theme={theme}
            />
            <HourlyForecast hours={forecast.hourly} theme={theme} />
            <DailyForecast days={forecast.daily} theme={theme} />
          </>
        ) : (
          !error && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={theme.text} />
              <Text style={{ color: theme.muted }}>{t('loading')}</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  notice: {
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  retry: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  retryText: {
    textDecorationLine: 'underline',
  },
  loading: {
    alignItems: 'center',
    gap: 12,
    marginTop: 80,
  },
});
