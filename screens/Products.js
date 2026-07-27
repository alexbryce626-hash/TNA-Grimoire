import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useData } from "../context/DataContext";
import { colors, radius } from "../theme";

export default function Products() {
  const { data, update } = useData();
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState(null);

  if (!data) return null;

  function startEdit(i) {
    setDraft({ ...data.products[i] });
    setEditIdx(i);
  }
  function saveEdit() {
    update((prev) => {
      const products = [...prev.products];
      products[editIdx] = { ...products[editIdx], base: draft.base, mica: draft.mica, tagline: draft.tagline, color: draft.color, desc: draft.desc };
      return { ...prev, products };
    });
    setEditIdx(null);
    setDraft(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Products</Text>
      <Text style={styles.desc}>Your brand catalog — descriptions and taglines, ready to copy into listings.</Text>

      {data.products.map((p, i) => (
        <View style={styles.card} key={p.name}>
          <View style={[styles.swatch, { backgroundColor: p.color }]} />
          <View style={{ flex: 1 }}>
            {editIdx === i ? (
              <View>
                <Text style={styles.lockedName}>{p.name} (name locked)</Text>
                <Field label="Base Profile" value={draft.base} onChangeText={(v) => setDraft({ ...draft, base: v })} />
                <Field label="Mica Color Used" value={draft.mica} onChangeText={(v) => setDraft({ ...draft, mica: v })} />
                <Field label="Tagline" value={draft.tagline} onChangeText={(v) => setDraft({ ...draft, tagline: v })} />
                <Field label="Swatch Color (hex)" value={draft.color} onChangeText={(v) => setDraft({ ...draft, color: v })} />
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                  multiline
                  value={draft.desc}
                  onChangeText={(v) => setDraft({ ...draft, desc: v })}
                />
                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                  <TouchableOpacity style={[styles.btnBlock, { flex: 1 }]} onPress={saveEdit}>
                    <Text style={styles.btnBlockText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnSecondary, { flex: 1 }]} onPress={() => { setEditIdx(null); setDraft(null); }}>
                    <Text style={styles.btnSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.base}>{p.base}{p.mica ? ` · ${p.mica}` : ""}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={styles.name}>{p.name}</Text>
                  <TouchableOpacity onPress={() => startEdit(i)}><Text style={styles.iconBtn}>✎</Text></TouchableOpacity>
                </View>
                <Text style={styles.tagline}>{p.tagline}</Text>
                <Text style={styles.descText}>{p.desc}</Text>
              </View>
            )}
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
  card: { flexDirection: "row", gap: 12, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 16, marginBottom: 12 },
  swatch: { width: 36, height: 36, borderRadius: 18, marginTop: 2 },
  base: { fontSize: 9.5, color: colors.inkSoft, textTransform: "uppercase" },
  name: { fontSize: 17, fontWeight: "700", color: colors.ink },
  tagline: { fontSize: 10.5, color: colors.clayDark, textTransform: "uppercase", marginVertical: 6 },
  descText: { fontSize: 13, color: colors.inkSoft, lineHeight: 19 },
  iconBtn: { fontSize: 16, color: colors.inkSoft },
  lockedName: { fontSize: 11, color: colors.inkSoft, marginBottom: 4 },
  label: { fontSize: 10, color: colors.inkSoft, textTransform: "uppercase", marginTop: 8, marginBottom: 4, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 9, fontSize: 14, backgroundColor: colors.paper, color: colors.ink },
  btnBlock: { backgroundColor: colors.ink, borderRadius: 9, paddingVertical: 10, alignItems: "center" },
  btnBlockText: { color: colors.paper, fontWeight: "600", fontSize: 12, textTransform: "uppercase" },
  btnSecondary: { borderWidth: 1, borderColor: colors.line, borderRadius: 9, paddingVertical: 10, alignItems: "center" },
  btnSecondaryText: { color: colors.ink, fontWeight: "600", fontSize: 12, textTransform: "uppercase" },
});
