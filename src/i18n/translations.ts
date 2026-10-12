export const LANGUAGES = ['en', 'uz', 'ko'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  uz: 'UZ',
  ko: '한',
};

const en = {
  searchPlaceholder: 'Search city…',
  myLocation: 'My location',
  feelsLike: 'Feels like',
  humidity: 'Humidity',
  wind: 'Wind',
  hourly: 'Next 24 hours',
  daily: '7-day forecast',
  today: 'Today',
  now: 'Now',
  loading: 'Loading…',
  errorTitle: 'Could not load the weather',
  retry: 'Try again',
  noResults: 'No cities found',
  locationDenied: 'Location access is off. Search for a city instead.',
  // Weather descriptions (WMO weather interpretation codes)
  clear: 'Clear sky',
  mainlyClear: 'Mainly clear',
  partlyCloudy: 'Partly cloudy',
  overcast: 'Overcast',
  fog: 'Fog',
  drizzle: 'Drizzle',
  rain: 'Rain',
  snow: 'Snow',
  rainShowers: 'Rain showers',
  snowShowers: 'Snow showers',
  thunderstorm: 'Thunderstorm',
  unknown: 'Unknown',
};

export type TranslationKey = keyof typeof en;

const uz: Record<TranslationKey, string> = {
  searchPlaceholder: 'Shaharni qidiring…',
  myLocation: 'Mening joylashuvim',
  feelsLike: 'His qilinadi',
  humidity: 'Namlik',
  wind: 'Shamol',
  hourly: 'Keyingi 24 soat',
  daily: '7 kunlik prognoz',
  today: 'Bugun',
  now: 'Hozir',
  loading: 'Yuklanmoqda…',
  errorTitle: "Ob-havo ma'lumotini yuklab bo'lmadi",
  retry: 'Qayta urinish',
  noResults: 'Shahar topilmadi',
  locationDenied: "Joylashuvga ruxsat berilmagan. Shaharni qidirib toping.",
  clear: 'Ochiq osmon',
  mainlyClear: 'Asosan ochiq',
  partlyCloudy: 'Qisman bulutli',
  overcast: 'Bulutli',
  fog: 'Tuman',
  drizzle: "Mayda yomg'ir",
  rain: "Yomg'ir",
  snow: 'Qor',
  rainShowers: 'Jala',
  snowShowers: 'Qorli jala',
  thunderstorm: 'Momaqaldiroq',
  unknown: "Noma'lum",
};

const ko: Record<TranslationKey, string> = {
  searchPlaceholder: '도시 검색…',
  myLocation: '내 위치',
  feelsLike: '체감',
  humidity: '습도',
  wind: '바람',
  hourly: '앞으로 24시간',
  daily: '7일 예보',
  today: '오늘',
  now: '지금',
  loading: '불러오는 중…',
  errorTitle: '날씨를 불러올 수 없습니다',
  retry: '다시 시도',
  noResults: '검색 결과가 없습니다',
  locationDenied: '위치 권한이 꺼져 있습니다. 도시를 검색해 주세요.',
  clear: '맑음',
  mainlyClear: '대체로 맑음',
  partlyCloudy: '구름 조금',
  overcast: '흐림',
  fog: '안개',
  drizzle: '이슬비',
  rain: '비',
  snow: '눈',
  rainShowers: '소나기',
  snowShowers: '소낙눈',
  thunderstorm: '뇌우',
  unknown: '알 수 없음',
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, uz, ko };

// Short weekday names, Sunday first (matches Date#getDay()).
export const WEEKDAYS: Record<Language, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  uz: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
  ko: ['일', '월', '화', '수', '목', '금', '토'],
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}
