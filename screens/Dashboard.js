import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useData } from "../context/DataContext";
import {
  totalRevenue, totalExpenses, netProfit, profitMargin,
  stockPct, productDemand, fmt$,
} from "../data";
import { colors, radius } from "../theme";

export default function Dashboard({ goTo }) {
  const { data } = useData();
  if (!data) return null;

  const rev = totalRevenue(data);
  const exp = totalExpenses(data);
  const profit = netProfit(data);
  const margin = profitMargin(data);

  const lowStock = Object.keys(data.inventory)
    .map((name) => ({ name, pct: stockPct(data, name) }))
    .filter((x) => x.pct !== null && x.pct <= 40)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  const recentSales = [...data.sales].slice(-4).reverse();
  const demand = productDemand(data);
  const topSeller = demand[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.desc}>Everything's calculated live from your logs.</Text>

      <View style={styles.dashBtnRow}>
        <TouchableOpacity style={styles.dashBtn} onPress={() => goTo("Sales", { openForm: true })}>
          <Text style={styles.dashBtnText}>+ Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dashBtn} onPress={() => goTo("Expenses", { openForm: true })}>
          <Text style={styles.dashBtnText}>+ Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dashBtn} onPress={() => goTo("Batches", { openForm: true })}>
          <Text style={styles.dashBtnText}>+ Batch</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricGrid}>
        <View style={[styles.metric, { borderColor: colors.line }]}>
          <Text style={styles.metricLabel}>TOTAL REVENUE</Text>
          <Text style={[styles.metricValue, { color: colors.sageDark }]}>{fmt$(rev)}</Text>
        </View>
        <View style={[styles.metric, { borderColor: colors.line }]}>
          <Text style={styles.metricLabel}>TOTAL EXPENSES</Text>
          <Text style={[styles.metricValue, { color: colors.danger }]}>{fmt$(exp)}</Text>
        </View>
        <View style={[styles.metric, { borderColor: colors.line }]}>
          <Text style={styles.metricLabel}>NET PROFIT</Text>
          <Text style={[styles.metricValue, { color: profit >= 0 ? colors.sageDark : colors.danger }]}>
            {profit < 0 ? "-" : ""}{fmt$(Math.abs(profit))}
          </Text>
        </View>
        <View style={[styles.metric, { borderColor: colors.line }]}>
          <Text style={styles.metricLabel}>PROFIT MARGIN</Text>
          <Text style={[styles.metricValue, { color: margin >= 0 ? colors.sageDark : colors.danger }]}>
            {margin.toFixed(1)}%
          </Text>
        </View>
      </View>

      {topSeller && topSeller.soldQty > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TOP SELLER</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>🏆 {topSeller.name}</Text>
            <Text style={styles.rowValue}>{topSeller.soldQty} sold · {fmt$(topSeller.soldRevenue)}</Text>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>LOW STOCK WATCH</Text>
        {lowStock.length ? lowStock.map((item) => (
          <View style={styles.row} key={item.name}>
            <Text style={styles.rowLabel}>{item.name}</Text>
            <View style={styles.stockBarBg}>
              <View style={[styles.stockBarFill, {
                width: `${item.pct}%`,
                backgroundColor: item.pct <= 15 ? colors.danger : colors.gold,
              }]} />
            </View>
          </View>
        )) : <Text style={styles.emptyNote}>Everything's well stocked.</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RECENT SALES</Text>
        {recentSales.length ? recentSales.map((s, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.rowLabel}>{s.product} ×{s.qty}</Text>
            <Text style={styles.rowValue}>{fmt$(s.unitPrice * s.qty - (s.shippingCost || 0))}</Text>
          </View>
        )) : <Text style={styles.emptyNote}>No sales logged yet.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.ink, marginBottom: 2 },
  desc: { fontSize: 13, color: colors.inkSoft, marginBottom: 16 },
  dashBtnRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  dashBtn: {
    flex: 1, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line,
    borderRadius: 10, paddingVertical: 12, alignItems: "center",
  },
  dashBtnText: { fontSize: 11, textTransform: "uppercase", color: colors.ink, fontWeight: "600" },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  metric: {
    width: "47%", backgroundColor: colors.paper, borderWidth: 1, borderRadius: radius, padding: 14,
  },
  metricLabel: { fontSize: 10, color: colors.inkSoft, textTransform: "uppercase", letterSpacing: 0.5 },
  metricValue: { fontSize: 22, fontWeight: "700", marginTop: 4 },
  card: {
    backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius, padding: 16, marginBottom: 14,
  },
  cardTitle: { fontSize: 10.5, color: colors.inkSoft, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: "600" },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  rowLabel: { fontSize: 13.5, color: colors.ink },
  rowValue: { fontSize: 13, color: colors.ink, fontFamily: "monospace" },
  stockBarBg: { width: 80, height: 6, borderRadius: 6, backgroundColor: colors.cream2, overflow: "hidden" },
  stockBarFill: { height: "100%", borderRadius: 6 },
  emptyNote: { fontSize: 13, color: colors.inkSoft, textAlign: "center", paddingVertical: 10 },
});
