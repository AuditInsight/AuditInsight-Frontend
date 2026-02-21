// components/ui/card/card.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { shadows } from '@/styles/shadows';

export const cardStyles = {
  base: {
    background: Colors.Surface,
    borderRadius: radius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${Colors.border}`,
  },

  padding: {
    sm: {
      padding: spacing.sm,
    },
    md: {
      padding: spacing.md,
    },
    lg: {
      padding: spacing.lg,
    },
  },
};