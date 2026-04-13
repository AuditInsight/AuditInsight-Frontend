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
    fontWeight: 600,
    color: theme.colors.textPrimary,
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filters: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  filterButton: {
    padding: "6px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    fontSize: theme.typography.sm,
    cursor: "pointer",
  },

  search: {
    padding: "6px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.sm,
    width: 200,
    marginLeft: theme.spacing.md,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  exportBtn: {
    padding: "6px 14px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.Surface,
    cursor: "pointer",
    fontSize: theme.typography.sm,
  },

  primaryBtn: {
    padding: "6px 14px",
    borderRadius: theme.radius.md,
    border: "none",
    background: theme.colors.primary,
    color: "#fff",
    cursor: "pointer",
    fontSize: theme.typography.sm,
  },

  button: {
  padding: "6px 12px",
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface,
  fontSize: theme.typography.sm,
  cursor: "pointer",
},
}