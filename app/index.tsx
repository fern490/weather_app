import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import WeatherDetails from '@/components/ui/weather_details';
import { useWeather } from '@/hooks/useWeather';
import { SunIcon, CloudIcon, RainIcon, WindIcon } from '@/components/icons/climaIconos';

export default function Home() {
  const { weatherData, isLoading, error } = useWeather();
  const [dayIndex, setDayIndex] = useState(0);

  const icon_size = 300;
  const current = weatherData?.[dayIndex];

  const getTemp = (v?: number | null, fallback?: number | null) => v ?? fallback ?? '--';

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

  if (!current) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'sun':
        return <SunIcon size={icon_size} />;
      case 'cloud':
        return <CloudIcon size={icon_size} />;
      case 'wind':
        return <WindIcon size={icon_size} />;
      case 'rain':
        return <RainIcon size={icon_size} />;
      default:
        return <RainIcon size={icon_size} />;
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer} testID="home-screen">
      <View style={styles.headerSection}>
        <View style={styles.dateSelector}>
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

        <Text style={styles.cityTitle}>BUENOS AIRES</Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.iconWrapper} testID={`weather-icon-${current.icon}`}>
          {renderIcon(current.icon)}
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
          {current.id === 'manana' ? (
            <>
              <Text style={[styles.tempSmall, { marginRight: 40 }]}>
                {current.temps?.t00 ?? '--'}°
              </Text>
              <Text style={[styles.tempSmall, { marginRight: 30 }]}>
                {current.temps?.t06 ?? '--'}°
              </Text>
              <Text style={styles.tempMain}>{current.temps?.t12 ?? '--'}°</Text>
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
                {getTemp(current.temps?.t00, current.temp ? current.temp - 4 : null)}°
              </Text>
              <Text style={[styles.tempSmall, { marginRight: 30 }]}>
                {getTemp(current.temps?.t00, current.temp ? current.temp - 2 : null)}°
              </Text>
              <Text style={styles.tempMain}>{current.temp ?? '--'}°</Text>
              <Text style={[styles.tempSmall, { marginLeft: 30 }]}>
                {getTemp(current.temps?.t00, current.temp ? current.temp - 2 : null)}°
              </Text>
              <Text style={[styles.tempSmall, { marginLeft: 40 }]}>
                {getTemp(current.temps?.t00, current.temp ? current.temp - 1 : null)}°
              </Text>
            </>
          )}
        </View>

        <View style={styles.timelineWrapper}>
          <View style={styles.lineBackground} />

          <View style={[styles.cut, { left: 0 }]} />
          <View style={[styles.cut, { right: 0, left: 'auto' }]} />

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
    gap: 4.5,
  },
  tempMain: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000',
      transform: [{ translateX: 9 }],
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
  tempTimelineBlock: {
    alignItems: 'center',
    width: '100%',
  },
});
