"use client";

import { createPortal } from "react-dom";
import { PlanTier, BillingCycle, PRICING_PLANS } from "@/types/billing";
import { theme } from "@/styles/theme";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  currentPlan: PlanTier;
  newPlan: PlanTier;
  cycle: BillingCycle;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function PlanChangeConfirmModal({
  open,
  currentPlan,
  newPlan,
  cycle,
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  if (!open || typeof document === "undefined") return null;

  const currentPlanInfo = PRICING_PLANS.find((p) => p.id === currentPlan);
  const newPlanInfo = PRICING_PLANS.find((p) => p.id === newPlan);

  if (!currentPlanInfo || !newPlanInfo) return null;

  const currentPrice = cycle === "MONTHLY" ? currentPlanInfo.monthlyPrice : currentPlanInfo.annualPrice;
  const newPrice = cycle === "MONTHLY" ? newPlanInfo.monthlyPrice : newPlanInfo.annualPrice;
  const priceDiff = newPrice - currentPrice;
  const isUpgrade = priceDiff > 0;
  const isDowngrade = priceDiff < 0;

  const overlay = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.5)",
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
    maxWidth: 480,
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto" as const,
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    borderBottom: `1px solid ${theme.colors.divider}`,
  };

  const title = {
    fontSize: theme.typography.lg,
    fontWeight: 700,
    color: theme.colors.textPrimary,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const body = {
    padding: "20px",
  };

  const section = {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    marginBottom: 16,
  };

  const label = {
    fontSize: theme.typography.xs,
    fontWeight: 600,
    color: theme.colors.textMuted,
    textTransform: "uppercase" as const,
  };

  const planComparison = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20,
    padding: "16px",
    background: theme.colors.appBackground,
    borderRadius: theme.radius.md,
  };

  const planBox = {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  };

  const planName = {
    fontSize: theme.typography.sm,
    fontWeight: 600,
    color: theme.colors.textPrimary,
  };

  const planPrice = {
    fontSize: "20px",
    fontWeight: 800,
    color: theme.colors.textPrimary,
  };

  const footer = {
    display: "flex",
    gap: 12,
    padding: "16px 20px",
    borderTop: `1px solid ${theme.colors.divider}`,
    justifyContent: "flex-end",
  };

  return createPortal(
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={modal}>
        {/* Header */}
        <div style={header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle
              size={20}
              style={{
                color: isUpgrade ? "#d97706" : isDowngrade ? "#2563eb" : "#64748b",
              }}
            />
            <h2 style={title as React.CSSProperties}>
              {isUpgrade ? "Upgrade Plan" : isDowngrade ? "Downgrade Plan" : "Change Plan"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              padding: 8,
              color: theme.colors.textMuted,
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={body}>
          {/* Plan Comparison */}
          <div style={planComparison}>
            <div style={planBox}>
              <div style={label}>Current Plan</div>
              <div style={planName}>{currentPlanInfo.name}</div>
              <div style={planPrice}>
                {currentPrice === 0
                  ? "Free"
                  : new Intl.NumberFormat("en-RW", {
                      style: "currency",
                      currency: "RWF",
                      maximumFractionDigits: 0,
                    }).format(currentPrice)}
              </div>
              <div style={{ fontSize: theme.typography.xs, color: theme.colors.textMuted }}>
                /{cycle === "MONTHLY" ? "month" : "year"}
              </div>
            </div>

            <div style={planBox}>
              <div style={label}>New Plan</div>
              <div style={planName}>{newPlanInfo.name}</div>
              <div style={planPrice}>
                {newPrice === 0
                  ? "Free"
                  : new Intl.NumberFormat("en-RW", {
                      style: "currency",
                      currency: "RWF",
                      maximumFractionDigits: 0,
                    }).format(newPrice)}
              </div>
              <div style={{ fontSize: theme.typography.xs, color: theme.colors.textMuted }}>
                /{cycle === "MONTHLY" ? "month" : "year"}
              </div>
            </div>
          </div>

          {/* Price Change Info */}
          {priceDiff !== 0 && (
            <div
              style={{
                padding: "12px",
                borderRadius: theme.radius.md,
                background:
                  isUpgrade
                    ? "rgba(217, 119, 6, 0.05)"
                    : isDowngrade
                      ? "rgba(37, 99, 235, 0.05)"
                      : "transparent",
                border: `1px solid ${isUpgrade ? "#fed7aa" : isDowngrade ? "#93c5fd" : "transparent"}`,
              }}
            >
              <div style={{ fontSize: theme.typography.sm, color: theme.colors.textPrimary }}>
                {isUpgrade ? "Upgrade" : "Downgrade"} Cost:{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color: isUpgrade ? "#d97706" : "#2563eb",
                  }}
                >
                  +{" "}
                  {new Intl.NumberFormat("en-RW", {
                    style: "currency",
                    currency: "RWF",
                    maximumFractionDigits: 0,
                  }).format(Math.abs(priceDiff))}
                </span>{" "}
                {cycle === "MONTHLY" ? "per month" : "per year"}
              </div>
              <div
                style={{
                  fontSize: theme.typography.xs,
                  color: theme.colors.textMuted,
                  marginTop: 6,
                }}
              >
                {isUpgrade
                  ? "The price difference will be charged to your payment method."
                  : "Your account will be credited the difference."}
              </div>
            </div>
          )}

          {/* Details */}
          <div style={section}>
            <div style={label}>What's included in {newPlanInfo.name}?</div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {newPlanInfo.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: theme.typography.sm,
                    color: theme.colors.textSecondary,
                  }}
                >
                  <span
                    style={{
                      color: theme.colors.primary,
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning for downgrade */}
          {isDowngrade && (
            <div
              style={{
                padding: "12px",
                borderRadius: theme.radius.md,
                background: "rgba(37, 99, 235, 0.05)",
                border: `1px solid #93c5fd`,
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.sm,
                  color: "#1e40af",
                  fontWeight: 500,
                }}
              >
                Note: Downgrading may affect your team's access and features. Some users or features
                may become unavailable.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={footer}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: theme.colors.surfaceDark,
              border: "none",
              borderRadius: theme.radius.md,
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sm,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: theme.colors.primary,
              border: "none",
              borderRadius: theme.radius.md,
              color: "#fff",
              fontSize: theme.typography.sm,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Processing..." : "Confirm & Continue"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
