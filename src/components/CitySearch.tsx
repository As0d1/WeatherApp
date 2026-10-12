import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { searchCities, type Place } from '../api/weather';
import { useLanguage } from '../i18n/LanguageContext';
import type { Theme } from '../utils/weatherCodes';

const SEARCH_DELAY_MS = 400;

interface Props {
  theme: Theme;
  onSelect: (place: Place) => void;
  onUseMyLocation: () => void;
}

export function CitySearch({ theme, onSelect, onUseMyLocation }: Props) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  // Results of the last finished search, and the query they belong to.
  const [search, setSearch] = useState<{ query: string; results: Place[] } | null>(null);

  const trimmed = query.trim();
  const results = search?.results ?? [];
  const searching = search?.query !== trimmed;

  useEffect(() => {
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    // Wait until the user stops typing before calling the API.
    const timer = setTimeout(() => {
      searchCities(trimmed, language, controller.signal)
        .catch(() => [])
        .then((found) => {
          if (!controller.signal.aborted) setSearch({ query: trimmed, results: found });
        });
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, language]);

  const select = (place: Place) => {
    setQuery('');
    setSearch(null);
    onSelect(place);
  };

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={theme.muted}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={t('searchPlaceholder')}
        />
        <Pressable
          onPress={onUseMyLocation}
          style={[styles.locationButton, { backgroundColor: theme.card }]}
          accessibilityRole="button"
          accessibilityLabel={t('myLocation')}
        >
          <Text style={styles.locationIcon}>📍</Text>
        </Pressable>
      </View>

      {trimmed.length >= 2 && (
        <View style={[styles.results, { backgroundColor: theme.card }]}>
          {searching && results.length === 0 ? (
            <ActivityIndicator color={theme.text} style={styles.resultRow} />
          ) : results.length === 0 ? (
            <Text style={[styles.resultRow, { color: theme.muted }]}>{t('noResults')}</Text>
          ) : (
            results.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => select(place)}
                style={styles.resultRow}
                accessibilityRole="button"
              >
                <Text style={[styles.resultName, { color: theme.text }]}>{place.name}</Text>
                <Text style={{ color: theme.muted }}>
                  {[place.region, place.country].filter(Boolean).join(', ')}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  locationButton: {
    width: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 20,
  },
  results: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
  },
});
