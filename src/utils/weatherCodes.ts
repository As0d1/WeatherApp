import type { TranslationKey } from '../i18n/translations';

export interface WeatherInfo {
  labelKey: TranslationKey;
  icon: string;
}

// Maps WMO weather interpretation codes used by Open-Meteo to a label and icon.
export function describeWeather(code: number, isDay = true): WeatherInfo {
  switch (code) {
    case 0:
      return { labelKey: 'clear', icon: isDay ? '☀️' : '🌙' };
    case 1:
      return { labelKey: 'mainlyClear', icon: isDay ? '🌤️' : '🌙' };
    case 2:
      return { labelKey: 'partlyCloudy', icon: '⛅' };
    case 3:
      return { labelKey: 'overcast', icon: '☁️' };
    case 45:
    case 48:
      return { labelKey: 'fog', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { labelKey: 'drizzle', icon: '🌦️' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { labelKey: 'rain', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { labelKey: 'snow', icon: '❄️' };
    case 80:
    case 81:
    case 82:
      return { labelKey: 'rainShowers', icon: '🌦️' };
    case 85:
    case 86:
      return { labelKey: 'snowShowers', icon: '🌨️' };
    case 95:
    case 96:
    case 99:
      return { labelKey: 'thunderstorm', icon: '⛈️' };
    default:
      return { labelKey: 'unknown', icon: '🌡️' };
  }
}

export interface Theme {
  background: string;
  card: string;
  text: string;
  muted: string;
}

// Picks a background that matches the time of day and the sky.
export function themeFor(code: number | undefined, isDay: boolean | undefined): Theme {
  if (isDay === false) {
    return { background: '#0F1B33', card: 'rgba(255,255,255,0.08)', text: '#F2F5FA', muted: '#A9B4C8' };
  }
  if (code !== undefined && code >= 45) {
    return { background: '#5B6B7F', card: 'rgba(255,255,255,0.14)', text: '#FFFFFF', muted: '#E1E6ED' };
  }
  return { background: '#3A8DDE', card: 'rgba(255,255,255,0.18)', text: '#FFFFFF', muted: '#E3EEFB' };
}
