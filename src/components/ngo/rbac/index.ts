/**
 * rbac/index.ts — Barrel export for all RBAC components, hooks, and types.
 *
 * Import from here instead of individual files:
 *   import { PermissionGate, useRBACGuard, RoleBadge } from "@/components/ngo/rbac";
 */

// ── Components ─────────────────────────────────────────────────────────────────
export { default as PermissionGate }          from "./PermissionGate";
export { default as RoleBadge }               from "./RoleBadge";
export { default as DonorScopeBanner }        from "./DonorScopeBanner";
export { default as ReadOnlyGuard }           from "./ReadOnlyGuard";
export { default as ActionItems }             from "./ActionItems";
export { default as AuditorAlertsPanel }      from "./AuditorAlertsPanel";
export { default as AuditSummaryPanel }       from "./AuditSummaryPanel";
export { default as ExecutiveAlertPanel }     from "./ExecutiveAlertPanel";
export { default as ExecutiveOverviewBanner } from "./ExecutiveOverviewBanner";
export { default as ReportSigningPanel }      from "./ReportSigningPanel";
export { default as DonorScopeMetrics }       from "./DonorScopeMetrics";
export { default as NGORoleSwitcher }         from "./NGORoleSwitcher";

// ── Hooks ──────────────────────────────────────────────────────────────────────
export {
  useRBACGuard,
  AccessDenied,
  withRBACGuard,
} from "@/hooks/useRBACGuard";

// ── Context hooks (re-exported for convenience) ────────────────────────────────
export {
  useRBAC,
  usePermission,
  useComponentGate,
  useScopedData,
  useRoleLabel,
  useRoleAccent,
  RBACProvider,
} from "@/context/RBACContext";

// ── Types ──────────────────────────────────────────────────────────────────────
export type {
  NGOUserRole,
  Permission,
  ComponentKey,
  RBACUser,
  DataScope,
} from "@/types/rbac";

export {
  PERMISSION_MATRIX,
  COMPONENT_GATE,
  NGO_USER_ROLES,
  buildRBACUser,
  buildDataScope,
} from "@/types/rbac";


