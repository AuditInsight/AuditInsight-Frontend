import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { ReviewItem } from "@/lib/reviewEngine";

function escapeCsv(value: unknown): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(headers: string[], rows: unknown[][]): string {
  return [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");
}

export function downloadFile(filename: string, content: string, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function datedFilename(prefix: string, ext: string) {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.${ext}`;
}

export function exportTransactionsCSV(transactions: Transaction[], filename?: string) {
  const csv = rowsToCsv(
    ["ID", "Date", "Name", "Counterparty", "Amount", "Type", "Status", "Evidence Status", "Risk Score"],
    transactions.map((t) => [
      t.id,
      t.date,
      t.name,
      t.counterparty,
      t.amount,
      t.type,
      t.status,
      t.evidenceStatus,
      t.riskScore ?? "",
    ])
  );
  downloadFile(filename ?? datedFilename("transactions", "csv"), csv);
}

export function exportEvidenceCSV(documents: Evidence[], filename?: string) {
  const csv = rowsToCsv(
    ["ID", "Document", "Category", "Subcategory", "Transaction", "Status", "Uploaded At", "Notes"],
    documents.map((e) => [
      e.id,
      e.documentName ?? e.name,
      e.category,
      e.subCategory ?? e.subfolder,
      e.transactionId,
      e.status,
      e.uploadedAt ?? "",
      e.notes ?? "",
    ])
  );
  downloadFile(filename ?? datedFilename("evidence", "csv"), csv);
}

export function exportReviewQueueCSV(items: ReviewItem[], filename?: string) {
  const csv = rowsToCsv(
    ["ID", "Type", "Transaction", "Counterparty", "Amount", "Severity", "Status", "Due"],
    items.map((r) => [
      r.id,
      r.type,
      r.transactionId,
      r.counterparty ?? "",
      r.amount ?? "",
      r.severity ?? r.risk,
      r.status,
      r.due ?? "",
    ])
  );
  downloadFile(filename ?? datedFilename("review-queue", "csv"), csv);
}

export interface DashboardExportTable {
  title: string;
  headers: string[];
  rows: unknown[][];
}

export function exportDashboardCSV(options: {
  role: string;
  userName: string;
  orgName?: string;
  metrics: { label: string; value: string | number }[];
  tables?: DashboardExportTable[];
  filename?: string;
}) {
  const lines = [
    "AuditInsight Dashboard Export",
    `Generated,${new Date().toLocaleString()}`,
    `Role,${escapeCsv(options.role)}`,
    `User,${escapeCsv(options.userName)}`,
    ...(options.orgName ? [`Organisation,${escapeCsv(options.orgName)}`] : []),
    "",
    "Summary Metrics",
    "Metric,Value",
    ...options.metrics.map((m) => `${escapeCsv(m.label)},${escapeCsv(m.value)}`),
  ];

  for (const table of options.tables ?? []) {
    lines.push("", table.title, rowsToCsv(table.headers, table.rows));
  }

  downloadFile(
    options.filename ?? datedFilename("dashboard", "csv"),
    lines.join("\n")
  );
}

export function printHtmlReport(title: string, bodyHtml: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111}
      h1{color:#0f172a;margin-bottom:4px;font-size:22px}
      p{margin:0 0 16px;color:#64748b;font-size:13px}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px}
      th{background:#f8fafc;font-weight:600;color:#374151}
    </style></head><body>${bodyHtml}</body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function exportReportsCSV(
  rows: ReviewItem[],
  options: { severity: string; dateFrom?: string; dateTo?: string; transactionsCount?: number }
) {
  exportReviewQueueCSV(rows, datedFilename("audit-report", "csv"));
}

export function exportReportsPDF(
  rows: ReviewItem[],
  options: { severity: string; dateFrom?: string; dateTo?: string; transactionsCount?: number }
) {
  const { severity, dateFrom = "", dateTo = "", transactionsCount = 0 } = options;
  const criticals = rows.filter((r) => r.risk === "Critical").length;
  const filterLabel = `Severity: ${severity}${dateFrom ? ` | From: ${dateFrom}` : ""}${dateTo ? ` | To: ${dateTo}` : ""}`;
  const rowsHtml = rows.map((r) =>
    `<tr>
      <td>${escapeCsv(r.transactionId)}</td>
      <td>${escapeCsv(r.counterparty ?? "")}</td>
      <td>${escapeCsv(r.amount ?? "")}</td>
      <td>${escapeCsv(r.risk)}</td>
      <td>${escapeCsv(r.type)}</td>
      <td>${escapeCsv(r.status)}</td>
      <td>${escapeCsv(r.due ?? "")}</td>
    </tr>`
  ).join("");

  printHtmlReport(
    "AuditInsight Compliance Report",
    `<h1>AuditInsight — Compliance Report</h1>
    <p>Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; ${filterLabel}</p>
    <p><strong>Total Transactions:</strong> ${transactionsCount} &nbsp;|&nbsp;
    <strong>Flagged Issues:</strong> ${rows.length} &nbsp;|&nbsp;
    <strong>Critical:</strong> ${criticals}</p>
    <table><thead><tr>
      <th>Transaction</th><th>Counterparty</th><th>Amount</th>
      <th>Severity</th><th>Type</th><th>Status</th><th>Due</th>
    </tr></thead><tbody>${rowsHtml}</tbody></table>`
  );
}
