import { fireEvent, render, screen } from '@testing-library/react-native';

import type { CurrentConditions } from '../../api/weather';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { themeFor } from '../../utils/weatherCodes';
import { CurrentWeather } from '../CurrentWeather';
import { SettingsBar } from '../SettingsBar';

const current: CurrentConditions = {
  time: '2026-10-12T14:15',
  temperature: 21.6,
  feelsLike: 20.2,
  humidity: 55,
  windSpeed: 12.4,
  weatherCode: 61,
  isDay: true,
};

function renderWeather() {
  const theme = themeFor(current.weatherCode, current.isDay);
  return render(
    <LanguageProvider>
      <SettingsBar unit="celsius" onUnitChange={() => {}} theme={theme} />
      <CurrentWeather placeName="Busan" current={current} unit="celsius" theme={theme} />
    </LanguageProvider>,
  );
}

describe('CurrentWeather', () => {
  it('shows the current conditions', async () => {
    renderWeather();
    expect(await screen.findByText('Busan')).toBeOnTheScreen();
    expect(screen.getByText('22°')).toBeOnTheScreen();
    expect(screen.getByText('Rain')).toBeOnTheScreen();
    expect(screen.getByText('55%')).toBeOnTheScreen();
    expect(screen.getByText('12 km/h')).toBeOnTheScreen();
  });

  it('switches language to Uzbek and Korean', async () => {
    renderWeather();
    await screen.findByText('Rain');

    fireEvent.press(screen.getByText('UZ'));
    expect(screen.getByText("Yomg'ir")).toBeOnTheScreen();
    expect(screen.getByText('Namlik')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('한'));
    expect(screen.getByText('비')).toBeOnTheScreen();
    expect(screen.getByText('습도')).toBeOnTheScreen();
  });
});
