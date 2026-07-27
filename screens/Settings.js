import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { COLOR_PRESETS, FONT_OPTIONS, DENSITY_PRESETS, radius } from "../theme";

export default function Settings({ onClose }) {
  const { theme, setPreset, setFont, setDensity, resetTheme } = useTheme();
  const { driveUrl, driveSecret, setDriveConfig, backupStatus, lastBackupAt, backupNow } = useData();
  const [showBackupFields, setShowBackupFields] = useState(false);
  const [urlDraft, setUrlDraft] = useState(driveUrl);
  const [secretDraft, setSecretDraft] = useState(driveSecret);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  const statusLabel = {
    idle: driveUrl ? "Not backed up yet" : "Backup not set up",
    syncing: "Backing up…",
    success: lastBackupAt ? `Backed up ${new Date(lastBackupAt).toLocaleTimeString()}` : "Backed up",
    error: "Last backup failed",
  }[backupStatus];
  const statusColor = backupStatus === "error" ? theme.colors.danger
    : backupStatus === "success" ? theme.colors.sageDark : theme.colors.inkSoft;

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* ---- Appearance ---- */}
          <Text style={styles.sectionTitle}>APPEARANCE</Text>

          <Text style={styles.label}>Color Palette</Text>
          <View style={styles.chipRow}>
            {Object.keys(COLOR_PRESETS).map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.swatchChip, theme.presetName === name && styles.swatchChipActive]}
                onPress={() => setPreset(name)}
              >
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <View style={[styles.swatchDot, { backgroundColor: COLOR_PRESETS[name].ink }]} />
                  <View style={[styles.swatchDot, { backgroundColor: COLOR_PRESETS[name].gold }]} />
                  <View style={[styles.swatchDot, { backgroundColor: COLOR_PRESETS[name].cream }]} />
                </View>
                <Text style={[styles.chipText, theme.presetName === name && styles.chipTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Font</Text>
          <View style={styles.chipRow}>
            {Object.keys(FONT_OPTIONS).map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.chip, theme.fontName === name && styles.chipActive]}
                onPress={() => setFont(name)}
              >
                <Text style={[styles.chipText, { fontFamily: FONT_OPTIONS[name] }, theme.fontName === name && styles.chipTextActive]}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Layout Density</Text>
          <View style={styles.chipRow}>
            {Object.keys(DENSITY_PRESETS).map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.chip, theme.densityName === name && styles.chipActive]}
                onPress={() => setDensity(name)}
              >
                <Text style={[styles.chipText, theme.densityName === name && styles.chipTextActive]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={resetTheme} style={{ marginTop: 4, marginBottom: 8 }}>
            <Text style={styles.resetLink}>Reset to default look</Text>
          </TouchableOpacity>

          {/* ---- Backup ---- */}
          <Text style={styles.sectionTitle}>DRIVE BACKUP</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>

          <TouchableOpacity onPress={() => setShowBackupFields(!showBackupFields)}>
            <Text style={styles.resetLink}>{showBackupFields ? "Hide connection details" : (driveUrl ? "Edit connection details" : "Set up backup")}</Text>
          </TouchableOpacity>

          {showBackupFields && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.scanNote}>
                Paste the Web app URL and secret from your Google Apps Script deployment
                (see google-apps-script/Code.gs in the project for setup steps).
              </Text>
              <Text style={styles.label}>Web App URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://script.google.com/macros/s/.../exec"
                autoCapitalize="none"
                value={urlDraft}
                onChangeText={setUrlDraft}
              />
              <Text style={styles.label}>Secret</Text>
              <TextInput
                style={styles.input}
                placeholder="your secret"
                autoCapitalize="none"
                secureTextEntry
                value={secretDraft}
                onChangeText={setSecretDraft}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => setDriveConfig(urlDraft.trim(), secretDraft.trim())}
              >
                <Text style={styles.saveBtnText}>Save Backup Settings</Text>
              </TouchableOpacity>
            </View>
          )}

          {driveUrl && (
            <TouchableOpacity style={{ marginTop: 12 }} onPress={backupNow}>
              <Text style={styles.resetLink}>Back up now</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const c = theme.colors;
  const f = theme.fontFamily;
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
    sheet: { backgroundColor: c.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: "88%" },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    title: { fontSize: 20, fontWeight: "700", color: c.ink, fontFamily: f },
    closeBtn: { fontSize: 13, fontWeight: "600", color: c.clayDark, fontFamily: f },
    sectionTitle: { fontSize: 11, color: c.inkSoft, letterSpacing: 1, marginTop: 18, marginBottom: 10, fontWeight: "700", fontFamily: f },
    label: { fontSize: 10, color: c.inkSoft, textTransform: "uppercase", marginTop: 10, marginBottom: 6, fontWeight: "600", fontFamily: f },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: c.paper },
    chipActive: { backgroundColor: c.ink, borderColor: c.ink },
    chipText: { fontSize: 12, color: c.inkSoft, fontFamily: f },
    chipTextActive: { color: c.paper },
    swatchChip: { borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 10, backgroundColor: c.paper, alignItems: "center" },
    swatchChipActive: { borderColor: c.gold, borderWidth: 2 },
    swatchDot: { width: 14, height: 14, borderRadius: 7, marginRight: -4, borderWidth: 1, borderColor: "rgba(0,0,0,0.15)" },
    resetLink: { fontSize: 12, color: c.clayDark, textDecorationLine: "underline", fontFamily: f },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statusText: { fontSize: 12, fontFamily: "monospace" },
    scanNote: { fontSize: 11.5, color: c.inkSoft, marginBottom: 6, lineHeight: 16, fontFamily: f },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 8, padding: 9, fontSize: 13, backgroundColor: c.paper, color: c.ink, fontFamily: f },
    saveBtn: { backgroundColor: c.ink, borderRadius: 9, paddingVertical: 11, alignItems: "center", marginTop: 12 },
    saveBtnText: { color: c.paper, fontWeight: "600", fontSize: 12, textTransform: "uppercase", fontFamily: f },
  });
}
