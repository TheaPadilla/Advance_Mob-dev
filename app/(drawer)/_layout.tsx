import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

import Profile from "./Profile";
import Settings from "./Settings";
import Playlists from "./Playlist";

const Drawer = createDrawerNavigator();
//added
export const SlideTransition = {
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 300 } },
    close: { animation: 'timing', config: { duration: 300 } },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};

export const FadeTransition = {
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 200 } },
    close: { animation: 'timing', config: { duration: 200 } },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};
//till here

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
        //dis one
        swipeEnabled: true,
        gestureEnabled: true,
        gestureResponseDistance: { horizontal: 20 }, // sensitivity (20px)
        swipeEdgeWidth: 50, // distance from edge to trigger swipe
        //till here
      }}
    >
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Playlists" component={Playlists} />
    </Drawer.Navigator>
  );
}