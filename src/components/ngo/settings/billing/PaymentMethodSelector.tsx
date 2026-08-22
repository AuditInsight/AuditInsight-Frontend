"use client";

import { useState } from "react";
import { theme } from "@/styles/theme";
import { Phone, CreditCard, AlertCircle, Loader } from "lucide-react";

export type PaymentMethod = "MOMO" | "CARD";

interface Props {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentStart: (method: PaymentMethod, phoneOrDetails?: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  onPaymentStart,
  loading = false,
  error,
}: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (selectedMethod === "MOMO") {
        if (!phoneNumber.trim()) {
          alert("Please enter a phone number");
          setIsProcessing(false);
          return;
        }
        await onPaymentStart("MOMO", phoneNumber);
      } else {
        await onPaymentStart("CARD");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaymentReady =
    !loading && !isProcessing && (selectedMethod === "CARD" || (selectedMethod === "MOMO" && phoneNumber.trim()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
      {/* Payment Method Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* MOMO Option */}
        <button
          onClick={() => !loading && !isProcessing && onMethodChange("MOMO")}
          disabled={loading || isProcessing}
          style={{
            padding: 16,
            border: `2px solid ${selectedMethod === "MOMO" ? theme.colors.primary : theme.colors.border}`,
            borderRadius: theme.radius.lg,
            background: selectedMethod === "MOMO" ? theme.colors.primarySoft : theme.colors.Surface,
            cursor: loading || isProcessing ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: loading || isProcessing ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading && !isProcessing && selectedMethod !== "MOMO") {
              (e.currentTarget as HTMLElement).style.borderColor = theme.colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !isProcessing && selectedMethod !== "MOMO") {
              (e.currentTarget as HTMLElement).style.borderColor = theme.colors.border;
            }
          }}
        >
          <Phone
            size={24}
            style={{
              color: selectedMethod === "MOMO" ? theme.colors.primary : theme.colors.textMuted,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div
              style={{
                fontSize: theme.typography.sm,
                fontWeight: 600,
                color: theme.colors.textPrimary,
              }}
            >
              Mobile Money (MOMO)
            </div>
            <div
              style={{
                fontSize: theme.typography.xs,
                color: theme.colors.textMuted,
                marginTop: 2,
              }}
            >
              via pawaPay - Fast and low fees
            </div>
          </div>
          {selectedMethod === "MOMO" && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: theme.colors.primary,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
          )}
        </button>

        {/* MOMO Phone Input */}
        {selectedMethod === "MOMO" && (
          <div
            style={{
              padding: 12,
              background: theme.colors.primarySoft,
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.primary}20`,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: theme.typography.xs,
                fontWeight: 600,
                color: theme.colors.textSecondary,
                marginBottom: 6,
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g., +250 788 123 456"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading || isProcessing}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: theme.radius.md,
                border: `1px solid ${theme.colors.border}`,
                fontSize: theme.typography.sm,
                color: theme.colors.textPrimary,
                fontFamily: "inherit",
                boxSizing: "border-box",
                background: theme.colors.Surface,
                opacity: loading || isProcessing ? 0.6 : 1,
              }}
            />
            <div
              style={{
                fontSize: theme.typography.xs,
                color: theme.colors.textMuted,
                marginTop: 6,
              }}
            >
              Enter the phone number associated with your mobile money account
            </div>
          </div>
        )}

        {/* Card Option */}
        <button
          onClick={() => !loading && !isProcessing && onMethodChange("CARD")}
          disabled={loading || isProcessing}
          style={{
            padding: 16,
            border: `2px solid ${selectedMethod === "CARD" ? theme.colors.primary : theme.colors.border}`,
            borderRadius: theme.radius.lg,
            background: selectedMethod === "CARD" ? theme.colors.primarySoft : theme.colors.Surface,
            cursor: loading || isProcessing ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: loading || isProcessing ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading && !isProcessing && selectedMethod !== "CARD") {
              (e.currentTarget as HTMLElement).style.borderColor = theme.colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !isProcessing && selectedMethod !== "CARD") {
              (e.currentTarget as HTMLElement).style.borderColor = theme.colors.border;
            }
          }}
        >
          <CreditCard
            size={24}
            style={{
              color: selectedMethod === "CARD" ? theme.colors.primary : theme.colors.textMuted,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div
              style={{
                fontSize: theme.typography.sm,
                fontWeight: 600,
                color: theme.colors.textPrimary,
              }}
            >
              Card Payment
            </div>
            <div
              style={{
                fontSize: theme.typography.xs,
                color: theme.colors.textMuted,
                marginTop: 2,
              }}
            >
              via Flutterwave - Visa, Mastercard, and more
            </div>
          </div>
          {selectedMethod === "CARD" && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: theme.colors.primary,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: theme.radius.md,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <AlertCircle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: theme.typography.sm, color: "#991b1b" }}>{error}</div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={!isPaymentReady}
        style={{
          width: "100%",
          padding: "12px",
          background: isPaymentReady ? theme.colors.primary : theme.colors.surfaceDark,
          border: "none",
          borderRadius: theme.radius.md,
          color: isPaymentReady ? "#fff" : theme.colors.textMuted,
          fontSize: theme.typography.sm,
          fontWeight: 600,
          cursor: isPaymentReady ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          opacity: isPaymentReady ? 1 : 0.6,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {isProcessing || loading ? (
          <>
            <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
            Processing...
          </>
        ) : (
          `Pay with ${selectedMethod === "MOMO" ? "Mobile Money" : "Card"}`
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
