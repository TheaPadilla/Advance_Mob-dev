import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function App({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: any) => state.theme); // get theme from Redux

  // Override colors for accent
  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.accentColor,
    },
  };
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.accentColor,
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={theme.mode === "dark" ? CustomDarkTheme : CustomLightTheme}>
          {children}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
