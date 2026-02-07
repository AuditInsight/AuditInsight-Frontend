import { Colors  } from '@/styles/colors';
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
    },

    primary: {
        background: Colors.primary,
        color: Colors.Surface,
    },

    danger: {
        background: Colors.danger,
        color: Colors.Surface,
    },
};