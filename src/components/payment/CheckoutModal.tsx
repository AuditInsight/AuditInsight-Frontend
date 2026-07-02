"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { PlanTier, BillingCycle, PRICING_PLANS } from "@/types/billing";
import StripeCardInput, { CardData } from "./StripeCardInput";
import MoMoInput from "./MoMoInput";
import { TEST_CARDS } from "./cardUtils";
import { MoMoData, TEST_PHONES, simulateMoMoPayment } from "./momoUtils";
import { Shield, CheckCircle2, XCircle, Lock, ChevronRight, CreditCard, Smartphone } from "lucide-react";

// ── Payment result ─────────────────────────────────────────────────
type PaymentState = "idle" | "processing" | "3dsecure" | "success" | "failed";

interface Props {
  open: boolean;
  plan: PlanTier;
  cycle: BillingCycle;
  onClose: () => void;
  onSuccess: (receiptId: string) => void;
}

// ── Simulate Stripe payment processing ────────────────────────────
async function simulatePayment(cardNumber: string): Promise<{ success: boolean; receiptId?: string; error?: string }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1400));

  // Check against test card outcomes
  const declined = TEST_CARDS.find(
    (c) => c.number.replace(/\s/g, "") === cardNumber && c.result === "declined"
  );
  if (declined) {
    return { success: false, error: "Your card was declined. Please try a different card." };
  }

  // All other valid cards succeed
  const receiptId = `rcpt_${Date.now().toString(36).toUpperCase()}`;
  return { success: true, receiptId };
}

type PaymentMethod = "card" | "momo";

export default function CheckoutModal({ open, plan, cycle, onClose, onSuccess }: Props) {
  const [payMethod, setPayMethod]     = useState<PaymentMethod>("card");
  const [cardData, setCardData]       = useState<CardData | null>(null);
  const [momoData, setMomoData]       = useState<MoMoData | null>(null);
  const [state, setState]             = useState<PaymentState>("idle");
  const [receiptId, setReceiptId]     = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [saveCard, setSaveCard]       = useState(true);
  const [showTestCards, setShowTestCards] = useState(false);

  const planInfo = PRICING_PLANS.find((p) => p.id === plan)!;
  const amount   = cycle === "monthly" ? planInfo.monthlyPrice : planInfo.annualPrice;
  const annualTotal = cycle === "annual" ? amount * 12 : null;

  if (!open || typeof document === "undefined") return null;

  const handlePay = async () => {
    setErrorMsg("");
    setState("processing");

    let result: { success: boolean; receiptId?: string; error?: string };

    if (payMethod === "momo") {
      if (!momoData?.isValid) return;
      result = await simulateMoMoPayment(momoData.phone);
    } else {
      if (!cardData?.isValid) return;
      // Simulate 3D Secure for amounts > $50
      if (amount > 50) {
        await new Promise((r) => setTimeout(r, 800));
        setState("3dsecure");
        await new Promise((r) => setTimeout(r, 2000));
        setState("processing");
      }
      result = await simulatePayment(cardData.number);
    }

    if (result.success) {
      setReceiptId(result.receiptId!);
      setState("success");
      setTimeout(() => onSuccess(result.receiptId!), 0);
    } else {
      setErrorMsg(result.error ?? "Payment failed.");
      setState("failed");
    }
  };

  const handleRetry = () => {
    setState("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    if (state === "processing" || state === "3dsecure") return;
    setState("idle");
    setErrorMsg("");
    setCardData(null);
    setMomoData(null);
    onClose();
  };

  const isPayReady = payMethod === "card" ? !!cardData?.isValid : !!momoData?.isValid;

  return createPortal(
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={modal}>

        {/* ── SUCCESS SCREEN ── */}
        {state === "success" && (
          <SuccessScreen
            planName={planInfo.name}
            amount={amount}
            cycle={cycle}
            receiptId={receiptId}
            onClose={handleClose}
          />
        )}

        {/* ── FAILED SCREEN ── */}
        {state === "failed" && (
          <FailedScreen error={errorMsg} onRetry={handleRetry} onClose={handleClose} />
        )}

        {/* ── 3D SECURE SCREEN ── */}
        {state === "3dsecure" && <ThreeDSecureScreen />}

        {/* ── PROCESSING SCREEN ── */}
        {state === "processing" && <ProcessingScreen />}

        {/* ── MAIN CHECKOUT ── */}
        {(state === "idle") && (
          <>
            {/* Header */}
            <div style={header}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={logoMark}>
                  <Shield size={14} color="#1e3a8a" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>AuditInsight</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Secure Checkout</div>
                </div>
              </div>
              <button style={closeBtn} onClick={handleClose} aria-label="Close">✕</button>
            </div>

            <div style={body}>
              {/* LEFT — Order summary */}
              <div style={summaryCol}>
                <div style={summaryCard}>
                  <div style={summaryTitle}>Order Summary</div>

                  <div style={planRow}>
                    <div style={planIcon}>💎</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{planInfo.name} Plan</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {cycle === "monthly" ? "Billed monthly" : "Billed annually"}
                      </div>
                    </div>
                  </div>

                  <div style={divider} />

                  {/* Line items */}
                  <div style={lineItem}>
                    <span style={lineLabel}>{planInfo.name} ({cycle})</span>
                    <span style={lineValue}>${amount}/mo</span>
                  </div>
                  {cycle === "annual" && (
                    <div style={lineItem}>
                      <span style={{ ...lineLabel, color: "#16a34a" }}>Annual discount (20%)</span>
                      <span style={{ ...lineValue, color: "#16a34a" }}>-${Math.round(planInfo.monthlyPrice * 0.2 * 12)}</span>
                    </div>
                  )}
                  <div style={lineItem}>
                    <span style={lineLabel}>Tax</span>
                    <span style={lineValue}>$0.00</span>
                  </div>

                  <div style={divider} />

                  <div style={{ ...lineItem, marginTop: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                      {cycle === "annual" ? "Total today" : "Due today"}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                      ${cycle === "annual" ? annualTotal : amount}
                    </span>
                  </div>
                  {cycle === "annual" && (
                    <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "right", marginTop: 2 }}>
                      ${amount}/mo × 12 months
                    </div>
                  )}

                  {/* Features */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Included
                    </div>
                    {planInfo.features.slice(0, 4).map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#374151", marginBottom: 6 }}>
                        <CheckCircle2 size={13} color="#16a34a" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test data hint */}
                <button
                  style={testCardsToggle}
                  onClick={() => setShowTestCards((v) => !v)}
                >
                  🧪 Test {payMethod === "card" ? "cards" : "phones"} {showTestCards ? "▲" : "▼"}
                </button>
                {showTestCards && payMethod === "card" && (
                  <div style={testCardsBox}>
                    {TEST_CARDS.map((c) => (
                      <div key={c.number} style={testCardRow}>
                        <span style={{ fontFamily: "monospace", fontSize: 12 }}>{c.number}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          color: c.result === "success" ? "#16a34a" : "#dc2626",
                          background: c.result === "success" ? "#dcfce7" : "#fee2e2",
                          padding: "2px 7px", borderRadius: 10,
                        }}>
                          {c.result}
                        </span>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                      Use any future expiry (e.g. 12/28) and any 3-digit CVV.
                    </div>
                  </div>
                )}
                {showTestCards && payMethod === "momo" && (
                  <div style={testCardsBox}>
                    {TEST_PHONES.map((t) => (
                      <div key={t.phone} style={testCardRow}>
                        <span style={{ fontFamily: "monospace", fontSize: 12 }}>{t.phone}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          color: t.result === "success" ? "#16a34a" : "#dc2626",
                          background: t.result === "success" ? "#dcfce7" : "#fee2e2",
                          padding: "2px 7px", borderRadius: 10,
                        }}>
                          {t.label.split("— ")[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — Payment form */}
              <div style={formCol}>
                <div style={formTitle}>Payment Details</div>

                {/* ── Payment method tabs ── */}
                <div style={tabsRow}>
                  <button
                    style={tabBtn(payMethod === "card")}
                    onClick={() => setPayMethod("card")}
                  >
                    <CreditCard size={14} />
                    Credit / Debit Card
                  </button>
                  <button
                    style={tabBtn(payMethod === "momo")}
                    onClick={() => setPayMethod("momo")}
                  >
                    <Smartphone size={14} />
                    Mobile Money
                  </button>
                </div>

                {payMethod === "card" ? (
                  <StripeCardInput onChange={setCardData} disabled={false} />
                ) : (
                  <MoMoInput onChange={setMomoData} disabled={false} />
                )}

                {/* Save card checkbox — card only */}
                {payMethod === "card" && (
                  <label style={saveCardRow}>
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      style={{ width: 15, height: 15, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 13, color: "#374151" }}>Save card for future payments</span>
                  </label>
                )}

                {/* Security badges */}
                <div style={securityRow}>
                  <Lock size={12} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>256-bit SSL encryption</span>
                  <span style={secBadge}>PCI DSS</span>
                  {payMethod === "card" && <span style={secBadge}>3D Secure</span>}
                  {payMethod === "momo" && <span style={secBadge}>USSD Push</span>}
                </div>

                {/* Pay button */}
                <button
                  style={{
                    ...payBtn,
                    opacity: isPayReady ? 1 : 0.5,
                    cursor: isPayReady ? "pointer" : "not-allowed",
                  }}
                  disabled={!isPayReady}
                  onClick={handlePay}
                >
                  {payMethod === "card" ? <Lock size={15} /> : <Smartphone size={15} />}
                  {payMethod === "card" ? "Pay" : "Pay with MoMo"} ${cycle === "annual" ? annualTotal : amount}
                  <ChevronRight size={15} />
                </button>

                <p style={termsText}>
                  By completing this purchase you agree to our{" "}
                  <span style={{ color: "#1e3a8a", cursor: "pointer" }}>Terms of Service</span>{" "}
                  and{" "}
                  <span style={{ color: "#1e3a8a", cursor: "pointer" }}>Privacy Policy</span>.
                  Subscriptions renew automatically. Cancel anytime.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Sub-screens ────────────────────────────────────────────────────

function ProcessingScreen() {
  return (
    <div style={centeredScreen}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={spinner} />
      <div style={screenTitle}>Processing payment…</div>
      <div style={screenSub}>Please do not close this window.</div>
    </div>
  );
}

function ThreeDSecureScreen() {
  return (
    <div style={centeredScreen}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
      <div style={screenTitle}>3D Secure Verification</div>
      <div style={screenSub}>Your bank is verifying this transaction.</div>
      <div style={{ marginTop: 20, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 24px", width: "100%", maxWidth: 320 }}>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Simulating bank authentication…</div>
        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "60%", background: "#1e3a8a", borderRadius: 3, animation: "progress 2s ease-in-out" }} />
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ planName, amount, cycle, receiptId, onClose }: {
  planName: string; amount: number; cycle: BillingCycle; receiptId: string; onClose: () => void;
}) {
  return (
    <div style={centeredScreen}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <CheckCircle2 size={36} color="#16a34a" />
      </div>
      <div style={{ ...screenTitle, color: "#15803d" }}>Payment Successful!</div>
      <div style={screenSub}>Your {planName} plan is now active.</div>

      <div style={receiptBox}>
        <div style={receiptRow}><span style={receiptLabel}>Plan</span><span style={receiptValue}>{planName}</span></div>
        <div style={receiptRow}><span style={receiptLabel}>Billing</span><span style={receiptValue}>{cycle === "monthly" ? "Monthly" : "Annual"}</span></div>
        <div style={receiptRow}><span style={receiptLabel}>Amount charged</span><span style={{ ...receiptValue, fontWeight: 700 }}>${amount}{cycle === "annual" ? " × 12" : "/mo"}</span></div>
        <div style={receiptRow}><span style={receiptLabel}>Receipt ID</span><span style={{ ...receiptValue, fontFamily: "monospace", fontSize: 12 }}>{receiptId}</span></div>
        <div style={receiptRow}><span style={receiptLabel}>Date</span><span style={receiptValue}>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></div>
      </div>

      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>
        A receipt has been sent to your email address.
      </div>

      <button style={payBtn} onClick={onClose}>
        Continue to Dashboard →
      </button>
    </div>
  );
}

function FailedScreen({ error, onRetry, onClose }: { error: string; onRetry: () => void; onClose: () => void }) {
  return (
    <div style={centeredScreen}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <XCircle size={36} color="#dc2626" />
      </div>
      <div style={{ ...screenTitle, color: "#b91c1c" }}>Payment Failed</div>
      <div style={{ ...screenSub, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", marginBottom: 24 }}>
        {error}
      </div>
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 320 }}>
        <button style={{ ...payBtn, background: "#fff", color: "#374151", border: "1.5px solid #e2e8f0", flex: "0 0 auto" }} onClick={onClose}>
          Cancel
        </button>
        <button style={{ ...payBtn, flex: 1 }} onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.60)",
  zIndex: 9000,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 20,
};

const modal: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  width: "100%",
  maxWidth: 860,
  maxHeight: "95vh",
  overflowY: "auto",
  boxShadow: "0 32px 100px rgba(0,0,0,0.30)",
};

const header: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "20px 24px",
  borderBottom: "1px solid #f1f5f9",
  position: "sticky", top: 0, background: "#fff", zIndex: 1,
};

const logoMark: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const closeBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, border: "none",
  background: "#f1f5f9", color: "#64748b", cursor: "pointer",
  fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
};

const body: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 0,
};

const summaryCol: React.CSSProperties = {
  padding: "24px 20px 24px 24px",
  borderRight: "1px solid #f1f5f9",
  background: "#fafbfc",
};

const formCol: React.CSSProperties = {
  padding: "24px 24px 24px 20px",
};

const summaryCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "18px 16px",
};

const summaryTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "#94a3b8",
  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14,
};

const planRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
};

const planIcon: React.CSSProperties = {
  fontSize: 28, lineHeight: 1,
};

const divider: React.CSSProperties = {
  height: 1, background: "#f1f5f9", margin: "12px 0",
};

const lineItem: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  marginBottom: 6,
};

const lineLabel: React.CSSProperties = { fontSize: 13, color: "#64748b" };
const lineValue: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#0f172a" };

const testCardsToggle: React.CSSProperties = {
  marginTop: 12, width: "100%", padding: "8px 12px",
  borderRadius: 8, border: "1px dashed #e2e8f0",
  background: "transparent", color: "#64748b",
  fontSize: 12, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit", textAlign: "left",
};

const testCardsBox: React.CSSProperties = {
  background: "#f8fafc", border: "1px solid #e2e8f0",
  borderRadius: 10, padding: "12px 14px", marginTop: 6,
};

const testCardRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  marginBottom: 6,
};

const formTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 14,
};

const tabsRow: React.CSSProperties = {
  display: "flex", gap: 8, marginBottom: 18,
  background: "#f1f5f9", borderRadius: 10, padding: 4,
};

const tabBtn = (active: boolean): React.CSSProperties => ({
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  padding: "8px 12px", borderRadius: 8, border: "none",
  background: active ? "#fff" : "transparent",
  color: active ? "#0f172a" : "#64748b",
  fontWeight: active ? 700 : 500,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
  transition: "all 0.15s",
});

const saveCardRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  marginTop: 14, cursor: "pointer",
};

const securityRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  marginTop: 12, marginBottom: 18,
};

const secBadge: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, background: "#f1f5f9",
  color: "#64748b", padding: "2px 7px", borderRadius: 6,
};

const payBtn: React.CSSProperties = {
  width: "100%", padding: "14px",
  borderRadius: 12, border: "none",
  background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
  color: "#fff", fontWeight: 700, fontSize: 16,
  cursor: "pointer", fontFamily: "inherit",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: "0 4px 16px rgba(30,58,138,0.30)",
  transition: "all 0.15s",
};

const termsText: React.CSSProperties = {
  fontSize: 11.5, color: "#94a3b8", textAlign: "center",
  marginTop: 12, lineHeight: 1.6,
};

// ── Shared screen styles ───────────────────────────────────────────
const centeredScreen: React.CSSProperties = {
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  padding: "52px 40px",
  minHeight: 400,
  textAlign: "center",
};

const screenTitle: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8,
};

const screenSub: React.CSSProperties = {
  fontSize: 14, color: "#64748b", marginBottom: 16,
};

const spinner: React.CSSProperties = {
  width: 48, height: 48, borderRadius: "50%",
  border: "3px solid #e2e8f0",
  borderTopColor: "#1e3a8a",
  animation: "spin 0.8s linear infinite",
  marginBottom: 20,
};

const receiptBox: React.CSSProperties = {
  background: "#f8fafc", border: "1px solid #e2e8f0",
  borderRadius: 12, padding: "16px 20px",
  width: "100%", maxWidth: 340,
  marginBottom: 16,
};

const receiptRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between",
  padding: "6px 0", borderBottom: "1px solid #f1f5f9",
};

const receiptLabel: React.CSSProperties = { fontSize: 13, color: "#64748b" };
const receiptValue: React.CSSProperties = { fontSize: 13, color: "#0f172a" };
