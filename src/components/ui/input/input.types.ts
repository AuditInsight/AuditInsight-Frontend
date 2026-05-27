import { LucideIcon } from "lucide-react";

export interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;

  error?: string;
  success?: boolean;

  type?: "text" | "password" | "email";

  /** `stacked` = label above field (best for auth forms). `floating` = label inside field. */
  variant?: "floating" | "stacked";

  icon?: LucideIcon;
}