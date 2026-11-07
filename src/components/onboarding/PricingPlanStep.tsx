"use client";

import { useEffect, useState } from "react";
import { SubscriptionType } from "@/types/billing";
import PlanCards from "@/components/billing/PlanCards";
import { getTrialOffer, type TrialOffer } from "@/utils/api";

interface Props {
  onSelect: (plan: SubscriptionType) => void;
  onBack: () => void;
}

/**
 * Last onboarding step: pick a plan, then the workspace is created. Payment itself happens next, through real
 * Mobile Money checkout, unless a free-trial campaign is running — then the new workspace starts on that trial.
 */
export default function PricingPlanStep({ onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<SubscriptionType>("SIX_MONTHS");
  const [offer, setOffer] = useState<TrialOffer | null>(null);

  useEffect(() => {
    let current = true;
    getTrialOffer()
      .then(({ data }) => {
        if (current) setOffer(data);
      })
      .catch(() => {
        if (current) setOffer({ active: false, durationDays: null });
      });
    return () => {
      current = false;
    };
  }, []);

  const trialDays = offer?.active ? offer.durationDays : null;

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Choose your plan</h2>
      <p style={s.sub}>
        {trialDays
          ? `New workspaces currently start with a ${trialDays}-day free trial. You'll pay for your chosen plan when it ends.`
          : "Pick the period that suits you. You'll pay with Mobile Money on the next screen."}
      </p>

      <div style={{ width: "100%", marginBottom: 32 }}>
        <PlanCards selected={selected} onSelect={setSelected} />
      </div>

      <div style={s.actions}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <button style={s.continueBtn} onClick={() => onSelect(selected)} disabled={offer === null}>
          {trialDays ? `Start ${trialDays}-day free trial →` : "Create workspace & continue to payment →"}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 1000, margin: "0 auto" },
  heading: { fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.4px", textAlign: "center" },
  sub: { fontSize: 14, color: "#64748B", margin: "0 0 24px", textAlign: "center", maxWidth: 560 },
  actions: { display: "flex", gap: 12, width: "100%", maxWidth: 520 },
  backBtn: { flex: "0 0 auto", padding: "13px 22px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  continueBtn: { flex: 1, padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" },
};
