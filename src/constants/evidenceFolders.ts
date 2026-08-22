// Mirrors EvidenceFolderValidator.java in the backend
// Keep these values in sync if the backend list changes
// Last verified: 2026-08-21

export interface EvidenceFolder {
  folder: string;
  subfolders: string[];
}

export type OrganisationType = 'PRIVATE' | 'NGO';

export const EVIDENCE_FOLDERS: Record<OrganisationType, EvidenceFolder[]> = {
  PRIVATE: [
    { folder: "Financial Reporting", subfolders: ["General Ledgers", "Trial Balances", "Financial Statements"] },
    { folder: "Banking and Cash", subfolders: ["Bank Statements", "Bank Reconciliations", "Payment Confirmations"] },
    { folder: "Sales Evidence", subfolders: ["Sales Invoices", "Receipts", "Credit Notes", "Sales Orders"] },
    { folder: "Purchases and Procurement", subfolders: ["Purchase Orders", "Supplier Invoices", "Goods Received Notes", "Supplier Contracts"] },
    { folder: "Payroll and HR", subfolders: ["Payroll Registers", "Employment Contracts", "Timesheets"] },
    { folder: "Tax and Compliance", subfolders: ["VAT Returns", "PAYE Filings", "Tax Clearance Certificates"] },
    { folder: "Inventory and Assets", subfolders: ["Stock Count Sheets", "Asset Registers", "Depreciation Schedules"] },
    { folder: "Legal and Governance", subfolders: ["Board Minutes", "Company Registration", "Contracts"] },
    { folder: "IT and System Evidence", subfolders: ["Access Logs", "Audit Trail Exports", "Backup Reports"] },
    { folder: "Other Supporting Documents", subfolders: ["Emails", "Screenshots", "Miscellaneous"] },
  ],
  NGO: [
    { folder: "Financial Reporting", subfolders: ["General Ledgers", "Trial Balances", "Financial Statements", "Project Financial Reports", "Donor Financial Reports"] },
    { folder: "Budget Management", subfolders: ["Approved Annual Budget", "Project Budgets", "Grant Budgets", "Budget Revisions", "Budget vs Actual Reports", "Budget Approval Minutes"] },
    { folder: "Banking and Cash", subfolders: ["Bank Statements", "Bank Reconciliations", "Payment Confirmations", "Cashbooks", "Cash Count Sheets", "Petty Cash Vouchers"] },
    { folder: "Payment Evidence", subfolders: ["Payment Vouchers", "Signed Payment Requests", "Electronic Transfer Confirmations", "Cheque Copies", "Mobile Money Confirmations", "Payment Approval Forms"] },
    { folder: "Grants and Donor Agreements", subfolders: ["Grant Agreements", "Funding Agreements", "Donor Contracts", "Grant Amendments", "Donor Correspondence"] },
    { folder: "Donor Compliance", subfolders: ["Donor Guidelines", "Reporting Requirements", "Compliance Checklists", "Donor Approvals", "Waivers", "Donor Monitoring Reports"] },
    { folder: "Project Documentation", subfolders: ["Project Proposals", "Work Plans", "Activity Reports", "Project Completion Reports", "Monitoring Reports"] },
    { folder: "Project Activities", subfolders: ["Training Reports", "Workshop Reports", "Workshop Agendas", "Workshop Attendance Lists", "Signed Attendance Sheets", "Meeting Minutes", "Evaluation Forms", "Photographs"] },
    { folder: "Beneficiary Documentation", subfolders: ["Beneficiary Lists", "Beneficiary Registration Forms", "Beneficiary IDs", "Distribution Lists", "Acknowledgement Receipts", "Consent Forms"] },
    { folder: "Procurement", subfolders: ["Purchase Requisitions", "Purchase Orders", "Supplier Quotations", "Bid Evaluation Reports", "Supplier Invoices", "Goods Received Notes", "Supplier Contracts"] },
    { folder: "Payroll and HR", subfolders: ["Payroll Registers", "Employment Contracts", "Timesheets", "Leave Records", "Staff Lists", "Performance Contracts"] },
    { folder: "Travel", subfolders: ["Travel Authorizations", "Travel Expense Claims", "Flight Tickets", "Hotel Invoices"] },
    { folder: "Vehicles", subfolders: ["Vehicle Logbooks", "Fuel Records", "Vehicle Maintenance Records", "Vehicle Insurance", "Vehicle Allocation Records"] },
    { folder: "Fixed Assets", subfolders: ["Asset Register", "Asset Tags", "Purchase Documents", "Asset Transfer Forms", "Asset Disposal Forms", "Physical Verification Reports", "Maintenance Records", "Depreciation Schedules"] },
    { folder: "Inventory", subfolders: ["Inventory Registers", "Stock Count Sheets"] },
    { folder: "Compliance and Tax", subfolders: ["VAT Documents", "PAYE Filings", "RSSB Contributions", "Tax Clearance Certificates", "NGO Registration Certificates"] },
    { folder: "Legal and Governance", subfolders: ["Board Minutes", "Management Meeting Minutes", "Policies", "Memorandums of Understanding", "Contracts", "Registration Documents"] },
    { folder: "Audit Evidence", subfolders: ["Audit Requests", "Management Responses", "Audit Reports", "Management Letters", "Corrective Action Plans"] },
    { folder: "IT and System Evidence", subfolders: ["Access Logs", "Audit Trail Exports", "Backup Reports"] },
    { folder: "Other Supporting Documents", subfolders: ["Emails", "Approval Letters", "Miscellaneous"] },
  ],
};
