import { Text, StyleSheet } from "react-native";

export default function CityHeader() {
  return (
    <Text testID="city-name" style={styles.city}>
      Buenos Aires
    </Text>
  );
}

const styles = StyleSheet.create({
  city: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});