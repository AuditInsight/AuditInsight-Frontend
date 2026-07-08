import { Colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { radius } from "../../../styles/radius";

export const inputStyles = {
  /* =========================
     CONTAINER
  ========================= */

  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xs,
    position: "relative" as const,
  },

  /* =========================
     LABEL (DEFAULT)
  ========================= */

  label: {
    fontSize: "12px",
    color: Colors.textSecondary,
    transition: "all 0.2s ease",
  },

  stackedLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: Colors.textPrimary,
    marginBottom: "6px",
  },

  /* =========================
     FLOATING LABEL (NEW)
  ========================= */

  floatingLabel: {
    position: "absolute" as const,
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",

    fontSize: "14px",
    color: Colors.textMuted,

    pointerEvents: "none" as const,

    transition: "all 0.2s ease",
  },

  floatingLabelActive: {
    top: "6px",
    fontSize: "11px",
    color: Colors.primary,
  },

  /* =========================
     INPUT BASE
  ========================= */

  input: {
    width: "100%",

    padding: "12px 14px",

    borderRadius: radius.md,

    border: "1px solid rgba(15,23,42,0.08)",

    fontSize: "14px",
    color: Colors.textPrimary,

    outline: "none",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.96),
        rgba(248,250,252,0.92)
      )
    `,

    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,

    transition: "all 0.2s ease",
  },

  /* =========================
     FOCUS (PREMIUM GLOW)
  ========================= */

  focus: {
    border: "1px solid rgba(21,94,239,0.30)",

    boxShadow: `
      0 0 0 4px rgba(21,94,239,0.10)
    `,
  },

  /* =========================
     ERROR STATE
  ========================= */

  error: {
    border: `1px solid ${Colors.danger}`,

    boxShadow: `
      0 0 0 4px rgba(220,38,38,0.10)
    `,
  },

  errorText: {
    fontSize: "12px",
    color: Colors.danger,
  },

  /* =========================
     SUCCESS STATE (NEW)
  ========================= */

  success: {
    border: `1px solid ${Colors.success}`,

    boxShadow: `
      0 0 0 4px rgba(22,163,74,0.10)
    `,
  },

  /* =========================
     DISABLED
  ========================= */

  disabled: {
    background: "#F1F5F9",
    opacity: 0.6,
    cursor: "not-allowed",
  },

  /* =========================
     ICON INSIDE INPUT (NEW)
  ========================= */

  inputWithIcon: {
    paddingLeft: "40px",
  },

  icon: {
    position: "absolute" as const,
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: Colors.textMuted,
  },

  /* =========================
     SEARCH INPUT VARIANT (NEW)
  ========================= */

  searchInput: {
    paddingLeft: "40px",

    borderRadius: "999px",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.98),
        rgba(248,250,252,0.92)
      )
    `,
  },

  /* =========================
     SHAKE ANIMATION (VALIDATION ERROR)
  ========================= */

  shake: {
    animation: "shake 0.3s ease",
  },

  /* inject keyframes (if using CSS-in-JS global) */
};


