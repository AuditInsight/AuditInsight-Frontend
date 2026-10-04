"use client";

import { useState, useEffect } from "react";
import { Subscription, SubscriptionType, getPlan } from "@/types/billing";
import PlanCards from "@/components/billing/PlanCards";
import { theme } from "@/styles/theme";

interface Props {
  subscription: Subscription | null;
  onPlanChange: (plan: SubscriptionType) => void;
  loading?: boolean;
}

export default function BillingSettingsCard({ subscription, onPlanChange, loading = false }: Props) {
  const current = subscription?.status === "ACTIVE" ? subscription.subscriptionType : null;
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType>(current ?? "SIX_MONTHS");

  useEffect(() => {
    if (current) setSelectedPlan(current);
  }, [current]);

  const changed = selectedPlan !== current;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
      <PlanCards selected={selectedPlan} current={current} onSelect={setSelectedPlan} disabled={loading} />

      {changed && (
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
          {current && (
            <button
              onClick={() => setSelectedPlan(current)}
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
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => onPlanChange(selectedPlan)}
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
            }}
          >
            {current ? "Change Plan" : "Subscribe"} · {getPlan(selectedPlan)?.name}
          </button>
        </div>
      )}
    </div>
  );
}
