// components/ui/badge/badge.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';

export const badgeStyles = {
  base: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 500,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.xl,
  },

  variants: {
    success: {
      color: Colors.success,
      background: Colors.successBg,
    },
    warning: {
      color: Colors.warning,
      background: Colors.warningBg,
    },
    danger: {
      color: Colors.danger,
      background: Colors.dangerBg,
    },
  },
};


