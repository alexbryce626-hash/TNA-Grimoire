import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { useData } from "../context/DataContext";
import { costPerUnit, stockPct, productDemand, fmt$ } from "../data";
import { colors, radius } from "../theme";

export default function Inventory() {
  const { data, update } = useData();
  if (!data) return null;

  const cats = [];
  data.rawMaterials.forEach((m) => { if (!cats.includes(m.category)) cats.push(m.category); });
  const demand = productDemand(data);

  function setStock(name, value) {
    update((prev) => ({ ...prev, inventory: { ...prev.inventory, [name]: Number(value) || 0 } }));
  }
  function setAdjustment(name, value) {
    update((prev) => ({ ...prev, productStockAdjustment: { ...prev.productStockAdjustment, [name]: Number(value) || 0 } }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.desc}>Raw materials by category, plus finished-goods stock and scent demand.</Text>

      <Text style={styles.sectionDivider}>FINISHED GOODS &amp; DEMAND</Text>
      {demand.map((p, i) => (
        <View style={styles.demandRow} key={p.name}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
            <View style={[styles.rankBadge, i === 0 && p.soldQty > 0 && styles.rankBadgeTop]}>
              <Text style={styles.rankBadgeText}>{i + 1}</Text>
            </View>
            <View>
              <Text style={styles.demandName}>{p.name}</Text>
              <Text style={styles.demandSub}>In stock: {p.stock} · Sold: {p.soldQty} · {fmt$(p.soldRevenue)}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Adjust</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="number-pad"
              defaultValue={String(p.adjustment)}
              onEndEditing={(e) => setAdjustment(p.name, e.nativeEvent.text)}
            />
          </View>
        </View>
      ))}
      <Text style={styles.scanNote}>Stock = adjustment + bars produced (Batch Log) − bars sold (Sales).</Text>

      {cats.map((cat) => (
        <View key={cat}>
          <Text style={styles.sectionDivider}>{cat.toUpperCase()}</Text>
          {data.rawMaterials.filter((m) => m.category === cat).map((m) => {
            const current = data.inventory[m.name];
            const pct = stockPct(data, m.name);
            return (
              <View style={styles.matRow} key={m.name}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matName}>{m.name}</Text>
                  <Text style={styles.matSub}>{fmt$(costPerUnit(data, m.name))}/unit</Text>
                </View>
                {current != null && (
                  <TextInput
                    style={styles.smallInput}
                    keyboardType="decimal-pad"
                    defaultValue={String(current)}
                    onEndEditing={(e) => setStock(m.name, e.nativeEvent.text)}
                  />
                )}
                {pct !== null && (
                  <View style={styles.stockBarBg}>
                    <View style={[styles.stockBarFill, {
                      width: `${pct}%`,
                      backgroundColor: pct <= 15 ? colors.danger : pct <= 40 ? colors.gold : colors.sage,
                    }]} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.ink, marginBottom: 2 },
  desc: { fontSize: 13, color: colors.inkSoft, marginBottom: 16 },
  sectionDivider: { fontSize: 10.5, color: colors.inkSoft, letterSpacing: 1, marginTop: 18, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 6, fontWeight: "600" },
  demandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 12, marginBottom: 8 },
  rankBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.cream2, alignItems: "center", justifyContent: "center" },
  rankBadgeTop: { backgroundColor: colors.gold },
  rankBadgeText: { fontSize: 10, color: colors.inkSoft, fontFamily: "monospace" },
  demandName: { fontSize: 14, fontWeight: "600", color: colors.ink },
  demandSub: { fontSize: 11, color: colors.inkSoft, marginTop: 2 },
  label: { fontSize: 9, color: colors.inkSoft, textTransform: "uppercase", textAlign: "center" },
  smallInput: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, padding: 6, width: 70, fontSize: 12, textAlign: "center", backgroundColor: colors.paper, color: colors.ink },
  matRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  matName: { fontSize: 13.5, color: colors.ink },
  matSub: { fontSize: 11, color: colors.inkSoft, fontFamily: "monospace" },
  stockBarBg: { width: 60, height: 6, borderRadius: 6, backgroundColor: colors.cream2, overflow: "hidden" },
  stockBarFill: { height: "100%", borderRadius: 6 },
  scanNote: { fontSize: 11.5, color: colors.inkSoft, marginTop: 6 },
});
