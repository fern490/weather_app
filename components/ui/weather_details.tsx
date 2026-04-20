import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface WeatherDetailsProps {
  humidity: number;
  pressure: number;
  wind: number;
}

export default function WeatherDetails({ humidity, pressure, wind }: WeatherDetailsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.detailItem}>
        <Ionicons name="water" size={24} color="#555" />
        <Text style={styles.label}></Text>
        <Text testID="humidity" style={styles.value}>{humidity}%</Text>
      </View>
      
      <View style={styles.detailItem}>
        <MaterialCommunityIcons name="gauge" size={24} color="#555" />
        <Text style={styles.label}></Text>
        <Text testID="pressure" style={styles.value}>{pressure} hPa</Text>
      </View>
      
      <View style={styles.detailItem}>
        <FontAwesome5 name="wind" size={20} color="#555" />
        <Text style={styles.label}></Text>
        <Text testID="wind" style={styles.value}>{wind} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginLeft: 12,
    marginRight: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
});