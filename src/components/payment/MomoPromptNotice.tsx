import { Smartphone } from "lucide-react";
import { formatRwf } from "@/types/billing";

/**
 * MTN Rwanda's approval prompt is worded by MTN as a withdrawal ("Kwemeza kubikuza…") and can't be changed
 * from our side, so customers are told up front that this prompt is their AuditInsight payment. The USSD
 * shortcode lets them find and approve the pending request when the push prompt doesn't arrive.
 */
export const MTN_RWA_PENDING_APPROVAL_USSD = "*182*7*1#";

export default function MomoPromptNotice({ amount }: { amount?: number }) {
  return (
    <div style={box}>
      <div style={titleRow}>
        <Smartphone size={15} color="#a16207" />
        <span>Check your phone</span>
      </div>
      <p style={text}>
        MTN will send a prompt that says <strong>&ldquo;Kwemeza kubikuza…&rdquo;</strong>. This is your payment
        {amount !== undefined ? <> of <strong>{formatRwf(amount)}</strong></> : null} to{" "}
        <strong>AuditInsight</strong>. Enter your MoMo PIN to approve it.
      </p>
      <p style={{ ...text, marginBottom: 0 }}>
        Didn&apos;t get the prompt? Dial{" "}
        <a href={`tel:${encodeURIComponent(MTN_RWA_PENDING_APPROVAL_USSD)}`} style={code}>
          {MTN_RWA_PENDING_APPROVAL_USSD}
        </a>{" "}
        to approve it.
      </p>
    </div>
  );
}

const box: React.CSSProperties = {
  background: "#fefce8",
  border: "1px solid #fde68a",
  borderRadius: 12,
  padding: "12px 14px",
  textAlign: "left",
  width: "100%",
  maxWidth: 380,
};

const titleRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 13, fontWeight: 700, color: "#854d0e", marginBottom: 6,
};

const text: React.CSSProperties = {
  fontSize: 13, color: "#713f12", lineHeight: 1.55, margin: "0 0 6px",
};

const code: React.CSSProperties = {
  fontFamily: "monospace", fontWeight: 700, color: "#854d0e",
  background: "#fef3c7", padding: "1px 6px", borderRadius: 6, textDecoration: "none",
};
