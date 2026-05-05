import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import WeatherDetails from '@/components/ui/weather_details';
import { WeatherDay } from '../types/clima';
import { fetchWeatherData } from '../services/servicioClima';



const SunIcon = ({ size = 200, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="38" stroke={color} strokeWidth="10" fill="none" />
  </Svg>
);

const CloudIcon = ({ size = 200, color = 'black' }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg width={size} height={(size * 93) / 125} viewBox="0 0 125 93">
        <Path
          d="
            M 31.492 20.797
            C 20.323 24.659, 12.251 34.477, 10.467 46.370
            L 9.773 51
            L 14.418 51
            C 17.278 51, 19.199 50.520, 19.417 49.750
            C 19.612 49.063, 20.293 46.580, 20.931 44.233
            C 23.341 35.363, 31.977 29.063, 41.782 29.022
            C 48.028 28.996, 52.371 30.631, 57.110 34.792
            C 60.097 37.415, 61.053 37.733, 64.038 37.103
            C 71.591 35.506, 77.709 38.968, 81.085 46.750
            C 82.818 50.743, 83.173 51, 86.964 51
            C 90.834 51, 91 50.869, 91 47.816
            C 91 40.327, 83.110 30.548, 75.142 28.161
            C 73.011 27.522, 69.378 27, 67.067 27
            C 64.186 27, 61.866 26.247, 59.683 24.603
            C 52.410 19.126, 40.842 17.564, 31.492 20.797

            M 29 53.462
            C 29 59.161, 33.182 67.434, 38.919 73.086
            C 45.526 79.595, 51.340 82.003, 60.428 81.994
            C 68.164 81.987, 72.621 80.731, 78.113 77.009
            C 81.493 74.719, 83.648 74.027, 87.500 73.996
            C 94.054 73.944, 99.781 71.242, 104.145 66.143
            C 107.449 62.284, 110 56.397, 110 52.634
            C 110 50.186, 101.152 50.293, 100.405 52.750
            C 97.553 62.125, 89.449 67.022, 81.676 64.067
            C 79.652 63.297, 78.810 63.577, 76.861 65.664
            C 70.062 72.950, 58.262 74.701, 49.728 69.691
            C 44.081 66.376, 40.040 60.721, 39.283 55.072
            L 38.737 51
            L 33.868 51
            C 29.362 51, 29 51.183, 29 53.462
          "
          fill={color}
          fillRule="evenodd"
        />
      </Svg>
    </View>
  );
};

const RainIcon = ({ size = 200, color = '#000' }) => {
  const strokeWidth = 10;
  const spacing = 25;
  return (
    <Svg width={size} height={size} viewBox="0 0 75 125.5">
      <Rect x={10} y={60} width={strokeWidth} height={30} fill={color} transform="skewX(-20)" />
      <Rect
        x={10 + spacing}
        y={20}
        width={strokeWidth}
        height={80}
        fill={color}
        transform="skewX(-20)"
      />
      <Rect
        x={10 + spacing * 2}
        y={40}
        width={strokeWidth}
        height={85}
        fill={color}
        transform="skewX(-20)"
      />
      <Rect
        x={10 + spacing * 3}
        y={20}
        width={strokeWidth}
        height={62}
        fill={color}
        transform="skewX(-20)"
      />
      <Rect
        x={10 + spacing * 4}
        y={70}
        width={strokeWidth}
        height={35}
        fill={color}
        transform="skewX(-20)"
      />
    </Svg>
  );
};

const WindIcon = ({ size = 200, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Path
      d="M 20 40 Q 60 40 80 30 T 95 40"
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
    <Path
      d="M 10 60 Q 50 60 70 50 T 110 60"
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
    <Path
      d="M 30 80 Q 70 80 90 70 T 105 80"
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
  </Svg>
);



export default function Home() {
  const [dayIndex, setDayIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const icon_size = 300;

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWeatherData();
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const intervalId = setInterval(fetchWeather, 600000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading || weatherData.length === 0) {
    return (
      <SafeAreaView
        style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const current = weatherData[dayIndex];
  const base = current.temp ?? null;

  if (!current) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer} testID="home-screen">
      <View style={styles.headerSection}>
        <View style={styles.dateSelector} testID="date-selector-container">
          {weatherData.map((data, index) => (
            <TouchableOpacity
              key={data.id}
              onPress={() => setDayIndex(index)}
              testID={`tab-day-${data.id}`}>
              <Text style={dayIndex === index ? styles.dateActive : styles.dateInactive}>
                {data.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.cityTitle} testID="city-title">
          BUENOS AIRES
        </Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.iconWrapper} testID={`weather-icon-${current.icon}`}>
          {current.icon === 'sun' ? (
            <SunIcon size={icon_size} />
          ) : current.icon === 'cloud' ? (
            <CloudIcon size={icon_size} />
          ) : current.icon === 'wind' ? (
            <WindIcon size={icon_size} />
          ) : (
            <RainIcon size={icon_size} />
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
        <View style={styles.tempRow} testID="temperature-row">
          {current.id === 'manana' ? (
            <>
              <Text style={[styles.tempSmall, { marginRight: 40 }]}>
                {current.temps?.t00 ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginRight: 30 }]}>
                {current.temps?.t06 ?? '--'}°
              </Text>
              <Text style={[styles.tempMain, { marginHorizontal: 0 }]} testID="main-temperature">
                {current.temps?.t12 ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 30 }]}>
                {current.temps?.t18 ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 40 }]}>
                {current.temps?.t24 ?? '--'}°
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.tempSmall, { marginRight: 40 }]}>
                {current.temps?.t00 ?? (current.temp != null ? current.temp - 4 : '--')}°
              </Text>
              <Text style={[styles.tempSmall, { marginRight: 30 }]}>
                {current.temps?.t00 ?? (current.temp != null ? current.temp - 2 : '--')}°
              </Text>
              <Text style={[styles.tempMain, { marginHorizontal: 0 }]} testID="main-temperature">
                {current.temp ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 30 }]}>
                {current.temps?.t00 ?? (current.temp != null ? current.temp - 2 : '--')}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 40 }]}>
                {current.temps?.t00 ?? (current.temp != null ? current.temp - 1 : '--')}°
              </Text>
            </>
          )}
        </View>

        <View style={styles.timelineWrapper}>
          <View style={styles.lineBackground} />
          <View style={[styles.cut, { right: '0%' }]} />
          <View style={[styles.cut, { left: '0%' }]} />

          <View style={styles.timeRow}>
            <View style={styles.timeRow}>
              {current.id === 'manana' ? (
                <>
                  <Text style={styles.timeText}>00</Text>
                  <View style={styles.numberContainer}>
                    <Text style={styles.timeText}>06</Text>
                  </View>
                  <View style={styles.nowContainer}>
                    <Text style={styles.nowLabel}>12</Text>
                  </View>
                  <View style={styles.numberContainer}>
                    <Text style={styles.timeText}>18</Text>
                  </View>
                  <Text style={styles.timeText}>24</Text>
                </>
              ) : (
                <>
                  <Text style={styles.timeText}>12</Text>
                  <View style={styles.numberContainer}>
                    <Text style={styles.timeText}>15</Text>
                  </View>
                  <View style={styles.nowContainer}>
                    <Text style={styles.nowLabel}>NOW</Text>
                  </View>
                  <View style={styles.numberContainer}>
                    <Text style={styles.timeText}>21</Text>
                  </View>
                  <Text style={styles.timeText}>24</Text>
                </>
              )}
            </View>
          </View>
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
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 44,
    width: '100%',
    paddingBottom: 135,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 83,
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
    marginTop: -106,
  },
  iconWrapper: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsWrapper: {
    alignSelf: 'flex-start',
    paddingLeft: 17,
    marginBottom: 20,
    marginTop: 35,
  },
  bottomSection: {
    marginBottom: 65,
    alignItems: 'center',
    width: '100%',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tempMain: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000',
  },
  tempSmall: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
    opacity: 1,
  },

  timelineWrapper: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineBackground: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#CFCFCF',
  },
  nowContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  cut: {
    position: 'absolute',
    width: 7,
    height: 4,
    backgroundColor: '#FFF',
    top: '50%',
    transform: [{ translateY: -2 }],
    left: 0,
    zIndex: 1,
  },
  numberContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowLabel: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#000000',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 56,
    zIndex: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#AAA',
  },
});
