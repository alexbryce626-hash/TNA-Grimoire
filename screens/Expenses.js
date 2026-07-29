import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { fmt$ } from "../data";
import { radius } from "../theme";

const CATS = ["Ingredients", "Equipment", "Shipping", "Other"];

const emptyForm = () => ({
  item: "", date: new Date().toISOString().slice(0, 10), category: "Ingredients", cost: "", vendor: "",
});

export default function Expenses({ params }) {
  const { data, update } = useData();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [showForm, setShowForm] = useState(!!params?.openForm);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [filter, setFilter] = useState("All");

  if (!data) return null;
  const rows = data.expenses
    .map((e, i) => ({ ...e, idx: i }))
    .filter((e) => filter === "All" || e.category === filter)
    .reverse();

  function openAddForm() {
    setForm(emptyForm());
    setEditIdx(null);
    setShowForm(true);
  }
  function editExpense(idx) {
    const e = data.expenses[idx];
    setForm({ item: e.item, date: e.date, category: e.category, cost: String(e.cost), vendor: e.vendor || "" });
    setEditIdx(idx);
    setShowForm(true);
  }
  function saveExpense() {
    const expense = { item: form.item, date: form.date, category: form.category, cost: Number(form.cost) || 0, vendor: form.vendor };
    update((prev) => {
      const expenses = [...prev.expenses];
      if (editIdx != null) expenses[editIdx] = expense; else expenses.push(expense);
      return { ...prev, expenses };
    });
    setShowForm(false);
    setEditIdx(null);
  }
  function deleteExpense(idx) {
    update((prev) => {
      const expenses = [...prev.expenses];
      expenses.splice(idx, 1);
      return { ...prev, expenses };
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.desc}>Every purchase that goes into the business.</Text>

      <TouchableOpacity style={styles.btnBlock} onPress={showForm ? () => setShowForm(false) : openAddForm}>
        <Text style={styles.btnBlockText}>{showForm ? "Cancel" : "+ Add Expense"}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.card}>
          <Field styles={styles} label="Item" value={form.item} onChangeText={(v) => setForm({ ...form, item: v })} />
          <Field styles={styles} label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              {CATS.map((c) => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
          <Field styles={styles} label="Cost ($)" value={form.cost} onChangeText={(v) => setForm({ ...form, cost: v })} keyboardType="decimal-pad" />
          <Field styles={styles} label="Vendor" value={form.vendor} onChangeText={(v) => setForm({ ...form, vendor: v })} />
          <TouchableOpacity style={styles.btnBlock} onPress={saveExpense}>
            <Text style={styles.btnBlockText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {["All", ...CATS].map((c) => (
          <TouchableOpacity key={c} onPress={() => setFilter(c)} style={[styles.chip, filter === c && styles.chipActive]}>
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {rows.length === 0 && <Text style={styles.emptyNote}>Nothing in this category.</Text>}
      {rows.map((e) => (
        <View style={styles.expenseCard} key={e.idx}>
          <View style={{ flex: 1 }}>
            <Text style={styles.expenseItem}>{e.item}</Text>
            <Text style={styles.expenseSub}>{e.date || "—"} · {e.category} · {e.vendor || "—"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.expenseCost}>{fmt$(e.cost)}</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              <TouchableOpacity onPress={() => editExpense(e.idx)}><Text style={styles.iconBtn}>✎</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExpense(e.idx)}><Text style={styles.iconBtnDel}>×</Text></TouchableOpacity>
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
    chip: { borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6, backgroundColor: c.paper },
    chipActive: { backgroundColor: c.ink, borderColor: c.ink },
    chipText: { fontSize: 10.5 * d.fontScale, textTransform: "uppercase", color: c.inkSoft, fontFamily: f },
    chipTextActive: { color: c.paper },
    emptyNote: { fontSize: 13 * d.fontScale, color: c.inkSoft, textAlign: "center", paddingVertical: 14, fontFamily: f },
    expenseCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: c.paper, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: d.cardPadding, marginBottom: d.gap },
    expenseItem: { fontSize: 14 * d.fontScale, fontWeight: "600", color: c.ink, fontFamily: f },
    expenseSub: { fontSize: 11 * d.fontScale, color: c.inkSoft, marginTop: 2, fontFamily: f },
    expenseCost: { fontFamily: "monospace", fontSize: 14 * d.fontScale, color: c.ink, fontWeight: "600" },
    iconBtn: { fontSize: 15, color: c.inkSoft },
    iconBtnDel: { fontSize: 18, color: c.clay },
  });
}
