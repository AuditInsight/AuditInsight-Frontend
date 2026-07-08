// ─── NGO-specific roles ──────────────────────────────────────────────────────
// These extend the base FrontendRole for NGO organisations.
// DONOR_REPRESENTATIVE is NGO-only: scoped view to their donor's projects only.
export type NGORole =
  | "ORG_ADMIN"            // Executive Director — view only, receives flags
  | "ACCOUNTANT"           // Finance Officer — record transactions, upload evidence
  | "AUDITOR"              // External/Internal Auditor — view + flag issues
  | "DONOR_REPRESENTATIVE"; // e.g. UNICEF rep — view only, scoped to their donor

// ─── Donors ─────────────────────────────────────────────────────────────────
export type DonorName =
  | "USAID" | "UNICEF" | "World Bank" | "EU" | "UNDP"
  | "GIZ" | "DFID" | "Gates Foundation" | "One Acre Fund" | "Red Cross";

// ─── NGO Transaction ─────────────────────────────────────────────────────────
// Extends the base Transaction with NGO-specific metadata fields
export type NGOTransactionStatus = "PENDING" | "COMPLETED" | "FLAGGED";

export interface NGOTransaction {
  id: string;
  organisationId: string;
  projectName: string;
  donor: DonorName;
  budgetLine: string;
  description: string;
  counterparty: string;
  date: string;
  amount: number;
  currency: string;
  paymentMethod: "BANK" | "MOBILE_MONEY" | "CASH";
  type: "EXPENSE" | "INCOME";
  status: NGOTransactionStatus;
  evidenceCount: number;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

// ─── Audit Flag ──────────────────────────────────────────────────────────────
export type FlagSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type NGOFlagCategory =
  | "Missing Beneficiary List"
  | "Missing Payment Voucher"
  | "Unapproved Budget Overrun"
  | "Missing Procurement Documents"
  | "Missing Signed Attendance Sheets"
  | "Unverified Supplier"
  | "Missing Bank Reconciliation"
  | "Duplicate Transaction"
  | "Missing Grant Agreement Reference"
  | "Missing Activity Report"
  | "Unsupported Cash Payment"
  | "Missing Donor Approval"
  | "Other";

export interface NGOFlag {
  id: string;
  transactionId: string;
  projectName: string;
  donor: DonorName;
  category: NGOFlagCategory;
  severity: FlagSeverity;
  notes: string;
  flaggedBy: string;       // auditor name
  flaggedAt: string;       // ISO date
  resolvedAt?: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface NGONotification {
  id: string;
  flagId: string;
  transactionId: string;
  projectName: string;
  donor: DonorName;
  message: string;
  auditorName: string;
  severity: FlagSeverity;
  createdAt: string;
  read: boolean;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
export interface NGONavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  /** Roles that can see this nav item. Undefined = all NGO roles */
  allowedRoles?: NGORole[];
}

// ─── Permission map ──────────────────────────────────────────────────────────
export interface NGOPermissions {
  canRecordTransaction: boolean;
  canUploadEvidence: boolean;
  canEditTransaction: boolean;
  canFlagIssue: boolean;
  canResolveFlag: boolean;
  canViewAllDonors: boolean;   // false for DONOR_REPRESENTATIVE
  canManageOrg: boolean;
  canViewNotifications: boolean;
}

export const NGO_PERMISSIONS: Record<NGORole, NGOPermissions> = {
  ACCOUNTANT: {
    canRecordTransaction: true,
    canUploadEvidence:    true,
    canEditTransaction:   true,
    canFlagIssue:         false,
    canResolveFlag:       false,  // ACCOUNTANT fixes the evidence, does not resolve flags
    canViewAllDonors:     true,
    canManageOrg:         false,
    canViewNotifications: true,
  },
  AUDITOR: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         true,   // AUDITOR raises flags
    canResolveFlag:       false,  // AUDITOR cannot resolve their own flags
    canViewAllDonors:     true,
    canManageOrg:         false,
    canViewNotifications: false,
  },
  ORG_ADMIN: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         false,
    canResolveFlag:       true,   // ORG_ADMIN receives flags and resolves them
    canViewAllDonors:     true,
    canManageOrg:         true,
    canViewNotifications: true,
  },
  DONOR_REPRESENTATIVE: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         false,
    canResolveFlag:       false,
    canViewAllDonors:     false,
    canManageOrg:         false,
    canViewNotifications: false,
  },
};


