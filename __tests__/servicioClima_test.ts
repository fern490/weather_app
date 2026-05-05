import { fetchWeatherData, formatDate, getDominantIcon } from '../services/servicioClima';

beforeAll(() => {
  process.env.EXPO_PUBLIC_API_KEY = 'test_key';
});

beforeEach(() => {
  global.fetch = undefined as any;
});

describe('formatDate', () => {
  test('formatea fecha correctamente', () => {
    const date = new Date('2024-05-03');
    expect(formatDate(date)).toBe('05/03');
  });
});

describe('getDominantIcon', () => {
  test('retorna cloud si no hay datos', () => {
    expect(getDominantIcon([])).toBe('cloud');
  });

  test('prioriza viento', () => {
    const points = [
      { windSpeed: 10, isRain: false, isCloud: false, isSun: false },
      { windSpeed: 9, isRain: false, isCloud: false, isSun: false },
    ];

    expect(getDominantIcon(points)).toBe('wind');
  });

  test('detecta lluvia', () => {
    const points = [
      { windSpeed: 2, isRain: true, isCloud: false, isSun: false },
      { windSpeed: 2, isRain: true, isCloud: false, isSun: false },
    ];

    expect(getDominantIcon(points)).toBe('rain');
  });
});

describe('fetchWeatherData', () => {
  test('retorna estructura válida', async () => {
    const today = new Date().toISOString().split('T')[0];

    let call = 0;

    global.fetch = (() => {
      call++;

      if (call === 1) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            main: { temp: 25, humidity: 60, pressure: 1010 },
            wind: { speed: 5 },
            weather: [{ icon: '01d' }],
          }),
        }) as any;
      }

      if (call === 2) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            list: [
              {
                dt_txt: `${today} 12:00:00`,
                main: { temp: 20, humidity: 50, pressure: 1000 },
                wind: { speed: 4 },
                weather: [{ icon: '01d' }],
              },
            ],
          }),
        }) as any;
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          hourly: {
            time: [`${today}T12:00`],
            temperature_2m: [22],
            relative_humidity_2m: [55],
            surface_pressure: [1005],
            wind_speed_10m: [10],
            weather_code: [1],
          },
        }),
      }) as any;
    }) as any;

    const data = await fetchWeatherData();

    expect(data).toHaveLength(3);
    expect(data[0].id).toBe('ayer');
    expect(data[1].id).toBe('hoy');
    expect(data[2].id).toBe('manana');
  });

  test('lanza error si falla clima actual', async () => {
    global.fetch = (() =>
      Promise.resolve({
        ok: false,
        json: async () => ({}),
      })) as any;
    await expect(fetchWeatherData()).rejects.toThrow('Error en clima actual');
  });
});
