"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import { useNGOToast } from "@/components/ngo-dashboard/NGOPageLayout";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { theme } from "@/styles/theme";
import { User, Lock, Bell, Building2 } from "lucide-react";

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

type Tab = "Organisation" | "Profile" | "Notifications" | "Security";

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Organisation:  <Building2 size={15} />,
  Profile:       <User size={15} />,
  Notifications: <Bell size={15} />,
  Security:      <Lock size={15} />,
};

function SettingsContent() {
  const { user, can } = useRBAC();
  const toast = useNGOToast();
  const isDonor = user.role === "DONOR_REPRESENTATIVE";
  const canEditProfile = can("settings:profile:edit");

  const visibleTabs: Tab[] = isDonor ? ["Profile", "Security"] : ["Organisation", "Profile", "Notifications", "Security"];
  const [active, setActive] = useState<Tab>(visibleTabs[0]);

  const handleSave = () => {
    if (!canEditProfile) { toast.error("Read-only", "Your role does not have permission to save settings."); return; }
    toast.success("Settings saved", "Your changes have been saved successfully.");
  };

  return (
    <div style={{ display: "flex", gap: theme.spacing.xl, alignItems: "flex-start" }}>

      {/* Sidebar */}
      <div style={{ width: 200, flexShrink: 0, background: theme.colors.Surface, borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {visibleTabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: theme.radius.md, border: "none", background: active === tab ? theme.colors.primarySoft : "transparent", color: active === tab ? theme.colors.primary : theme.colors.textSecondary, fontWeight: active === tab ? 600 : 400, fontSize: theme.typography.sm, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left", transition: "all 0.15s" }}>
            <span style={{ color: active === tab ? theme.colors.primary : theme.colors.textMuted }}>{TAB_ICONS[tab]}</span>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: theme.spacing.lg }}>

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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.lg }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.lg }}>
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
              <Field label="Current Password" type="password" />
              <Field label="New Password"     type="password" />
              <Field label="Confirm Password" type="password" />
              <Toggle label="Two-factor authentication"     sub="Require OTP on every login" />
              <Toggle label="Session timeout after 30 min" sub="Auto sign-out on inactivity" defaultChecked />
            </div>
          </Section>
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
  );
}

export default function NGOSettingsPage() {
  return (
    <ProtectedRoute>
      <NGOPageLayout pageTitle="Settings" pageSub="Manage your organisation profile, preferences, and security.">
        <SettingsContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}
