import { useEffect, useState } from 'react';
import { fetchWeatherData } from '@/services/servicioClima';
import { WeatherDay } from '@/types/clima';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWeatherData();
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  return {
    weatherData,
    isLoading,
    error,
  };
}