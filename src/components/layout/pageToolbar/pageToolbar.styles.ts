import { theme } from "@/styles/theme"

export const pageToolbarStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: theme.typography.heading,
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    flexWrap: "wrap" as const,
  },

  filters: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap" as const,
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    boxShadow: theme.shadows.sm,
  },

  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    minWidth: "140px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    cursor: "pointer",
    fontSize: theme.typography.sm,
    transition: "all 0.2s ease",
  },

  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer",
    fontSize: theme.typography.sm,
    fontWeight: 600,
    transition: "all 0.2s ease",
  },

  button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    fontSize: theme.typography.sm,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
}