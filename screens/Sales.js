import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { packingCost, fmt$, PACK_SAMPLE, PACK_CUSTOM } from "../data";
import { radius } from "../theme";

const emptyForm = (data) => ({
  date: new Date().toISOString().slice(0, 10),
  product: data.recipes[0]?.name || "",
  qty: "1",
  batch: "",
  unitPrice: data.recipes[0] ? String(data.recipes[0].retailPrice.toFixed(2)) : "8.00",
  boxSize: "Medium",
  shippingCost: packingCost(data, "Medium").toFixed(2),
  channel: "",
  bar1: data.products[0]?.name || "",
  bar2: data.products[0]?.name || "",
  bar3: data.products[0]?.name || "",
});

export default function Sales({ params }) {
  const { data, update } = useData();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [showForm, setShowForm] = useState(!!params?.openForm);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState(data ? emptyForm(data) : null);

  if (!data) return null;
  const rows = data.sales.map((s, i) => ({ ...s, idx: i })).reverse();

  function openAddForm() {
    setForm(emptyForm(data));
    setEditIdx(null);
    setShowForm(true);
  }

  function onProductChange(product) {
    let unitPrice = form.unitPrice;
    if (product === PACK_SAMPLE) unitPrice = "35.00";
    else if (product === PACK_CUSTOM) unitPrice = "21.00";
    else {
      const r = data.recipes.find((r) => r.name === product);
      if (r) unitPrice = r.retailPrice.toFixed(2);
    }
    setForm({ ...form, product, unitPrice });
  }

  function onBoxSizeChange(boxSize) {
    setForm({ ...form, boxSize, shippingCost: packingCost(data, boxSize).toFixed(2) });
  }

  function saveSale() {
    const sale = {
      date: form.date, product: form.product, qty: Number(form.qty) || 1,
      batch: form.batch, unitPrice: Number(form.unitPrice) || 0, boxSize: form.boxSize,
      shippingCost: Number(form.shippingCost) || 0, channel: form.channel,
    };
    if (form.product === PACK_CUSTOM) sale.components = [form.bar1, form.bar2, form.bar3];

    update((prev) => {
      const sales = [...prev.sales];
      if (editIdx != null) sales[editIdx] = sale; else sales.push(sale);
      return { ...prev, sales };
    });
    setShowForm(false);
    setEditIdx(null);
  }

  function editSale(idx) {
    const s = data.sales[idx];
    setForm({
      date: s.date, product: s.product, qty: String(s.qty), batch: s.batch || "",
      unitPrice: String(s.unitPrice), boxSize: s.boxSize || "Medium",
      shippingCost: String(s.shippingCost || 0), channel: s.channel || "",
      bar1: s.components?.[0] || data.products[0]?.name || "",
      bar2: s.components?.[1] || data.products[0]?.name || "",
      bar3: s.components?.[2] || data.products[0]?.name || "",
    });
    setEditIdx(idx);
    setShowForm(true);
  }

  function deleteSale(idx) {
    update((prev) => {
      const sales = [...prev.sales];
      sales.splice(idx, 1);
      return { ...prev, sales };
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Sales</Text>
      <Text style={styles.desc}>Log every sale. Shipping auto-calculates from packaging costs.</Text>

      <TouchableOpacity style={styles.btnBlock} onPress={showForm ? () => setShowForm(false) : openAddForm}>
        <Text style={styles.btnBlockText}>{showForm ? "Cancel" : "+ Log a Sale"}</Text>
      </TouchableOpacity>

      {showForm && form && (
        <View style={styles.card}>
          <Text style={styles.label}>Product</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.product} onValueChange={onProductChange}>
              {data.recipes.map((r) => <Picker.Item key={r.name} label={r.name} value={r.name} />)}
              <Picker.Item label={PACK_SAMPLE} value={PACK_SAMPLE} />
              <Picker.Item label={PACK_CUSTOM} value={PACK_CUSTOM} />
            </Picker>
          </View>

          {form.product === PACK_SAMPLE && (
            <Text style={styles.scanNote}>Subtracts 1 bar from every scent per pack sold.</Text>
          )}

          {form.product === PACK_CUSTOM && (
            <View>
              <Text style={styles.sectionDivider}>CUSTOM PACK CONTENTS</Text>
              {["bar1", "bar2", "bar3"].map((key, i) => (
                <View key={key}>
                  <Text style={styles.label}>Bar {i + 1}</Text>
                  <View style={styles.pickerWrap}>
                    <Picker selectedValue={form[key]} onValueChange={(v) => setForm({ ...form, [key]: v })}>
                      {data.products.map((p) => <Picker.Item key={p.name} label={p.name} value={p.name} />)}
                    </Picker>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Field styles={styles} label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
          <Field styles={styles} label="Qty (packs)" value={form.qty} onChangeText={(v) => setForm({ ...form, qty: v })} keyboardType="number-pad" />
          <Field styles={styles} label="Batch ID" value={form.batch} onChangeText={(v) => setForm({ ...form, batch: v })} />
          <Field styles={styles} label="Unit Price ($)" value={form.unitPrice} onChangeText={(v) => setForm({ ...form, unitPrice: v })} keyboardType="decimal-pad" />

          <Text style={styles.label}>Box Size</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.boxSize} onValueChange={onBoxSizeChange}>
              <Picker.Item label="Small" value="Small" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Large" value="Large" />
            </Picker>
          </View>

          <Field styles={styles} label="Shipping Cost ($)" value={form.shippingCost} onChangeText={(v) => setForm({ ...form, shippingCost: v })} keyboardType="decimal-pad" />
          <Field styles={styles} label="Sales Channel" value={form.channel} onChangeText={(v) => setForm({ ...form, channel: v })} />

          <TouchableOpacity style={styles.btnBlock} onPress={saveSale}>
            <Text style={styles.btnBlockText}>Save Sale</Text>
          </TouchableOpacity>
        </View>
      )}

      {rows.length === 0 && <Text style={styles.emptyNote}>No sales yet.</Text>}
      {rows.map((s) => (
        <View style={styles.saleCard} key={s.idx}>
          <View style={{ flex: 1 }}>
            <Text style={styles.saleProduct}>{s.product}</Text>
            {s.product === PACK_CUSTOM && s.components && (
              <Text style={styles.saleSub}>{s.components.join(", ")}</Text>
            )}
            <Text style={styles.saleSub}>{s.date} · Qty {s.qty} · {fmt$(s.unitPrice)}/ea</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.saleRevenue}>{fmt$(s.unitPrice * s.qty - (s.shippingCost || 0))}</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              <TouchableOpacity onPress={() => editSale(s.idx)}><Text style={styles.iconBtn}>✎</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSale(s.idx)}><Text style={styles.iconBtnDel}>×</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Field({ label, styles, ...props }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

function makeStyles(theme) {
  const c = theme.colors, d = theme.density, f = theme.fontFamily;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.cream, padding: d.screenPadding },
    title: { fontSize: 20 * d.fontScale, fontWeight: "700", color: c.ink, marginBottom: 2, fontFamily: f },
    desc: { fontSize: 13 * d.fontScale, color: c.inkSoft, marginBottom: 16, fontFamily: f },
    btnBlock: { backgroundColor: c.ink, borderRadius: 9, paddingVertical: 12, alignItems: "center", marginBottom: 12 },
    btnBlockText: { color: c.paper, fontWeight: "600", fontSize: 12 * d.fontScale, textTransform: "uppercase", fontFamily: f },
    card: { backgroundColor: c.paper, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: d.cardPadding, marginBottom: d.cardMargin },
    label: { fontSize: 10 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", marginTop: 10, marginBottom: 4, fontWeight: "600", fontFamily: f },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 8, padding: 9, fontSize: 14 * d.fontScale, backgroundColor: c.paper, color: c.ink, fontFamily: f },
    pickerWrap: { borderWidth: 1, borderColor: c.line, borderRadius: 8, backgroundColor: c.paper },
    sectionDivider: { fontSize: 10.5 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", letterSpacing: 1, marginTop: 16, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: c.line, paddingBottom: 6, fontFamily: f },
    scanNote: { fontSize: 11.5 * d.fontScale, color: c.inkSoft, marginTop: 6, fontFamily: f },
    emptyNote: { fontSize: 13 * d.fontScale, color: c.inkSoft, textAlign: "center", paddingVertical: 14, fontFamily: f },
    saleCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: c.paper, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: d.cardPadding, marginBottom: d.gap },
    saleProduct: { fontSize: 15 * d.fontScale, fontWeight: "600", color: c.ink, fontFamily: f },
    saleSub: { fontSize: 11.5 * d.fontScale, color: c.inkSoft, marginTop: 2, fontFamily: f },
    saleRevenue: { fontFamily: "monospace", fontSize: 14 * d.fontScale, color: c.ink, fontWeight: "600" },
    iconBtn: { fontSize: 15, color: c.inkSoft },
    iconBtnDel: { fontSize: 18, color: c.clay },
  });
}
