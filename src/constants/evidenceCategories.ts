// All predefined evidence categories and subcategories
// Used to ensure complete folder structure is always shown in sidebar

export interface EvidenceCategory {
  title: string;
  items: string[];
}

export const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  {
    title: "Banking & Cash",
    items: [
      "Bank statements",
      "Payment confirmations",
      "Cash receipts",
      "Bank reconciliation",
    ],
  },
  {
    title: "Legal & Governance",
    items: [
      "Contracts & agreements",
      "Regulatory correspondence",
      "Board minutes",
      "Policy documents",
    ],
  },
  {
    title: "Payroll & HR",
    items: [
      "Payroll registers",
      "Employee contracts",
      "Attendance records",
      "Leave documentation",
    ],
  },
  {
    title: "Purchases & Procurement",
    items: [
      "Supplier invoices",
      "Purchase orders",
      "Quotations",
      "Goods receipt notes",
    ],
  },
  {
    title: "Financial Reporting",
    items: [
      "Monthly statements",
      "Reconciliation reports",
      "Audit reports",
      "Tax returns",
    ],
  },
  {
    title: "Project Management",
    items: [
      "Project proposals",
      "Implementation plans",
      "Monitoring reports",
      "Completion reports",
    ],
  },
];
