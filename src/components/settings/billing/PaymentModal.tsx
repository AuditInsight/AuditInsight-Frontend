"use client";

import { useState } from "react";
import { PlanTier, BillingCycle, PRICING_PLANS } from "@/types/billing";

interface Props {
  open: boolean;
  plan: PlanTier;
  cycle: BillingCycle;
  onClose: () => void;
  onSuccess: () => void;
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function PaymentModal({ open, plan, cycle, onClose, onSuccess }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planInfo = PRICING_PLANS.find(p => p.id === plan)!;
  const amount = cycle === "monthly" ? planInfo.monthlyPrice : planInfo.annualPrice;

  if (!open) return null;

  const handlePay = async () => {
    setError("");
    const rawCard = cardNumber.replace(/\s/g, "");
    if (!name.trim()) { setError("Cardholder name is required."); return; }
    if (rawCard.length !== 16) { setError("Enter a valid 16-digit card number."); return; }
    if (expiry.length !== 5) { setError("Enter a valid expiry date (MM/YY)."); return; }
    if (cvv.length < 3) { setError("Enter a valid CVV."); return; }

    setLoading(true);
    // MOCK: simulate payment processing
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSuccess();
  };

  const cardBrand = cardNumber.startsWith("4") ? "VISA"
    : cardNumber.startsWith("5") ? "MC"
    : cardNumber.startsWith("3") ? "AMEX" : "";

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <h3 style={s.title}>Complete Payment</h3>
            <p style={s.sub}>{planInfo.name} Plan · {cycle === "monthly" ? "Monthly" : "Annual"} billing</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.amountBox}>
          <span style={s.amountLabel}>Total due today</span>
          <span style={s.amountValue}>${amount}<span style={s.perPeriod}>/{cycle === "monthly" ? "mo" : "yr"}</span></span>
        </div>

        {error && <div style={s.errBanner}>{error}</div>}

        <div style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Cardholder name</label>
            <input style={s.input} placeholder="Full name on card" value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
              onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.label}>Card number</label>
            <div style={s.cardInputWrap}>
              <input style={{ ...s.input, paddingRight: 60 }} placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
              />
              {cardBrand && <span style={s.cardBrand}>{cardBrand}</span>}
            </div>
          </div>

          <div style={s.row}>
            <div style={{ ...s.fieldGroup, flex: 1 }}>
              <label style={s.label}>Expiry date</label>
              <input style={s.input} placeholder="MM/YY" value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
              />
            </div>
            <div style={{ ...s.fieldGroup, flex: 1 }}>
              <label style={s.label}>CVV</label>
              <input style={s.input} placeholder="•••" maxLength={4} value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
                type="password"
              />
            </div>
          </div>
        </div>

        <div style={s.secureNote}>
          <span>🔒</span>
          <span>Your payment info is encrypted and secure. We never store raw card data.</span>
        </div>

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
          <button style={{ ...s.payBtn, opacity: loading ? 0.7 : 1 }} onClick={handlePay} disabled={loading}>
            {loading ? "Processing…" : `Pay $${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" },
  header: { padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub: { fontSize: 13, color: "#64748B", margin: "4px 0 0" },
  closeBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94A3B8", padding: 4, lineHeight: 1 },
  amountBox: { margin: "18px 24px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  amountLabel: { fontSize: 13, color: "#64748B", fontWeight: 500 },
  amountValue: { fontSize: 24, fontWeight: 800, color: "#0F172A" },
  perPeriod: { fontSize: 13, color: "#94A3B8", fontWeight: 400 },
  errBanner: { margin: "0 24px 12px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13 },
  form: { padding: "0 24px", display: "flex", flexDirection: "column", gap: 0 },
  fieldGroup: { marginBottom: 14 },
  row: { display: "flex", gap: 12 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" },
  cardInputWrap: { position: "relative" },
  cardBrand: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#1e3a8a", background: "#EFF6FF", padding: "2px 7px", borderRadius: 5 },
  secureNote: { margin: "12px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8" },
  actions: { padding: "16px 24px 24px", display: "flex", gap: 10 },
  cancelBtn: { flex: "0 0 auto", padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  payBtn: { flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
};
