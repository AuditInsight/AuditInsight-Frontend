// ─── Evidence categories & document types ───────────────────────────────────
export const NGO_EVIDENCE_CATEGORIES = {
  "Financial Reporting":        ["General Ledgers","Trial Balances","Financial Statements","Project Financial Reports","Donor Financial Reports"],
  "Budget Management":          ["Approved Annual Budget","Project Budgets","Grant Budgets","Budget Revisions","Budget vs Actual Reports","Budget Approval Minutes"],
  "Banking and Cash":           ["Bank Statements","Bank Reconciliations","Payment Confirmations","Cashbooks","Cash Count Sheets","Petty Cash Vouchers"],
  "Payment Evidence":           ["Payment Vouchers","Signed Payment Requests","Electronic Transfer Confirmations","Cheque Copies","Mobile Money Confirmations","Payment Approval Forms"],
  "Grants and Donor Agreements":["Grant Agreements","Funding Agreements","Donor Contracts","Grant Amendments","Donor Correspondence"],
  "Donor Compliance":           ["Donor Guidelines","Reporting Requirements","Compliance Checklists","Donor Approvals","Waivers","Donor Monitoring Reports"],
  "Project Documentation":      ["Project Proposals","Work Plans","Activity Reports","Project Completion Reports","Monitoring Reports"],
  "Project Activities":         ["Training Reports","Workshop Reports","Workshop Agendas","Workshop Attendance Lists","Signed Attendance Sheets","Meeting Minutes","Evaluation Forms","Photographs"],
  "Beneficiary Documentation":  ["Beneficiary Lists","Beneficiary Registration Forms","Beneficiary IDs","Distribution Lists","Acknowledgement Receipts","Consent Forms"],
  "Procurement":                ["Purchase Requisitions","Purchase Orders","Supplier Quotations","Bid Evaluation Reports","Supplier Invoices","Goods Received Notes","Supplier Contracts"],
  "Payroll and HR":             ["Payroll Registers","Employment Contracts","Timesheets","Leave Records","Staff Lists","Performance Contracts"],
  "Travel":                     ["Travel Authorizations","Travel Expense Claims","Flight Tickets","Hotel Invoices"],
  "Vehicles":                   ["Vehicle Logbooks","Fuel Records","Vehicle Maintenance Records","Vehicle Insurance","Vehicle Allocation Records"],
  "Fixed Assets":               ["Asset Register","Asset Tags","Purchase Documents","Asset Transfer Forms","Asset Disposal Forms","Physical Verification Reports","Maintenance Records","Depreciation Schedules"],
  "Inventory":                  ["Inventory Registers","Stock Count Sheets"],
  "Compliance and Tax":         ["VAT Documents","PAYE Filings","RSSB Contributions","Tax Clearance Certificates","NGO Registration Certificates"],
  "Legal and Governance":       ["Board Minutes","Management Meeting Minutes","Policies","Memorandums of Understanding","Contracts","Registration Documents"],
  "Audit Evidence":             ["Audit Requests","Management Responses","Audit Reports","Management Letters","Corrective Action Plans"],
  "IT and System Evidence":     ["Access Logs","Audit Trail Exports","Backup Reports"],
  "Other Supporting Documents": ["Emails","Approval Letters","Miscellaneous"],
} as const;

export type NGOEvidenceCategory = keyof typeof NGO_EVIDENCE_CATEGORIES;
export type NGOEvidenceDocType  = typeof NGO_EVIDENCE_CATEGORIES[NGOEvidenceCategory][number];

// ─── NGO-specific roles ───────────────────────────────────────────────────────
export type NGORole = "ORG_ADMIN" | "ACCOUNTANT" | "AUDITOR" | "DONOR_REPRESENTATIVE";

// ─── Donors ─────────────────────────────────────────────────────────────────
// Kept for backward compatibility with existing data references
export type DonorName = string;

// ─── NGO Transaction ─────────────────────────────────────────────────────────
// Extends the base Transaction with NGO-specific metadata fields
export type NGOTransactionStatus = "PENDING" | "COMPLETED" | "FLAGGED";

export interface NGOTransaction {
  id: string;
  organisationId: string;
  projectName: string;
  donor: string;
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
  canManageOrg: boolean;
  canViewNotifications: boolean;
}

export const NGO_PERMISSIONS: Record<NGORole, NGOPermissions> = {
  DONOR_REPRESENTATIVE: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         false,
    canResolveFlag:       false,
    canManageOrg:         false,
    canViewNotifications: false,
  },
  ACCOUNTANT: {
    canRecordTransaction: true,
    canUploadEvidence:    true,
    canEditTransaction:   true,
    canFlagIssue:         false,
    canResolveFlag:       false,
    canManageOrg:         false,
    canViewNotifications: true,
  },
  AUDITOR: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         true,
    canResolveFlag:       false,
    canManageOrg:         false,
    canViewNotifications: false,
  },
  ORG_ADMIN: {
    canRecordTransaction: false,
    canUploadEvidence:    false,
    canEditTransaction:   false,
    canFlagIssue:         false,
    canResolveFlag:       true,
    canManageOrg:         true,
    canViewNotifications: true,
  },
};

