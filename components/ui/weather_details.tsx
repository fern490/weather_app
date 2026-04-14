import { View, Text, StyleSheet } from "react-native";

export default function WeatherDetails({
  humidity,
  pressure,
  wind,
}: {
  humidity: number;
  pressure: number;
  wind: number;
}) {
  return (
    <View style={styles.container}>
      <Text testID="humidity">
        Humedad: {humidity}%
      </Text>

      <Text testID="pressure">
        Presión: {pressure} hPa
      </Text>

      <Text testID="wind">
        Viento: {wind} km/h
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
});