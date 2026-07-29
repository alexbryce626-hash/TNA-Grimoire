import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLOR_PRESETS, FONT_OPTIONS, DENSITY_PRESETS, DEFAULT_THEME } from "../theme";

const THEME_STORAGE_KEY = "app-theme-settings-v1";
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setThemeState({
            presetName: saved.presetName || DEFAULT_THEME.presetName,
            colors: COLOR_PRESETS[saved.presetName] || DEFAULT_THEME.colors,
            fontName: saved.fontName || DEFAULT_THEME.fontName,
            fontFamily: FONT_OPTIONS[saved.fontName] ?? DEFAULT_THEME.fontFamily,
            densityName: saved.densityName || DEFAULT_THEME.densityName,
            density: DENSITY_PRESETS[saved.densityName] || DEFAULT_THEME.density,
          });
        }
      } catch (e) {
        console.error("Failed to load theme", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistTheme = useCallback(async (next) => {
    setThemeState(next);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
        presetName: next.presetName, fontName: next.fontName, densityName: next.densityName,
      }));
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  }, []);

  const setPreset = useCallback((presetName) => {
    setThemeState((prev) => {
      const next = { ...prev, presetName, colors: COLOR_PRESETS[presetName] };
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  const setFont = useCallback((fontName) => {
    setThemeState((prev) => {
      const next = { ...prev, fontName, fontFamily: FONT_OPTIONS[fontName] };
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  const setDensity = useCallback((densityName) => {
    setThemeState((prev) => {
      const next = { ...prev, densityName, density: DENSITY_PRESETS[densityName] };
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  const resetTheme = useCallback(() => {
    persistTheme(DEFAULT_THEME);
  }, [persistTheme]);

  return (
    <ThemeContext.Provider value={{ theme, loaded, setPreset, setFont, setDensity, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
