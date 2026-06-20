"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Check, Loader2 } from "lucide-react";
import OrganisationSetupStep from "@/components/onboarding/OrganisationSetupStep";
import PricingPlanStep from "@/components/onboarding/PricingPlanStep";
import { PlanTier, BillingCycle } from "@/types/billing";
import { useAuth } from "@/context/AuthContext";

type Step = "org-setup" | "pricing";

interface OrgData {
  orgName: string;
  industry: string;
  size: string;
  country: string;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "org-setup", label: "Organisation" },
  { id: "pricing",   label: "Choose Plan"  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState<Step>("org-setup");
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [completing, setCompleting] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleOrgNext = (data: OrgData) => {
    setOrgData(data);
    setStep("pricing");
  };

  const handlePlanSelect = async (plan: PlanTier, cycle: BillingCycle) => {
    setCompleting(true);
    const org = orgData ?? { orgName: "My Organisation", industry: "", size: "", country: "" };
    // Persist org and plan to localStorage
    localStorage.setItem("onboarding_plan",  plan);
    localStorage.setItem("onboarding_cycle", cycle);
    localStorage.setItem("onboarding_org",   JSON.stringify(org));
    // Write org name back into the auth session so Header shows it immediately
    completeOnboarding(org.orgName, `org-${Date.now()}`);
    await new Promise((r) => setTimeout(r, 900));
    router.push("/dashboard");
  };

  // Derive display info for the top bar
  const [displayName, setDisplayName] = useState(user?.fullName ?? "New User");
  const [displayEmail, setDisplayEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (user) return;

    const signupRole = localStorage.getItem("signup_role");
    const signupEmail = localStorage.getItem("signup_email");

    if (!signupEmail || signupRole !== "CLIENT") {
      router.replace("/sign-up");
      return;
    }

    const otpVerified = localStorage.getItem("otp_verified") === "true";
    const verifiedEmail = localStorage.getItem("verified_email");
    if (!otpVerified || verifiedEmail !== signupEmail) {
      router.replace(`/verify-otp?email=${encodeURIComponent(signupEmail)}&next=/onboarding`);
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) {
      const storedName = typeof window !== "undefined" ? localStorage.getItem("signup_name") : null;
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("signup_email") : null;
      setDisplayName(storedName ?? "New User");
      setDisplayEmail(storedEmail ?? "");
    } else {
      setDisplayName(user.fullName);
      setDisplayEmail(user.email);
    }
  }, [user]);

  const initials = displayName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={s.shell}>
      {/* ── Top bar ── */}
      <div style={s.topBar}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoMark}>
            <Shield size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={s.logoText}>AuditInsight</span>
        </div>

        {/* Step indicator */}
        <div style={s.stepRow}>
          {STEPS.map((st, i) => (
            <div key={st.id} style={s.stepGroup}>
              <div style={{
                ...s.stepDot,
                ...(i < stepIndex ? s.stepDone  : {}),
                ...(i === stepIndex ? s.stepActive : {}),
              }}>
                {i < stepIndex ? <Check size={12} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{ ...s.stepLabel, ...(i === stepIndex ? s.stepLabelActive : {}) }}>
                {st.label}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ ...s.stepLine, ...(i < stepIndex ? s.stepLineDone : {}) }} />
              )}
            </div>
          ))}
        </div>

        {/* Logged-in user pill */}
        <div style={s.userPill}>
          <div style={s.userAvatar}>{initials}</div>
          <div style={s.userInfo}>
            <span style={s.userName}>{displayName}</span>
            <span style={s.userEmail}>{displayEmail}</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={s.main}>
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
  shell: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
  },

  // ── top bar ──
  topBar: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    height: 64,
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  logoRow: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "linear-gradient(135deg, #0f3d75, #1e3a8a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },

  // ── step indicator ──
  stepRow: { display: "flex", alignItems: "center" },
  stepGroup: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepActive: { background: "#1e3a8a", color: "#fff" },
  stepDone:   { background: "#22c55e", color: "#fff" },
  stepLabel:  { fontSize: 13, color: "#94a3b8", fontWeight: 500, marginRight: 6 },
  stepLabelActive: { color: "#0f172a", fontWeight: 600 },
  stepLine:   { width: 36, height: 2, background: "#e2e8f0", marginRight: 6 },
  stepLineDone: { background: "#22c55e" },

  // ── user pill ──
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 14px 6px 6px",
    borderRadius: 40,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    flexShrink: 0,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0f3d75, #1e3a8a)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo:  { display: "flex", flexDirection: "column", gap: 1 },
  userName:  { fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 },
  userEmail: { fontSize: 11, color: "#94a3b8", lineHeight: 1.2 },

  // ── main ──
  main: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "52px 40px 80px",
  },

  // ── completing overlay ──
  completingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    minHeight: 260,
  },
  spinnerRing: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "3px solid #e2e8f0",
    borderTopColor: "#1e3a8a",
    animation: "spin 0.8s linear infinite",
  } as React.CSSProperties,
  completingTitle:    { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 },
  completingSubtitle: { fontSize: 14, color: "#64748b", margin: 0 },
};

