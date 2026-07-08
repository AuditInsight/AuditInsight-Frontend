import { theme } from "@/styles/theme";
import { Colors } from "@/styles/colors";

export const headerStyles = {
  container: {
    height: "68px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: `0 ${theme.spacing.xl}`,

    // 🔥 UPDATED: solid premium navy header
    background: "#0d2158",

    // optional (kept subtle depth without breaking flat navy)
    boxShadow: `
      0 12px 40px rgba(0,0,0,0.25)
    `,

    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",

    borderBottom: `
      1px solid rgba(255,255,255,0.08)
    `,

    position: "sticky" as const,
    top: 0,

    zIndex: theme.zIndex.header,
  },

  /* =========================
     LEFT
  ========================= */

  left: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xl,
  },

  /* =========================
     LOGO
  ========================= */

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    paddingRight: "10px",
  },

  logoMark: {
    width: "34px",
    height: "34px",

    borderRadius: "12px",

    background: `
      linear-gradient(
        135deg,
        rgba(255,255,255,1),
        rgba(255,255,255,0.85)
      )
    `,

    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.8),
      0 8px 20px rgba(255,255,255,0.20)
    `,
  },

  logoText: {
    display: "flex",
    flexDirection: "column" as const,
    lineHeight: 1.1,
  },

  title: {
    fontSize: theme.typography.lg,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.03em",
  },

  subtitle: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },

  /* =========================
     NAVIGATION
  ========================= */

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "20px",
  },

  navItem: {
    position: "relative" as const,

    display: "flex",
    alignItems: "center",
    gap: "8px",

    padding: "10px 14px",
    borderRadius: "14px",

    fontSize: theme.typography.sm,
    fontWeight: 500,

    color: "rgba(206, 213, 244, 0.78)",

    cursor: "pointer",

    transition: theme.transitions.normal,

    border: "1px solid transparent",
  },

  navItemHover: {
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    transform: "translateY(-1px)",
  },

  navItemActive: {
    background: "rgba(255,255,255,0.10)",
    color: "#fff",

    border: "1px solid rgba(255,255,255,0.10)",

    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.12),
      0 4px 12px rgba(0,0,0,0.12)
    `,
  },

  /* =========================
     RIGHT
  ========================= */

  right: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.lg,
  },

  welcomeBlock: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: "2px",
  },

  welcomeLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.60)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },

  welcome: {
    fontSize: theme.typography.sm,
    color: "#fff",
    fontWeight: 600,
  },

  /* =========================
     AVATAR
  ========================= */

  avatar: {
    width: "42px",
    height: "42px",

    borderRadius: "50%",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.22),
        rgba(255,255,255,0.10)
      )
    `,

    border: "1px solid rgba(255,255,255,0.18)",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    color: "#fff",
    fontWeight: 700,

    position: "relative" as const,

    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.18),
      0 6px 18px rgba(0,0,0,0.16)
    `,
  },

  badge: {
    position: "absolute" as const,

    top: "-2px",
    right: "-2px",

    minWidth: "18px",
    height: "18px",

    padding: "0 4px",

    borderRadius: "999px",

    background: theme.colors.danger,
    color: "#fff",

    fontSize: "10px",
    fontWeight: 700,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    border: `
      2px solid rgba(11,49,94,1)
    `,

    boxShadow: `
      0 4px 10px rgba(220,38,38,0.35)
    `,
  },
};


