// redux/themeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  mode: "light" | "dark";
  accentColor: string;
  customColors: string[];
}

const initialState: ThemeState = {
  mode: "light",
  accentColor: "#1DB954", // default Spotify green
  customColors: ["#1DB954", "#FF4500", "#6A5ACD"], // default custom options
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    setAccentColor(state, action: PayloadAction<string>) {
      state.accentColor = action.payload;
    },
    addCustomColor(state, action: PayloadAction<string>) {
      if (!state.customColors.includes(action.payload)) {
        state.customColors.push(action.payload);
      }
    },
  },
});

export const { setTheme, setAccentColor, addCustomColor } = themeSlice.actions;
export default themeSlice.reducer;
