import { useAuth } from "@/context/AuthContext.production";
import { FrontendRole } from "@/types/auth";

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
  canViewSettings: boolean;
  canManageOrganisation: boolean;
  canInviteMembers: boolean;
  canSuspendMembers: boolean;
  canViewAdminPanel: boolean;
}

const PERMISSIONS: Record<FrontendRole, Permissions> = {
  ORG_ADMIN: {
    canViewTransactions:  true,
    canAddTransaction:    false,
    canEditTransaction:   false,
    canDeleteTransaction: false,
    canViewEvidence:      true,
    canUploadEvidence:    false,
    canEditEvidence:      false,
    canDeleteEvidence:    false,
    canFlagIssue:         false,
    canResolveIssue:      false,
    canApproveTransaction:true,
    canViewAuditLogs:     true,
    canViewSettings:      true,
    canManageOrganisation:true,
    canInviteMembers:     true,
    canSuspendMembers:    true,
    canViewAdminPanel:    false,
  },
  ACCOUNTANT: {
    canViewTransactions:  true,
    canAddTransaction:    true,
    canEditTransaction:   true,
    canDeleteTransaction: true,
    canViewEvidence:      true,
    canUploadEvidence:    true,
    canEditEvidence:      true,
    canDeleteEvidence:    true,
    canFlagIssue:         false,
    canResolveIssue:      true,
    canApproveTransaction:false,
    canViewAuditLogs:     false,
    canViewSettings:      true,
    canManageOrganisation:false,
    canInviteMembers:     false,
    canSuspendMembers:    false,
    canViewAdminPanel:    false,
  },
  AUDITOR: {
    canViewTransactions:  true,
    canAddTransaction:    false,
    canEditTransaction:   false,
    canDeleteTransaction: false,
    canViewEvidence:      true,
    canUploadEvidence:    false,
    canEditEvidence:      false,
    canDeleteEvidence:    false,
    canFlagIssue:         true,
    canResolveIssue:      false,
    canApproveTransaction:false,
    canViewAuditLogs:     true,
    canViewSettings:      true,
    canManageOrganisation:false,
    canInviteMembers:     false,
    canSuspendMembers:    false,
    canViewAdminPanel:    false,
  },
  SYSTEM_ADMIN: {
    canViewTransactions:  false,
    canAddTransaction:    false,
    canEditTransaction:   false,
    canDeleteTransaction: false,
    canViewEvidence:      false,
    canUploadEvidence:    false,
    canEditEvidence:      false,
    canDeleteEvidence:    false,
    canFlagIssue:         false,
    canResolveIssue:      false,
    canApproveTransaction:false,
    canViewAuditLogs:     false,
    canViewSettings:      true,
    canManageOrganisation:false,
    canInviteMembers:     false,
    canSuspendMembers:    false,
    canViewAdminPanel:    true,
  },
  // NGO-only role — strict read-only, scoped to their donor's projects
  DONOR_REPRESENTATIVE: {
    canViewTransactions:  true,
    canAddTransaction:    false,
    canEditTransaction:   false,
    canDeleteTransaction: false,
    canViewEvidence:      true,
    canUploadEvidence:    false,
    canEditEvidence:      false,
    canDeleteEvidence:    false,
    canFlagIssue:         false,
    canResolveIssue:      false,
    canApproveTransaction:false,
    canViewAuditLogs:     false,
    canViewSettings:      false,
    canManageOrganisation:false,
    canInviteMembers:     false,
    canSuspendMembers:    false,
    canViewAdminPanel:    false,
  },
};

const FALLBACK: Permissions = PERMISSIONS["ORG_ADMIN"];

export function usePermissions(): Permissions {
  const { user } = useAuth();
  const role = user?.role ?? null;
  if (!role) return FALLBACK;
  return PERMISSIONS[role as FrontendRole] ?? FALLBACK;
}


