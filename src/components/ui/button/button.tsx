// components/ui/button/Button.tsx

"use client";

import { useState } from 'react';
import { ButtonProps } from './button.types';
import { buttonStyles } from './button.styles';

export function Button({
  label,
  variant = 'primary',
  onClick,
  disabled,
}: ButtonProps) {

  const [hovered, setHovered] = useState(false);

  const isPrimary = variant === 'primary';

  return (
    <button
      style={{
        ...buttonStyles.base,
        ...(buttonStyles[variant as keyof typeof buttonStyles] || {}),

        // ✅ PREMIUM HOVER EFFECT
        transform:
          hovered && isPrimary
            ? 'translateY(-2px)'
            : 'translateY(0)',

        boxShadow:
          hovered && isPrimary
            ? '0 16px 40px rgba(37,99,235,0.30)'
            : buttonStyles.primary.boxShadow,
      }}

      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}

      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}


