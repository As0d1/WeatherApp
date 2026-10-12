import { StyleSheet, Text, View } from 'react-native';

import type { DailyPoint } from '../api/weather';
import { useLanguage } from '../i18n/LanguageContext';
import { formatTemperature, formatWeekday } from '../utils/format';
import { describeWeather, type Theme } from '../utils/weatherCodes';

interface Props {
  days: DailyPoint[];
  theme: Theme;
}

export function DailyForecast({ days, theme }: Props) {
  const { t, language } = useLanguage();

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.muted }]}>{t('daily')}</Text>
      {days.map((day, index) => (
        <View key={day.date} style={styles.row}>
          <Text style={[styles.day, { color: theme.text }]}>
            {index === 0 ? t('today') : formatWeekday(day.date, language)}
          </Text>
          <Text style={styles.icon}>{describeWeather(day.weatherCode).icon}</Text>
          <Text style={[styles.rain, { color: theme.muted }]}>
            {day.precipitationChance ? `💧${day.precipitationChance}%` : ''}
          </Text>
          <Text style={[styles.temperatures, { color: theme.text }]}>
            {formatTemperature(day.max)}
            <Text style={{ color: theme.muted }}>  {formatTemperature(day.min)}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  day: {
    width: 64,
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    fontSize: 22,
    width: 36,
  },
  rain: {
    flex: 1,
    fontSize: 13,
  },
  temperatures: {
    fontSize: 16,
    fontWeight: '600',
  },
});
