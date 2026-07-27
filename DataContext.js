import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SEED, STORAGE_KEY } from "../data";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!parsed.productStockAdjustment) parsed.productStockAdjustment = {};
          setData(parsed);
        } else {
          const seed = JSON.parse(JSON.stringify(SEED));
          setData(seed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        }
      } catch (e) {
        console.error("Failed to load data", e);
        setData(JSON.parse(JSON.stringify(SEED)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }, []);

  // update(draft => { ...mutate and return new object... })
  const update = useCallback((updater) => {
    setData((prev) => {
      const next = updater(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.error("Failed to save data", e)
      );
      return next;
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, persist, update }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
