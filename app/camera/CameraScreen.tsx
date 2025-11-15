import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import FilterPreview from "./FilterPreview";
import IntensitySlider from "./IntensitySlider";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [intensity, setIntensity] = useState(0.5);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  // Capture photo
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
  };

  // Back to camera view
  const retakePhoto = () => {
    setPhotoUri(null);
  };

  return (
    <View style={styles.container}>
      {/* If no photo, show live camera */}
      {!photoUri ? (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      ) : (
        <FilterPreview
          imageUri={photoUri}
          filter={selectedFilter}
          intensity={intensity}
        />
      )}

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {!photoUri ? (
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />
        ) : (
          <>
            {/* Filter Options */}
            <View style={styles.filterRow}>
              {["none", "grayscale", "sepia", "brightness"].map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setSelectedFilter(f)}
                  style={[
                    styles.filterBtn,
                    selectedFilter === f && styles.filterSelected,
                  ]}
                >
                  <Text style={styles.filterText}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Intensity Slider */}
            <IntensitySlider
              value={intensity}
              onChange={(v) => setIntensity(v)}
            />

            {/* Retake */}
            <TouchableOpacity onPress={retakePhoto} style={styles.retakeBtn}>
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  camera: {
    flex: 1,
    width: "100%",
  },

  controls: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    alignSelf: "center",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  filterBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#333",
  },

  filterSelected: {
    backgroundColor: "#888",
  },

  filterText: { color: "white", fontSize: 12 },

  retakeBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  retakeText: {
    fontWeight: "bold",
  },
});
