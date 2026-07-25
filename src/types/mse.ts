export const MSE_EVIDENCE_SECTIONS = [
  {
    title: "Purchases & Procurement",
    items: [
      "Supplier invoices",
      "Purchase orders",
      "Supplier contracts",
      "Goods received notes",
    ],
  },
  {
    title: "Banking & Cash",
    items: [
      "Payment confirmations",
      "Bank statements",
      "Bank reconciliations",
      "Cashbooks",
    ],
  },
  {
    title: "Payroll & HR",
    items: [
      "Payroll registers",
      "Employment contracts",
      "Timesheets",
    ],
  },
  {
    title: "Legal & Governance",
    items: [
      "Contracts & agreements",
      "Regulatory correspondence",
      "Audit reports",
    ],
  },
  {
    title: "Financial Reporting",
    items: [
      "Financial statements",
      "Budget reports",
      "Audit trails",
    ],
  },
] as const;

export type MSEEvidenceSection = typeof MSE_EVIDENCE_SECTIONS[number];
export type MSEEvidenceCategory = MSEEvidenceSection["title"];
export type MSEEvidenceSubcategory = MSEEvidenceSection["items"][number];
