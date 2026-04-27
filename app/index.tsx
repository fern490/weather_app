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

// --- VARIABLES DE CONFIGURACIÓN ---
const API_CONFIG = {
  KEY: 'ab297713b62b8c93e8a26c1815a6c18a',
  LAT: '-34.6037',
  LON: '-58.3816',
  UNITS: 'metric',
};

const formatDate = (date: any) => {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  });
};

// --- COMPONENTES DE ICONOS ---
const SunIcon = ({ size = 200, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="38" stroke={color} strokeWidth="10" fill="none" />
  </Svg>
);

const CloudIcon = ({ size = 200, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Path
      d="M 20 65 A 28 28 0 1 1 85 65 M 35 75 A 28 28 0 1 0 100 75"
      fill="none"
      stroke={color}
      strokeWidth={15}
      strokeLinecap="butt"
    />
  </Svg>
);

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

const getCustomIcon = (openWeatherIconCode: string | undefined) => {
  if (!openWeatherIconCode) return 'cloud';
  if (openWeatherIconCode.includes('01')) return 'sun';
  if (
    openWeatherIconCode.includes('02') ||
    openWeatherIconCode.includes('03') ||
    openWeatherIconCode.includes('04')
  )
    return 'cloud';
  return 'rain';
};

export default function Home() {
  const [dayIndex, setDayIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const icon_size = 250;

  const fetchWeather = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
      );
      if (!currentRes.ok) throw new Error('Error en clima actual');
      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}`
      );
      if (!forecastRes.ok) throw new Error('Error en pronóstico');
      const forecastData = await forecastRes.json();

      const tomorrowDateStr = tomorrow.toLocaleDateString('en-CA');
      if (!forecastData.list) throw new Error('Sin datos de pronóstico');

      const tomorrowList = (forecastData.list ?? []).filter((item: any) =>
        item.dt_txt.startsWith(tomorrowDateStr)
      );

      const getTempByHour = (list: any[], hour: string) => {
        const item = list?.find((i) => i.dt_txt.includes(`${hour}:00:00`));
        return item ? Math.round(item.main.temp) : null;
      };

      const tomorrowTemps = {
        t00: getTempByHour(tomorrowList, '00'),
        t06: getTempByHour(tomorrowList, '06'),
        t12: getTempByHour(tomorrowList, '12'),
        t18: getTempByHour(tomorrowList, '18'),
      };

      let tomorrowData: any = null;

      if (tomorrowList.length > 0) {
        tomorrowData = tomorrowList.reduce((closest: any, item: any) => {
          const hour = new Date(item.dt_txt).getHours();
          const diff = Math.abs(hour - 12);

          if (!closest) return item;

          const closestHour = new Date(closest.dt_txt).getHours();
          const closestDiff = Math.abs(closestHour - 12);

          return diff < closestDiff ? item : closest;
        }, null);
      }

      const updatedWeather = [
        {
          id: 'ayer',
          date: formatDate(yesterday),
          temp: Math.round(currentData.main.temp - 2),
          humidity: currentData.main?.humidity || 0,
          pressure: currentData.main?.pressure || 0,
          wind: currentData.wind?.speed || 0,
          icon: 'cloud',
        },
        {
          id: 'hoy',
          date: formatDate(today),
          temp: Math.round(currentData.main.temp),
          humidity: currentData.main?.humidity || 0,
          pressure: currentData.main?.pressure || 0,
          wind: currentData.wind?.speed || 0,
          icon: getCustomIcon(currentData.weather?.[0]?.icon),
        },
        {
          id: 'manana',
          date: formatDate(tomorrow),
          temp: tomorrowData?.main?.temp ? Math.round(tomorrowData.main.temp) : null,
          humidity: tomorrowData?.main?.humidity || 0,
          pressure: tomorrowData?.main?.pressure || 0,
          wind: tomorrowData?.wind?.speed || 0,
          icon: getCustomIcon(tomorrowData?.weather?.[0]?.icon ?? null),
          temps: tomorrowTemps,
        },
      ];

      setWeatherData(updatedWeather);
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
              <Text style={[styles.tempSmall, { marginRight: 40 }]}>{current.temp - 4}°</Text>
              <Text style={[styles.tempSmall, { marginRight: 30 }]}>{current.temp - 2}°</Text>
              <Text style={[styles.tempMain, { marginHorizontal: 0 }]} testID="main-temperature">
                {current.temp ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 30 }]}>{current.temp + 2}°</Text>
              <Text style={[styles.tempSmall, { marginLeft: 40 }]}>{current.temp + 1}°</Text>
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
    height: 220,
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
