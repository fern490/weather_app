import { View, Text, StyleSheet } from "react-native";

interface WeatherMainInfoProps {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
}

export default function WeatherMainInfo({ currentTemp, minTemp, maxTemp }: WeatherMainInfoProps) {
  return (
    <View style={styles.container}>
      {}
      <Text testID="current-temperature" style={styles.currentTempText}>
        {currentTemp}°C
      </Text>
      
      {}
      <View style={styles.minMaxContainer}>
        <Text testID="min-temperature" style={styles.minMaxText}>Mín: {minTemp}°</Text>
        <Text style={styles.separator}>|</Text>
        <Text testID="max-temperature" style={styles.minMaxText}>Máx: {maxTemp}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  currentTempText: {
    fontSize: 90,
    fontWeight: '200',
    color: '#000',
    marginBottom: -10,
  },
  minMaxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minMaxText: {
    fontSize: 18,
    color: '#666',
  },
  separator: {
    marginHorizontal: 15,
    color: '#CCC',
    fontSize: 18,
  }
});