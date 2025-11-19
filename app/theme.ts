// src/theme.ts

export const theme = {
  // ---------- Colors ----------
  colors: {
    // App background
    appBg: "#050816",          // very dark blue/gray
    appBgSoft: "#0B1020",      // slightly lighter for surfaces

    // Cards / surfaces
    cardDefault: "#111827",    // dark gray
    cardSoft: "#1F2937",
    cardStrong: "#020617",

    // Accent cards (like the big stat tiles in your ref)
    cardAccentGreen: "#4ADE80", // steps / success
    cardAccentOrange: "#FB923C",
    cardAccentRed: "#F97373",
    cardAccentYellow: "#FACC15",
    cardAccentTeal: "#22C55E",
    cardAccentMint: "#34D399",

    // Brand / primary actions (e.g. CTA buttons)
    primary: "#FB923C",
    primarySoft: "#FED7AA",
    primaryDark: "#EA580C",

    // Secondary actions / pills
    secondary: "#38BDF8",
    secondarySoft: "#E0F2FE",
    secondaryDark: "#0EA5E9",

    // Text
    textPrimary: "#F9FAFB",
    textSecondary: "#E5E7EB",
    textMuted: "#9CA3AF",
    textOnAccentDark: "#111827",
    textOnAccentLight: "#111827",

    // Icons / borders / lines
    borderSubtle: "#1F2937",
    borderStrong: "#374151",
    iconDefault: "#9CA3AF",
    iconActive: "#F9FAFB",

    // Status
    success: "#22C55E",
    warning: "#FACC15",
    danger: "#EF4444",

    // Misc
    overlay: "rgba(0,0,0,0.6)",
  },

  // ---------- Spacing ----------
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  // ---------- Radii ----------
  radii: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    pill: 999,
  },

  // ---------- Typography ----------
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: "700" as const,
      letterSpacing: 0.2,
    },
    h2: {
      fontSize: 22,
      fontWeight: "700" as const,
      letterSpacing: 0.2,
    },
    h3: {
      fontSize: 18,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 14,
      fontWeight: "400" as const,
    },
    bodyStrong: {
      fontSize: 14,
      fontWeight: "600" as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
    },
  },

  // ---------- Shadows ----------
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },

  // ---------- Layout helpers ----------
  layout: {
    cardPadding: 16,
    screenPadding: 16,
  },
};
