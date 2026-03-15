import { theme } from "@/styles/theme"

export const dashboardLayoutStyles = {
  page: {
    padding: theme.spacing.xl,
    background: theme.colors.appBackground,
    minHeight: "100vh",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  secondaryGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: theme.spacing.lg,
  },
}