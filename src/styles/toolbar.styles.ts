// src/styles/toolbar.styles.ts

import { theme } from "@/styles/theme";

export const toolbarStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.lg,

    marginBottom: theme.spacing.xl,

    padding: theme.spacing.lg,

    borderRadius: theme.radius.xl,

    background: `
      linear-gradient(
        135deg,
        rgba(255,255,255,0.78),
        rgba(255,255,255,0.62)
      )
    `,

    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,0.45)",

    boxShadow: `
      0 10px 40px rgba(15,23,42,0.06),
      0 2px 10px rgba(15,23,42,0.04)
    `,

    position: "relative" as const,

    overflow: "hidden",
  },

  // ✨ subtle top accent glow
  accentBar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "4px",

    background: `
      linear-gradient(
        90deg,
        #155EEF,
        #12B76A
      )
    `,
  },

  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    flexWrap: "wrap" as const,
  },

  left: {
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "center",
    flexWrap: "wrap" as const,
  },

  // 🔥 secondary button
  button: {
    padding: "10px 16px",

    borderRadius: theme.radius.lg,

    border: `1px solid rgba(15,23,42,0.08)`,

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.95),
        rgba(248,250,252,0.88)
      )
    `,

    color: theme.colors.textPrimary,

    fontSize: theme.typography.sm,
    fontWeight: 500,

    cursor: "pointer",

    transition: "all 0.25s ease",

    boxShadow: `
      0 2px 6px rgba(15,23,42,0.04)
    `,
  },

  buttonHover: {
    transform: "translateY(-2px)",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,1),
        rgba(241,245,249,0.95)
      )
    `,

    boxShadow: `
      0 10px 24px rgba(15,23,42,0.08)
    `,
  },

  // 🔥 primary action
  primaryBtn: {
    padding: "10px 18px",

    borderRadius: theme.radius.lg,

    border: "none",

    background: `
      linear-gradient(
        135deg,
        #155EEF,
        #0F4BD8
      )
    `,

    color: "#fff",

    fontWeight: 600,

    cursor: "pointer",

    transition: "all 0.25s ease",

    boxShadow: `
      0 10px 24px rgba(21,94,239,0.22)
    `,
  },

  primaryBtnHover: {
    transform: "translateY(-2px)",

    boxShadow: `
      0 18px 40px rgba(21,94,239,0.28)
    `,
  },

  // 🚨 alert tabs
  alertTab: {
    padding: "10px 16px",

    borderRadius: "999px",

    fontSize: theme.typography.sm,

    fontWeight: 600,

    display: "flex",

    alignItems: "center",

    gap: "8px",

    cursor: "pointer",

    transition: "all 0.25s ease",

    border: "1px solid transparent",
  },

  alertVariants: {
    warning: {
      background: "rgba(247,144,9,0.12)",

      color: "#B54708",

      border: "1px solid rgba(247,144,9,0.18)",

      boxShadow: `
        0 4px 14px rgba(247,144,9,0.10)
      `,
    },

    danger: {
      background: "rgba(240,68,56,0.12)",

      color: "#B42318",

      border: "1px solid rgba(240,68,56,0.18)",

      boxShadow: `
        0 4px 14px rgba(240,68,56,0.10)
      `,
    },

    success: {
      background: "rgba(18,183,106,0.12)",

      color: "#067647",

      border: "1px solid rgba(18,183,106,0.18)",

      boxShadow: `
        0 4px 14px rgba(18,183,106,0.10)
      `,
    },
  },

  // 🔥 title section
  titleBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,

    letterSpacing: "-0.03em",

    color: theme.colors.textPrimary,
  },

  subtitle: {
    fontSize: theme.typography.sm,

    color: theme.colors.textSecondary,
  },
};