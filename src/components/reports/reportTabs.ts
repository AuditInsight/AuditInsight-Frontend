export const REPORT_TABS = [
  "Audit Readiness Report",
  "Evidence Completeness Report",
  "High-Risk Transactions",
  "Compliance Exposure",
  "Fraud & Duplicate Alerts",
  "Internal Audit Findings",
] as const;

export type ReportTabId = (typeof REPORT_TABS)[number];

export const DEFAULT_REPORT_TAB: ReportTabId = "Audit Readiness Report";
