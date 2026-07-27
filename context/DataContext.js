import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SEED, STORAGE_KEY } from "../data";

const DataContext = createContext(null);
const DRIVE_URL_KEY = "drive-backup-url";
const DRIVE_SECRET_KEY = "drive-backup-secret";

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dataRef = useRef(null);

  const [driveUrl, setDriveUrlState] = useState("");
  const [driveSecret, setDriveSecretState] = useState("");
  const driveConfigRef = useRef({ url: "", secret: "" });
  const [backupStatus, setBackupStatus] = useState("idle"); // idle | syncing | success | error
  const [lastBackupAt, setLastBackupAt] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        let initial;
        if (raw) {
          initial = JSON.parse(raw);
          if (!initial.productStockAdjustment) initial.productStockAdjustment = {};
        } else {
          initial = JSON.parse(JSON.stringify(SEED));
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
        setData(initial);
        dataRef.current = initial;
      } catch (e) {
        console.error("Failed to load data", e);
        const fallback = JSON.parse(JSON.stringify(SEED));
        setData(fallback);
        dataRef.current = fallback;
      } finally {
        setLoading(false);
      }

      try {
        const [url, secret] = await Promise.all([
          AsyncStorage.getItem(DRIVE_URL_KEY),
          AsyncStorage.getItem(DRIVE_SECRET_KEY),
        ]);
        driveConfigRef.current = { url: url || "", secret: secret || "" };
        setDriveUrlState(url || "");
        setDriveSecretState(secret || "");
      } catch (e) {
        console.error("Failed to load backup config", e);
      }
    })();
  }, []);

  const setDriveConfig = useCallback(async (url, secret) => {
    driveConfigRef.current = { url, secret };
    setDriveUrlState(url);
    setDriveSecretState(secret);
    try {
      await AsyncStorage.setItem(DRIVE_URL_KEY, url);
      await AsyncStorage.setItem(DRIVE_SECRET_KEY, secret);
    } catch (e) {
      console.error("Failed to save backup config", e);
    }
  }, []);

  const pushBackup = useCallback(async (payload) => {
    const { url, secret } = driveConfigRef.current;
    if (!url) return; // backup not configured yet — silently skip
    setBackupStatus("syncing");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, data: payload }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setBackupStatus("success");
      setLastBackupAt(new Date().toISOString());
    } catch (e) {
      console.error("Drive backup failed", e);
      setBackupStatus("error");
    }
  }, []);

  const persist = useCallback(async (next) => {
    setData(next);
    dataRef.current = next;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save data", e);
    }
    pushBackup(next);
  }, [pushBackup]);

  // update(draft => { ...mutate and return new object... })
  const update = useCallback((updater) => {
    const next = updater(dataRef.current);
    dataRef.current = next;
    setData(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
      console.error("Failed to save data", e)
    );
    pushBackup(next);
  }, [pushBackup]);

  const backupNow = useCallback(() => {
    if (dataRef.current) pushBackup(dataRef.current);
  }, [pushBackup]);

  return (
    <DataContext.Provider value={{
      data, loading, persist, update,
      driveUrl, driveSecret, setDriveConfig, backupStatus, lastBackupAt, backupNow,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
