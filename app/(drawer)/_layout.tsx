import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image } from "react-native";

// Screens
import PlaylistsScreen from "./Playlist"; // 👉 this will now be "Home"
import PlaylistDetailScreen from "./PlaylistDetail";
import ProfileScreen from "./Profile";
import SettingsScreen from "./Settings";
import CreatePlaylistScreen from "./CreatePlaylist";
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 👉 Home stack (was Playlists)
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={PlaylistsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={({ route }) => ({
          title: route.params?.playlistName || "Playlist",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        })}
      />
    </Stack.Navigator>
  );
}

// 👉 New Playlist stack (for creating playlists)
// 👉 New Playlist stack (for creating playlists)
function PlaylistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreatePlaylist"
        component={CreatePlaylistScreen}
        options={{
          title: "Create Playlist",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={({ route }) => ({
          title: route.params?.playlistName || "Playlist",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        })}
      />
    </Stack.Navigator>
  );
}


function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#fff",
        headerShown: true,
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Playlist (new) */}
      <Tab.Screen
        name="Playlist"
        component={PlaylistStack}
        options={{
          title: "Playlist",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="music" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />

      {/* Settings */}
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#121212" }}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("@/assets/images/augusta.jpg")}
          style={styles.profilePic}
        />
        <Text style={styles.drawerTitle}>Augusta</Text>
      </View>

      <DrawerItem
        label="Home"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <FontAwesome name="home" size={size} color="#1DB954" />
        )}
        onPress={() => props.navigation.navigate("Tabs", { screen: "Home" })}
      />
      <DrawerItem
        label="Playlist"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <FontAwesome name="music" size={size} color="#1DB954" />
        )}
        onPress={() => props.navigation.navigate("Tabs", { screen: "Playlist" })}
      />
      <DrawerItem
        label="Profile"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <FontAwesome name="user" size={size} color="#1DB954" />
        )}
        onPress={() =>
          props.navigation.navigate("Tabs", { screen: "ProfileScreen" })
        }
      />
      <DrawerItem
        label="Settings"
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <FontAwesome name="cog" size={size} color="#1DB954" />
        )}
        onPress={() =>
          props.navigation.navigate("Tabs", { screen: "SettingsScreen" })
        }
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
        sceneContainerStyle: { backgroundColor: "#000" },
        drawerStyle: { width: "70%", backgroundColor: "#121212" },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Tabs" component={TabsLayout} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  drawerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  drawerLabel: { color: "#fff", fontSize: 16 },
});
