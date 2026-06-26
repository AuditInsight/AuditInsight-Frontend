// DashboardPage.styles.ts
import { theme } from "@/styles/theme";

export const dashboardLayoutStyles = {
  page: {
    padding: theme.spacing.lg,
    background: theme.colors.appBackground,
    minHeight: "100vh",
  },

  // Grids are now handled by responsive CSS classes in TransactionIntegrityDashboard
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: "start",
  },

  secondaryGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: theme.spacing.md,
    alignItems: "start",
  },
};
