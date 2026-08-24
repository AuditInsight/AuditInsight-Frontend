// ─── Evidence categories & document types ───────────────────────────────────
// Synced with EVIDENCE_FOLDERS in constants/evidenceFolders.ts (last updated: 2026-08-24)
export const NGO_EVIDENCE_CATEGORIES = {
  "Financial Reporting":                       ["General Ledgers","Trial Balances","Financial Statements","Project Financial Reports","Donor Financial Reports","Management Accounts","Journal Entries","Supporting Schedules"],
  "Budget Management":                         ["Approved Annual Budget","Project Budgets","Grant Budgets","Budget Revisions","Budget vs Actual Reports","Budget Approval Minutes"],
  "Banking and Cash":                          ["Bank Statements","Bank Reconciliations","Payment Confirmations","Cashbooks","Cash Count Sheets","Petty Cash Vouchers","Cheque Copies"],
  "Payment Evidence":                          ["Payment Vouchers","Signed Payment Requests","Electronic Transfer Confirmations","Cheque Copies","Mobile Money Confirmations","Payment Approval Forms","Payment Schedules"],
  "Receivables, Payables and Advances":        ["Accounts Receivable Aging","Accounts Payable Aging","Customer and Debtor Statements","Supplier Statements","Receivables Reconciliations","Payables Reconciliations","Staff Advances","Staff Advance Liquidations","Partner Advances","Advance Reconciliations","Balance Confirmations"],
  "Grants and Donor Agreements":                ["Grant Agreements","Funding Agreements","Donor Contracts","Grant Amendments","Donor Correspondence"],
  "Grant and Donor Reconciliations":            ["Grant Reconciliations","Donor Fund Balances","Restricted Fund Schedules","Unrestricted Fund Schedules","Grant Expenditure Schedules","Grant Advance Reconciliations","Budget vs Actual Reconciliations"],
  "Donor Compliance":                          ["Donor Guidelines","Reporting Requirements","Compliance Checklists","Donor Approvals","Waivers","Donor Monitoring Reports"],
  "Implementing Partners and Sub-Grants":      ["Partner Agreements","Sub-Grant Agreements","Partner Budgets","Partner Financial Reports","Partner Narrative Reports","Partner Monitoring Reports","Partner Due Diligence Assessments","Partner Audit Reports","Partner Advance Reports","Partner Liquidation Reports"],
  "Project Documentation":                     ["Project Proposals","Work Plans","Activity Reports","Project Completion Reports","Monitoring Reports"],
  "Project Activities":                        ["Training Reports","Workshop Reports","Workshop Agendas","Workshop Attendance Lists","Signed Attendance Sheets","Meeting Minutes","Evaluation Forms","Photographs"],
  "Beneficiary Documentation":                 ["Beneficiary Lists","Beneficiary Registration Forms","Beneficiary IDs","Distribution Lists","Acknowledgement Receipts","Consent Forms"],
  "Procurement":                               ["Purchase Requisitions","Procurement Plans","Purchase Orders","Supplier Quotations","Tender Documents","Bid Opening Minutes","Bid Evaluation Reports","Supplier Selection Approvals","Supplier Invoices","Goods Received Notes","Delivery Notes","Supplier Contracts","Procurement Waivers"],
  "Payroll and HR":                            ["Payroll Registers","Employment Contracts","Timesheets","Leave Records","Staff Lists","Performance Contracts","PAYE Records","RSSB Contributions","Salary Approval Letters","Employee Expense Claims","HR Policies"],
  "Travel":                                    ["Travel Authorizations","Travel Expense Claims","Flight Tickets","Hotel Invoices","Travel Reports","Boarding Passes"],
  "Vehicles":                                  ["Vehicle Logbooks","Fuel Records","Vehicle Maintenance Records","Vehicle Insurance","Vehicle Allocation Records"],
  "Fixed Assets":                              ["Asset Register","Asset Tags","Purchase Documents","Asset Transfer Forms","Asset Disposal Forms","Physical Verification Reports","Maintenance Records","Depreciation Schedules"],
  "Inventory and Distributions":                ["Inventory Registers","Stock Count Sheets","Goods Received Notes","Warehouse Records","Stock Movement Reports","Distribution Plans","Distribution Lists","Beneficiary Acknowledgement Receipts","Damaged and Expired Stock Reports"],
  "Internal Controls and Risk Management":     ["Internal Control Policies","Risk Registers","Risk Assessments","Internal Audit Reports","Internal Audit Plans","Fraud Reports","Whistleblowing Reports","Conflict of Interest Declarations","Control Self-Assessments"],
  "Insurance and Liabilities":                 ["Insurance Policies","Insurance Claims","Lease Agreements","Legal Claims","Provisions","Contingent Liabilities","Guarantees and Commitments"],
  "Compliance and Tax":                        ["VAT Documents","PAYE Filings","RSSB Contributions","Tax Clearance Certificates","NGO Registration Certificates"],
  "Legal and Governance":                      ["Board Minutes","Management Meeting Minutes","Policies","Memorandums of Understanding","Contracts","Registration Documents"],
  "Related Parties and Declarations":          ["Related Party Transactions","Conflict of Interest Declarations","Board Member Declarations","Management Declarations","Related Party Confirmations"],
  "Audit Evidence":                            ["Audit Requests","Management Responses","Audit Reports","Management Letters","Corrective Action Plans","Internal Audit Reports","Review Working Papers"],
  "IT and System Evidence":                    ["Access Logs","Audit Trail Exports","Backup Reports","System Reports","User Access Records"],
  "Other Supporting Documents":                ["Emails","Approval Letters","Correspondence","Miscellaneous"],
} as const;

export type NGOEvidenceCategory = keyof typeof NGO_EVIDENCE_CATEGORIES;
export type NGOEvidenceDocType  = string;

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
  budgetLine: string;
  donor?: string;
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
  donor?: string;
  category: NGOFlagCategory;
  severity: FlagSeverity;
  notes: string;
  flaggedBy: string;
  flaggedAt: string;
  resolvedAt?: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface NGONotification {
  id: string;
  flagId: string;
  transactionId: string;
  projectName: string;
  donor?: string;
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

