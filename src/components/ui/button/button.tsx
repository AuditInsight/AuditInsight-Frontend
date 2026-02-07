import { ButtonProps } from './button.types';
import { buttonStyles } from './button.styles';

export function Button ({ 
    label, 
    variant = 'primary', 
    onClick, 
    disabled, 
}: ButtonProps) { return (
    <button 
        style={{
            ...buttonStyles.base, 
            ...(buttonStyles[variant as keyof typeof buttonStyles] || {}),
        }}
        onClick={onClick}
        disabled={disabled}
    >
        {label}
    </button>
);
}