"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { PRICING_PLANS, PlanTier, BillingCycle, Subscription } from "@/types/billing";
import { theme } from "@/styles/theme";

interface Props {
  subscription: Subscription | null;
  onPlanChange: (plan: PlanTier, cycle: BillingCycle) => void;
  loading?: boolean;
}

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function BillingSettingsCard({ subscription, onPlanChange, loading = false }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("PROFESSIONAL");

  useEffect(() => {
    if (subscription) {
      setCycle(subscription.billingCycle);
      setSelectedPlan(subscription.planTier);
    }
  }, [subscription]);

  const getPrice = (plan: (typeof PRICING_PLANS)[0], cycle: BillingCycle) => {
    if (cycle === "MONTHLY") return plan.monthlyPrice;
    if (cycle === "SIX_MONTHS") return plan.sixMonthsPrice;
    return plan.annualPrice;
  };

  const handleSelectPlan = (planId: PlanTier) => {
    if (planId !== selectedPlan) {
      setSelectedPlan(planId);
    }
  };

  const handleApplyPlan = () => {
    if (selectedPlan !== subscription?.planTier || cycle !== subscription?.billingCycle) {
      onPlanChange(selectedPlan, cycle);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
      {/* Billing Cycle Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => setCycle("MONTHLY")}
          style={{
            padding: "8px 16px",
            borderRadius: theme.radius.md,
            border: "none",
            background: cycle === "MONTHLY" ? theme.colors.primary : theme.colors.surfaceDark,
            color: cycle === "MONTHLY" ? "#fff" : theme.colors.textSecondary,
            fontSize: theme.typography.sm,
            fontWeight: cycle === "MONTHLY" ? 600 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setCycle("SIX_MONTHS")}
          style={{
            padding: "8px 16px",
            borderRadius: theme.radius.md,
            border: "none",
            background: cycle === "SIX_MONTHS" ? theme.colors.primary : theme.colors.surfaceDark,
            color: cycle === "SIX_MONTHS" ? "#fff" : theme.colors.textSecondary,
            fontSize: theme.typography.sm,
            fontWeight: cycle === "SIX_MONTHS" ? 600 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          6 Months
        </button>
        <button
          onClick={() => setCycle("YEARLY")}
          style={{
            padding: "8px 16px",
            borderRadius: theme.radius.md,
            border: "none",
            background: cycle === "YEARLY" ? theme.colors.primary : theme.colors.surfaceDark,
            color: cycle === "YEARLY" ? "#fff" : theme.colors.textSecondary,
            fontSize: theme.typography.sm,
            fontWeight: cycle === "YEARLY" ? 600 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Annual
        </button>
      </div>

      {/* Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {PRICING_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = subscription?.planTier === plan.id;
          const price = getPrice(plan, cycle);

          return (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading}
              style={{
                position: "relative",
                background: theme.colors.Surface,
                border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.radius.lg,
                padding: 20,
                textAlign: "left",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                opacity: loading ? 0.6 : 1,
                boxShadow:
                  isSelected
                    ? `0 0 0 4px ${theme.colors.primarySoft}`
                    : `0 1px 3px rgba(0,0,0,0.05)`,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!loading && !isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    theme.colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    theme.colors.border;
                }
              }}
            >
              {plan.highlighted && !isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${theme.colors.primary}, #2563eb)`,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}

              {isCurrent && isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#16a34a",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 4,
                  }}
                >
                  Current Plan
                </div>
              )}

              <div>
                <div
                  style={{
                    fontSize: theme.typography.md,
                    fontWeight: 700,
                    color: theme.colors.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.xs,
                    color: theme.colors.textMuted,
                    minHeight: 32,
                  }}
                >
                  {plan.description}
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${theme.colors.divider}`, paddingTop: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {price === 0
                      ? "Free"
                      : new Intl.NumberFormat("en-RW", {
                          style: "currency",
                          currency: "RWF",
                          maximumFractionDigits: 0,
                        }).format(price)}
                  </span>
                  {price > 0 && (
                    <span
                      style={{
                        fontSize: theme.typography.xs,
                        color: theme.colors.textMuted,
                      }}
                    >
                      /{cycle === "MONTHLY" ? "mo" : "year"}
                    </span>
                  )}
                </div>
                {price > 0 && (
                  <div
                    style={{
                      fontSize: theme.typography.xs,
                      color: theme.colors.textMuted,
                    }}
                  >
                    {cycle === "MONTHLY" ? "Billed monthly" : "Billed annually"}
                  </div>
                )}
              </div>

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
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: theme.typography.xs,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    <span style={{ color: theme.colors.primary, flexShrink: 0, marginTop: 2 }}>
                      {CHECK}
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: theme.colors.primary,
                    fontSize: theme.typography.xs,
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: theme.colors.primary,
                    }}
                  />
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      {selectedPlan !== subscription?.planTier || cycle !== subscription?.billingCycle ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${theme.colors.divider}`,
          }}
        >
          <button
            onClick={() => {
              setSelectedPlan(subscription?.planTier || "PROFESSIONAL");
              setCycle(subscription?.billingCycle || "MONTHLY");
            }}
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
            onClick={handleApplyPlan}
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
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            {loading && <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {subscription?.planTier === "FREE" && selectedPlan !== "FREE"
              ? "Upgrade & Pay"
              : subscription?.planTier && selectedPlan === "FREE"
                ? "Downgrade"
                : "Change Plan"}
          </button>
        </div>
      ) : null}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
