"use client";

import { useState, useEffect } from "react";
import NGODashboardShell from "@/components/ngo/dashboard/NGODashboardShell";
import { useToast } from "@/components/ngo/NGOToast";
import PermissionGate from "@/components/ngo/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { useSettings } from "@/hooks/useSettings";
import InviteUserModal from "@/components/mse/settings/users/InviteUserModal"; // Re‑use MSE modal (dynamic role labels)
import NGOUsersTable from "@/components/ngo/settings/users/NGOUsersTable";
import SEO from "@/components/seo/SEO";
import { theme } from "@/styles/theme";
import { User, Lock, Bell, Building2, Users, Eye, EyeOff, CreditCard } from "lucide-react";
import NGOPageHeader from "@/components/ngo/dashboard/NGOPageHeader";
import BillingSettingsCard from "@/components/ngo/settings/billing/BillingSettingsCard";
import PlanChangeConfirmModal from "@/components/ngo/settings/billing/PlanChangeConfirmModal";
import PaymentCheckoutModal from "@/components/ngo/settings/billing/PaymentCheckoutModal";
import { PlanTier, BillingCycle, Subscription } from "@/types/billing";
import { usePaymentProcessor } from "@/hooks/usePaymentProcessor";

// ── Primitives ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${theme.colors.divider}` }}>
        <h2 style={{ margin: 0, fontSize: theme.typography.md, fontWeight: 700, color: theme.colors.textPrimary }}>{title}</h2>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text", readOnly = false }: { label: string; defaultValue?: string; type?: string; readOnly?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: theme.typography.xs, fontWeight: 600, color: theme.colors.textSecondary }}>{label}</label>
      <input
        type={type} defaultValue={defaultValue} readOnly={readOnly}
        style={{ padding: "9px 12px", borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, fontSize: theme.typography.sm, color: readOnly ? theme.colors.textMuted : theme.colors.textPrimary, fontFamily: "inherit", outline: "none", background: readOnly ? theme.colors.appBackground : theme.colors.Surface, cursor: readOnly ? "not-allowed" : "text" }}
      />
    </div>
  );
}

function PasswordField({ label, defaultValue }: { label: string; defaultValue?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: theme.typography.xs, fontWeight: 600, color: theme.colors.textSecondary }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type={visible ? "text" : "password"}
          defaultValue={defaultValue}
          style={{ padding: "9px 12px", paddingRight: "36px", borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`, fontSize: theme.typography.sm, color: theme.colors.textPrimary, fontFamily: "inherit", outline: "none", background: theme.colors.Surface, width: "100%", boxSizing: "border-box" }}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.textMuted }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, sub, defaultChecked, disabled = false }: { label: string; sub?: string; defaultChecked?: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.colors.divider}` }}>
      <div>
        <p style={{ margin: 0, fontSize: theme.typography.sm, fontWeight: 600, color: theme.colors.textPrimary }}>{label}</p>
        {sub && <p style={{ margin: "2px 0 0", fontSize: theme.typography.xs, color: theme.colors.textMuted }}>{sub}</p>}
      </div>
      <button onClick={() => !disabled && setOn((v) => !v)} disabled={disabled} style={{ width: 42, height: 24, borderRadius: 999, border: "none", cursor: disabled ? "not-allowed" : "pointer", background: on ? theme.colors.primary : theme.colors.surfaceDark, position: "relative", transition: "background 0.2s", flexShrink: 0, opacity: disabled ? 0.5 : 1 }}>
        <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: theme.shadows.xs }} />
      </button>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────────

type Tab = "Organisation" | "Profile" | "Notifications" | "Security" | "Users" | "Billing and Plans";

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Organisation:  <Building2 size={15} />,
  Profile:       <User size={15} />,
  Notifications: <Bell size={15} />,
  Security:      <Lock size={15} />,
  Users:         <Users size={15} />,
  "Billing and Plans": <CreditCard size={15} />,
};

function SettingsContent() {
  const { user, can } = useRBAC();
  const { members, inviteMember } = useSettings();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription>({
    id: "sub_default",
    organisationId: user.organisationId,
    planTier: "PROFESSIONAL",
    billingCycle: "MONTHLY",
    status: "ACTIVE",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [confirmPlanChange, setConfirmPlanChange] = useState<{
    plan: PlanTier;
    cycle: BillingCycle;
  } | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [processingPlanChange, setProcessingPlanChange] = useState(false);

  const toast = useToast();
  const isDonor = user.role === "DONOR_REPRESENTATIVE";
  const canEditProfile = can("settings:profile:edit");

  const paymentProcessor = usePaymentProcessor({
    organisationId: user.organisationId,
    planTier: subscription.planTier,
    billingCycle: subscription.billingCycle,
  });


  const visibleTabs: Tab[] = isDonor ? ["Profile", "Security", "Billing and Plans"] : ["Organisation", "Profile", "Notifications", "Security", "Users", "Billing and Plans"];
  const [active, setActive] = useState<Tab>(visibleTabs[0]);

  const handleSave = () => {
    if (!canEditProfile) {
      toast.error("Read-only", "Your role does not have permission to save settings.");
      return;
    }
    toast.success("Settings saved", "Your changes have been saved successfully.");
  };

  const handlePlanChange = (plan: PlanTier, cycle: BillingCycle) => {
    if (!subscription) return;

    // If current plan is FREE and selecting FREE, no payment needed
    if (subscription.planTier === "FREE" && plan === "FREE") {
      toast.success("Plan updated", "Your plan has been updated.");
      return;
    }

    // If selecting FREE plan, allow direct downgrade
    if (plan === "FREE") {
      setConfirmPlanChange({ plan, cycle });
      return;
    }

    // For paid plans, show confirmation first
    setConfirmPlanChange({ plan, cycle });
  };

  const handleConfirmPlanChange = async () => {
    if (!confirmPlanChange || !subscription) return;

    const { plan, cycle } = confirmPlanChange;

    // If current plan is FREE, open payment modal for upgrade
    if (subscription.planTier === "FREE") {
      setPaymentOpen(true);
      setConfirmPlanChange(null);
      return;
    }

    // If downgrading to FREE or same paid plan with different cycle
    if (plan === "FREE" || (plan === subscription.planTier && cycle === subscription.billingCycle)) {
      setProcessingPlanChange(true);
      try {
        // Just update the plan without payment
        toast.success("Plan updated", `Your plan has been updated to ${plan}.`);
        setSubscription({
          ...subscription,
          planTier: plan,
          billingCycle: cycle,
        });
      } catch (error) {
        toast.error("Failed", "Could not update your plan. Please try again.");
      } finally {
        setProcessingPlanChange(false);
        setConfirmPlanChange(null);
      }
      return;
    }

    // For plan or cycle change with payment required
    setPaymentOpen(true);
    setConfirmPlanChange(null);
  };

  const handlePaymentSuccess = (updatedSubscription: Subscription) => {
    setSubscription(updatedSubscription);
    setPaymentOpen(false);
    toast.success(
      "Subscription updated",
      `Your subscription to ${updatedSubscription.planTier} plan is now active.`
    );
  };

  return (
    <>
    <SEO title="NGO Settings" description="Manage organisation profile, notifications and team members for your NGO." />
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xl }}>
      <NGOPageHeader title="Settings" subtitle="Manage your organisation profile, preferences, and security." />
      <style>{`
        .ngo-settings { display: flex; gap: 24px; align-items: flex-start; }
        .ngo-settings-sidebar { width: 200px; flex-shrink: 0; }
        .ngo-settings-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
        .ngo-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          .ngo-settings { flex-direction: column; }
          .ngo-settings-sidebar { width: 100%; display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; padding: 10px !important; }
          .ngo-settings-sidebar button { flex: 1; min-width: 120px; }
        }
        @media (max-width: 480px) {
          .ngo-field-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="ngo-settings">

      {/* Sidebar */}
      <div className="ngo-settings-sidebar" style={{ background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {visibleTabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: theme.radius.md, border: "none", background: active === tab ? theme.colors.primarySoft : "transparent", color: active === tab ? theme.colors.primary : theme.colors.textSecondary, fontWeight: active === tab ? 600 : 400, fontSize: theme.typography.sm, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left", transition: "all 0.15s" }}>
            <span style={{ color: active === tab ? theme.colors.primary : theme.colors.textMuted }}>{TAB_ICONS[tab]}</span>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ngo-settings-body">

        {active === "Organisation" && (
          <PermissionGate
            permission="settings:org:edit"
            fallback={
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: theme.radius.md, background: theme.colors.warningBg, border: `1px solid #fde68a` }}>
                <Lock size={14} style={{ color: theme.colors.warning, flexShrink: 0 }} />
                <span style={{ fontSize: theme.typography.sm, color: "#92400e" }}>Organisation settings are restricted to Executive Directors only.</span>
              </div>
            }
          >
            <Section title="Organisation Profile">
              <div className="ngo-field-grid">
                <Field label="Organisation Name"   defaultValue="Rwanda Health Foundation" />
                <Field label="Registration Number" defaultValue="NGO-RW-2019-0042" />
                <Field label="Country"             defaultValue="Rwanda" />
                <Field label="Primary Donor"       defaultValue="USAID" />
                <Field label="Contact Email"       defaultValue="info@rwandahealth.org" type="email" />
                <Field label="Phone Number"        defaultValue="+250 788 000 000" />
              </div>
            </Section>
          </PermissionGate>
        )}

        {active === "Profile" && (
          <Section title="Personal Profile">
            {isDonor && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", borderRadius: theme.radius.md, background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
                <Lock size={13} style={{ color: "#7c3aed", flexShrink: 0 }} />
                <span style={{ fontSize: theme.typography.xs, color: "#5b21b6", fontWeight: 500 }}>Profile fields are read-only for Donor Representatives.</span>
              </div>
            )}
            <div className="ngo-field-grid">
              <Field label="Full Name"  defaultValue={user.fullName}  readOnly={isDonor} />
              <Field label="Job Title"  defaultValue={isDonor ? "Donor Representative" : "Finance Officer"} readOnly={isDonor} />
              <Field label="Email"      defaultValue={user.email}     type="email" readOnly={isDonor} />
              <Field label="Phone"      defaultValue="+250 788 111 222" readOnly={isDonor} />
              {isDonor && user.assignedDonorId && <Field label="Assigned Donor" defaultValue={user.assignedDonorId} readOnly />}
            </div>
          </Section>
        )}

        {active === "Notifications" && !isDonor && (
          <Section title="Notification Preferences">
            <Toggle label="New audit flag raised"     sub="Get notified when a transaction is flagged"  defaultChecked />
            <Toggle label="Evidence upload required"  sub="Reminders for pending evidence"              defaultChecked />
            <Toggle label="Donor report due"          sub="Alerts before donor report deadlines"        defaultChecked />
            <Toggle label="Transaction approved"      sub="Notify when a transaction is approved" />
            <Toggle label="Weekly compliance summary" sub="Email digest every Monday" />
          </Section>
        )}

        {active === "Security" && (
          <Section title="Security Settings">
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>
              <PasswordField label="Current Password" />
              <PasswordField label="New Password" />
              <PasswordField label="Confirm Password" />
              <Toggle label="Two-factor authentication"     sub="Require OTP on every login" />
              <Toggle label="Session timeout after 30 min" sub="Auto sign-out on inactivity" defaultChecked />
            </div>
          </Section>
        )}
        {active === "Users" && (
          <Section title="Team Members">
            <PermissionGate permission="settings:org:edit" fallback={null}>
              <button
                onClick={() => setInviteOpen(true)}
                style={{
                  padding: "10px 20px",
                  background: theme.colors.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  marginBottom: 12,
                }}
              >
                Invite Member
              </button>
            </PermissionGate>
            <NGOUsersTable users={members} />
            <InviteUserModal
              open={inviteOpen}
              onClose={() => setInviteOpen(false)}
              onInvite={inviteMember}
            />
          </Section>
        )}

        {active === "Billing and Plans" && (
          <>
            <Section title="Current Subscription">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <p style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 600, color: theme.colors.textMuted }}>
                      {loadingSubscription ? (
                        <span style={{ display: "inline-block", height: 12, width: 80, background: theme.colors.border, borderRadius: 4 }} />
                      ) : (
                        ["PLAN", "BILLING CYCLE", "ACTIVE UNTIL", "STATUS"][i]
                      )}
                    </p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.textPrimary, minHeight: 24 }}>
                      {loadingSubscription ? (
                        <span style={{ display: "inline-block", height: 24, width: 120, background: theme.colors.border, borderRadius: 4 }} />
                      ) : i === 0 ? (
                        subscription?.planTier || "Unknown"
                      ) : i === 1 ? (
                        subscription?.billingCycle || "Unknown"
                      ) : i === 2 ? (
                        subscription ? new Date(subscription.endDate).toLocaleDateString() : "Unknown"
                      ) : (
                        subscription?.status || "Unknown"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Available Plans">
              {subscription && !loadingSubscription ? (
                <>
                  <BillingSettingsCard
                    subscription={subscription}
                    onPlanChange={handlePlanChange}
                    loading={processingPlanChange}
                  />

                  {/* Confirmation Modal */}
                  {confirmPlanChange && (
                    <PlanChangeConfirmModal
                      open={!!confirmPlanChange}
                      currentPlan={subscription.planTier}
                      newPlan={confirmPlanChange.plan}
                      cycle={confirmPlanChange.cycle}
                      onConfirm={handleConfirmPlanChange}
                      onCancel={() => setConfirmPlanChange(null)}
                      loading={processingPlanChange}
                    />
                  )}

                  {/* Payment Modal */}
                  {confirmPlanChange && (
                    <PaymentCheckoutModal
                      open={paymentOpen}
                      plan={confirmPlanChange.plan}
                      cycle={confirmPlanChange.cycle}
                      organisationId={user.organisationId}
                      onClose={() => setPaymentOpen(false)}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}
                </>
              ) : loadingSubscription ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Skeleton loader matching BillingSettingsCard layout */}
                  <div style={{ height: 120, background: theme.colors.appBackground, borderRadius: theme.radius.md, animation: "pulse 2s infinite" }} />
                  <div style={{ height: 200, background: theme.colors.appBackground, borderRadius: theme.radius.md, animation: "pulse 2s infinite" }} />
                  <div style={{ height: 160, background: theme.colors.appBackground, borderRadius: theme.radius.md, animation: "pulse 2s infinite" }} />
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ color: theme.colors.warning }}>
                    Could not load subscription information. Please refresh the page.
                  </p>
                </div>
              )}
            </Section>
          </>
        )}

        {!isDonor && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSave} style={{ padding: "10px 24px", borderRadius: theme.radius.md, border: "none", background: theme.colors.primary, color: "#fff", fontSize: theme.typography.sm, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: theme.shadows.sm }}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
}

export default function NGOSettingsPage() {
  return (
    <ProtectedRoute>
      <NGODashboardShell>
        <SettingsContent />
      </NGODashboardShell>
    </ProtectedRoute>
  );
}


