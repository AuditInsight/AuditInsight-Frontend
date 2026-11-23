"use client";

import Link from "next/link";
import type { AdminPaymentResponse } from "@/api/admin";
import PaymentStatusBadge from "./PaymentStatusBadge";
import {
  PLAN_LABEL,
  PROVIDER_LABEL,
  formatDateTime,
  formatMoney,
  formatPhone,
  receivedAmount,
} from "./paymentFormat";

interface Props {
  payments: AdminPaymentResponse[];
}

/** Every payment with who paid, for which organisation, how, how much, and when it started and settled. */
export default function PaymentsTable({ payments }: Props) {
  return (
    <div style={tableWrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            <th style={th}>Started</th>
            <th style={th}>Organisation</th>
            <th style={th}>Paid by</th>
            <th style={th}>Method</th>
            <th style={th}>Plan</th>
            <th style={th}>Status</th>
            <th style={{ ...th, textAlign: "right" }}>Price</th>
            <th style={{ ...th, textAlign: "right" }}>Received</th>
            <th style={th}>Settled</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} style={row}>
              <td style={{ ...td, whiteSpace: "nowrap" }}>{formatDateTime(p.createdAt)}</td>
              <td style={td}>
                <Link href={`/admin/organizations/${p.organisationId}`} style={link}>
                  {p.organisationName ?? "Unknown organisation"}
                </Link>
              </td>
              <td style={td}>
                <div style={{ fontWeight: 600 }}>{p.payerName || "—"}</div>
                {p.payerEmail && <div style={muted}>{p.payerEmail}</div>}
              </td>
              <td style={td}>
                <div>{PROVIDER_LABEL[p.provider] ?? p.provider}</div>
                {p.provider === "MOMO" && <div style={muted}>{formatPhone(p.payerPhone)}</div>}
              </td>
              <td style={td}>{PLAN_LABEL[p.subscriptionType] ?? p.subscriptionType}</td>
              <td style={td}>
                <PaymentStatusBadge status={p.status} />
              </td>
              <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>{formatMoney(p.expectedAmount, p.currency)}</td>
              <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap", fontWeight: 700 }}>{receivedAmount(p)}</td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>{formatDateTime(p.resolvedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && <p style={emptyState}>No payments match these filters.</p>}
    </div>
  );
}

const tableWrap: React.CSSProperties = { overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc" };
const th: React.CSSProperties = { padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9" };
const td: React.CSSProperties = { padding: "12px 14px", color: "#1f2937", verticalAlign: "top" };
const muted: React.CSSProperties = { fontSize: 12, color: "#6b7280", marginTop: 2 };
const link: React.CSSProperties = { color: "#1e3a8a", fontWeight: 600, textDecoration: "none" };
const emptyState: React.CSSProperties = { textAlign: "center", padding: "32px 16px", color: "#94a3b8", fontSize: 13.5, margin: 0 };
