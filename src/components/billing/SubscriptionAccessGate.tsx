"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Loader2, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext.production";
import { usePlans } from "@/hooks/usePlans";
import { formatRwf } from "@/types/billing";
import type { SubscriptionType } from "@/types/billing";
import { getOrganisationAccess, type AccessResponse } from "@/utils/api";
import CheckoutModal from "@/components/payment/CheckoutModal";

type AccessState = "loading" | "active" | "unpaid" | "error";

const DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? DATE.format(new Date(parsed)) : null;
}

/**
 * Shows the workspace only when the backend says the organisation has access: a current paid period, a trial a
 * Super Admin authorised, or the platform emergency override. Otherwise asks for payment. The browser never
 * decides access itself; it only displays the backend's decision.
 */
export default function SubscriptionAccessGate({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { plans, loading: plansLoading, error: plansError, refetch } = usePlans();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let current = true;
    const organisationId = user?.organisationId;
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        setRetryCount((count) => count + 1);
      }
    };

    if (!organisationId) {
      Promise.resolve().then(() => {
        if (current) setAccessState("error");
      });
      return () => {
        current = false;
      };
    }

    window.addEventListener("focus", refreshWhenVisible);
    const refreshInterval = window.setInterval(refreshWhenVisible, 60_000);

    getOrganisationAccess(organisationId)
      .then(({ data }) => {
        if (!current) return;
        setAccess(data);
        setAccessState(data.hasAccess ? "active" : "unpaid");
      })
      .catch(() => {
        if (current) setAccessState("error");
      });

    return () => {
      current = false;
      window.removeEventListener("focus", refreshWhenVisible);
      window.clearInterval(refreshInterval);
    };
  }, [retryCount, user?.organisationId]);

  const retryAccessCheck = useCallback(() => {
    setAccessState("loading");
    setRetryCount((count) => count + 1);
  }, []);

  const handlePaymentSuccess = () => {
    setSelectedPlan(null);
    retryAccessCheck();
  };

  if (accessState === "active") {
    return (
      <>
        <AccessBanner access={access} />
        {children}
      </>
    );
  }

  if (accessState === "loading") {
    return (
      <div style={styles.centered}>
        <Loader2 size={32} style={styles.spinner} />
        <p style={styles.muted}>Checking your organisation’s access…</p>
      </div>
    );
  }

  if (accessState === "error") {
    return (
      <div style={styles.centered}>
        <section style={styles.card}>
          <Image src="/logo.svg" alt="AuditInsight" width={42} height={42} style={styles.logo} />
          <h1 style={styles.title}>We couldn’t verify your subscription</h1>
          <p style={styles.description}>
            Your workspace is being kept unavailable until we can confirm its subscription status.
            Please try again.
          </p>
          {!user?.organisationId && (
            <p style={styles.error}>This account is not linked to an organisation.</p>
          )}
          <button type="button" onClick={retryAccessCheck} style={styles.primaryButton}>
            <RefreshCw size={16} /> Try again
          </button>
        </section>
      </div>
    );
  }

  const trialEnded = access?.trial && !access.trial.current ? formatDate(access.trial.endsAt) : null;
  const requestedPlan = access?.requestedPlan ?? null;

  return (
    <div style={styles.centered}>
      <section style={styles.card}>
        <Image src="/logo.svg" alt="AuditInsight" width={42} height={42} style={styles.logo} />
        <div style={styles.icon}>
          <CreditCard size={24} />
        </div>
        <p style={styles.eyebrow}>SUBSCRIPTION REQUIRED</p>
        <h1 style={styles.title}>
          {trialEnded ? "Your free trial has ended" : "Pay to use the AuditInsight platform"}
        </h1>
        <p style={styles.description}>
          {trialEnded
            ? `Your trial ended on ${trialEnded}. Choose a plan below to keep using your workspace. Your data is safe.`
            : "Your organisation needs an active paid subscription to use its workspace. Choose a plan below to unlock transactions, evidence, reports, and the rest of the platform."}
        </p>

        {plansLoading ? (
          <div style={styles.planStatus}>
            <Loader2 size={18} style={styles.spinner} />
            Loading current plans and prices…
          </div>
        ) : plansError ? (
          <div style={styles.planError}>
            <p>{plansError} Payment options are unavailable until the current prices can be loaded.</p>
            <button type="button" onClick={refetch} style={styles.secondaryButton}>
              <RefreshCw size={15} /> Retry loading plans
            </button>
          </div>
        ) : (
          <div style={styles.plans}>
            {plans.map((plan) => (
              <article
                key={plan.id}
                style={plan.id === requestedPlan ? { ...styles.planCard, ...styles.planCardChosen } : styles.planCard}
              >
                {plan.id === requestedPlan && <p style={styles.chosenTag}>Chosen at sign-up</p>}
                <h2 style={styles.planName}>{plan.name}</h2>
                <p style={styles.price}>{formatRwf(plan.price)}</p>
                <p style={styles.billed}>{plan.billed}</p>
                <button type="button" onClick={() => setSelectedPlan(plan.id)} style={styles.primaryButton}>
                  Pay with Mobile Money
                </button>
              </article>
            ))}
          </div>
        )}

        <div style={styles.secureNote}>
          <ShieldCheck size={16} />
          Your workspace will be available once payment is confirmed.
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = "/log-in";
          }}
          style={styles.logoutButton}
        >
          <LogOut size={15} /> Sign out
        </button>
      </section>

      {selectedPlan && user?.organisationId && (
        <CheckoutModal
          open
          plan={selectedPlan}
          organisationId={user.organisationId}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

/** A slim note above the workspace while it runs on a trial or the emergency override. */
function AccessBanner({ access }: { access: AccessResponse | null }) {
  if (!access) return null;
  const until = formatDate(access.accessUntil);
  const paidStarts = formatDate(access.nextPaid?.startDate);
  let text: string;
  if (access.basis === "TRIAL") {
    text = paidStarts
      ? `Free trial until ${until}. Your paid plan starts on ${paidStarts}.`
      : `Free trial until ${until}. Choose a plan in Billing to keep access afterwards.`;
  } else if (access.basis === "EMERGENCY_OVERRIDE") {
    text = `Temporary platform-wide access until ${until}.`;
  } else {
    return null;
  }
  return (
    <div role="status" style={styles.banner}>
      {text}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  centered: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    color: "#0f172a",
  },
  card: {
    width: "100%",
    maxWidth: 960,
    padding: "clamp(24px, 5vw, 48px)",
    borderRadius: 20,
    background: "#fff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 48px rgba(15, 23, 42, 0.08)",
    textAlign: "center",
  },
  logo: { width: 42, height: 42, objectFit: "contain", marginBottom: 16 },
  icon: {
    width: 52,
    height: 52,
    margin: "0 auto 12px",
    borderRadius: 16,
    background: "#eff6ff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: { margin: "0 0 8px", color: "#1e3a8a", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em" },
  title: { margin: "0 auto 10px", maxWidth: 650, fontSize: "clamp(24px, 4vw, 34px)", lineHeight: 1.2, fontWeight: 800 },
  description: { margin: "0 auto 28px", maxWidth: 650, color: "#64748b", fontSize: 15, lineHeight: 1.65 },
  plans: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    textAlign: "left",
  },
  planCard: { padding: 20, border: "1px solid #e2e8f0", borderRadius: 14, background: "#fff" },
  planName: { margin: 0, fontSize: 15, fontWeight: 700 },
  price: { margin: "14px 0 2px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" },
  billed: { margin: "0 0 16px", fontSize: 12, color: "#64748b" },
  primaryButton: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px 16px",
    border: 0,
    borderRadius: 10,
    background: "#1e3a8a",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  planStatus: { display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: 24, color: "#475569" },
  planError: { padding: 18, borderRadius: 12, background: "#fff7ed", color: "#9a3412", fontSize: 14 },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    background: "#fff",
    color: "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  },
  secureNote: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, color: "#64748b", fontSize: 13 },
  logoutButton: { display: "inline-flex", alignItems: "center", gap: 7, marginTop: 20, padding: 8, border: 0, background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" },
  muted: { marginTop: 14, color: "#64748b", fontSize: 14 },
  error: { margin: "0 0 16px", color: "#b91c1c", fontSize: 13 },
  spinner: { color: "#1e3a8a", animation: "subscription-spin 1s linear infinite" },
  planCardChosen: { borderColor: "#1e3a8a", boxShadow: "0 0 0 1px #1e3a8a" },
  chosenTag: { margin: "0 0 8px", color: "#1e3a8a", fontSize: 11, fontWeight: 700 },
  banner: { padding: "8px 16px", background: "#eff6ff", borderBottom: "1px solid #bfdbfe", color: "#1e3a8a", fontSize: 13, textAlign: "center" },
};
