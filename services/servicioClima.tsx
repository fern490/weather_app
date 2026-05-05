import { WeatherDay, WeatherIcon } from '../types/clima';

const API_CONFIG = {
  KEY: process.env.EXPO_PUBLIC_API_KEY,
  LAT: '-34.6037',
  LON: '-58.3816',
  UNITS: 'metric',
};

export const formatDate = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
};

export const getDominantIcon = (
  points: { windSpeed: number; isRain: boolean; isCloud: boolean; isSun: boolean }[]
) => {
  if (!points || points.length === 0) return 'cloud';

  const counts = { sun: 0, cloud: 0, rain: 0, wind: 0 };

  points.forEach((p) => {
    if (p.windSpeed > 8) counts.wind++;
    else if (p.isRain) counts.rain++;
    else if (p.isCloud) counts.cloud++;
    else counts.sun++;
  });

  return Object.keys(counts).reduce((a, b) =>
    counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
  );
};

export const fetchWeatherData = async (): Promise<WeatherDay[]> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
    );
    if (!currentRes.ok) throw new Error('Error en clima actual');
    const currentData = await currentRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
    );
    if (!forecastRes.ok) throw new Error('Error en pronóstico');
    const forecastData = await forecastRes.json();

    if (!forecastData.list) throw new Error('Sin datos de pronóstico');

    const todayDateStr = today.toLocaleDateString('en-CA');
    const todayList = forecastData.list.filter((item: any) => item.dt_txt.startsWith(todayDateStr));

    const todayPoints = todayList.map((item: any) => ({
      windSpeed: item.wind.speed,
      isRain: ['09', '10', '11', '13'].some((c) => item.weather[0].icon.includes(c)),
      isCloud: ['02', '03', '04'].some((c) => item.weather[0].icon.includes(c)),
      isSun: item.weather[0].icon.includes('01'),
    }));

    const currentIconCode = currentData.weather?.[0]?.icon || '';

    todayPoints.push({
      windSpeed: currentData.wind?.speed || 0,
      isRain: ['09', '10', '11', '13'].some((c) => currentIconCode.includes(c)),
      isCloud: ['02', '03', '04'].some((c) => currentIconCode.includes(c)),
      isSun: currentIconCode.includes('01'),
    });

    const todayDominantIcon = getDominantIcon(todayPoints);

    const tomorrowDateStr = tomorrow.toLocaleDateString('en-CA');
    const tomorrowList = forecastData.list.filter((item: any) =>
      item.dt_txt.startsWith(tomorrowDateStr)
    );

    const tomorrowPoints = tomorrowList.map((item: any) => ({
      windSpeed: item.wind.speed,
      isRain: ['09', '10', '11', '13'].some((c) => item.weather[0].icon.includes(c)),
      isCloud: ['02', '03', '04'].some((c) => item.weather[0].icon.includes(c)),
      isSun: item.weather[0].icon.includes('01'),
    }));

    const tomorrowDominantIcon = getDominantIcon(tomorrowPoints);

    const getTempByHour = (list: any[], hour: string) => {
      const item = list?.find((i) => i.dt_txt.includes(`${hour}:00:00`));
      return item ? Math.round(item.main.temp) : null;
    };

    const tomorrowTemps = {
      t00: getTempByHour(tomorrowList, '00'),
      t06: getTempByHour(tomorrowList, '06'),
      t12: getTempByHour(tomorrowList, '12'),
      t18: getTempByHour(tomorrowList, '18'),
      t24: getTempByHour(tomorrowList, '21'),
    };

    let tomorrowData: any = null;
    if (tomorrowList.length > 0) {
      tomorrowData = tomorrowList.reduce((closest: any, item: any) => {
        const hour = new Date(item.dt_txt).getHours();
        const diff = Math.abs(hour - 12);
        if (!closest) return item;
        const closestHour = new Date(closest.dt_txt).getHours();
        const closestDiff = Math.abs(closestHour - 12);
        return diff < closestDiff ? item : closest;
      }, null);
    }

    const yesterdayStr = yesterday.toISOString().split('T')[0];
    let pastWeather = { temp: 0, humidity: 0, pressure: 0, wind: 0, icon: 'cloud' };

    try {
      const pastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${API_CONFIG.LAT}&longitude=${API_CONFIG.LON}&past_days=1&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`
      );

      if (pastRes.ok) {
        const pastData = await pastRes.json();

        const yesterdayPoints = pastData.hourly.time
          .map((t: string, i: number) => {
            if (!t.startsWith(yesterdayStr)) return null;
            const wmoCode = pastData.hourly.weather_code[i];
            return {
              windSpeed: pastData.hourly.wind_speed_10m[i] / 3.6,
              isRain: wmoCode >= 50,
              isCloud: wmoCode > 1 && wmoCode < 50,
              isSun: wmoCode <= 1,
            };
          })
          .filter(Boolean);

        pastWeather.icon = getDominantIcon(yesterdayPoints as any);

        const targetTime = `${yesterdayStr}T12:00`;
        const timeIndex = pastData.hourly.time.findIndex((t: string) => t === targetTime);

        if (timeIndex !== -1) {
          pastWeather.temp = Math.round(pastData.hourly.temperature_2m[timeIndex]);
          pastWeather.humidity = Math.round(pastData.hourly.relative_humidity_2m[timeIndex]);
          pastWeather.pressure = Math.round(pastData.hourly.surface_pressure[timeIndex]);
          pastWeather.wind = Math.round(pastData.hourly.wind_speed_10m[timeIndex]);
        }
      }
    } catch (error) {
      console.log('Error obteniendo datos históricos', error);
    }

    const normalizeIcon = (icon: string): WeatherIcon => {
      if (icon === 'sun' || icon === 'cloud' || icon === 'rain' || icon === 'wind') {
        return icon;
      }
      return 'cloud';
    };

    const updatedWeather: WeatherDay[] = [
      {
        id: 'ayer',
        date: formatDate(yesterday),
        temp: pastWeather.temp,
        humidity: pastWeather.humidity,
        pressure: pastWeather.pressure,
        wind: pastWeather.wind,
        icon: normalizeIcon(pastWeather.icon),
      },
      {
        id: 'hoy',
        date: formatDate(today),
        temp: Math.round(currentData.main.temp),
        humidity: currentData.main?.humidity || 0,
        pressure: currentData.main?.pressure || 0,
        wind: currentData.wind?.speed || 0,
        icon: normalizeIcon(todayDominantIcon),
      },
      {
        id: 'manana',
        date: formatDate(tomorrow),
        temp: tomorrowData?.main?.temp !== undefined ? Math.round(tomorrowData.main.temp) : null,
        humidity: tomorrowData?.main?.humidity || 0,
        pressure: tomorrowData?.main?.pressure || 0,
        wind: tomorrowData?.wind?.speed || 0,
        icon: normalizeIcon(tomorrowDominantIcon),
        temps: {
          t00: tomorrowTemps.t00 ?? null,
          t06: tomorrowTemps.t06 ?? null,
          t12: tomorrowTemps.t12 ?? null,
          t18: tomorrowTemps.t18 ?? null,
          t24: tomorrowTemps.t24 ?? null,
        },
      },
    ];

    return updatedWeather;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
