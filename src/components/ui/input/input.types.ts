import { LucideIcon } from "lucide-react";

export interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;

  error?: string;
  success?: boolean;

  type?: "text" | "password" | "email";

  // ✅ FIXED for Lucide icons
  icon?: LucideIcon;
}