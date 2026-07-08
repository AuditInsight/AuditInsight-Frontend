// components/ui/button/button.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { typography } from '@/styles/typography';

export const buttonStyles = {
  base: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radius.md,
    fontSize: typography.md,
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',

    // ✅ PREMIUM FEEL
    transition: 'all 0.25s ease',
    transform: 'translateY(0)',
  },

  primary: {
    // ✅ MODERN SAAS GRADIENT
    background: `
      linear-gradient(
        135deg,
        #2563EB,
        #1D4ED8
      )
    `,

    color: Colors.Surface,

    // ✅ GLOW DEPTH
    boxShadow: '0 10px 24px rgba(37,99,235,0.25)',
  },

  danger: {
    background: Colors.danger,
    color: Colors.Surface,
  },

  secondary: {
    background: 'rgba(255,255,255,0.72)',
    color: Colors.textPrimary,
    border: `1px solid ${Colors.border}`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },

  ghost: {
    background: 'transparent',
    color: Colors.textPrimary,
  },
};


