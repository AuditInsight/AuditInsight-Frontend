import { theme } from "@/styles/theme"

export const headerStyles = {
  container: {
    height: "72px",
    background: "linear-gradient(90deg,#0A4178,#0A4174)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing.xl}`,
    color: "#fff",
    boxShadow: theme.shadows.md,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xl,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: theme.typography.lg,
    fontWeight: 600,
    letterSpacing: 0.3,
  },

  logoMark: {
    width: "28px",
    height: "28px",
    background: "#fff",
    borderRadius: "6px",
  },

  nav: {
    display: "flex",
    gap: "32px",
    marginLeft: "40px",
  },

  navItem: {
    position: "relative" as "relative" | "absolute" | "fixed",
    fontSize: theme.typography.md,
    cursor: "pointer",
    paddingBottom: "6px",
    opacity: 0.9,
  },

  navItemActive: {
    opacity: 1,
  },

  activeUnderline: {
    position: "absolute" as "relative" | "absolute" | "fixed",
    bottom: "-12px",
    left: 0,
    right: 0,
    height: "3px",
    background: "#fff",
    borderRadius: "4px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.lg,
  },

  welcome: {
    fontSize: theme.typography.md,
    opacity: 0.95,
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#fff",
    position: "relative" as "relative" | "absolute" | "fixed",
  },

  badge: {
    position: "absolute" as "relative" | "absolute" | "fixed",
    top: "-4px",
    right: "-4px",
    width: "18px",
    height: "18px",
    background: theme.colors.danger,
    borderRadius: "50%",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 600,
  },
}
