import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { HourlyPoint } from '../api/weather';
import { useLanguage } from '../i18n/LanguageContext';
import { formatHour, formatTemperature } from '../utils/format';
import { describeWeather, type Theme } from '../utils/weatherCodes';

interface Props {
  hours: HourlyPoint[];
  theme: Theme;
}

export function HourlyForecast({ hours, theme }: Props) {
  const { t } = useLanguage();

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.muted }]}>{t('hourly')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hours.map((hour, index) => (
          <View key={hour.time} style={styles.hour}>
            <Text style={{ color: theme.muted }}>{index === 0 ? t('now') : formatHour(hour.time)}</Text>
            <Text style={styles.icon}>{describeWeather(hour.weatherCode, hour.isDay).icon}</Text>
            <Text style={[styles.temperature, { color: theme.text }]}>
              {formatTemperature(hour.temperature)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  hour: {
    alignItems: 'center',
    width: 64,
    gap: 6,
  },
  icon: {
    fontSize: 24,
  },
  temperature: {
    fontSize: 17,
    fontWeight: '600',
  },
});
