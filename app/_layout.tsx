// app/_layout.tsx
import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "../redux/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  );
}

function InnerApp() {
  const { mode } = useSelector((state: any) => state.theme);
  const navTheme = mode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        initialRouteName="SignIn"
        screenOptions={{
          headerStyle: { backgroundColor: navTheme.colors.card },
          headerTintColor: navTheme.colors.text,
        }}
      >
        <Stack.Screen name="SignIn" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        {/* Remove "(tabs)" if you don't have it yet */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
