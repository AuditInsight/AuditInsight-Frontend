"use client";

/**
 * useRBACGuard.ts — Page-level RBAC guard hook + HOC for the NGO portal.
 *
 * Usage (hook):
 *   const { allowed, reason } = useRBACGuard({ roles: ["AUDITOR", "ORG_ADMIN"] });
 *   if (!allowed) return <AccessDenied reason={reason} />;
 *
 * Usage (HOC):
 *   export default withRBACGuard(MyPage, { roles: ["ACCOUNTANT"] });
 *
 * Usage (permission):
 *   const { allowed } = useRBACGuard({ permission: "report:sign" });
 */

import { type ComponentType } from "react";
import { useRBAC } from "@/context/RBACContext";
import type { Permission, NGOUserRole } from "@/types/rbac";
import { Lock } from "lucide-react";

// ── Guard options ──────────────────────────────────────────────────────────────

interface RBACGuardOptions {
  /** Allow only these roles */
  roles?: NGOUserRole[];
  /** Allow only if user has this permission */
  permission?: Permission;
  /** Custom denial message */
  message?: string;
}

interface RBACGuardResult {
  allowed: boolean;
  reason: string;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useRBACGuard(options: RBACGuardOptions): RBACGuardResult {
  const { user, can } = useRBAC();

  if (options.permission !== undefined) {
    const allowed = can(options.permission);
    return {
      allowed,
      reason: allowed
        ? ""
        : options.message ?? `Your role (${user.role}) does not have the required permission.`,
    };
  }

  if (options.roles !== undefined) {
    const allowed = options.roles.includes(user.role);
    return {
      allowed,
      reason: allowed
        ? ""
        : options.message ??
          `This page is restricted to: ${options.roles.join(", ")}. Your role is ${user.role}.`,
    };
  }

  return { allowed: true, reason: "" };
}

// ── AccessDenied UI ────────────────────────────────────────────────────────────

export function AccessDenied({ reason }: { reason?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Lock size={28} className="text-slate-400" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900 mb-1">Access Restricted</p>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          {reason ?? "You do not have permission to view this page."}
        </p>
      </div>
      <a
        href="/ngo-dashboard"
        className="mt-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
      >
        Back to Dashboard
      </a>
    </div>
  );
}

// ── HOC ────────────────────────────────────────────────────────────────────────

export function withRBACGuard<P extends object>(
  Component: ComponentType<P>,
  options: RBACGuardOptions,
) {
  function GuardedComponent(props: P) {
    const { allowed, reason } = useRBACGuard(options);
    if (!allowed) return <AccessDenied reason={reason} />;
    return <Component {...props} />;
  }
  GuardedComponent.displayName = `withRBACGuard(${Component.displayName ?? Component.name})`;
  return GuardedComponent;
}


