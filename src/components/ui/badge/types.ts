// components/ui/badge/badge.types.ts

export type BadgeVariant = 'success' | 'warning' | 'danger';
export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}