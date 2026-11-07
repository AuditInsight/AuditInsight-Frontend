"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { SubscriptionType, getPlan, formatRwf, Subscription } from "@/types/billing";
import { theme } from "@/styles/theme";
import { X, Loader, CheckCircle2, AlertCircle } from "lucide-react";
import PaymentMethodSelector, { PaymentMethod } from "./PaymentMethodSelector";
import { usePaymentProcessor } from "@/hooks/usePaymentProcessor";
import { usePlans } from "@/hooks/usePlans";

type PaymentState = "selecting" | "processing" | "success" | "awaiting" | "error";

interface Props {
  open: boolean;
  plan: SubscriptionType;
  organisationId: string;
  onClose: () => void;
  onSuccess: (subscription: Subscription | null) => void;
}

export default function PaymentCheckoutModal({
  open,
  plan,
  organisationId,
  onClose,
  onSuccess,
}: Props) {
  const [state, setState] = useState<PaymentState>("selecting");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MOMO");
  const [localError, setLocalError] = useState<string | null>(null);

  const [successNote, setSuccessNote] = useState<string | null>(null);

  const { loading, error, processMomoPayment, resetState } = usePaymentProcessor({
    organisationId,
    subscriptionType: plan,
  });

  const { plans } = usePlans();
  const planInfo = getPlan(plan, plans);
  if (!planInfo) return null;

  const price = planInfo.price;

  const handlePaymentStart = async (method: PaymentMethod, phoneNumber?: string) => {
    setLocalError(null);
    setSuccessNote(null);

    if (method !== "MOMO" || !phoneNumber) {
      setState("error");
      setLocalError("Only Mobile Money payments are available.");
      return;
    }

    setState("processing");
    try {
      const result = await processMomoPayment(phoneNumber);
      if (result.outcome === "paid") {
        const starts = result.subscription?.startDate ? Date.parse(result.subscription.startDate) : NaN;
        if (Number.isFinite(starts) && starts > Date.now()) {
          setSuccessNote(
            `Your ${planInfo.name} starts on ${new Date(starts).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}, when your current access ends.`
          );
        }
        setState("success");
        setTimeout(() => onSuccess(result.subscription), 1500);
      } else if (result.outcome === "pending") {
        setState("awaiting");
      } else {
        setState("error");
        setLocalError(result.error);
      }
    } catch (err) {
      setState("error");
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleClose = () => {
    if (state === "processing" || state === "success") return;
    resetState();
    setState("selecting");
    setLocalError(null);
    onClose();
  };

  const handleRetry = () => {
    resetState();
    setState("selecting");
    setLocalError(null);
  };

  if (!open || typeof document === "undefined") return null;

  const overlay = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  };

  const modal = {
    background: theme.colors.Surface,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.lg,
    maxWidth: 560,
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    borderBottom: `1px solid ${theme.colors.divider}`,
  };

  const body = {
    padding: "24px",
    flex: 1,
    overflow: "auto" as const,
  };

  return createPortal(
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={modal}>
        {/* ── SELECTING PAYMENT METHOD ── */}
        {state === "selecting" && (
          <>
            {/* Header */}
            <div style={header}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: theme.typography.lg,
                    fontWeight: 700,
                    color: theme.colors.textPrimary,
                  }}
                >
                  Complete Your Payment
                </h2>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  color: theme.colors.textMuted,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = theme.colors.textMuted;
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={body}>
              {/* Order Summary Card */}
              <div
                style={{
                  padding: 16,
                  background: theme.colors.appBackground,
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.divider}`,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div
                      style={{
                        fontSize: theme.typography.xs,
                        fontWeight: 600,
                        color: theme.colors.textMuted,
                        marginBottom: 4,
                      }}
                    >
                      PLAN
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.md,
                        fontWeight: 700,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {planInfo.name}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: theme.typography.xs,
                        fontWeight: 600,
                        color: theme.colors.textMuted,
                        marginBottom: 4,
                      }}
                    >
                      BILLING
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.md,
                        fontWeight: 700,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {planInfo.billed}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${theme.colors.divider}`,
                    paddingTop: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.sm,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Amount due
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {formatRwf(price)}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                onPaymentStart={handlePaymentStart}
                loading={loading}
                error={localError || error || undefined}
              />

              {/* Security Info */}
              <div
                style={{
                  marginTop: 20,
                  padding: 12,
                  background: "rgba(22, 163, 74, 0.05)",
                  border: "1px solid rgba(22, 163, 74, 0.2)",
                  borderRadius: theme.radius.md,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: theme.typography.xs,
                  color: "#15803d",
                }}
              >
                <span>🔒</span>
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          </>
        )}

        {/* ── PROCESSING ── */}
        {state === "processing" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: theme.colors.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "spin 1s linear infinite",
              }}
            >
              <Loader size={28} style={{ color: theme.colors.primary }} />
            </div>
            <div
              style={{
                fontSize: theme.typography.md,
                fontWeight: 600,
                color: theme.colors.textPrimary,
                textAlign: "center",
              }}
            >
              {paymentMethod === "MOMO"
                ? "Processing your MOMO payment..."
                : "Redirecting to secure checkout..."}
            </div>
            <div
              style={{
                fontSize: theme.typography.sm,
                color: theme.colors.textMuted,
                textAlign: "center",
              }}
            >
              {paymentMethod === "MOMO"
                ? "Please wait while we verify your payment"
                : "You will be redirected to Flutterwave"}
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {(state === "success" || state === "awaiting") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(22, 163, 74, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "scaleIn 0.6s ease-out",
              }}
            >
              <CheckCircle2 size={32} style={{ color: "#16a34a" }} />
            </div>
            <div
              style={{
                fontSize: theme.typography.lg,
                fontWeight: 700,
                color: theme.colors.textPrimary,
                textAlign: "center",
              }}
            >
              {state === "awaiting" ? "Waiting for your approval" : "Payment Successful!"}
            </div>
            <div
              style={{
                fontSize: theme.typography.sm,
                color: theme.colors.textMuted,
                textAlign: "center",
                maxWidth: 300,
              }}
            >
              {state === "awaiting"
                ? "Approve the prompt on your phone. Your plan activates automatically once Mobile Money confirms it, so you can close this window."
                : successNote ?? `Your ${planInfo.name} is now active.`}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {state === "error" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(220, 38, 38, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertCircle size={32} style={{ color: "#dc2626" }} />
            </div>
            <div
              style={{
                fontSize: theme.typography.lg,
                fontWeight: 700,
                color: theme.colors.textPrimary,
                textAlign: "center",
              }}
            >
              Payment Failed
            </div>
            <div
              style={{
                fontSize: theme.typography.sm,
                color: "#991b1b",
                textAlign: "center",
                maxWidth: 300,
                background: "#fef2f2",
                padding: 12,
                borderRadius: theme.radius.md,
                border: "1px solid #fecaca",
              }}
            >
              {localError || error || "Something went wrong with your payment. Please try again."}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                onClick={handleRetry}
                style={{
                  padding: "10px 24px",
                  background: theme.colors.primary,
                  border: "none",
                  borderRadius: theme.radius.md,
                  color: "#fff",
                  fontSize: theme.typography.sm,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: "10px 24px",
                  background: theme.colors.surfaceDark,
                  border: "none",
                  borderRadius: theme.radius.md,
                  color: theme.colors.textPrimary,
                  fontSize: theme.typography.sm,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
}
