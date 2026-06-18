"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrganisationSetupStep from "@/components/onboarding/OrganisationSetupStep";
import PricingPlanStep from "@/components/onboarding/PricingPlanStep";
import { PlanTier, BillingCycle } from "@/types/billing";

type Step = "org-setup" | "pricing";

interface OrgData {
  orgName: string;
  industry: string;
  size: string;
  country: string;
}

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const STEPS: { id: Step; label: string }[] = [
  { id: "org-setup", label: "Organisation" },
  { id: "pricing", label: "Choose Plan" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("org-setup");
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [completing, setCompleting] = useState(false);

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const handleOrgNext = (data: OrgData) => {
    setOrgData(data);
    setStep("pricing");
  };

  const handlePlanSelect = async (plan: PlanTier, cycle: BillingCycle) => {
    setCompleting(true);
    // MOCK: store onboarding result and redirect
    localStorage.setItem("onboarding_plan", plan);
    localStorage.setItem("onboarding_cycle", cycle);
    if (orgData) localStorage.setItem("onboarding_org", JSON.stringify(orgData));
    await new Promise(r => setTimeout(r, 800));
    if (plan === "FREE") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard?showPayment=true");
    }
  };

  return (
    <div style={s.shell}>
      {/* top bar */}
      <div style={s.topBar}>
        <div style={s.logo}>
          <div style={s.logoMark}><ShieldIcon /></div>
          <span style={s.logoText}>AuditInsight</span>
        </div>
        <div style={s.stepIndicator}>
          {STEPS.map((st, i) => (
            <div key={st.id} style={s.stepGroup}>
              <div style={{
                ...s.stepDot,
                ...(i < stepIndex ? s.stepDone : {}),
                ...(i === stepIndex ? s.stepActive : {}),
              }}>
                {i < stepIndex ? "✓" : i + 1}
              </div>
              <span style={{ ...s.stepLabel, ...(i === stepIndex ? s.stepLabelActive : {}) }}>
                {st.label}
              </span>
              {i < STEPS.length - 1 && <div style={{ ...s.stepLine, ...(i < stepIndex ? s.stepLineDone : {}) }} />}
            </div>
          ))}
        </div>
      </div>

      {/* main content */}
      <div style={s.main}>
        {completing ? (
          <div style={s.completing}>
            <div style={s.spinner} />
            <p style={s.completingText}>Setting up your workspace…</p>
          </div>
        ) : step === "org-setup" ? (
          <OrganisationSetupStep onNext={handleOrgNext} />
        ) : (
          <PricingPlanStep onSelect={handlePlanSelect} onBack={() => setStep("org-setup")} />
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { minHeight: "100vh", background: "#F8FAFC", display: "flex", flexDirection: "column" },
  topBar: { background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  logoText: { fontSize: 17, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.3px" },
  stepIndicator: { display: "flex", alignItems: "center", gap: 0 },
  stepGroup: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", background: "#E2E8F0", color: "#94A3B8", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  stepActive: { background: "#1e3a8a", color: "#fff" },
  stepDone: { background: "#22c55e", color: "#fff" },
  stepLabel: { fontSize: 13, color: "#94A3B8", fontWeight: 500, marginRight: 8 },
  stepLabelActive: { color: "#0F172A", fontWeight: 600 },
  stepLine: { width: 32, height: 2, background: "#E2E8F0", marginRight: 8 },
  stepLineDone: { background: "#22c55e" },
  main: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "52px 40px 80px" },
  completing: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, minHeight: 240 },
  spinner: { width: 40, height: 40, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#1e3a8a", animation: "spin 0.8s linear infinite" } as React.CSSProperties,
  completingText: { fontSize: 16, color: "#64748B", fontWeight: 500 },
};
