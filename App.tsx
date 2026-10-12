import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from './src/i18n/LanguageContext';
import { WeatherScreen } from './src/screens/WeatherScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <WeatherScreen />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
