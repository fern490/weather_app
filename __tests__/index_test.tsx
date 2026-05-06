import { test, expect } from 'bun:test';
import { getTempValue, getMainTemp, getWeatherType, isTomorrow } from '../utils/climautils';

test('usa temps.t00 si existe', () => {
  const data = { temps: { t00: 20 }, temp: 30 };
  expect(getTempValue(data, 4)).toBe(20);
});

test('usa temp - fallback si no hay temps', () => {
  const data = { temp: 25 };
  expect(getTempValue(data, 4)).toBe(21);
});

test("devuelve '--' si no hay datos", () => {
  const data = {};
  expect(getTempValue(data, 4)).toBe('--');
});

test('getMainTemp devuelve temp', () => {
  expect(getMainTemp({ temp: 28 })).toBe(28);
});

test("getMainTemp devuelve '--' si no hay temp", () => {
  expect(getMainTemp({})).toBe('--');
});

test('detecta tipo de clima', () => {
  expect(getWeatherType('sun')).toBe('sun');
  expect(getWeatherType('cloud')).toBe('cloud');
  expect(getWeatherType('wind')).toBe('wind');
  expect(getWeatherType('rain')).toBe('rain');
  expect(getWeatherType('algo_raro')).toBe('rain');
});

test('detecta si es mañana', () => {
  expect(isTomorrow('manana')).toBe(true);
  expect(isTomorrow('hoy')).toBe(false);
});
