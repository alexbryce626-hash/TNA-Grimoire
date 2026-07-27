import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { DataProvider } from "./context/DataContext";
import { colors } from "./theme";

import Dashboard from "./screens/Dashboard";
import Sales from "./screens/Sales";
import Recipes from "./screens/Recipes";
import Inventory from "./screens/Inventory";
import Expenses from "./screens/Expenses";
import Products from "./screens/Products";
import Batches from "./screens/Batches";

const TABS = [
  { key: "Dashboard", label: "Dashboard", Component: Dashboard },
  { key: "Sales", label: "Sales", Component: Sales },
  { key: "Recipes", label: "Recipes", Component: Recipes },
  { key: "Inventory", label: "Inventory", Component: Inventory },
  { key: "Expenses", label: "Expenses", Component: Expenses },
  { key: "Products", label: "Products", Component: Products },
  { key: "Batches", label: "Batch Log", Component: Batches },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [params, setParams] = useState({});

  function goTo(tab, tabParams = {}) {
    setActiveTab(tab);
    setParams(tabParams);
  }

  const Active = TABS.find((t) => t.key === activeTab)?.Component || Dashboard;

  return (
    <DataProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.ink} />
        <View style={styles.header}>
          <Text style={styles.brandName}>The Naked Alchemist's Grimoire</Text>
          <Text style={styles.brandSub}>SOAP BUSINESS, CONSOLIDATED</Text>
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
      </SafeAreaView>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.ink },
  header: { backgroundColor: colors.ink, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4 },
  brandName: { color: colors.paper, fontSize: 19, fontWeight: "700" },
  brandSub: { color: "#C9BFA8", fontSize: 10, letterSpacing: 1.5, marginTop: 2, marginBottom: 10 },
  tabsRow: { flexDirection: "row" },
  tabBtn: { paddingHorizontal: 4, paddingVertical: 8, marginRight: 18, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabBtnActive: { borderBottomColor: colors.gold },
  tabText: { color: "#B7AF9C", fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5 },
  tabTextActive: { color: colors.paper },
});
