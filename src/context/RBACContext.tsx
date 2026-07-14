"use client";

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

// ── Context shape ──────────────────────────────────────────────────────────────

interface RBACContextValue {
  user: RBACUser;
  can: (permission: Permission) => boolean;
  canSee: (component: ComponentKey) => boolean;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const NOOP_USER: RBACUser = buildRBACUser(
  0, "Unknown", "", "ORG_ADMIN", "", "NGO Portal"
);

const RBACContext = createContext<RBACContextValue>({
  user:   NOOP_USER,
  can:    () => false,
  canSee: () => false,
});

// ── Provider ───────────────────────────────────────────────────────────────────

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();

  const rbacUser = useMemo<RBACUser>(() => {
    if (!authUser) return NOOP_USER;

    const rawRole = authUser.role;
    const role: NGOUserRole =
      rawRole === "SYSTEM_ADMIN" || rawRole === "DONOR_REPRESENTATIVE"
        ? "ORG_ADMIN"
        : (rawRole as NGOUserRole);

    return buildRBACUser(
      authUser.id,
      authUser.fullName,
      authUser.email,
      role,
      authUser.organisationId ?? "",
      authUser.organisationName ?? "NGO Portal",
      null,
      authUser.mustChangePassword,
    );
  }, [authUser]);

  const value = useMemo<RBACContextValue>(() => ({
    user: rbacUser,
    can:    (permission: Permission) => rbacUser.permissions.has(permission),
    canSee: (component: ComponentKey) => COMPONENT_GATE[component].includes(rbacUser.role),
  }), [rbacUser]);

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useRBAC(): RBACContextValue {
  return useContext(RBACContext);
}

export function usePermission(permission: Permission): boolean {
  const { can } = useRBAC();
  return can(permission);
}

export function useComponentGate(component: ComponentKey): boolean {
  const { canSee } = useRBAC();
  return canSee(component);
}

// ── Role metadata helpers ──────────────────────────────────────────────────────

const ROLE_LABELS: Record<NGOUserRole, string> = {
  ACCOUNTANT: "Finance Officer",
  AUDITOR:    "Auditor",
  ORG_ADMIN:  "Executive Director",
};

const ROLE_ACCENTS: Record<NGOUserRole, { color: string; bg: string; border: string }> = {
  ACCOUNTANT: { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  AUDITOR:    { color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  ORG_ADMIN:  { color: "#1e3a8a", bg: "#eff6ff", border: "#bfdbfe" },
};

export function useRoleLabel(): string {
  const { user } = useRBAC();
  return ROLE_LABELS[user.role];
}

export function useRoleAccent(): { color: string; bg: string; border: string } {
  const { user } = useRBAC();
  return ROLE_ACCENTS[user.role];
}
