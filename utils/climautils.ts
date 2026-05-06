export function getTempValue(current: any, fallback: number) {
  if (current?.temps?.t00 != null) return current.temps.t00;

  if (current?.temp != null) return current.temp - fallback;

  return "--";
}

export function getMainTemp(current: any) {
  return current?.temp ?? "--";
}

export function getWeatherType(icon: string) {
  switch (icon) {
    case "sun":
      return "sun";
    case "cloud":
      return "cloud";
    case "wind":
      return "wind";
    default:
      return "rain";
  }
}

export function isTomorrow(id: string) {
  return id === "manana";
}

