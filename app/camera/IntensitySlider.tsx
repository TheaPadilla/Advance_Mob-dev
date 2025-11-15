import React from "react";
import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";

interface IntensitySliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
}

const IntensitySlider: React.FC<IntensitySliderProps> = ({
  value,
  onValueChange,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Slider
        style={{ width: "100%" }}
        minimumValue={0}
        maximumValue={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#777"
        thumbTintColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "90%", marginVertical: 10, alignSelf: "center" },
  label: { color: "#fff", marginBottom: 4, fontSize: 12 },
});

export default IntensitySlider;
