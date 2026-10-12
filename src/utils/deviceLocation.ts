import * as Location from 'expo-location';

import type { Place } from '../api/weather';

export const CURRENT_LOCATION_ID = 'current-location';

/** Returns the device's place, or null if the user did not allow location access. */
export async function getDevicePlace(): Promise<Place | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const position =
    (await Location.getLastKnownPositionAsync()) ??
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  const { latitude, longitude } = position.coords;

  let name = '';
  let region: string | undefined;
  let country: string | undefined;
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    name = address?.city ?? address?.district ?? address?.subregion ?? '';
    region = address?.region ?? undefined;
    country = address?.country ?? undefined;
  } catch {
    // Reverse geocoding is optional; the UI falls back to "My location".
  }

  return { id: CURRENT_LOCATION_ID, name, region, country, latitude, longitude };
}
