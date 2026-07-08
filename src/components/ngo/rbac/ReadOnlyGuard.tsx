"use client";

/**
 * ReadOnlyGuard.tsx — Wraps children with a read-only overlay for roles
 * that have no write permissions (ORG_ADMIN, DONOR_REPRESENTATIVE).
 *
 * For write-capable roles (ACCOUNTANT, AUDITOR) it renders children as-is.
 * The overlay is purely visual — actual permission enforcement is in PermissionGate.
 */

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useRBAC } from "@/context/RBACContext";

interface Props {
  children: ReactNode;
  /** Override: force read-only regardless of role */
  forceReadOnly?: boolean;
}

const READ_ONLY_ROLES = new Set(["ORG_ADMIN", "DONOR_REPRESENTATIVE"]);

export default function ReadOnlyGuard({ children, forceReadOnly }: Props) {
  const { user } = useRBAC();
  const isReadOnly = forceReadOnly ?? READ_ONLY_ROLES.has(user.role);

  if (!isReadOnly) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ background: "rgba(248,250,252,0.0)" }}
      />
      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 shadow-sm pointer-events-none">
        <Lock size={10} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-400">Read-only</span>
      </div>
    </div>
  );
}


