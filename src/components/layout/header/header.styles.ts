import { theme } from "@/styles/theme";
import { Colors } from "@/styles/colors";

export const headerStyles = {
  container: {
    height: "76px",
    background: Colors.gradientHeader, // ✅ same blue as login
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing.xl}`,
    color: "#fff",
    boxShadow: "0 25px 70px rgba(0,0,0,0.12)", // ✅ stronger premium shadow
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky" as const,
    top: 0,
    zIndex: theme.zIndex.header,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xl,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: theme.typography.lg,
    fontWeight: 700,
    letterSpacing: 0.4,
    cursor: "pointer",
  },

  logoMark: {
    width: "30px",
    height: "30px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(255,255,255,0.25)",
  },

  nav: {
    display: "flex",
    gap: "28px",
    marginLeft: "36px",
  },

  navItem: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: theme.typography.md,
    cursor: "pointer",
    padding: "8px 0",
    opacity: 0.85,
    transition: "all 0.2s ease",
  },

  navItemActive: {
    opacity: 1,
    fontWeight: 600,
  },

  activeUnderline: {
    position: "absolute" as const,
    bottom: "-10px",
    left: 0,
    right: 0,
    height: "3px",
    background: "#fff",
    borderRadius: "999px",
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
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    position: "relative" as const,
  },

  badge: {
    position: "absolute" as const,
    top: "-3px",
    right: "-3px",
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    background: theme.colors.danger,
    borderRadius: "999px",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    border: "2px solid rgba(10,65,120,1)",
  },
};