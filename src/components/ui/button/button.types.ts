export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps {
    label: string;
    variant?: ButtonVariant;
    onClick?: () => void;
    disabled?: boolean;
}


