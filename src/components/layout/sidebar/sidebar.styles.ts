import { Colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export const sidebarStyles = {
  container: {
    width: '240px',
    background: Colors.Surface,
    borderRight: `1px solid ${Colors.border}`,
    padding: spacing.md,
    height: '100vh',
  },

  item:  {
    padding: spacing.sm,
    borderRadius: '8px',
    cursor: 'pointer',
  },

  itemActive: {
    background: Colors.primary,
    color: 'white',
  },
};
