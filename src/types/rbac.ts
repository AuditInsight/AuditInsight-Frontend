/**
 * rbac.ts — Enterprise RBAC type definitions for AuditInsight NGO Portal.
 *
 * Architecture:
 *   NGOUserRole      — canonical role enum (mirrors NGORole from ngo.ts)
 *   RBACUser         — full user context object passed through RBACContext
 *   Permission       — every discrete action the system can gate
 *   PermissionMatrix — maps every role to its exact permission set
 *   ComponentGate    — maps UI component keys to the roles that may see them
 *   DataScope        — describes what data slice a user is allowed to see
 */

import type { DonorName } from "./ngo";

// ── Role enum ──────────────────────────────────────────────────────────────────
export type NGOUserRole =
  | "ACCOUNTANT"           // Finance Officer — write/upload
  | "AUDITOR"              // External/Internal Auditor — flag only
  | "ORG_ADMIN"            // Executive Director — read + resolve
  | "DONOR_REPRESENTATIVE"; // Donor rep — scoped read-only

/** All four NGO roles as a readonly tuple — useful for exhaustive checks */
export const NGO_USER_ROLES = [
  "ACCOUNTANT",
  "AUDITOR",
  "ORG_ADMIN",
  "DONOR_REPRESENTATIVE",
] as const satisfies ReadonlyArray<NGOUserRole>;

// ── Permission atoms ───────────────────────────────────────────────────────────
// Every discrete action in the system. Adding a new feature = add a Permission.
export type Permission =
  // Transaction permissions
  | "transaction:create"
  | "transaction:edit"
  | "transaction:delete"
  | "transaction:view"
  // Evidence permissions
  | "evidence:upload"
  | "evidence:delete"
  | "evidence:view"
  // Flag permissions
  | "flag:create"
  | "flag:resolve"
  | "flag:dismiss"
  | "flag:view"
  // Beneficiary permissions
  | "beneficiary:create"
  | "beneficiary:edit"
  | "beneficiary:view"
  // Report permissions
  | "report:sign"
  | "report:export"
  | "report:view"
  // Settings permissions
  | "settings:org:edit"
  | "settings:profile:edit"
  | "settings:notifications:edit"
  | "settings:security:edit"
  // Notification permissions
  | "notifications:view"
  // Dashboard widget permissions
  | "widget:action_items"       // ACCOUNTANT action items panel
  | "widget:auditor_alerts"     // ACCOUNTANT — see which files were rejected
  | "widget:executive_overview" // ORG_ADMIN greeting banner
  | "widget:executive_flags"    // ORG_ADMIN cross-dept flag alert panel
  | "widget:donor_metrics"      // DONOR_REPRESENTATIVE scoped metrics
  | "widget:audit_summary"      // AUDITOR review queue summary
  | "widget:compliance_ring";   // ORG_ADMIN + AUDITOR compliance score ring

// ── Permission matrix ──────────────────────────────────────────────────────────
// Single source of truth. Every role's full permission set is explicit here.
export const PERMISSION_MATRIX: Record<NGOUserRole, ReadonlySet<Permission>> = {
  ACCOUNTANT: new Set<Permission>([
    "transaction:create",
    "transaction:edit",
    "transaction:view",
    "evidence:upload",
    "evidence:view",
    "flag:view",
    "beneficiary:create",
    "beneficiary:edit",
    "beneficiary:view",
    "report:export",
    "report:view",
    "settings:profile:edit",
    "settings:notifications:edit",
    "settings:security:edit",
    "notifications:view",
    "widget:action_items",
    "widget:auditor_alerts",
  ]),

  AUDITOR: new Set<Permission>([
    "transaction:view",
    "evidence:view",
    "flag:create",
    "flag:view",
    "beneficiary:view",
    "report:view",
    "settings:profile:edit",
    "settings:notifications:edit",
    "settings:security:edit",
    "widget:audit_summary",
    "widget:compliance_ring",
  ]),

  ORG_ADMIN: new Set<Permission>([
    "transaction:view",
    "evidence:view",
    "flag:resolve",
    "flag:dismiss",
    "flag:view",
    "beneficiary:view",
    "report:sign",
    "report:export",
    "report:view",
    "settings:org:edit",
    "settings:profile:edit",
    "settings:notifications:edit",
    "settings:security:edit",
    "notifications:view",
    "widget:executive_overview",
    "widget:executive_flags",
    "widget:compliance_ring",
  ]),

  DONOR_REPRESENTATIVE: new Set<Permission>([
    "transaction:view",
    "evidence:view",
    "flag:view",
    "beneficiary:view",
    "report:view",
    "settings:profile:edit",
    "settings:notifications:edit",
    "settings:security:edit",
    "widget:donor_metrics",
  ]),
};

// ── Component gate map ─────────────────────────────────────────────────────────
// Maps named UI slots to the roles that may render them.
// Use with <PermissionGate component="txn:upload_btn"> in JSX.
export type ComponentKey =
  | "txn:upload_btn"        // Upload Evidence button on transaction row
  | "txn:edit_btn"          // Edit Transaction button
  | "txn:delete_btn"        // Delete Transaction button
  | "txn:flag_btn"          // Flag Compliance Issue button
  | "txn:add_btn"           // + New Transaction button (page header)
  | "txn:export_btn"        // Export CSV button
  | "evidence:upload_zone"  // Drag-and-drop upload zone
  | "evidence:upload_btn"   // Upload button in evidence table row
  | "evidence:delete_btn"   // Delete evidence button
  | "flag:resolve_btn"      // Mark Resolved button
  | "flag:dismiss_btn"      // Dismiss flag button
  | "beneficiary:add_btn"   // Add Beneficiary button
  | "beneficiary:edit_btn"  // Edit beneficiary row
  | "report:sign_btn"       // Sign Report button
  | "settings:org_tab"      // Organisation settings tab
  | "panel:action_items"    // ACCOUNTANT action items widget
  | "panel:auditor_alerts"  // ACCOUNTANT auditor alerts panel
  | "panel:executive_flags" // ORG_ADMIN cross-dept flag panel
  | "panel:donor_metrics"   // DONOR_REPRESENTATIVE scoped metrics
  | "panel:audit_summary"   // AUDITOR review queue summary
  | "panel:compliance_ring" // Compliance score ring
  | "topbar:notifications"; // Bell icon in topbar

export const COMPONENT_GATE: Record<ComponentKey, ReadonlyArray<NGOUserRole>> = {
  "txn:upload_btn":        ["ACCOUNTANT"],
  "txn:edit_btn":          ["ACCOUNTANT"],
  "txn:delete_btn":        [],                                          // nobody — hard disabled
  "txn:flag_btn":          ["AUDITOR"],
  "txn:add_btn":           ["ACCOUNTANT"],
  "txn:export_btn":        ["ACCOUNTANT", "ORG_ADMIN"],
  "evidence:upload_zone":  ["ACCOUNTANT"],
  "evidence:upload_btn":   ["ACCOUNTANT"],
  "evidence:delete_btn":   [],                                          // nobody
  "flag:resolve_btn":      ["ORG_ADMIN"],
  "flag:dismiss_btn":      ["ORG_ADMIN"],
  "beneficiary:add_btn":   ["ACCOUNTANT"],
  "beneficiary:edit_btn":  ["ACCOUNTANT"],
  "report:sign_btn":       ["ORG_ADMIN"],
  "settings:org_tab":      ["ORG_ADMIN"],
  "panel:action_items":    ["ACCOUNTANT"],
  "panel:auditor_alerts":  ["ACCOUNTANT"],
  "panel:executive_flags": ["ORG_ADMIN"],
  "panel:donor_metrics":   ["DONOR_REPRESENTATIVE"],
  "panel:audit_summary":   ["AUDITOR"],
  "panel:compliance_ring": ["ORG_ADMIN", "AUDITOR"],
  "topbar:notifications":  ["ACCOUNTANT", "ORG_ADMIN"],
};

// ── Data scope ─────────────────────────────────────────────────────────────────
// Describes what slice of data a user is allowed to see.
// DONOR_REPRESENTATIVE has a non-null donorScope that acts as a row-level filter.
export interface DataScope {
  /** If set, only rows where row.donor === donorScope are visible */
  donorScope: DonorName | null;
  /** If true, the user sees all donors' data */
  isGlobal: boolean;
}

export function buildDataScope(role: NGOUserRole, donorScope: DonorName | null): DataScope {
  return {
    donorScope: role === "DONOR_REPRESENTATIVE" ? donorScope : null,
    isGlobal:   role !== "DONOR_REPRESENTATIVE",
  };
}

// ── RBAC user context object ───────────────────────────────────────────────────
// This is the shape stored in RBACContext and consumed by useRBAC().
export interface RBACUser {
  id: number;
  fullName: string;
  email: string;
  role: NGOUserRole;
  organisationId: string;
  organisationName: string;
  /** Only set for DONOR_REPRESENTATIVE — restricts visible data to this donor */
  assignedDonorId: DonorName | null;
  permissions: ReadonlySet<Permission>;
  dataScope: DataScope;
  /** True when the user must change their password before accessing the app */
  mustChangePassword: boolean;
}

// ── Factory ────────────────────────────────────────────────────────────────────
export function buildRBACUser(
  id: number,
  fullName: string,
  email: string,
  role: NGOUserRole,
  organisationId: string,
  organisationName: string,
  donorScope: DonorName | null = null,
  mustChangePassword = false,
): RBACUser {
  return {
    id,
    fullName,
    email,
    role,
    organisationId,
    organisationName,
    assignedDonorId: role === "DONOR_REPRESENTATIVE" ? donorScope : null,
    permissions:     PERMISSION_MATRIX[role],
    dataScope:       buildDataScope(role, donorScope),
    mustChangePassword,
  };
}
