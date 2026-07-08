// components/ui/table/table.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { shadows } from '@/styles/shadows';

export const tableStyles = {
  wrapper: {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: radius.lg,
    border: `1px solid rgba(255,255,255,0.45)`,
    overflow: 'hidden',
    boxShadow: shadows.lg,

    // ✨ smooth SaaS green/blue background glow
    position: "relative" as const,

    backgroundImage: `
      radial-gradient(
        circle at top left,
        rgba(34,197,94,0.08),
        transparent 35%
      ),

      radial-gradient(
        circle at bottom right,
        rgba(59,130,246,0.08),
        transparent 35%
      )
    `,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },

  thead: {
    background: "rgba(248,250,252,0.75)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },

  th: {
    textAlign: 'left' as const,
    padding: spacing.md,
    fontSize: '14px',
    fontWeight: 600,
    color: Colors.textSecondary,
    borderBottom: `1px solid ${Colors.divider}`,
    letterSpacing: "0.3px",
  },

  td: {
    padding: spacing.md,
    fontSize: '14px',
    color: Colors.textPrimary,
    borderBottom: `1px solid ${Colors.divider}`,
  },

  tr: {
    background: "rgba(255,255,255,0.55)",
    transition: "all 0.2s ease",
  },

  trHover: {
    background: "rgba(37,99,235,0.04)",
  },
};


