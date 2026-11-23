import type { AdminPaymentStatus } from "@/api/admin";
import { STATUS_COLORS, STATUS_LABEL } from "./paymentFormat";

export default function PaymentStatusBadge({ status }: { status: AdminPaymentStatus }) {
  const colors = STATUS_COLORS[status] ?? { bg: "#f1f5f9", fg: "#475569" };
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
