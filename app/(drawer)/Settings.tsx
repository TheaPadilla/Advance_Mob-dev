import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView, // Added ScrollView for better scrolling on small screens
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setTheme,
  setAccentColor,
  addCustomColor,
  removeCustomColor,
} from "../../redux/themeSlice";
import ColorPicker from "react-native-wheel-color-picker";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>(); // Typed as any to avoid drawer error
  const dispatch = useDispatch();

  const { mode, accentColor, customColors } = useSelector((state: any) => state.theme);
  const darkMode = mode === "dark";

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(accentColor);

  // Dynamic Styles
  const containerStyle = {
    ...styles.container,
    backgroundColor: darkMode ? "#121212" : "#fff",
  };
  const textStyle = { ...styles.text, color: darkMode ? "#fff" : "#000" };
  const logoutStyle = { ...styles.logout, backgroundColor: accentColor };
  const logoutTextStyle = { ...styles.logoutText, color: darkMode ? "#000" : "#fff" };

  // New MenuItem Style
  const menuItemStyle = {
    ...styles.menuItem,
    backgroundColor: darkMode ? "#1E1E1E" : "#F5F5F5",
  };

  const handleLongPress = (color: string) => {
    Alert.alert(
      "Delete Color",
      `Do you want to delete ${color}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(removeCustomColor(color));
          },
        },
      ]
    );
  };

  return (
    <View style={containerStyle}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15, paddingTop: 40 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={30} color={accentColor} />
        </TouchableOpacity>
        <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 22, fontWeight: "bold", marginLeft: 15 }}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* --- SECTION: APPEARANCE --- */}
        <Text style={[styles.sectionHeader, { color: accentColor }]}>APPEARANCE</Text>

        {/* Dark Mode Toggle */}
        <View style={styles.settingRow}>
          <Text style={textStyle}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => dispatch(setTheme(value ? "dark" : "light"))}
            thumbColor={accentColor}
            trackColor={{ false: "#888", true: accentColor }}
          />
        </View>

        {/* Accent Color Section */}
        <Text style={[textStyle, { marginTop: 20, marginBottom: 10 }]}>Accent Color</Text>

        {/* Colors Grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
          {customColors.map((c: string) => (
            <TouchableOpacity
              key={c}
              style={{
                backgroundColor: c,
                width: 40,
                height: 40,
                borderRadius: 20,
                margin: 5,
                borderWidth: c === accentColor ? 3 : 1,
                borderColor: c === accentColor ? (darkMode ? "#fff" : "#000") : "#ccc",
              }}
              onPress={() => dispatch(setAccentColor(c))}
              onLongPress={() => handleLongPress(c)}
            />
          ))}

          {/* Add Button */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              margin: 5,
              backgroundColor: darkMode ? "#333" : "#e0e0e0",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setSelectedColor(accentColor);
              setPickerVisible(true);
            }}
          >
            <FontAwesome name="plus" size={16} color={darkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>


        {/* --- SECTION: GENERAL --- */}
        <View style={{ marginTop: 30 }}>
           <Text style={[styles.sectionHeader, { color: accentColor }]}>GENERAL</Text>

           {/* MAP BUTTON */}
           <TouchableOpacity
             style={menuItemStyle}
             // IMPORTANT: Ensure your MapScreen is at "app/MapScreen.tsx"
             onPress={() => router.push("/MapScreen")}
           >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
                    <FontAwesome name="map-marker" size={20} color={accentColor} />
                 </View>
                 <Text style={[textStyle, { marginLeft: 15, fontWeight: '500' }]}>Location Map</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={darkMode ? "#555" : "#ccc"} />
           </TouchableOpacity>
        </View>


        {/* --- LOGOUT --- */}
        <TouchableOpacity
          style={[logoutStyle, { marginTop: 40 }]}
          onPress={() => router.replace("/SignIn")}
        >
          <Text style={logoutTextStyle}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setPickerVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: darkMode ? "#222" : "#fff" }]}>
            <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
              Pick a Custom Color
            </Text>

            <View style={{ height: 300, width: '100%' }}>
                <ColorPicker
                color={selectedColor}
                onColorChange={(color) => setSelectedColor(color)}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                style={{ flex: 1 }}
                />
            </View>

            <TouchableOpacity
              onPress={() => {
                if (!customColors.includes(selectedColor)) {
                  dispatch(addCustomColor(selectedColor));
                }
                dispatch(setAccentColor(selectedColor));
                setPickerVisible(false);
              }}
              style={{
                backgroundColor: accentColor,
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 25,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>Save Color</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
    opacity: 0.8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  text: { fontSize: 16 },

  // New Styles for Menu Items
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  logout: { padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  }
});