import { View, StyleSheet } from "react-native";
import { useState } from "react";

import CityHeader from "@/components/ui/ciudad_header";
import DayNavigator from "@/components/ui/dia_nav";
import WeatherMainInfo from "@/components/ui/weath_main_info";
import WeatherDetails from "@/components/ui/weather_details";

export default function Home() {
  const weatherData = [
    {
      day: "Lunes",
      temp: 22,
      min: 18,
      max: 26,
      humidity: 60,
      pressure: 1013,
      wind: 15,
      icon: "☀️",
    },
    {
      day: "Martes",
      temp: 20,
      min: 16,
      max: 24,
      humidity: 55,
      pressure: 1010,
      wind: 10,
      icon: "⛅",
    },
    {
      day: "Miércoles",
      temp: 22,
      min: 19,
      max: 22,
      humidity: 89,
      pressure: 1013,
      wind: 20,
      icon: "🌧️",
    },
  ];

  const [dayIndex, setDayIndex] = useState(0);
  const current = weatherData[dayIndex];

  const handleNext = () => {
    if (dayIndex < weatherData.length - 1) {
      setDayIndex(dayIndex + 1);
    }
  };

  const handlePrev = () => {
    if (dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <CityHeader />

      <DayNavigator
        day={current.day}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <WeatherMainInfo
        icon={current.icon}
        temp={current.temp}
        min={current.min}
        max={current.max}
      />

      <WeatherDetails
        humidity={current.humidity}
        pressure={current.pressure}
        wind={current.wind}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});