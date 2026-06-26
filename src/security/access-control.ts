import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

// ─── Permission matrix per role ────────────────────────────────────
const PERMISSIONS: Record<UserRole, Permissions> = {
  // CEO / Organisation Owner — read-only on financials, full team admin
  CLIENT: {
    canViewTransactions: true,
    canAddTransaction: false,
    canEditTransaction: false,
    canDeleteTransaction: false,
    canViewEvidence: true,
    canUploadEvidence: false,
    canEditEvidence: false,
    canDeleteEvidence: false,
    canFlagIssue: false,
    canResolveIssue: false,
    canApproveTransaction: true,
    canViewAuditLogs: true,
    canManageOrganisation: true,
    canInviteMembers: true,
    canSuspendMembers: true,
    canViewAdminPanel: false,
  },

  MEMBER: {
    canViewTransactions: true,
    canAddTransaction: true,
    canEditTransaction: true,
    canDeleteTransaction: true,
    canViewEvidence: true,
    canUploadEvidence: true,
    canEditEvidence: true,
    canDeleteEvidence: true,
    canFlagIssue: false,
    canResolveIssue: true,
    canApproveTransaction: false,
    canViewAuditLogs: false,
    canManageOrganisation: false,
    canInviteMembers: false,
    canSuspendMembers: false,
    canViewAdminPanel: false,
  },

  AUDITOR: {
    canViewTransactions: true,
    canAddTransaction: false,
    canEditTransaction: false,
    canDeleteTransaction: false,
    canViewEvidence: true,
    canUploadEvidence: false,
    canEditEvidence: false,
    canDeleteEvidence: false,
    canFlagIssue: true,
    canResolveIssue: false,
    canApproveTransaction: false,
    canViewAuditLogs: true,
    canManageOrganisation: false,
    canInviteMembers: false,
    canSuspendMembers: false,
    canViewAdminPanel: false,
  },

  ADMIN: {
    canViewTransactions: false,
    canAddTransaction: false,
    canEditTransaction: false,
    canDeleteTransaction: false,
    canViewEvidence: false,
    canUploadEvidence: false,
    canEditEvidence: false,
    canDeleteEvidence: false,
    canFlagIssue: false,
    canResolveIssue: false,
    canApproveTransaction: false,
    canViewAuditLogs: false,
    canManageOrganisation: false,
    canInviteMembers: false,
    canSuspendMembers: false,
    canViewAdminPanel: true,
  },
};

// ─── Permissions type ──────────────────────────────────────────────
export interface Permissions {
  canViewTransactions: boolean;
  canAddTransaction: boolean;
  canEditTransaction: boolean;
  canDeleteTransaction: boolean;
  canViewEvidence: boolean;
  canUploadEvidence: boolean;
  canEditEvidence: boolean;
  canDeleteEvidence: boolean;
  canFlagIssue: boolean;
  canResolveIssue: boolean;
  canApproveTransaction: boolean;
  canViewAuditLogs: boolean;
  canManageOrganisation: boolean;
  canInviteMembers: boolean;
  canSuspendMembers: boolean;
  canViewAdminPanel: boolean;
}

// ─── Hook ──────────────────────────────────────────────────────────
export function usePermissions(): Permissions {
  const { role } = useAuth();
  return PERMISSIONS[role ?? "CLIENT"];
}
