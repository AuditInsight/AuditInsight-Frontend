// Mirrors EvidenceFolderValidator.java in the backend
// Keep these values in sync if the backend list changes
// Last verified: 2026-08-24

export interface EvidenceFolder {
  folder: string;
  subfolders: string[];
}

export type OrganisationType = 'PRIVATE' | 'NGO';

export const EVIDENCE_FOLDERS: Record<OrganisationType, EvidenceFolder[]> = {
  PRIVATE: [
    { folder: "Financial Reporting", subfolders: ["General Ledgers", "Trial Balances", "Financial Statements", "Management Accounts", "Journal Entries", "Journal Vouchers", "Supporting Schedules", "Monthly Financial Reports"] },
    { folder: "Banking and Cash", subfolders: ["Bank Statements", "Bank Reconciliations", "Cashbooks", "Petty Cash Records", "Cash Count Sheets", "Payment Confirmations", "Cheque Copies"] },
    { folder: "Sales and Revenue", subfolders: ["Sales Invoices", "Receipts", "Credit Notes", "Sales Orders", "Customer Contracts", "Delivery Notes"] },
    { folder: "Purchases and Procurement", subfolders: ["Purchase Requisitions", "Purchase Orders", "Supplier Quotations", "Supplier Invoices", "Goods Received Notes", "Supplier Contracts"] },
    { folder: "Accounts Receivable and Payable", subfolders: ["Customer Statements", "Supplier Statements", "Accounts Receivable Aging", "Accounts Payable Aging", "Customer Confirmations", "Supplier Confirmations", "Receivables Reconciliations", "Payables Reconciliations", "Bad Debt Provisions"] },
    { folder: "Payment Evidence", subfolders: ["Payment Vouchers", "Payment Requests", "Payment Approval Forms", "Electronic Transfer Confirmations", "Mobile Money Confirmations", "Cheque Copies", "Payment Schedules"] },
    { folder: "Payroll and HR", subfolders: ["Payroll Registers", "Employment Contracts", "Timesheets", "Leave Records", "Staff Lists", "PAYE Records", "RSSB Contributions"] },
    { folder: "Tax and Compliance", subfolders: ["VAT Returns", "PAYE Filings", "Corporate Income Tax Returns", "Withholding Tax Records", "Tax Clearance Certificates", "Tax Assessments", "RRA Correspondence"] },
    { folder: "Inventory and Assets", subfolders: ["Inventory Registers", "Stock Count Sheets", "Goods Received Notes", "Asset Registers", "Asset Purchase Documents", "Asset Disposal Documents", "Depreciation Schedules", "Physical Verification Reports"] },
    { folder: "Loans and Financing", subfolders: ["Loan Agreements", "Bank Loan Statements", "Loan Repayment Schedules", "Interest Schedules", "Guarantees and Securities", "Shareholder Loan Agreements", "Financing Correspondence"] },
    { folder: "Legal and Governance", subfolders: ["Company Registration Documents", "Shareholder Documents", "Board Minutes", "Management Meeting Minutes", "Company Policies", "Contracts", "Licenses and Permits", "Insurance Documents"] },
    { folder: "IT and System Evidence", subfolders: ["Access Logs", "Audit Trail Exports", "Backup Reports", "System Reports", "User Access Records"] },
    { folder: "Audit and Review", subfolders: ["Audit Requests", "Audit Reports", "Management Letters", "Management Responses", "Corrective Action Plans", "Internal Audit Reports", "Review Working Papers"] },
    { folder: "Other Supporting Documents", subfolders: ["Emails", "Screenshots", "Approval Documents", "Correspondence", "Miscellaneous"] },
  ],
  NGO: [
    { folder: "Financial Reporting", subfolders: ["General Ledgers", "Trial Balances", "Financial Statements", "Project Financial Reports", "Donor Financial Reports", "Management Accounts", "Journal Entries", "Supporting Schedules"] },
    { folder: "Budget Management", subfolders: ["Approved Annual Budget", "Project Budgets", "Grant Budgets", "Budget Revisions", "Budget vs Actual Reports", "Budget Approval Minutes"] },
    { folder: "Banking and Cash", subfolders: ["Bank Statements", "Bank Reconciliations", "Payment Confirmations", "Cashbooks", "Cash Count Sheets", "Petty Cash Vouchers", "Cheque Copies"] },
    { folder: "Payment Evidence", subfolders: ["Payment Vouchers", "Signed Payment Requests", "Electronic Transfer Confirmations", "Cheque Copies", "Mobile Money Confirmations", "Payment Approval Forms", "Payment Schedules"] },
    { folder: "Receivables, Payables and Advances", subfolders: ["Accounts Receivable Aging", "Accounts Payable Aging", "Customer and Debtor Statements", "Supplier Statements", "Receivables Reconciliations", "Payables Reconciliations", "Staff Advances", "Staff Advance Liquidations", "Partner Advances", "Advance Reconciliations", "Balance Confirmations"] },
    { folder: "Grants and Donor Agreements", subfolders: ["Grant Agreements", "Funding Agreements", "Donor Contracts", "Grant Amendments", "Donor Correspondence"] },
    { folder: "Grant and Donor Reconciliations", subfolders: ["Grant Reconciliations", "Donor Fund Balances", "Restricted Fund Schedules", "Unrestricted Fund Schedules", "Grant Expenditure Schedules", "Grant Advance Reconciliations", "Budget vs Actual Reconciliations"] },
    { folder: "Donor Compliance", subfolders: ["Donor Guidelines", "Reporting Requirements", "Compliance Checklists", "Donor Approvals", "Waivers", "Donor Monitoring Reports"] },
    { folder: "Implementing Partners and Sub-Grants", subfolders: ["Partner Agreements", "Sub-Grant Agreements", "Partner Budgets", "Partner Financial Reports", "Partner Narrative Reports", "Partner Monitoring Reports", "Partner Due Diligence Assessments", "Partner Audit Reports", "Partner Advance Reports", "Partner Liquidation Reports"] },
    { folder: "Project Documentation", subfolders: ["Project Proposals", "Work Plans", "Activity Reports", "Project Completion Reports", "Monitoring Reports"] },
    { folder: "Project Activities", subfolders: ["Training Reports", "Workshop Reports", "Workshop Agendas", "Workshop Attendance Lists", "Signed Attendance Sheets", "Meeting Minutes", "Evaluation Forms", "Photographs"] },
    { folder: "Beneficiary Documentation", subfolders: ["Beneficiary Lists", "Beneficiary Registration Forms", "Beneficiary IDs", "Distribution Lists", "Acknowledgement Receipts", "Consent Forms"] },
    { folder: "Procurement", subfolders: ["Purchase Requisitions", "Procurement Plans", "Purchase Orders", "Supplier Quotations", "Tender Documents", "Bid Opening Minutes", "Bid Evaluation Reports", "Supplier Selection Approvals", "Supplier Invoices", "Goods Received Notes", "Delivery Notes", "Supplier Contracts", "Procurement Waivers"] },
    { folder: "Payroll and HR", subfolders: ["Payroll Registers", "Employment Contracts", "Timesheets", "Leave Records", "Staff Lists", "Performance Contracts", "PAYE Records", "RSSB Contributions", "Salary Approval Letters", "Employee Expense Claims", "HR Policies"] },
    { folder: "Travel", subfolders: ["Travel Authorizations", "Travel Expense Claims", "Flight Tickets", "Hotel Invoices", "Travel Reports", "Boarding Passes"] },
    { folder: "Vehicles", subfolders: ["Vehicle Logbooks", "Fuel Records", "Vehicle Maintenance Records", "Vehicle Insurance", "Vehicle Allocation Records"] },
    { folder: "Fixed Assets", subfolders: ["Asset Register", "Asset Tags", "Purchase Documents", "Asset Transfer Forms", "Asset Disposal Forms", "Physical Verification Reports", "Maintenance Records", "Depreciation Schedules"] },
    { folder: "Inventory and Distributions", subfolders: ["Inventory Registers", "Stock Count Sheets", "Goods Received Notes", "Warehouse Records", "Stock Movement Reports", "Distribution Plans", "Distribution Lists", "Beneficiary Acknowledgement Receipts", "Damaged and Expired Stock Reports"] },
    { folder: "Internal Controls and Risk Management", subfolders: ["Internal Control Policies", "Risk Registers", "Risk Assessments", "Internal Audit Reports", "Internal Audit Plans", "Fraud Reports", "Whistleblowing Reports", "Conflict of Interest Declarations", "Control Self-Assessments"] },
    { folder: "Insurance and Liabilities", subfolders: ["Insurance Policies", "Insurance Claims", "Lease Agreements", "Legal Claims", "Provisions", "Contingent Liabilities", "Guarantees and Commitments"] },
    { folder: "Compliance and Tax", subfolders: ["VAT Documents", "PAYE Filings", "RSSB Contributions", "Tax Clearance Certificates", "NGO Registration Certificates"] },
    { folder: "Legal and Governance", subfolders: ["Board Minutes", "Management Meeting Minutes", "Policies", "Memorandums of Understanding", "Contracts", "Registration Documents"] },
    { folder: "Related Parties and Declarations", subfolders: ["Related Party Transactions", "Conflict of Interest Declarations", "Board Member Declarations", "Management Declarations", "Related Party Confirmations"] },
    { folder: "Audit Evidence", subfolders: ["Audit Requests", "Management Responses", "Audit Reports", "Management Letters", "Corrective Action Plans", "Internal Audit Reports", "Review Working Papers"] },
    { folder: "IT and System Evidence", subfolders: ["Access Logs", "Audit Trail Exports", "Backup Reports", "System Reports", "User Access Records"] },
    { folder: "Other Supporting Documents", subfolders: ["Emails", "Approval Letters", "Correspondence", "Miscellaneous"] },
  ],
};
