import React from "react";
import { Image, StyleSheet, View, Animated } from "react-native";

interface FilterPreviewProps {
  uri: string;
  filter: "none" | "grayscale" | "sepia" | "vintage";
  intensity?: number;
  rotation?: number;
  scale?: Animated.Value;
  style?: any;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({
  uri,
  filter,
  intensity = 1,
  rotation = 0,
  scale,
  style,
}) => {
  // Simple simulated filter using opacity-based tint overlay
  const overlayColor =
    filter === "grayscale"
      ? `rgba(128,128,128,${intensity})`
      : filter === "sepia"
      ? `rgba(112,66,20,${intensity})`
      : filter === "vintage"
      ? `rgba(255,192,203,${intensity})`
      : "transparent";

  return (
    <Animated.View
      style={[
        style,
        {
          overflow: "hidden",
          transform: [
            { rotate: `${rotation}deg` },
            ...(scale ? [{ scale }] : []),
          ],
        },
      ]}
    >
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {filter !== "none" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: overlayColor },
          ]}
        />
      )}
    </Animated.View>
  );
};

export default FilterPreview;
