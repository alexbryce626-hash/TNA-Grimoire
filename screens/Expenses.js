import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../context/DataContext";
import { fmt$ } from "../data";
import { colors, radius } from "../theme";

const CATS = ["Ingredients", "Equipment", "Shipping", "Other"];

const emptyForm = () => ({
  item: "", date: new Date().toISOString().slice(0, 10), category: "Ingredients", cost: "", vendor: "",
});

export default function Expenses({ params }) {
  const { data, update } = useData();
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
          <Field label="Item" value={form.item} onChangeText={(v) => setForm({ ...form, item: v })} />
          <Field label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              {CATS.map((c) => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
          <Field label="Cost ($)" value={form.cost} onChangeText={(v) => setForm({ ...form, cost: v })} keyboardType="decimal-pad" />
          <Field label="Vendor" value={form.vendor} onChangeText={(v) => setForm({ ...form, vendor: v })} />
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

function Field({ label, ...props }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 14 },
  title: { fontSize: 20, fontWeight: "700", color: colors.ink, marginBottom: 2 },
  desc: { fontSize: 13, color: colors.inkSoft, marginBottom: 16 },
  btnBlock: { backgroundColor: colors.ink, borderRadius: 9, paddingVertical: 12, alignItems: "center", marginBottom: 12 },
  btnBlockText: { color: colors.paper, fontWeight: "600", fontSize: 12, textTransform: "uppercase" },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 16, marginBottom: 14 },
  label: { fontSize: 10, color: colors.inkSoft, textTransform: "uppercase", marginTop: 10, marginBottom: 4, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 9, fontSize: 14, backgroundColor: colors.paper, color: colors.ink },
  pickerWrap: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.paper },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6, backgroundColor: colors.paper },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 10.5, textTransform: "uppercase", color: colors.inkSoft },
  chipTextActive: { color: colors.paper },
  emptyNote: { fontSize: 13, color: colors.inkSoft, textAlign: "center", paddingVertical: 14 },
  expenseCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 14, marginBottom: 10 },
  expenseItem: { fontSize: 14, fontWeight: "600", color: colors.ink },
  expenseSub: { fontSize: 11, color: colors.inkSoft, marginTop: 2 },
  expenseCost: { fontFamily: "monospace", fontSize: 14, color: colors.ink, fontWeight: "600" },
  iconBtn: { fontSize: 15, color: colors.inkSoft },
  iconBtnDel: { fontSize: 18, color: colors.clay },
});
