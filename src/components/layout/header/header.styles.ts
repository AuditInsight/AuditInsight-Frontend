import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { shadows } from '@/styles/shadows';

export const headerStyles = {
  container: {
    height: '64px',
    background: Colors.Surface,
    borderBottom: `1px solid ${Colors.border}`,
    padding: `0 ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: shadows.sm,
  },

  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: Colors.textPrimary,
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
};