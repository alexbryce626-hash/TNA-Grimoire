import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../theme";

export default function Products() {
  const { data, update } = useData();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
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
                <Field styles={styles} label="Base Profile" value={draft.base} onChangeText={(v) => setDraft({ ...draft, base: v })} />
                <Field styles={styles} label="Mica Color Used" value={draft.mica} onChangeText={(v) => setDraft({ ...draft, mica: v })} />
                <Field styles={styles} label="Tagline" value={draft.tagline} onChangeText={(v) => setDraft({ ...draft, tagline: v })} />
                <Field styles={styles} label="Swatch Color (hex)" value={draft.color} onChangeText={(v) => setDraft({ ...draft, color: v })} />
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
    card: { flexDirection: "row", gap: 12, backgroundColor: c.paper, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: d.cardPadding, marginBottom: d.gap },
    swatch: { width: 36, height: 36, borderRadius: 18, marginTop: 2 },
    base: { fontSize: 9.5 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", fontFamily: f },
    name: { fontSize: 17 * d.fontScale, fontWeight: "700", color: c.ink, fontFamily: f },
    tagline: { fontSize: 10.5 * d.fontScale, color: c.clayDark, textTransform: "uppercase", marginVertical: 6, fontFamily: f },
    descText: { fontSize: 13 * d.fontScale, color: c.inkSoft, lineHeight: 19, fontFamily: f },
    iconBtn: { fontSize: 16, color: c.inkSoft },
    lockedName: { fontSize: 11 * d.fontScale, color: c.inkSoft, marginBottom: 4, fontFamily: f },
    label: { fontSize: 10 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", marginTop: 8, marginBottom: 4, fontWeight: "600", fontFamily: f },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 8, padding: 9, fontSize: 14 * d.fontScale, backgroundColor: c.paper, color: c.ink, fontFamily: f },
    btnBlock: { backgroundColor: c.ink, borderRadius: 9, paddingVertical: 10, alignItems: "center" },
    btnBlockText: { color: c.paper, fontWeight: "600", fontSize: 12 * d.fontScale, textTransform: "uppercase", fontFamily: f },
    btnSecondary: { borderWidth: 1, borderColor: c.line, borderRadius: 9, paddingVertical: 10, alignItems: "center" },
    btnSecondaryText: { color: c.ink, fontWeight: "600", fontSize: 12 * d.fontScale, textTransform: "uppercase", fontFamily: f },
  });
}
