// All predefined evidence categories and subcategories for MSE (PRIVATE)
// Mirrors EVIDENCE_FOLDERS.PRIVATE in src/constants/evidenceFolders.ts
// Used to ensure complete folder structure is always shown in sidebar

export interface EvidenceCategory {
  title: string;
  items: string[];
}

export const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  {
    title: "Financial Reporting",
    items: ["General Ledgers", "Trial Balances", "Financial Statements"],
  },
  {
    title: "Banking and Cash",
    items: ["Bank Statements", "Bank Reconciliations", "Payment Confirmations"],
  },
  {
    title: "Sales Evidence",
    items: ["Sales Invoices", "Receipts", "Credit Notes", "Sales Orders"],
  },
  {
    title: "Purchases and Procurement",
    items: ["Purchase Orders", "Supplier Invoices", "Goods Received Notes", "Supplier Contracts"],
  },
  {
    title: "Payroll and HR",
    items: ["Payroll Registers", "Employment Contracts", "Timesheets"],
  },
  {
    title: "Tax and Compliance",
    items: ["VAT Returns", "PAYE Filings", "Tax Clearance Certificates"],
  },
  {
    title: "Inventory and Assets",
    items: ["Stock Count Sheets", "Asset Registers", "Depreciation Schedules"],
  },
  {
    title: "Legal and Governance",
    items: ["Board Minutes", "Company Registration", "Contracts"],
  },
  {
    title: "IT and System Evidence",
    items: ["Access Logs", "Audit Trail Exports", "Backup Reports"],
  },
  {
    title: "Other Supporting Documents",
    items: ["Emails", "Screenshots", "Miscellaneous"],
  },
];
