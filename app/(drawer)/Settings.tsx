import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, Button } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setAccentColor } from "../../redux/themeSlice";
import { ColorPicker } from "react-native-color-picker";
import React from "react";

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { mode, accentColor } = useSelector((state: any) => state.theme);
  const darkMode = mode === "dark";

  const [modalVisible, setModalVisible] = React.useState(false);

  const containerStyle = {
    ...styles.container,
    backgroundColor: darkMode ? "#121212" : "#fff",
  };

  const textStyle = { ...styles.text, color: darkMode ? "#fff" : "#000" };
  const logoutStyle = { ...styles.logout, backgroundColor: accentColor };
  const logoutTextStyle = { ...styles.logoutText, color: darkMode ? "#000" : "#fff" };

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

      {/* Custom Accent Color */}
      <Text style={[textStyle, { marginTop: 20, marginBottom: 10 }]}>Accent Color</Text>
      <TouchableOpacity
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: accentColor, borderWidth: 2, borderColor: "#fff" }}
        onPress={() => setModalVisible(true)}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
          <ColorPicker
            color={accentColor}
            onColorChangeComplete={(color) => dispatch(setAccentColor(color))}
            style={{ flex: 1 }}
          />
          <Button title="Done" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Logout */}
      <TouchableOpacity style={[logoutStyle, { marginTop: 30 }]} onPress={() => router.replace("/SignIn")}>
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
