import { View, Text, StyleSheet } from "react-native";

export default function CityHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.cityText}>BUENOS AIRES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  cityText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});