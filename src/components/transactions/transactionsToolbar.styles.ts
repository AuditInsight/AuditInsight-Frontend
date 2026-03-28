import { theme } from "@/styles/theme"

export const toolbarStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "center",
  },

  button: {
    padding: "6px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    fontSize: theme.typography.sm,
    cursor: "pointer",
  },

  primaryBtn: {
    padding: "6px 14px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer",
  },

  alertTab: {
    padding: "10px 16px",
    borderRadius: theme.radius.md,
    fontSize: theme.typography.sm,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },

  alertVariants: {
    warning: {
      background: theme.colors.warningBg,
      color: theme.colors.warning,
    },
    danger: {
      background: theme.colors.dangerBg,
      color: theme.colors.danger,
    },
  },
}