"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Check } from "lucide-react";
import { isAxiosError } from "axios";
import OrganisationSetupStep from "@/components/onboarding/OrganisationSetupStep";
import PricingPlanStep from "@/components/onboarding/PricingPlanStep";
import { PlanTier, BillingCycle } from "@/types/billing";
import { useAuth } from "@/context/AuthContext.production";
import { apiClient } from "@/api/client";
import { CreateOrganisationRequest, OrganisationApiResponse } from "@/types/tenants";
import { ApiErrorResponse } from "@/types/auth";

type Step = "org-setup" | "pricing";

interface OrgData {
  orgName: string;
  industry: "NGO" | "PRIVATE";  // maps directly to backend OrganisationType
  size: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
}

const STEPS: { id: Step; label: string }[] = [
  { id: "org-setup", label: "Organisation" },
  { id: "pricing",   label: "Choose Plan"  },
];

export default function OnboardingPage() {
  const router      = useRouter();
  const { user }    = useAuth();

  const [step, setStep]         = useState<Step>("org-setup");
  const [orgData, setOrgData]   = useState<OrgData | null>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError]       = useState("");

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleOrgNext = (data: OrgData) => {
    setOrgData(data);
    setStep("pricing");
  };

  const handlePlanSelect = async (plan: PlanTier, cycle: BillingCycle) => {
    setCompleting(true);
    setError("");

    const org = orgData ?? { orgName: "My Organisation", industry: "PRIVATE" as const, size: "1-10", fiscalYearStart: "01-01", fiscalYearEnd: "12-31", currencies: ["USD"] };

    try {
      const payload: CreateOrganisationRequest = {
        name:            org.orgName,
        industry:        org.industry,   // PRIVATE | NGO — backend OrganisationType
        size:            org.size,
        fiscalYearStart: org.fiscalYearStart,
        fiscalYearEnd:   org.fiscalYearEnd,
        currencies:      org.currencies,
      };

      // Create the organisation — backend links it to the authenticated user
      await apiClient.post<OrganisationApiResponse>("/organisations", payload);

      // For paid plans, billing integration would go here.
      // For now we store the selection and proceed.
      sessionStorage.setItem("selected_plan",  plan);
      sessionStorage.setItem("selected_cycle", cycle);

      router.replace("/dashboard");
    } catch (err: unknown) {
      setCompleting(false);
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.message ?? "Failed to create organisation. Please try again.");
      } else {
        setError("Unable to reach the server. Check your connection.");
      }
    }
  };

  const displayName = user?.fullName ?? "New User";
  const displayEmail = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={s.shell}>
      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.logoRow}>
          <div style={s.logoMark}><Shield size={15} color="#fff" strokeWidth={2.5} /></div>
          <span style={s.logoText}>AuditInsight</span>
        </div>

        <div style={s.stepRow}>
          {STEPS.map((st, i) => (
            <div key={st.id} style={s.stepGroup}>
              <div style={{ ...s.stepDot, ...(i < stepIndex ? s.stepDone : {}), ...(i === stepIndex ? s.stepActive : {}) }}>
                {i < stepIndex ? <Check size={12} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{ ...s.stepLabel, ...(i === stepIndex ? s.stepLabelActive : {}) }}>{st.label}</span>
              {i < STEPS.length - 1 && (
                <div style={{ ...s.stepLine, ...(i < stepIndex ? s.stepLineDone : {}) }} />
              )}
            </div>
          ))}
        </div>

        <div style={s.userPill}>
          <div style={s.userAvatar}>{initials}</div>
          <div style={s.userInfo}>
            <span style={s.userName}>{displayName}</span>
            <span style={s.userEmail}>{displayEmail}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={s.main}>
        {error && (
          <div style={s.errorBanner} role="alert">{error}</div>
        )}
        {completing ? (
          <div style={s.completingWrap}>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <div style={s.spinnerRing} />
            <p style={s.completingTitle}>Setting up your workspace…</p>
            <p style={s.completingSubtitle}>This will only take a moment.</p>
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
  shell: { minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" },
  topBar: { background: "#fff", borderBottom: "1px solid #e2e8f0", height: 64, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, position: "sticky", top: 0, zIndex: 50 },
  logoRow: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  logoMark: { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0f3d75, #1e3a8a)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },
  stepRow: { display: "flex", alignItems: "center" },
  stepGroup: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", background: "#e2e8f0", color: "#94a3b8", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepActive: { background: "#1e3a8a", color: "#fff" },
  stepDone:   { background: "#1e3a8a", color: "#fff" },
  stepLabel:  { fontSize: 13, color: "#94a3b8", fontWeight: 500, marginRight: 6 },
  stepLabelActive: { color: "#0f172a", fontWeight: 600 },
  stepLine:   { width: 36, height: 2, background: "#e2e8f0", marginRight: 6 },
  stepLineDone: { background: "#1e3a8a" },
  userPill: { display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 6px", borderRadius: 40, border: "1px solid #e2e8f0", background: "#f8fafc", flexShrink: 0 },
  userAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0f3d75, #1e3a8a)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userInfo:  { display: "flex", flexDirection: "column", gap: 1 },
  userName:  { fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 },
  userEmail: { fontSize: 11, color: "#94a3b8", lineHeight: 1.2 },
  main: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 24px 80px" },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "11px 16px", fontSize: 13.5, marginBottom: 24, width: "100%", maxWidth: 900, alignSelf: "center", boxSizing: "border-box" },
  completingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 260, width: "100%" },
  spinnerRing: { width: 48, height: 48, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#1e3a8a", animation: "spin 0.8s linear infinite" } as React.CSSProperties,
  completingTitle:    { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 },
  completingSubtitle: { fontSize: 14, color: "#64748b", margin: 0 },
};


