import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal } from "react-native";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import Dashboard from "./screens/Dashboard";
import Sales from "./screens/Sales";
import Recipes from "./screens/Recipes";
import Inventory from "./screens/Inventory";
import Expenses from "./screens/Expenses";
import Products from "./screens/Products";
import Batches from "./screens/Batches";
import Settings from "./screens/Settings";

const TABS = [
  { key: "Dashboard", label: "Dashboard", Component: Dashboard },
  { key: "Sales", label: "Sales", Component: Sales },
  { key: "Recipes", label: "Recipes", Component: Recipes },
  { key: "Inventory", label: "Inventory", Component: Inventory },
  { key: "Expenses", label: "Expenses", Component: Expenses },
  { key: "Products", label: "Products", Component: Products },
  { key: "Batches", label: "Batch Log", Component: Batches },
];

function AppShell() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [params, setParams] = useState({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  function goTo(tab, tabParams = {}) {
    setActiveTab(tab);
    setParams(tabParams);
  }

  const Active = TABS.find((t) => t.key === activeTab)?.Component || Dashboard;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.ink} />
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandName}>The Naked Alchemist's Grimoire</Text>
            <Text style={styles.brandSub}>SOAP BUSINESS, CONSOLIDATED</Text>
          </View>
          <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.gearBtn}>
            <Text style={styles.gearIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => goTo(t.key)}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Active goTo={goTo} params={params} />

      <Modal visible={settingsOpen} animationType="slide" transparent onRequestClose={() => setSettingsOpen(false)}>
        <Settings onClose={() => setSettingsOpen(false)} />
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppShell />
      </DataProvider>
    </ThemeProvider>
  );
}

function makeStyles(theme) {
  const c = theme.colors;
  const f = theme.fontFamily;
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.ink },
    header: { backgroundColor: c.ink, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
    brandRow: { flexDirection: "row", alignItems: "flex-start" },
    brandName: { color: c.paper, fontSize: 19, fontWeight: "700", fontFamily: f },
    brandSub: { color: "#C9BFA8", fontSize: 10, letterSpacing: 1.5, marginTop: 2, marginBottom: 10, fontFamily: f },
    gearBtn: { padding: 4, marginLeft: 8 },
    gearIcon: { color: c.paper, fontSize: 22 },
    tabsRow: { flexDirection: "row" },
    tabBtn: { paddingHorizontal: 4, paddingVertical: 8, marginRight: 18, borderBottomWidth: 2, borderBottomColor: "transparent" },
    tabBtnActive: { borderBottomColor: c.gold },
    tabText: { color: "#B7AF9C", fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: f },
    tabTextActive: { color: c.paper },
  });
}
