import { fireEvent, render, screen } from '@testing-library/react-native';

import { LanguageProvider } from '../../i18n/LanguageContext';
import { themeFor } from '../../utils/weatherCodes';
import { CitySearch } from '../CitySearch';

describe('CitySearch', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('searches as the user types and returns the selected city', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          { id: 1, name: 'Tashkent', latitude: 41.26, longitude: 69.21, country: 'Uzbekistan' },
        ],
      }),
    }) as unknown as typeof fetch;
    const onSelect = jest.fn();

    render(
      <LanguageProvider>
        <CitySearch theme={themeFor(0, true)} onSelect={onSelect} onUseMyLocation={() => {}} />
      </LanguageProvider>,
    );

    fireEvent.changeText(await screen.findByLabelText('Search city…'), 'Tash');
    fireEvent.press(await screen.findByText('Tashkent'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Tashkent', country: 'Uzbekistan' }),
    );
    expect(screen.queryByText('Tashkent')).toBeNull();
  });
});
