// components/ui/badge/Badge.tsx

import { BadgeProps } from './badge.types';
import { badgeStyles } from './badge.styles';

export const Badge = ({ label, variant = 'success' }: BadgeProps) => {
  return (
    <span
      style={{
        ...badgeStyles.base,
        ...badgeStyles.variants[variant],
      }}
    >
      {label}
    </span>
  );
};


