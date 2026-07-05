"use client";

import { useState } from "react";
import NGOPageLayout from "@/components/ngo-dashboard/NGOPageLayout";
import { useNGOToast } from "@/components/ngo-dashboard/NGOPageLayout";
import PermissionGate from "@/components/ngo-dashboard/rbac/PermissionGate";
import { useRBAC } from "@/context/RBACContext";
import { ProtectedRoute } from "@/components/Guards";
import { User, Lock, Bell, Building2 } from "lucide-react";

// ── Shared primitives ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label, defaultValue, type = "text", readOnly = false,
}: {
  label: string; defaultValue?: string; type?: string; readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={`px-3 py-2.5 rounded-xl border text-sm text-slate-900 font-[inherit] outline-none transition-colors ${
          readOnly
            ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }`}
      />
    </div>
  );
}

function Toggle({
  label, sub, defaultChecked, disabled = false,
}: {
  label: string; sub?: string; defaultChecked?: boolean; disabled?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => !disabled && setOn((v) => !v)}
        disabled={disabled}
        style={{
          width: 42, height: 24, borderRadius: 999, border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: on ? "#1e3a8a" : "#e2e8f0",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

// ── Settings content ───────────────────────────────────────────────────────────

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

  const canEditOrg     = can("settings:org:edit");
  const canEditProfile = can("settings:profile:edit");
  const isDonor        = user.role === "DONOR_REPRESENTATIVE";

  // DONOR_REPRESENTATIVE only sees Profile + Security tabs
  const visibleTabs: Tab[] = isDonor
    ? ["Profile", "Security"]
    : ["Organisation", "Profile", "Notifications", "Security"];

  const [active, setActive] = useState<Tab>(visibleTabs[0]);

  const handleSave = () => {
    if (!canEditProfile) {
      toast.error("Read-only", "Your role does not have permission to save settings.");
      return;
    }
    toast.success("Settings saved", "Your changes have been saved successfully.");
  };

  return (
    <div className="flex gap-5 items-start">
      {/* Sidebar tabs */}
      <div className="w-48 flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex flex-col gap-1">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-none text-sm cursor-pointer font-[inherit] w-full text-left transition-colors ${
              active === tab
                ? "bg-blue-50 text-blue-900 font-semibold"
                : "bg-transparent text-slate-500 hover:bg-slate-50 font-normal"
            }`}
          >
            <span style={{ color: active === tab ? "#1e3a8a" : "#94a3b8" }}>
              {TAB_ICONS[tab]}
            </span>
            {tab}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="flex-1 flex flex-col gap-4">

        {/* Organisation — ORG_ADMIN only (settings:org:edit) */}
        {active === "Organisation" && (
          <PermissionGate
            permission="settings:org:edit"
            fallback={
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                <Lock size={14} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-medium">
                  Organisation settings are restricted to Executive Directors only.
                </p>
              </div>
            }
          >
            <Section title="Organisation Profile">
              <div className="grid grid-cols-2 gap-4">
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

        {/* Profile — all roles, read-only for DONOR_REPRESENTATIVE */}
        {active === "Profile" && (
          <Section title="Personal Profile">
            {isDonor && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-violet-50 border border-violet-200">
                <Lock size={13} className="text-violet-500 flex-shrink-0" />
                <p className="text-xs text-violet-700 font-medium">
                  Profile fields are read-only for Donor Representatives.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name"  defaultValue={user.fullName}  readOnly={isDonor} />
              <Field label="Job Title"  defaultValue={isDonor ? "Donor Representative" : "Finance Officer"} readOnly={isDonor} />
              <Field label="Email"      defaultValue={user.email}     type="email" readOnly={isDonor} />
              <Field label="Phone"      defaultValue="+250 788 111 222" readOnly={isDonor} />
              {isDonor && user.assignedDonorId && (
                <Field label="Assigned Donor" defaultValue={user.assignedDonorId} readOnly />
              )}
            </div>
          </Section>
        )}

        {/* Notifications — hidden for DONOR_REPRESENTATIVE */}
        {active === "Notifications" && !isDonor && (
          <Section title="Notification Preferences">
            <Toggle label="New audit flag raised"     sub="Get notified when a transaction is flagged"  defaultChecked />
            <Toggle label="Evidence upload required"  sub="Reminders for pending evidence"              defaultChecked />
            <Toggle label="Donor report due"          sub="Alerts before donor report deadlines"        defaultChecked />
            <Toggle label="Transaction approved"      sub="Notify when a transaction is approved" />
            <Toggle label="Weekly compliance summary" sub="Email digest every Monday" />
          </Section>
        )}

        {/* Security — all roles */}
        {active === "Security" && (
          <Section title="Security Settings">
            <div className="flex flex-col gap-4">
              <Field label="Current Password" type="password" />
              <Field label="New Password"     type="password" />
              <Field label="Confirm Password" type="password" />
              <Toggle label="Two-factor authentication"    sub="Require OTP on every login" />
              <Toggle label="Session timeout after 30 min" sub="Auto sign-out on inactivity" defaultChecked />
            </div>
          </Section>
        )}

        {/* Save — hidden for DONOR_REPRESENTATIVE (read-only profile) */}
        {!isDonor && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
            >
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
      <NGOPageLayout
        pageTitle="Settings"
        pageSub="Manage your organisation profile, preferences, and security."
      >
        <SettingsContent />
      </NGOPageLayout>
    </ProtectedRoute>
  );
}
