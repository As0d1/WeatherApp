import { WEEKDAYS, type Language } from '../i18n/translations';
import type { Unit } from '../api/weather';

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`;
}

export function windUnit(unit: Unit): string {
  return unit === 'fahrenheit' ? 'mph' : 'km/h';
}

// "2026-10-12T14:00" -> "14:00"
export function formatHour(isoLocalTime: string): string {
  return isoLocalTime.slice(11, 16);
}

// "2026-10-12" -> "Mon" / "Dush" / "월"
export function formatWeekday(isoDate: string, language: Language): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return WEEKDAYS[language][new Date(year, month - 1, day).getDay()];
}
