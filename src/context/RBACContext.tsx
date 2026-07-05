"use client";

/**
 * RBACContext.tsx — Enterprise RBAC provider for AuditInsight NGO Portal.
 *
 * Bridges the existing AuthContext (which holds the raw User object) into the
 * RBAC layer (which exposes typed permissions, component gates, and data scopes).
 *
 * Usage:
 *   // Wrap once at the NGO layout level — already done inside NGOPageLayout
 *   <RBACProvider>...</RBACProvider>
 *
 *   // Consume anywhere below
 *   const { user, can, canSee, scopeData } = useRBAC();
 *   const allowed = usePermission("evidence:upload");
 *   const visible = useComponentGate("txn:upload_btn");
 *   const rows    = useScopedData(allTransactions, (t) => t.donor);
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext.production";
import {
  buildRBACUser,
  COMPONENT_GATE,
  type RBACUser,
  type Permission,
  type ComponentKey,
  type NGOUserRole,
} from "@/types/rbac";
import type { DonorName } from "@/types/ngo";

// ── Context shape ──────────────────────────────────────────────────────────────

interface RBACContextValue {
  /** The fully-resolved RBAC user (never null inside RBACProvider) */
  user: RBACUser;
  /**
   * Check a single permission atom.
   * @example can("evidence:upload") → true for ACCOUNTANT, false for AUDITOR
   */
  can: (permission: Permission) => boolean;
  /**
   * Check whether a named UI component should be rendered for this user.
   * Returns false if the component key is not in the allowed roles list.
   * @example canSee("txn:upload_btn") → true only for ACCOUNTANT
   */
  canSee: (component: ComponentKey) => boolean;
  /**
   * Filter an array of records to only those the current user is allowed to see.
   * For DONOR_REPRESENTATIVE this applies the donorScope row-level filter.
   * For all other roles it returns the array unchanged.
   * @param items   — the full unfiltered array
   * @param getDonor — accessor that returns the donor field of each item
   */
  scopeData: <T>(items: T[], getDonor: (item: T) => string) => T[];
}

// ── Defaults (never actually used — provider always wraps before consumption) ──

const NOOP_USER: RBACUser = buildRBACUser(
  0, "Unknown", "", "ORG_ADMIN", "", "NGO Portal"
);

const RBACContext = createContext<RBACContextValue>({
  user:      NOOP_USER,
  can:       () => false,
  canSee:    () => false,
  scopeData: (items) => items,
});

// ── Provider ───────────────────────────────────────────────────────────────────

interface RBACProviderProps {
  children: ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const { user: authUser } = useAuth();

  const rbacUser = useMemo<RBACUser>(() => {
    if (!authUser) return NOOP_USER;

    // Guard: SYSTEM_ADMIN cannot reach NGO pages — fall back to ORG_ADMIN
    const rawRole = authUser.role;
    const role: NGOUserRole =
      rawRole === "SYSTEM_ADMIN" ? "ORG_ADMIN" : (rawRole as NGOUserRole);

    return buildRBACUser(
      authUser.id,
      authUser.fullName,
      authUser.email,
      role,
      authUser.organisationId ?? "",
      authUser.organisationName ?? "NGO Portal",
      (authUser.donorScope as DonorName | null) ?? null,
      authUser.mustChangePassword,
    );
  }, [authUser]);

  const value = useMemo<RBACContextValue>(() => ({
    user: rbacUser,

    can: (permission: Permission) =>
      rbacUser.permissions.has(permission),

    canSee: (component: ComponentKey) =>
      COMPONENT_GATE[component].includes(rbacUser.role),

    scopeData: <T,>(items: T[], getDonor: (item: T) => string): T[] => {
      if (rbacUser.dataScope.isGlobal) return items;
      const scope = rbacUser.dataScope.donorScope;
      if (!scope) return items;
      return items.filter((item) => getDonor(item) === scope);
    },
  }), [rbacUser]);

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

/** Primary hook — returns the full RBAC context */
export function useRBAC(): RBACContextValue {
  return useContext(RBACContext);
}

/**
 * Convenience hook — returns true if the current user has the given permission.
 * @example const canUpload = usePermission("evidence:upload");
 */
export function usePermission(permission: Permission): boolean {
  const { can } = useRBAC();
  return can(permission);
}

/**
 * Convenience hook — returns true if the named UI component should be shown.
 * @example const showUploadBtn = useComponentGate("txn:upload_btn");
 */
export function useComponentGate(component: ComponentKey): boolean {
  const { canSee } = useRBAC();
  return canSee(component);
}

/**
 * Convenience hook — returns the data array filtered to the user's scope.
 * For DONOR_REPRESENTATIVE this applies the donorScope row-level filter.
 * @example const rows = useScopedData(allTransactions, (t) => t.donor);
 */
export function useScopedData<T>(
  items: T[],
  getDonor: (item: T) => string,
): T[] {
  const { scopeData } = useRBAC();
  return useMemo(
    () => scopeData(items, getDonor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, scopeData],
  );
}
