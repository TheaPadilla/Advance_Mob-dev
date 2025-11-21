import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  // REMOVED SafeAreaView from here to fix the warning
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useRouter } from "expo-router";
import ViewShot from "react-native-view-shot";
// ADDED correct SafeAreaView import
import { SafeAreaView } from "react-native-safe-area-context";

// --- CUSTOM COMPONENTS ---
import FilterPreview from "./FilterPreview";
import IntensitySlider from "./IntensitySlider";

type FilterType = "none" | "grayscale" | "sepia" | "vintage";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraType>("front");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const [filterIntensity, setFilterIntensity] = useState<number>(0.5);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permText}>Camera access is required.</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo) {
          setCapturedUri(photo.uri);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const savePhoto = async () => {
    if (capturedUri) {
      try {
        let finalUri = capturedUri;

        if (activeFilter !== "none" && viewShotRef.current && viewShotRef.current.capture) {
          finalUri = await viewShotRef.current.capture();
        }

        router.navigate({
          pathname: "/(drawer)/Profile",
          params: { newAvatarUri: finalUri }
        });

      } catch (error) {
        console.error("Failed to save filtered image", error);
        Alert.alert("Error", "Could not save the filtered image.");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedUri(null);
    setActiveFilter("none");
    setFilterIntensity(0.5);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // --- RENDER: EDITOR MODE ---
  if (capturedUri) {
    return (
      <SafeAreaView style={styles.editorContainer}>
        <View style={styles.previewWrapper}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 0.9 }}
            style={{ flex: 1 }}
          >
            <FilterPreview
              uri={capturedUri}
              filter={activeFilter}
              intensity={filterIntensity}
              style={{ flex: 1 }}
            />
          </ViewShot>
        </View>

        <View style={styles.editorControls}>
          {activeFilter !== "none" && (
            <IntensitySlider
              label="Filter Intensity"
              value={filterIntensity}
              onValueChange={setFilterIntensity}
            />
          )}

          <View style={styles.filterRow}>
            {(["none", "grayscale", "sepia", "vintage"] as FilterType[]).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterBtn,
                  activeFilter === f && styles.filterBtnActive,
                ]}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive
                ]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={retakePhoto} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={savePhoto} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDER: CAMERA MODE ---
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />

          <TouchableOpacity style={styles.switchBtn} onPress={toggleCameraFacing}>
            <Text style={{ color: "white", fontWeight: "600" }}>Flip</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
  permText: { color: "white", marginBottom: 20 },

  camera: { flex: 1 },
  controls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 50,
    position: "relative",
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "white",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  switchBtn: {
    position: "absolute",
    right: 30,
    bottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
  },

  editorContainer: { flex: 1, backgroundColor: "black" },
  previewWrapper: {
    flex: 1,
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#111"
  },
  editorControls: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "black"
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#222",
  },
  filterBtnActive: {
    backgroundColor: "white",
    borderColor: "white",
  },
  filterText: { color: "#888", fontSize: 12 },
  filterTextActive: { color: "black", fontWeight: "bold" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  secondaryBtn: {
    padding: 15,
  },
  secondaryBtnText: { color: "white", fontSize: 16 },
  primaryBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  primaryBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});