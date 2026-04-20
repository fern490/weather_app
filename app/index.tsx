import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import CityHeader from '@/components/ui/ciudad_header';
import WeatherDetails from '@/components/ui/weather_details';

// Icono replicado exactamente de la imagen (estilo Zen/Yin-Yang)
const CloudIcon = ({ size = 180, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    {/* Arco Superior */}
    <Path
      d="M 20,50 A 15,15 0 0 1 50,50 A 10,10 0 0 1 75,50"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    {/* Arco Inferior invertido */}
    <Path
      d="M 30,55 A 15,15 0 0 0 60,55 A 10,10 0 0 0 85,55"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export default function Home() {
  // Datos actualizados según la imagen (Tokyo, 16°, etc.)
  const [dayIndex, setDayIndex] = useState(1); // Iniciamos en 4/22
  
  const weatherData = [
    { id: 1, date: '4/19', temp: 21, humidity: 78, pressure: 1056, wind: 2.3, icon: 'cloud' },
    { id: 2, date: '4/20', temp: 16, humidity: 78, pressure: 1056, wind: 2.3, icon: 'cloud' },
    { id: 3, date: '4/21', temp: 21, humidity: 78, pressure: 1010, wind: 2.4, icon: 'cloud' },
  ];

  const current = weatherData[dayIndex];

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header con fechas y Ciudad */}
      <View style={styles.headerSection}>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => dayIndex > 0 && setDayIndex(dayIndex - 1)}>
            <Text style={styles.dateInactive}>{weatherData[0].date}</Text>
          </TouchableOpacity>
          <Text style={styles.dateActive}>{current.date}</Text>
          <TouchableOpacity onPress={() => dayIndex < 2 && setDayIndex(dayIndex + 1)}>
            <Text style={styles.dateInactive}>{weatherData[2].date}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cityTitle}>BUENOS AIRES</Text>
      </View>

      {/* Sección Central: Icono y Detalles */}
      <View style={styles.middleSection}>
        <View style={styles.iconWrapper}>
          <CloudIcon size={200} />
        </View>

        <View style={styles.detailsWrapper}>
          <WeatherDetails
            humidity={current.humidity}
            pressure={current.pressure}
            wind={current.wind}
          />
        </View>
      </View>

      {/* Sección Inferior: Timeline de temperatura */}
      <View style={styles.bottomSection}>
        <View style={styles.tempRow}>
          <Text style={styles.tempSmall}>15°</Text>
          <Text style={styles.tempSmall}>19°</Text>
          <Text style={styles.tempMain}>{current.temp}°</Text>
          <Text style={styles.tempSmall}>21°</Text>
          <Text style={styles.tempSmall}>20°</Text>
        </View>
        
        {/* Línea de tiempo "NOW" */}
        <View style={styles.timelineContainer}>
          <View style={styles.line} />
          <Text style={styles.nowLabel}>NOW</Text>
          <View style={styles.line} />
        </View>
        
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>12</Text>
          <Text style={styles.timeText}>15</Text>
          <View style={{ width: 40 }} />
          <Text style={styles.timeText}>21</Text>
          <Text style={styles.timeText}>24</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 40,
  },
  dateActive: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  dateInactive: {
    fontSize: 16,
    color: '#CCC',
  },
  cityTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 40,
  },
  detailsWrapper: {
    alignSelf: 'flex-start',
    paddingLeft: 40,
  },
  bottomSection: {
    marginBottom: 50,
    alignItems: 'center',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    width: '100%',
    gap: 25,
  },
  tempMain: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000',
  },
  tempSmall: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  nowLabel: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 35,
  },
  timeText: {
    fontSize: 14,
    color: '#AAA',
  },
});