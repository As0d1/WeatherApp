import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Unit } from '../api/weather';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGE_LABELS, LANGUAGES } from '../i18n/translations';
import type { Theme } from '../utils/weatherCodes';

interface Props {
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
  theme: Theme;
}

export function SettingsBar({ unit, onUnitChange, theme }: Props) {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.bar}>
      <Segmented
        options={LANGUAGES.map((code) => ({ value: code, label: LANGUAGE_LABELS[code] }))}
        selected={language}
        onSelect={setLanguage}
        theme={theme}
      />
      <Segmented
        options={[
          { value: 'celsius' as const, label: '°C' },
          { value: 'fahrenheit' as const, label: '°F' },
        ]}
        selected={unit}
        onSelect={onUnitChange}
        theme={theme}
      />
    </View>
  );
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  theme: Theme;
}

function Segmented<T extends string>({ options, selected, onSelect, theme }: SegmentedProps<T>) {
  return (
    <View style={[styles.segmented, { backgroundColor: theme.card }]}>
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[styles.segment, active && { backgroundColor: theme.text }]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.segmentText, { color: active ? theme.background : theme.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentText: {
    fontWeight: '600',
  },
});
