// theme.js — color/font/density presets + the default theme shape

export const COLOR_PRESETS = {
  Apothecary: {
    ink: "#2B2825", inkSoft: "#5B5650", cream: "#F2ECDD", cream2: "#EAE2CE", paper: "#FBF8F1",
    sage: "#7C8B6F", sageDark: "#5E6B54", clay: "#B5654B", clayDark: "#95523D",
    gold: "#C9A24B", line: "#DED4BC", danger: "#B5453B",
  },
  Botanical: {
    ink: "#1F2E24", inkSoft: "#4C5F51", cream: "#EAF0E4", cream2: "#DCE7D3", paper: "#F7FAF4",
    sage: "#4E7A5C", sageDark: "#3A5C45", clay: "#8A6A4C", clayDark: "#6E5239",
    gold: "#A8B24C", line: "#CBDAC1", danger: "#B5453B",
  },
  Blush: {
    ink: "#3A2B2E", inkSoft: "#6B5459", cream: "#F7EAE6", cream2: "#F0DAD4", paper: "#FDF6F3",
    sage: "#B98E93", sageDark: "#9B6F75", clay: "#C77B5F", clayDark: "#A6613F",
    gold: "#D9A65C", line: "#EAD1CA", danger: "#B5453B",
  },
  Midnight: {
    ink: "#EDE9E0", inkSoft: "#B7B0A4", cream: "#20242B", cream2: "#2A2F38", paper: "#262B33",
    sage: "#7FA08C", sageDark: "#7FA08C", clay: "#C98A64", clayDark: "#D9A17F",
    gold: "#D9B45C", line: "#3B414C", danger: "#D9756A",
  },
  Monochrome: {
    ink: "#232323", inkSoft: "#5C5C5C", cream: "#EDEDED", cream2: "#DFDFDF", paper: "#F8F8F8",
    sage: "#6E6E6E", sageDark: "#4A4A4A", clay: "#8A8A8A", clayDark: "#5C5C5C",
    gold: "#A9A9A9", line: "#D3D3D3", danger: "#A94442",
  },
};

export const FONT_OPTIONS = {
  System: undefined, // platform default
  Serif: "serif",
  Monospace: "monospace",
};

export const DENSITY_PRESETS = {
  Comfortable: { screenPadding: 14, cardPadding: 16, cardMargin: 14, rowPaddingV: 8, gap: 10, fontScale: 1 },
  Compact: { screenPadding: 10, cardPadding: 11, cardMargin: 9, rowPaddingV: 5, gap: 6, fontScale: 0.92 },
};

export const radius = 14;

export const DEFAULT_THEME = {
  presetName: "Apothecary",
  colors: COLOR_PRESETS.Apothecary,
  fontName: "System",
  fontFamily: FONT_OPTIONS.System,
  densityName: "Comfortable",
  density: DENSITY_PRESETS.Comfortable,
};
