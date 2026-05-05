export type WeatherIcon = 'sun' | 'cloud' | 'rain' | 'wind';

export type WeatherTemps = {
  t00: number | null;
  t06: number | null;
  t12: number | null;
  t18: number | null;
  t24: number | null;
};

export type WeatherDay = {
  id: 'ayer' | 'hoy' | 'manana';
  date: string;
  temp: number | null;
  humidity: number;
  pressure: number;
  wind: number;
  icon: WeatherIcon;
  temps?: WeatherTemps;
};