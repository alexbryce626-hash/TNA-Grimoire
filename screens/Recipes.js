import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { computeRecipe, fmt$, fmtNum } from "../data";
import { radius } from "../theme";

export default function Recipes() {
  const { data, update } = useData();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [openIdx, setOpenIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState(null);

  if (!data) return null;

  function startEdit(i) {
    setDraft(JSON.parse(JSON.stringify(data.recipes[i])));
    setEditIdx(i);
    setOpenIdx(i);
  }

  function saveEdit() {
    update((prev) => {
      const recipes = [...prev.recipes];
      recipes[editIdx] = {
        ...draft,
        batchYield: Number(draft.batchYield),
        retailPrice: Number(draft.retailPrice),
        lye: Number(draft.lye),
        water: Number(draft.water),
        label: Number(draft.label),
        parchment: Number(draft.parchment),
        oils: draft.oils.map((o) => ({ name: o.name, amt: Number(o.amt) })),
        fats: draft.fats.map((o) => ({ name: o.name, amt: Number(o.amt) })),
      };
      return { ...prev, recipes };
    });
    setEditIdx(null);
    setDraft(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.desc}>Full cost breakdown, calculated live from raw material prices.</Text>

      {data.recipes.map((r, i) => {
        const d = computeRecipe(data, r);
        const isEditing = editIdx === i;
        const product = data.products.find((p) => p.name === r.name);
        return (
          <View style={styles.card} key={r.name}>
            <TouchableOpacity
              style={styles.head}
              disabled={isEditing}
              onPress={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <View style={[styles.swatch, { backgroundColor: product?.color || "#999" }]} />
                <View>
                  <Text style={styles.recipeName}>{r.name}</Text>
                  <Text style={styles.recipeSub}>{r.batchYield} bars · {fmt$(d.perBarCost)}/bar cost</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={styles.marginText}>{d.marginPct.toFixed(0)}%{"\n"}margin</Text>
                <TouchableOpacity onPress={() => (isEditing ? (setEditIdx(null), setDraft(null)) : startEdit(i))}>
                  <Text style={styles.iconBtn}>{isEditing ? "✕" : "✎"}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {(openIdx === i || isEditing) && (
              isEditing ? (
                <View style={{ marginTop: 12 }}>
                  <Row2 styles={styles}>
                    <Field styles={styles} label="Batch Yield" value={String(draft.batchYield)} onChangeText={(v) => setDraft({ ...draft, batchYield: v })} keyboardType="number-pad" />
                    <Field styles={styles} label="Retail Price ($)" value={String(draft.retailPrice)} onChangeText={(v) => setDraft({ ...draft, retailPrice: v })} keyboardType="decimal-pad" />
                  </Row2>

                  <Text style={styles.sectionDivider}>ESSENTIAL OILS</Text>
                  {draft.oils.map((o, oi) => (
                    <View key={oi} style={styles.ingEditRow}>
                      <View style={[styles.pickerWrap, { flex: 2 }]}>
                        <Picker selectedValue={o.name} onValueChange={(v) => {
                          const oils = [...draft.oils]; oils[oi] = { ...oils[oi], name: v }; setDraft({ ...draft, oils });
                        }}>
                          {data.rawMaterials.map((m) => <Picker.Item key={m.name} label={m.name} value={m.name} />)}
                        </Picker>
                      </View>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        keyboardType="decimal-pad"
                        value={String(o.amt)}
                        onChangeText={(v) => { const oils = [...draft.oils]; oils[oi] = { ...oils[oi], amt: v }; setDraft({ ...draft, oils }); }}
                      />
                      <TouchableOpacity onPress={() => { const oils = [...draft.oils]; oils.splice(oi, 1); setDraft({ ...draft, oils }); }}>
                        <Text style={styles.iconBtnDel}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.smallBtn}
                    onPress={() => setDraft({ ...draft, oils: [...draft.oils, { name: data.rawMaterials[0].name, amt: 1 }] })}
                  >
                    <Text style={styles.smallBtnText}>+ Oil</Text>
                  </TouchableOpacity>

                  <Text style={styles.sectionDivider}>LYE &amp; WATER</Text>
                  <Field styles={styles} label="Lye (g)" value={String(draft.lye)} onChangeText={(v) => setDraft({ ...draft, lye: v })} keyboardType="decimal-pad" />
                  <Field styles={styles} label="Water (g)" value={String(draft.water)} onChangeText={(v) => setDraft({ ...draft, water: v })} keyboardType="decimal-pad" />

                  <Text style={styles.sectionDivider}>FAT OILS</Text>
                  {draft.fats.map((o, fi) => (
                    <View key={fi} style={styles.ingEditRow}>
                      <View style={[styles.pickerWrap, { flex: 2 }]}>
                        <Picker selectedValue={o.name} onValueChange={(v) => {
                          const fats = [...draft.fats]; fats[fi] = { ...fats[fi], name: v }; setDraft({ ...draft, fats });
                        }}>
                          {data.rawMaterials.map((m) => <Picker.Item key={m.name} label={m.name} value={m.name} />)}
                        </Picker>
                      </View>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        keyboardType="decimal-pad"
                        value={String(o.amt)}
                        onChangeText={(v) => { const fats = [...draft.fats]; fats[fi] = { ...fats[fi], amt: v }; setDraft({ ...draft, fats }); }}
                      />
                    </View>
                  ))}

                  <Text style={styles.sectionDivider}>PACKAGING</Text>
                  <Field styles={styles} label="Label ($)" value={String(draft.label)} onChangeText={(v) => setDraft({ ...draft, label: v })} keyboardType="decimal-pad" />
                  <Field styles={styles} label="Parchment (sheets)" value={String(draft.parchment)} onChangeText={(v) => setDraft({ ...draft, parchment: v })} keyboardType="decimal-pad" />

                  <TouchableOpacity style={styles.btnBlock} onPress={saveEdit}>
                    <Text style={styles.btnBlockText}>Save Recipe</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.sectionDivider}>ESSENTIAL OILS</Text>
                  {d.oils.map((o, oi) => (
                    <View key={oi} style={styles.ingLine}><Text style={styles.ingLineLabel}>{o.name} — {fmtNum(o.amt)}g</Text><Text style={styles.ingLineValue}>{fmt$(o.cost)}</Text></View>
                  ))}
                  <Text style={styles.sectionDivider}>LYE &amp; WATER</Text>
                  <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Lye — {fmtNum(r.lye)}g</Text><Text style={styles.ingLineValue}>{fmt$(d.lyeCost)}</Text></View>
                  <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Water — {fmtNum(r.water)}g</Text><Text style={styles.ingLineValue}>{fmt$(d.waterCost)}</Text></View>
                  <Text style={styles.sectionDivider}>FAT OILS</Text>
                  {d.fats.map((o, oi) => (
                    <View key={oi} style={styles.ingLine}><Text style={styles.ingLineLabel}>{o.name} — {fmtNum(o.amt)}g</Text><Text style={styles.ingLineValue}>{fmt$(o.cost)}</Text></View>
                  ))}
                  <Text style={styles.sectionDivider}>PACKAGING</Text>
                  <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Label</Text><Text style={styles.ingLineValue}>{fmt$(r.label)}</Text></View>
                  <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Parchment — {fmtNum(r.parchment)} sheets</Text><Text style={styles.ingLineValue}>{fmt$(d.parchmentCost)}</Text></View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsText}>Batch: {fmt$(d.totalBatchCost)}</Text>
                    <Text style={styles.totalsText}>Per bar: {fmt$(d.perBarCost)}</Text>
                    <Text style={styles.totalsText}>Retail: {fmt$(r.retailPrice)}</Text>
                  </View>
                </View>
              )
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function Row2({ children, styles }) {
  return <View style={{ flexDirection: "row", gap: 10 }}>{children.map((c, i) => <View key={i} style={{ flex: 1 }}>{c}</View>)}</View>;
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
    card: { backgroundColor: c.paper, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: d.cardPadding, marginBottom: d.gap },
    head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    swatch: { width: 12, height: 12, borderRadius: 6 },
    recipeName: { fontSize: 16.5 * d.fontScale, fontWeight: "700", color: c.ink, fontFamily: f },
    recipeSub: { fontSize: 10.5 * d.fontScale, color: c.inkSoft, fontFamily: f },
    marginText: { fontSize: 11 * d.fontScale, color: c.sageDark, textAlign: "right", fontFamily: f },
    iconBtn: { fontSize: 16, color: c.inkSoft, paddingHorizontal: 6 },
    iconBtnDel: { fontSize: 18, color: c.clay, paddingHorizontal: 6 },
    sectionDivider: { fontSize: 10.5 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", letterSpacing: 1, marginTop: 16, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: c.line, paddingBottom: 6, fontFamily: f },
    ingLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: c.line, borderStyle: "dashed" },
    ingLineLabel: { fontSize: 12.5 * d.fontScale, color: c.ink, fontFamily: f },
    ingLineValue: { fontFamily: "monospace", fontSize: 12.5 * d.fontScale, color: c.ink },
    totalsRow: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: c.line },
    totalsText: { fontFamily: "monospace", fontSize: 12 * d.fontScale, color: c.ink, fontWeight: "600" },
    label: { fontSize: 10 * d.fontScale, color: c.inkSoft, textTransform: "uppercase", marginTop: 10, marginBottom: 4, fontWeight: "600", fontFamily: f },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 8, padding: 9, fontSize: 14 * d.fontScale, backgroundColor: c.paper, color: c.ink, fontFamily: f },
    pickerWrap: { borderWidth: 1, borderColor: c.line, borderRadius: 8, backgroundColor: c.paper },
    ingEditRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
    smallBtn: { alignSelf: "flex-start", borderWidth: 1, borderColor: c.line, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 8 },
    smallBtnText: { fontSize: 10.5 * d.fontScale, textTransform: "uppercase", color: c.ink, fontFamily: f },
    btnBlock: { backgroundColor: c.ink, borderRadius: 9, paddingVertical: 12, alignItems: "center", marginTop: 16 },
    btnBlockText: { color: c.paper, fontWeight: "600", fontSize: 12 * d.fontScale, textTransform: "uppercase", fontFamily: f },
  });
}
