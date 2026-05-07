import { WeatherDay, WeatherIcon } from '../types/clima';

const API_CONFIG = {
  KEY: process.env.EXPO_PUBLIC_API_KEY,
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

export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<{ weather: WeatherDay[]; city: string }> => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
      ),
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error('Error en las APIs de OpenWeather');
    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const cityName = currentData.name;

    if (!forecastRes.ok) throw new Error('Error en pronóstico');

    if (!forecastData.list) throw new Error('Sin datos de pronóstico');

    const todayDateStr = today.toLocaleDateString('en-CA');

    const todayList = forecastData.list.filter((item: any) => item.dt_txt.startsWith(todayDateStr));

    const todayTemps = todayList.map((item: any) => item.main.temp);

    todayTemps.push(currentData.main.temp);

    const todayMin = Math.round(Math.min(...todayTemps));
    const todayMax = Math.round(Math.max(...todayTemps));

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

    const tomorrowTempsList = tomorrowList.map((item: any) => item.main.temp);

    const tomorrowMin =
      tomorrowTempsList.length > 0 ? Math.round(Math.min(...tomorrowTempsList)) : null;

    const tomorrowMax =
      tomorrowTempsList.length > 0 ? Math.round(Math.max(...tomorrowTempsList)) : null;

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

    const getLocalDateStr = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    const yesterdayStr = getLocalDateStr(yesterday);
    const isSameDay = (t: string, date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return t.startsWith(`${year}-${month}-${day}`);
    };

    const pastWeather = {
      temp: 0,
      humidity: 0,
      pressure: 0,
      wind: 0,
      icon: 'cloud' as WeatherIcon,
      min: null as number | null,
      max: null as number | null,
    };

    try {
      const pastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=1&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`
      );

      if (pastRes.ok) {
        const pastData = await pastRes.json();
        const targetTime = `${yesterdayStr}T12:00`;
        const idx = pastData.hourly.time.findIndex((t: string) => t.startsWith(targetTime));
        const dayIndices = pastData.hourly.time
          .map((t: string, i: number) => (isSameDay(t, yesterday) ? i : -1))
          .filter((i: number) => i !== -1);

        const yesterdayTemps = pastData.hourly.time
          .filter((t: string) => isSameDay(t, yesterday))
          .map((i: number) => pastData.hourly.temperature_2m[i]);
        if (dayIndices.length > 0) {
          const temps = pastData.hourly.time.reduce((acc: number[], t: string, i: number) => {
            if (t.startsWith(yesterdayStr)) {
              acc.push(pastData.hourly.temperature_2m[i]);
            }
            return acc;
          }, []);

          pastWeather.min = Math.round(Math.min(...temps));
          pastWeather.max = Math.round(Math.max(...temps));

          const dataIdx = idx !== -1 ? idx : dayIndices[0];
          pastWeather.temp = Math.round(pastData.hourly.temperature_2m[dataIdx]);
          pastWeather.humidity = pastData.hourly.relative_humidity_2m[dataIdx];
          pastWeather.pressure = Math.round(pastData.hourly.surface_pressure[dataIdx]);
          pastWeather.wind = Math.round(pastData.hourly.wind_speed_10m[dataIdx]);
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
        min: pastWeather.min,
        max: pastWeather.max,
        humidity: pastWeather.humidity,
        pressure: pastWeather.pressure,
        wind: pastWeather.wind,
        icon: normalizeIcon(pastWeather.icon),
      },
      {
        id: 'hoy',
        date: formatDate(today),
        temp: Math.round(currentData.main.temp),
        min: todayMin,
        max: todayMax,
        humidity: currentData.main?.humidity ?? 0,
        pressure: currentData.main?.pressure ?? 0,
        wind: Math.round(currentData.wind.speed * 3.6),
        icon: normalizeIcon(todayDominantIcon),
      },
      {
        id: 'manana',
        date: formatDate(tomorrow),
        temp: tomorrowData?.main?.temp !== undefined ? Math.round(tomorrowData.main.temp) : null,
        min: tomorrowMin,
        max: tomorrowMax,
        humidity: tomorrowData?.main?.humidity ?? 0,
        pressure: tomorrowData?.main?.pressure ?? 0,
        wind: tomorrowData?.wind?.speed ?? 0,
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

    return { weather: updatedWeather, city: cityName };
  } catch (err: any) {
    throw new Error(err.message);
  }
};
