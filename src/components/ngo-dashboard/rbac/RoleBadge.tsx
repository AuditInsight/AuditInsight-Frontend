"use client";

/**
 * RoleBadge.tsx — Displays the current user's role as a styled pill.
 * Reads role from RBACContext — no props needed.
 */

import { useRoleLabel, useRoleAccent } from "@/context/RBACContext";

interface Props {
  size?: "sm" | "md";
}

export default function RoleBadge({ size = "sm" }: Props) {
  const label  = useRoleLabel();
  const accent = useRoleAccent();

  const px   = size === "md" ? "10px 16px" : "3px 10px";
  const fs   = size === "md" ? 12 : 10.5;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: px,
        borderRadius: 999,
        fontSize: fs,
        fontWeight: 700,
        letterSpacing: "0.03em",
        color: accent.color,
        background: accent.bg,
        border: `1px solid ${accent.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
