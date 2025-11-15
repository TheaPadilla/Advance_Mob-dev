import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  Alert,
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
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { mode, accentColor, customColors } = useSelector((state: any) => state.theme);
  const darkMode = mode === "dark";

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(accentColor);

  const containerStyle = {
    ...styles.container,
    backgroundColor: darkMode ? "#121212" : "#fff",
  };

  const textStyle = { ...styles.text, color: darkMode ? "#fff" : "#000" };
  const logoutStyle = { ...styles.logout, backgroundColor: accentColor };
  const logoutTextStyle = { ...styles.logoutText, color: darkMode ? "#000" : "#fff" };

  // Long press to delete a color
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
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={30} color={accentColor} />
        </TouchableOpacity>
        <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 20, marginLeft: 15 }}>
          Settings
        </Text>
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.setting}>
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

      {/* Current accent color preview */}
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: accentColor,
          borderWidth: 2,
          borderColor: "#fff",
        }}
        onPress={() => {
          setSelectedColor(accentColor);
          setPickerVisible(true);
        }}
      />

      {/* Custom Colors List */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
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
              borderColor: c === accentColor ? "#000" : "#ccc",
            }}
            onPress={() => dispatch(setAccentColor(c))}
            onLongPress={() => handleLongPress(c)}
          />
        ))}
      </View>

      {/* Add Custom Color Button */}
      <TouchableOpacity
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 8,
          backgroundColor: accentColor,
        }}
        onPress={() => {
          setSelectedColor(accentColor);
          setPickerVisible(true);
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}>
          + Add Custom Color
        </Text>
      </TouchableOpacity>

      {/* Color Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          activeOpacity={1}
          onPressOut={() => setPickerVisible(false)} // cancel on touching outside
        >
          <View
            style={{
              width: "100%",
              backgroundColor: darkMode ? "#222" : "#fff",
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 16, marginBottom: 10 }}>
              Pick a Custom Color
            </Text>

            <ColorPicker
              color={selectedColor}
              onColorChange={(color) => setSelectedColor(color)}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              style={{ flex: 1, marginBottom: 20 }}
            />

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
                padding: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout */}
      <TouchableOpacity
        style={[logoutStyle, { marginTop: 30 }]}
        onPress={() => router.replace("/SignIn")}
      >
        <Text style={logoutTextStyle}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  setting: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  text: { fontSize: 16 },
  logout: { padding: 15, borderRadius: 10 },
  logoutText: { textAlign: "center", fontWeight: "bold" },
});
