import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

import CityHeader from '@/components/ui/ciudad_header';
import WeatherDetails from '@/components/ui/weather_details';

const CloudIcon = ({ size = 200, color = '#000' }) => {
  const strokeWidth = 10;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      
      {}
      <Path
        d="M25 65 A25 25 0 0 1 55 40"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {}
      <Path
        d="M55 40 A20 20 0 0 1 85 55"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {}
      <Path
        d="M85 55 A15 15 0 0 1 95 65"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {}
      <Path
        d="M95 65 A20 20 0 0 1 70 75"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {}
      <Path
        d="M45 75 A20 20 0 0 1 25 65"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

    </Svg>
  );
};

const SunIcon = ({ size = 200, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle 
      cx="50" 
      cy="50" 
      r="38" 
      stroke={color} 
      strokeWidth="10" 
      fill="none" 
    />
  </Svg>
);

const RainIcon = ({ size = 200, color = '#000' }) => {
  const strokeWidth = 10;
  const spacing = 25;

  return (
    <Svg width={size} height={size} viewBox="0 0 75 125.5">
      <Rect x={10} y={60} width={strokeWidth} height={30} fill={color} transform="skewX(-20)" />
      <Rect x={10 + spacing} y={20} width={strokeWidth} height={80} fill={color} transform="skewX(-20)" />
      <Rect x={10 + spacing * 2} y={40} width={strokeWidth} height={85} fill={color} transform="skewX(-20)" />
      <Rect x={10 + spacing * 3} y={20} width={strokeWidth} height={62} fill={color} transform="skewX(-20)" />
      <Rect x={10 + spacing * 4} y={70} width={strokeWidth} height={35} fill={color} transform="skewX(-20)" />
    </Svg>
  );
};

export default function Home() {
  const [dayIndex, setDayIndex] = useState(1);

  const weatherData = [
    { id: 1, date: '4/20', temp: 15, humidity: 95, pressure: 1008, wind: 5.2, icon: 'yesterday-cloud' }, // Ayer
    { id: 2, date: '4/21', temp: 16, humidity: 80, pressure: 1016, wind: 19, icon: 'rain' }, // Hoy
    { id: 3, date: '4/22', temp: 19, humidity: 88, pressure: 1020, wind: 25, icon: 'sun' }, // Mañana
  ];

  const current = weatherData[dayIndex];

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerSection}>
        <View style={styles.dateSelector}>
          {weatherData.map((data, index) => (
            <TouchableOpacity key={data.id} onPress={() => setDayIndex(index)}>
              <Text style={dayIndex === index ? styles.dateActive : styles.dateInactive}>
                {data.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.cityTitle}>BUENOS AIRES</Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.iconWrapper}>
          {}
          {current.icon === 'sun' ? (
            <SunIcon size={200} />
          ) : current.icon === 'yesterday-cloud' ? (
            <CloudIcon size={200} />
          ) : (
            <RainIcon size={220} />
          )}
        </View>

        <View style={styles.detailsWrapper}>
          <WeatherDetails
            humidity={current.humidity}
            pressure={current.pressure}
            wind={current.wind}
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.tempRow}>
          <Text style={styles.tempSmall}>{current.temp - 4}°</Text>
          <Text style={styles.tempSmall}>{current.temp - 2}°</Text>
          <Text style={styles.tempMain}>{current.temp}°</Text>
          <Text style={styles.tempSmall}>{current.temp + 2}°</Text>
          <Text style={styles.tempSmall}>{current.temp + 1}°</Text>
        </View>

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
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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