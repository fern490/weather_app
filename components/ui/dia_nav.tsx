import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DayNavigator({
  day,
  onNext,
  onPrev,
}: {
  day: string;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <View style={styles.nav}>
      <TouchableOpacity testID="prev-day-button" onPress={onPrev}>
        <Text style={styles.button}>{"<"}</Text>
      </TouchableOpacity>

      <Text testID="current-day" style={styles.day}>
        {day}
      </Text>

      <TouchableOpacity testID="next-day-button" onPress={onNext}>
        <Text style={styles.button}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  day: {
    fontSize: 18,
  },
});