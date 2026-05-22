import { theme } from "@/styles/theme";

const statsStyles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  card: {
    background: theme.colors.Surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  value: {
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.textPrimary,
  },

  trend: {
    fontSize: theme.typography.xs,
    marginTop: theme.spacing.xs,
    color: theme.colors.textMuted,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    background: theme.colors.appBackground,
  },
};

export default statsStyles;