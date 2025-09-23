import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <FontAwesome name="bars" size={30} color="#1DB954" />
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 20, marginLeft: 15 }}>Settings</Text>
          </View>
      <View style={styles.setting}>
        <Text style={styles.text}>Enable Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? "#1DB954" : "#888"}
        />
      </View>
      <View style={styles.setting}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? "#1DB954" : "#888"}
        />
      </View>
      <TouchableOpacity
        style={styles.logout}
        onPress={() => router.replace("/LoginScreen")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  setting: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  text: { color: "#fff", fontSize: 16 },
  logout: { marginTop: 30, padding: 15, backgroundColor: "#1DB954", borderRadius: 10 },
  logoutText: { textAlign: "center", fontWeight: "bold", color: "#000" },
});