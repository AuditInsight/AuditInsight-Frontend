import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { shadows } from '@/styles/shadows';

export const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.4)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    background: Colors.Surface,
    borderRadius: radius.lg,
    boxShadow: shadows.lg,
    width: '500px',
    maxWidth: '90%',
    padding: spacing.lg,
    },

    header: { 
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: spacing.md,
    color: Colors.textPrimary,
  },

  closeButton: {
    position: 'absolute' as const,
    top: spacing.md,
    right: spacing.md,
    cursor: 'pointer',
    fontSize: '18px',
  },
};