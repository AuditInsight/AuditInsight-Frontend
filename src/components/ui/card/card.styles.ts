// components/ui/card/card.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { shadows } from '@/styles/shadows';
import { theme } from '@/styles/theme';

export const cardStyles = {
  base: {
    // ✅ ADVANCED GLASS SAAS STYLE
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    borderRadius: radius.lg,

    // ✅ deeper floating shadow
    boxShadow: shadows.lg,

    // ✅ soft glass border
    border: `1px solid rgba(255,255,255,0.4)`,

    // ✅ smoother feel
    transition: "all 0.25s ease",
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

  container: {
    // ✅ MATCH GLASS STYLE
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: `1px solid rgba(255,255,255,0.4)`,

    borderRadius: theme.radius.lg,

    boxShadow: theme.shadows.lg,

    padding: theme.spacing.lg,

    transition: "all 0.25s ease",
  },
};


