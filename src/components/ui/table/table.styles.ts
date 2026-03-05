// components/ui/table/table.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';

export const tableStyles = {
  wrapper: {
    background: Colors.Surface,
    borderRadius: radius.lg,
    border: `1px solid ${Colors.border}`,
    overflow: 'hidden',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },

  thead: {
    background: Colors.appBackground,
  },

  th: {
    textAlign: 'left' as const,
    padding: spacing.md,
    fontSize: '14px',
    fontWeight: 600,
    color: Colors.textSecondary,
    borderBottom: `1px solid ${Colors.divider}`,
  },

  td: {
    padding: spacing.md,
    fontSize: '14px',
    color: Colors.textPrimary,
    borderBottom: `1px solid ${Colors.divider}`,
  },

  tr: {
    background: Colors.Surface,
  },
};