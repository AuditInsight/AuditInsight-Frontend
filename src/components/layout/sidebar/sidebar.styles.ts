import { Colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export const sidebarStyles = {
  /* =========================
     SIDEBAR CONTAINER
  ========================= */

  container: {
    width: "320px",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.88),
        rgba(255,255,255,0.74)
      )
    `,

    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",

    borderRight: `
      1px solid rgba(255,255,255,0.55)
    `,

    boxShadow: `
      inset -1px 0 0 rgba(255,255,255,0.4)
    `,

    padding: "20px",

    position: "sticky" as const,
    top: "68px",

    height: "calc(100vh - 68px)",

    overflowY: "auto" as const,
  },

  /* =========================
     SIDEBAR ITEMS
  ========================= */

  item: {
    display: "flex",
    alignItems: "center",

    gap: "10px",

    padding: spacing.sm,

    borderRadius: "12px",

    cursor: "pointer",

    color: Colors.textSecondary,

    transition: "all 0.2s ease",

    userSelect: "none" as const,
  },

  itemHover: {
    background: Colors.surfaceHover,

    color: Colors.textPrimary,

    transform: "translateX(2px)",
  },

  itemActive: {
    background: Colors.primary,

    color: "#fff",

    boxShadow: `
      0 8px 20px rgba(10,65,120,0.18)
    `,
  },
};


