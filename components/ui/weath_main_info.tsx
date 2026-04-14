import { View, Text, StyleSheet } from "react-native";

export default function WeatherMainInfo({
  icon,
  temp,
  min,
  max,
}: {
  icon: string;
  temp: number;
  min: number;
  max: number;
}) {
  return (
    <View style={styles.container}>
      <Text testID="weather-icon" style={styles.icon}>
        {icon}
      </Text>

      <Text testID="current-temperature" style={styles.temp}>
        {temp}°
      </Text>

      <Text testID="min-temperature">
        Min: {min}°
      </Text>

      <Text testID="max-temperature">
        Max: {max}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  icon: {
    fontSize: 50,
    marginVertical: 10,
  },
  temp: {
    fontSize: 40,
    fontWeight: "bold",
  },
});