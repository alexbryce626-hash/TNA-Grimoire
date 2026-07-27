import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useData } from "../context/DataContext";
import {
  addDays, addMonths, getMicaMaterialName, applyConsumption, fmtNum,
} from "../data";
import { colors, radius } from "../theme";

const API_KEY_STORAGE = "anthropic-api-key";

function defaultWeightsForRecipe(recipe) {
  if (!recipe) return {};
  const w = { lye: recipe.lye, water: recipe.water };
  recipe.fats.forEach((f) => { w[f.name] = f.amt; });
  recipe.oils.forEach((o) => { w[o.name] = o.amt; });
  return w;
}

export default function Batches({ params }) {
  const { data, update } = useData();
  const [showForm, setShowForm] = useState(!!params?.openForm);
  const [openIdx, setOpenIdx] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);

  const firstRecipe = data?.recipes[0];
  const [form, setForm] = useState(null);

  React.useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then((v) => { if (v) setApiKey(v); });
  }, []);

  React.useEffect(() => {
    if (data && !form) {
      const today = new Date().toISOString().slice(0, 10);
      setForm({
        lot: "", date: today, recipe: firstRecipe?.name || "",
        yield: String(firstRecipe?.batchYield || 16),
        demoldDate: addDays(today, 3), fullCureDate: addMonths(today, 4),
        weights: defaultWeightsForRecipe(firstRecipe),
        notes: "",
      });
    }
  }, [data]);

  if (!data || !form) return null;

  function onDateChange(date) {
    setForm({ ...form, date, demoldDate: addDays(date, 3), fullCureDate: addMonths(date, 4) });
  }
  function onRecipeChange(recipeName) {
    const recipe = data.recipes.find((r) => r.name === recipeName);
    setForm({ ...form, recipe: recipeName, yield: String(recipe?.batchYield || 16), weights: defaultWeightsForRecipe(recipe) });
  }
  function setWeight(key, val) {
    setForm({ ...form, weights: { ...form.weights, [key]: val } });
  }

  function saveBatch() {
    if (!form.lot) { Alert.alert("Lot ID required"); return; }
    const recipe = data.recipes.find((r) => r.name === form.recipe);
    const weights = {};
    Object.keys(form.weights).forEach((k) => { weights[k] = Number(form.weights[k]) || 0; });
    const consumption = { ...weights };
    delete consumption.mica;
    const micaName = recipe ? getMicaMaterialName(data, form.recipe) : null;
    if (micaName && weights.mica) consumption[micaName] = weights.mica;

    const batch = {
      lot: form.lot, date: form.date, recipe: form.recipe, yield: Number(form.yield) || 0,
      demoldDate: form.demoldDate, fullCureDate: form.fullCureDate, notes: form.notes,
      weights, consumption,
    };

    update((prev) => {
      const withBatch = { ...prev, batches: [...prev.batches, batch] };
      return applyConsumption(withBatch, consumption, -1);
    });

    setShowForm(false);
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      lot: "", date: today, recipe: firstRecipe?.name || "",
      yield: String(firstRecipe?.batchYield || 16),
      demoldDate: addDays(today, 3), fullCureDate: addMonths(today, 4),
      weights: defaultWeightsForRecipe(firstRecipe), notes: "",
    });
  }

  function deleteBatch(idx) {
    const batch = data.batches[idx];
    update((prev) => {
      let next = { ...prev, batches: [...prev.batches] };
      next.batches.splice(idx, 1);
      if (batch.consumption) next = applyConsumption(next, batch.consumption, 1);
      return next;
    });
  }

  async function saveApiKey(v) {
    setApiKey(v);
    await AsyncStorage.setItem(API_KEY_STORAGE, v);
  }

  async function scanNotebook() {
    if (!apiKey) {
      Alert.alert("API key needed", "Add your Anthropic API key first to use photo scanning.");
      setShowKeyInput(true);
      return;
    }
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Camera permission needed"); return; }
    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
    if (result.canceled) return;
    const base64 = result.assets[0].base64;

    setScanStatus("Reading your photo…");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
              { type: "text", text: `This is a photo of handwritten soap-making batch notes. Extract fields and respond with ONLY raw JSON, no markdown fences:
{"lot":"", "date":"YYYY-MM-DD or empty", "recipeGuess":"scent name or empty", "yield":number or null, "lyeWeight":number or null, "waterWeight":number or null, "sheaWeight":number or null, "coconutWeight":number or null, "oliveWeight":number or null, "castorWeight":number or null, "oilWeights":[number,number,number] or [], "micaWeight":number or null, "notes":""}
Leave unclear fields empty/null — do not guess.` },
            ],
          }],
        }),
      });
      const dataResp = await resp.json();
      const textBlock = (dataResp.content || []).find((b) => b.type === "text");
      if (!textBlock) throw new Error("No response");
      const clean = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const matched = data.recipes.find((r) => r.name.toLowerCase() === String(parsed.recipeGuess || "").toLowerCase());
      const recipe = matched || firstRecipe;
      const weights = defaultWeightsForRecipe(recipe);
      if (parsed.lyeWeight != null) weights.lye = parsed.lyeWeight;
      if (parsed.waterWeight != null) weights.water = parsed.waterWeight;
      if (parsed.sheaWeight != null) weights["Shea Butter"] = parsed.sheaWeight;
      if (parsed.coconutWeight != null) weights["coconut oil"] = parsed.coconutWeight;
      if (parsed.oliveWeight != null) weights["olive oil"] = parsed.oliveWeight;
      if (parsed.castorWeight != null) weights["castor oil"] = parsed.castorWeight;
      if (recipe && parsed.oilWeights) recipe.oils.forEach((o, i) => { if (parsed.oilWeights[i] != null) weights[o.name] = parsed.oilWeights[i]; });
      if (parsed.micaWeight != null) weights.mica = parsed.micaWeight;

      const dateVal = parsed.date || new Date().toISOString().slice(0, 10);
      setForm({
        lot: parsed.lot || "", date: dateVal, recipe: recipe?.name || "",
        yield: String(parsed.yield || recipe?.batchYield || 16),
        demoldDate: addDays(dateVal, 3), fullCureDate: addMonths(dateVal, 4),
        weights, notes: parsed.notes || "",
      });
      setScanStatus(null);
    } catch (err) {
      console.error(err);
      setScanStatus("Couldn't read that photo — please fill in manually.");
    }
  }

  const recipe = data.recipes.find((r) => r.name === form.recipe);
  const micaName = recipe ? getMicaMaterialName(data, form.recipe) : null;
  const rows = data.batches.map((b, i) => ({ ...b, idx: i })).reverse();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Batch Log</Text>
      <Text style={styles.desc}>Logging a batch subtracts ingredients from inventory automatically.</Text>

      <TouchableOpacity style={styles.btnBlock} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.btnBlockText}>{showForm ? "Cancel" : "+ Log a Batch"}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setShowKeyInput(!showKeyInput)}>
            <Text style={styles.keyToggle}>{apiKey ? "🔑 API key saved" : "🔑 Set Anthropic API key"} (for photo scan)</Text>
          </TouchableOpacity>
          {showKeyInput && (
            <TextInput
              style={styles.input}
              placeholder="sk-ant-..."
              secureTextEntry
              value={apiKey}
              onChangeText={saveApiKey}
            />
          )}

          <View style={styles.scanBox}>
            <TouchableOpacity style={styles.btnSecondary} onPress={scanNotebook}>
              <Text style={styles.btnSecondaryText}>📷 Scan from Notebook</Text>
            </TouchableOpacity>
            {scanStatus && <Text style={styles.scanNote}>{scanStatus}</Text>}
          </View>

          <Field label="Lot ID" value={form.lot} onChangeText={(v) => setForm({ ...form, lot: v })} placeholder="e.g. VE002" />
          <Field label="Batch Date (YYYY-MM-DD)" value={form.date} onChangeText={onDateChange} />

          <Text style={styles.label}>Scent / Recipe</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={form.recipe} onValueChange={onRecipeChange}>
              {data.recipes.map((r) => <Picker.Item key={r.name} label={r.name} value={r.name} />)}
            </Picker>
          </View>

          <Field label="Yield (bars)" value={form.yield} onChangeText={(v) => setForm({ ...form, yield: v })} keyboardType="number-pad" />
          <Field label="Demold Date (auto: +3 days)" value={form.demoldDate} onChangeText={(v) => setForm({ ...form, demoldDate: v })} />
          <Field label="Full Cure Date (auto: +4 months)" value={form.fullCureDate} onChangeText={(v) => setForm({ ...form, fullCureDate: v })} />

          <Text style={styles.sectionDivider}>INGREDIENT WEIGHTS</Text>
          <Field label="Lye Weight (g)" value={String(form.weights.lye ?? "")} onChangeText={(v) => setWeight("lye", v)} keyboardType="decimal-pad" />
          <Field label="Water Weight (g)" value={String(form.weights.water ?? "")} onChangeText={(v) => setWeight("water", v)} keyboardType="decimal-pad" />
          <Field label="Shea Butter Weight (g)" value={String(form.weights["Shea Butter"] ?? "")} onChangeText={(v) => setWeight("Shea Butter", v)} keyboardType="decimal-pad" />
          <Field label="Coconut Oil Weight (g)" value={String(form.weights["coconut oil"] ?? "")} onChangeText={(v) => setWeight("coconut oil", v)} keyboardType="decimal-pad" />
          <Field label="Olive Oil Weight (g)" value={String(form.weights["olive oil"] ?? "")} onChangeText={(v) => setWeight("olive oil", v)} keyboardType="decimal-pad" />
          <Field label="Castor Oil Weight (g)" value={String(form.weights["castor oil"] ?? "")} onChangeText={(v) => setWeight("castor oil", v)} keyboardType="decimal-pad" />
          {recipe && recipe.oils.map((o, i) => (
            <Field
              key={o.name}
              label={`Essential Oil ${i + 1} Weight (${o.name})`}
              value={String(form.weights[o.name] ?? "")}
              onChangeText={(v) => setWeight(o.name, v)}
              keyboardType="decimal-pad"
            />
          ))}
          {micaName && (
            <Field label={`Mica Weight (${micaName})`} value={String(form.weights.mica ?? "0")} onChangeText={(v) => setWeight("mica", v)} keyboardType="decimal-pad" />
          )}

          <Text style={styles.label}>Notes / Remarks</Text>
          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: "top" }]}
            multiline
            value={form.notes}
            onChangeText={(v) => setForm({ ...form, notes: v })}
          />

          <TouchableOpacity style={styles.btnBlock} onPress={saveBatch}>
            <Text style={styles.btnBlockText}>Save Batch</Text>
          </TouchableOpacity>
        </View>
      )}

      {rows.length === 0 && <Text style={styles.emptyNote}>No batches logged yet.</Text>}
      {rows.map((b) => {
        const product = data.products.find((p) => p.name === b.recipe);
        return (
          <View style={styles.batchCard} key={b.idx}>
            <TouchableOpacity style={styles.batchHead} onPress={() => setOpenIdx(openIdx === b.idx ? null : b.idx)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <View style={[styles.swatch, { backgroundColor: product?.color || "#999" }]} />
                <View>
                  <Text style={styles.batchName}>{b.lot} · {b.recipe}</Text>
                  <Text style={styles.batchSub}>{b.date} · {b.yield} bars</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteBatch(b.idx)}><Text style={styles.iconBtnDel}>×</Text></TouchableOpacity>
            </TouchableOpacity>
            {openIdx === b.idx && (
              <View style={{ marginTop: 8 }}>
                <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Demold Date</Text><Text style={styles.ingLineValue}>{b.demoldDate || "—"}</Text></View>
                <View style={styles.ingLine}><Text style={styles.ingLineLabel}>Full Cure Date</Text><Text style={styles.ingLineValue}>{b.fullCureDate || "—"}</Text></View>
                <Text style={styles.sectionDivider}>WEIGHTS</Text>
                {Object.entries(b.weights || {}).map(([name, amt]) => (
                  <View style={styles.ingLine} key={name}><Text style={styles.ingLineLabel}>{name}</Text><Text style={styles.ingLineValue}>{fmtNum(amt)}g</Text></View>
                ))}
                {b.notes ? (
                  <View>
                    <Text style={styles.sectionDivider}>NOTES</Text>
                    <Text style={styles.notesText}>{b.notes}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        );
      })}
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
  btnSecondary: { borderWidth: 1, borderColor: colors.line, borderRadius: 9, paddingVertical: 10, alignItems: "center" },
  btnSecondaryText: { color: colors.ink, fontWeight: "600", fontSize: 12 },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 16, marginBottom: 14 },
  keyToggle: { fontSize: 11.5, color: colors.inkSoft, marginBottom: 8 },
  scanBox: { borderWidth: 1.5, borderColor: colors.line, borderStyle: "dashed", borderRadius: 12, padding: 14, marginBottom: 8, backgroundColor: colors.cream },
  scanNote: { fontSize: 11.5, color: colors.inkSoft, marginTop: 8, textAlign: "center" },
  label: { fontSize: 10, color: colors.inkSoft, textTransform: "uppercase", marginTop: 10, marginBottom: 4, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 9, fontSize: 14, backgroundColor: colors.paper, color: colors.ink },
  pickerWrap: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.paper },
  sectionDivider: { fontSize: 10.5, color: colors.inkSoft, letterSpacing: 1, marginTop: 16, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 6, fontWeight: "600" },
  emptyNote: { fontSize: 13, color: colors.inkSoft, textAlign: "center", paddingVertical: 14 },
  batchCard: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius, padding: 14, marginBottom: 10 },
  batchHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  swatch: { width: 12, height: 12, borderRadius: 6 },
  batchName: { fontSize: 15, fontWeight: "600", color: colors.ink },
  batchSub: { fontSize: 11, color: colors.inkSoft },
  iconBtnDel: { fontSize: 18, color: colors.clay },
  ingLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.line },
  ingLineLabel: { fontSize: 12.5, color: colors.ink },
  ingLineValue: { fontFamily: "monospace", fontSize: 12.5, color: colors.ink },
  notesText: { fontSize: 13, color: colors.inkSoft },
});
