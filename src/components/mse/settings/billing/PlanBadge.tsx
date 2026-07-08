"use client";

import { Subscription, PRICING_PLANS, PaymentStatus } from "@/types/billing";

interface Props {
  subscription: Subscription;
}

const STATUS_STYLES: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  active:    { bg: "#dcfce7", color: "#16a34a", label: "Active" },
  trialing:  { bg: "#dbeafe", color: "#1d4ed8", label: "Trial" },
  past_due:  { bg: "#fef9c3", color: "#a16207", label: "Past Due" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c", label: "Cancelled" },
};

function daysLeft(isoDate: string): number {
  return Math.max(0, Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86400000));
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function PlanBadge({ subscription }: Props) {
  const plan = PRICING_PLANS.find(p => p.id === subscription.plan)!;
  const status = STATUS_STYLES[subscription.status];
  const days = daysLeft(subscription.currentPeriodEnd);
  const isWarning = days <= 7 && subscription.status === "active";

  return (
    <div style={s.card}>
      <div style={s.left}>
        <div style={s.planIcon}>💎</div>
        <div>
          <div style={s.planName}>{plan.name} Plan</div>
          <div style={s.meta}>
            {subscription.billingCycle === "annual" ? "Annual billing" : "Monthly billing"}
            {" · "}
            <span style={{ ...s.statusBadge, background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
        </div>
      </div>
      <div style={s.right}>
        <div style={{ ...s.renewalBox, ...(isWarning ? s.renewalWarning : {}) }}>
          <div style={s.renewalLabel}>{subscription.cancelAtPeriodEnd ? "Expires" : "Renews"}</div>
          <div style={s.renewalDate}>{formatDate(subscription.currentPeriodEnd)}</div>
          <div style={{ ...s.daysLeft, color: isWarning ? "#b45309" : "#64748B" }}>
            {days === 0 ? "Today" : `${days} day${days !== 1 ? "s" : ""} left`}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: { background: "linear-gradient(135deg,#0c2d6b,#1e3a8a)", borderRadius: 14, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 },
  left: { display: "flex", alignItems: "center", gap: 14 },
  planIcon: { fontSize: 32, lineHeight: 1 },
  planName: { fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" },
  meta: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 },
  statusBadge: { fontSize: 11.5, fontWeight: 700, padding: "2px 9px", borderRadius: 20 },
  right: {},
  renewalBox: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 120 },
  renewalWarning: { background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.40)" },
  renewalLabel: { fontSize: 11, color: "rgba(255,255,255,0.60)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 },
  renewalDate: { fontSize: 15, fontWeight: 700, color: "#fff" },
  daysLeft: { fontSize: 12, marginTop: 2, fontWeight: 500 },
};


