import { StyleSheet, Text, View } from 'react-native';

import type { CurrentConditions, DailyPoint, Unit } from '../api/weather';
import { useLanguage } from '../i18n/LanguageContext';
import { formatTemperature, windUnit } from '../utils/format';
import { describeWeather, type Theme } from '../utils/weatherCodes';

interface Props {
  placeName: string;
  current: CurrentConditions;
  today?: DailyPoint;
  unit: Unit;
  theme: Theme;
}

export function CurrentWeather({ placeName, current, today, unit, theme }: Props) {
  const { t } = useLanguage();
  const { icon, labelKey } = describeWeather(current.weatherCode, current.isDay);

  return (
    <View style={styles.container}>
      <Text style={[styles.place, { color: theme.text }]} numberOfLines={1}>
        {placeName}
      </Text>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.temperature, { color: theme.text }]}>
        {formatTemperature(current.temperature)}
      </Text>
      <Text style={[styles.condition, { color: theme.text }]}>{t(labelKey)}</Text>
      {today && (
        <Text style={{ color: theme.muted }}>
          ↑ {formatTemperature(today.max)}   ↓ {formatTemperature(today.min)}
        </Text>
      )}

      <View style={[styles.details, { backgroundColor: theme.card }]}>
        <Detail label={t('feelsLike')} value={formatTemperature(current.feelsLike)} theme={theme} />
        <Detail label={t('humidity')} value={`${current.humidity}%`} theme={theme} />
        <Detail
          label={t('wind')}
          value={`${Math.round(current.windSpeed)} ${windUnit(unit)}`}
          theme={theme}
        />
      </View>
    </View>
  );
}

function Detail({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <View style={styles.detail}>
      <Text style={[styles.detailLabel, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  place: {
    fontSize: 28,
    fontWeight: '600',
  },
  icon: {
    fontSize: 72,
    marginTop: 8,
  },
  temperature: {
    fontSize: 80,
    fontWeight: '200',
  },
  condition: {
    fontSize: 20,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 14,
  },
  detail: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
});
