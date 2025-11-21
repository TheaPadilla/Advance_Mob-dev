import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Platform } from "react-native";
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
// Update this path to wherever your store is located
import { RootState } from "../redux/store";

// --- 1. MOCK DATA: Custom POIs relevant to a Music App theme ---
const mockPOIs = [
  {
    id: "1",
    title: "The Main Stage",
    description: "Central concert arena",
    latitude: 37.78825, // San Francisco (Example)
    longitude: -122.4324,
    color: "#E91E63", // Pink
    icon: "music",
  },
  {
    id: "2",
    title: "Underground Studio",
    description: "Exclusive recording sessions",
    latitude: 37.75825,
    longitude: -122.4624,
    color: "#9C27B0", // Purple
    icon: "microphone",
  },
  {
    id: "3",
    title: "Vinyl Archive",
    description: "Rare records store",
    latitude: 37.77825,
    longitude: -122.4024,
    color: "#FF9800", // Orange
    icon: "headphones",
  },
];

// --- 2. CUSTOM MAP APPEARANCE (Dark Mode JSON) ---
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  // State
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [initialFocus, setInitialFocus] = useState(false);
  const [alertHistory, setAlertHistory] = useState<string[]>([]);

  // Geofencing State: Tracks which zones we are currently inside
  const activeZones = useRef<Set<string>>(new Set());

  // Redux Theme (Fallback to defaults if Redux isn't fully set up)
  const mode = useSelector((state: RootState) => state.theme?.mode) || "dark";
  const accentColor = useSelector((state: RootState) => state.theme?.accentColor) || "#007AFF";
  const isDark = mode === "dark";

  // --- 3. REAL-TIME TRACKING & PERMISSIONS ---
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for tracking and geofencing.");
        return;
      }
      setHasPermission(true);
    })();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    let subscription: Location.LocationSubscription;

    const startWatching = async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ latitude, longitude });

          // Check Geofences on every location update
          checkGeofences(latitude, longitude);

          // Auto-center map on first valid location
          if (!initialFocus && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 1000);
            setInitialFocus(true);
          }
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [hasPermission, initialFocus]);

  // --- 4. GEOFENCING IMPLEMENTATION ---
  const checkGeofences = (userLat: number, userLon: number) => {
    mockPOIs.forEach((poi) => {
      const distance = getHaversineDistance(userLat, userLon, poi.latitude, poi.longitude);
      const GEOFENCE_RADIUS = 100; // 100 meters

      // User ENTERS the region
      if (distance <= GEOFENCE_RADIUS && !activeZones.current.has(poi.id)) {
        activeZones.current.add(poi.id);
        triggerAlert(`Entered ${poi.title}`);
      }
      // User LEAVES the region
      else if (distance > GEOFENCE_RADIUS && activeZones.current.has(poi.id)) {
        activeZones.current.delete(poi.id);
        triggerAlert(`Left ${poi.title}`);
      }
    });
  };

  const triggerAlert = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlertHistory((prev) => [`${timestamp}: ${msg}`, ...prev].slice(0, 3));
    Alert.alert("Geofence Alert", msg);
  };

  // Helper: Haversine Formula for distance
  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // --- 5. MAP CONTROLS (Zoom & Pan) ---
  const handleZoom = (factor: number) => {
    // Simple zoom simulation by changing delta
    if (!currentLocation || !mapRef.current) return;

    // We can't easily get current region state without tracking it,
    // so we focus on the user with a wider/tighter zoom
    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.05 * factor,
      longitudeDelta: 0.05 * factor,
    }, 500);
  };

  const centerMap = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      Alert.alert("Waiting", "Acquiring GPS signal...");
    }
  };

  if (Platform.OS === "web") {
    return <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', alignItems:'center'}}><Text style={{color:'white'}}>Map not supported on Web</Text></View>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.headerContainer, { backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)" }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <FontAwesome name="bars" size={24} color={accentColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>
            Live Tracker
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDark ? darkMapStyle : []}
        showsUserLocation={hasPermission} // Real-time native blue dot
        showsMyLocationButton={false}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {mockPOIs.map((poi) => (
          <React.Fragment key={poi.id}>
            {/* Geofence Radius Visual (100m) */}
            <Circle
              center={{ latitude: poi.latitude, longitude: poi.longitude }}
              radius={100}
              strokeColor={poi.color}
              fillColor={poi.color + "30"} // Transparent fill
            />

            {/* Custom Marker */}
            <Marker coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}>
              <View style={[styles.customMarker, { borderColor: poi.color }]}>
                {/* @ts-ignore */}
                <FontAwesome name={poi.icon} size={16} color={poi.color} />
              </View>

              {/* Custom Callout Bubble */}
              <Callout tooltip>
                <View style={styles.calloutBubble}>
                  <Text style={styles.calloutTitle}>{poi.title}</Text>
                  <Text style={styles.calloutDesc}>{poi.description}</Text>
                </View>
                <View style={styles.calloutArrow} />
              </Callout>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: accentColor }]} onPress={() => handleZoom(0.5)}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, { backgroundColor: accentColor }]} onPress={() => handleZoom(2)}>
          <MaterialIcons name="remove" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fab, { backgroundColor: accentColor, marginTop: 10 }]} onPress={centerMap}>
          <MaterialIcons name="my-location" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Alert Log Overlay */}
      {alertHistory.length > 0 && (
        <View style={[styles.logContainer, { backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)" }]}>
          <Text style={[styles.logTitle, { color: isDark ? "#ccc" : "#333" }]}>Live Alerts:</Text>
          {alertHistory.map((log, index) => (
            <Text key={index} style={{ color: isDark ? "#fff" : "#000", fontSize: 12, marginBottom: 2 }}>
              {log}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  headerContainer: { zIndex: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  map: { ...StyleSheet.absoluteFillObject },

  // Markers
  customMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  calloutBubble: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    elevation: 5,
  },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  calloutDesc: { fontSize: 12, color: '#666', textAlign: 'center' },
  calloutArrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: 'white',
    borderWidth: 10,
    alignSelf: 'center',
    marginTop: -10,
    marginBottom: 10,
  },

  // Controls
  controlsContainer: {
    position: "absolute",
    right: 16,
    bottom: 140,
    gap: 12,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  // Logs
  logContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)"
  },
  logTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  }
});