import type { AdminPaymentResponse } from "@/api/admin";
import { PROVIDER_LABEL, formatDateTime, formatMoney, formatPhone, receivedAmount } from "./paymentFormat";

/** Everything support needs to trace one payment with the provider or the customer. */
export default function PaymentDetails({ payment: p }: { payment: AdminPaymentResponse }) {
  const referenceLabel = p.provider === "MOMO" ? "MTN transaction ID" : "Flutterwave reference";
  const rows: [string, string][] = [
    ["Payment ID", p.id],
    [referenceLabel, p.providerReference ?? (p.provider === "MOMO" ? "Not reported by MTN yet" : "—")],
    ["Method", PROVIDER_LABEL[p.provider] ?? p.provider],
    ...(p.provider === "MOMO" ? ([["Number charged", formatPhone(p.payerPhone)]] as [string, string][]) : []),
    ["Paid by", [p.payerName, p.payerEmail].filter(Boolean).join(" — ") || "—"],
    ["Price", formatMoney(p.expectedAmount, p.currency)],
    ["Received", receivedAmount(p)],
    ["Started", formatDateTime(p.createdAt)],
    ["Settled", formatDateTime(p.resolvedAt)],
    ["Paid period", p.subscriptionId ? "Created" : p.status === "SUCCESSFUL" ? "Not linked — check the organisation" : "None"],
  ];

  return (
    <div style={wrap}>
      <dl style={grid}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ minWidth: 0 }}>
            <dt style={dt}>{k}</dt>
            <dd style={dd}>{v}</dd>
          </div>
        ))}
      </dl>
      {p.failureReason && (
        <p style={reason}>
          <strong>Why it did not go through: </strong>
          {p.failureReason}
        </p>
      )}
    </div>
  );
}

const wrap: React.CSSProperties = { padding: "14px 16px", background: "#f8fafc" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px 20px", margin: 0 };
const dt: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.3 };
const dd: React.CSSProperties = { margin: "2px 0 0", fontSize: 13, color: "#111827", wordBreak: "break-all" };
const reason: React.CSSProperties = { margin: "12px 0 0", fontSize: 13, color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px" };
