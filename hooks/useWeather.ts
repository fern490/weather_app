import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { fetchWeatherData } from '../services/servicioClima';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [city, setCity] = useState<string>('Localizando...');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const neighborhood = address.district || address.name || address.city || "Ubicación desconocida";

      const data = await fetchWeatherData(latitude, longitude);
      
      setWeatherData(data.weather);
      
      setCity(neighborhood); 
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return { weatherData, city, isLoading, isRefreshing, error, refresh: () => loadWeather(true) };
};