import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

import Profile from "./Profile";
import Settings from "./Settings";
import Playlists from "./Playlist";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#121212" }}>
      <DrawerItem
        label="Profile"
        labelStyle={{ color: "white" }}
        icon={({ size }) => <Ionicons name="person-circle-outline" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Profile")}
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: "white" }}
        icon={({ size }) => <Ionicons name="settings-outline" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Settings")}
      />
      <DrawerItem
        label="Playlists"
        labelStyle={{ color: "white" }}
        icon={({ size }) => <Ionicons name="musical-notes-outline" size={size} color="#1DB954" />}
        onPress={() => props.navigation.navigate("Playlists")}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#121212", width: 240 },
        sceneContainerStyle: { backgroundColor: "#121212" },
        drawerType: dimensions.width >= 768 ? "permanent" : "slide",
        overlayColor: "rgba(0,0,0,0.6)",
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Playlists" component={Playlists} />
    </Drawer.Navigator>
  );
}