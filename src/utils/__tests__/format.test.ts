import { formatHour, formatTemperature, formatWeekday, windUnit } from '../format';
import { describeWeather } from '../weatherCodes';

describe('format helpers', () => {
  it('rounds temperatures', () => {
    expect(formatTemperature(21.6)).toBe('22°');
    expect(formatTemperature(-0.4)).toBe('0°');
  });

  it('formats hours', () => {
    expect(formatHour('2026-10-12T09:00')).toBe('09:00');
  });

  it('formats weekdays in every language', () => {
    // 12 October 2026 is a Monday.
    expect(formatWeekday('2026-10-12', 'en')).toBe('Mon');
    expect(formatWeekday('2026-10-12', 'uz')).toBe('Dush');
    expect(formatWeekday('2026-10-12', 'ko')).toBe('월');
  });

  it('picks the wind unit', () => {
    expect(windUnit('celsius')).toBe('km/h');
    expect(windUnit('fahrenheit')).toBe('mph');
  });
});

describe('describeWeather', () => {
  it('uses a moon icon for clear nights', () => {
    expect(describeWeather(0, true)).toEqual({ labelKey: 'clear', icon: '☀️' });
    expect(describeWeather(0, false)).toEqual({ labelKey: 'clear', icon: '🌙' });
  });

  it('groups related codes', () => {
    expect(describeWeather(63).labelKey).toBe('rain');
    expect(describeWeather(75).labelKey).toBe('snow');
    expect(describeWeather(99).labelKey).toBe('thunderstorm');
  });

  it('handles unknown codes', () => {
    expect(describeWeather(1234).labelKey).toBe('unknown');
  });
});
