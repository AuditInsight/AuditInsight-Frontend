import type { PaymentLedgerTotal, AdminPaymentStatus } from "@/api/admin";
import { formatMoney } from "./paymentFormat";

interface Props {
  totals: PaymentLedgerTotal[];
}

/** Money received and payment counts for the current filters. */
export default function PaymentTotals({ totals }: Props) {
  const count = (status: AdminPaymentStatus) =>
    totals.filter((t) => t.status === status).reduce((n, t) => n + Number(t.payments), 0);

  // Money received per currency from paid payments, and separately from underpaid ones (received but no access given).
  const receivedBy = (status: AdminPaymentStatus) =>
    totals
      .filter((t) => t.status === status && Number(t.received) > 0)
      .map((t) => formatMoney(Number(t.received), t.currency));

  const paidMoney = receivedBy("SUCCESSFUL");
  const underpaidMoney = receivedBy("UNDERPAID");

  const cards = [
    { label: "Money received (paid)", value: paidMoney.length ? paidMoney.join(" · ") : "RWF 0", color: "#15803d", wide: true },
    { label: "Paid", value: count("SUCCESSFUL"), color: "#15803d" },
    { label: "Waiting for approval", value: count("PENDING"), color: "#0369a1" },
    { label: "Failed", value: count("FAILED"), color: "#b91c1c" },
    { label: "Expired", value: count("EXPIRED") + count("CANCELLED"), color: "#475569" },
    { label: "Underpaid", value: count("UNDERPAID"), color: "#92400e" },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={grid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...card, ...(c.wide ? { gridColumn: "span 2" } : {}) }}>
            <span style={{ fontSize: c.wide ? 22 : 26, fontWeight: 800, color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{c.label}</span>
          </div>
        ))}
      </div>
      {underpaidMoney.length > 0 && (
        <p style={note}>
          Underpaid payments brought in {underpaidMoney.join(" · ")} but gave no access. Those customers need a refund
          or to pay the difference.
        </p>
      )}
    </div>
  );
}

const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", minWidth: 0 };
const note: React.CSSProperties = { margin: "10px 0 0", fontSize: 13, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px" };
