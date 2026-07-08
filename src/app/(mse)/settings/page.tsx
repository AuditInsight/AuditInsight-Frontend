"use client";

import { useState } from "react";

import SettingsSidebar from "@/components/mse/settings/SettingsSidebar";
import OrganizationProfileCard from "@/components/mse/settings/organization/OrganizationProfileCard";
import FiscalYearSettings from "@/components/mse/settings/organization/FiscalYearSettings";
import CurrencySettings from "@/components/mse/settings/organization/CurrencySettings";
import UsersTable from "@/components/mse/settings/users/UsersTable";
import InviteUserModal from "@/components/mse/settings/users/InviteUserModal";
import PermissionsMatrix from "@/components/mse/settings/permissions/PermissionsMetrix";
import WorkflowStatusesCard from "@/components/mse/settings/workflow/WorkflowStatusesCard";
import EscalationRulesCard from "@/components/mse/settings/workflow/EscalationRulesCard";
import AutoAssignmentCard from "@/components/mse/settings/workflow/AutoAssignmentCard";
import ApprovalLimitsCard from "@/components/mse/settings/compliance/ApprovalLimitsCard";
import SegregationRulesCard from "@/components/mse/settings/compliance/SegregationRulesCard";
import EvidenceRequirementsCard from "@/components/mse/settings/compliance/EvidenceRequirementsCard";
import SecuritySettingsCard from "@/components/mse/settings/security/SecuritySettingsCard";
import PasswordPolicyCard from "@/components/mse/settings/security/PasswordPolicyCard";
import SessionManagementCard from "@/components/mse/settings/security/SessionManagmentCard";
import AuditLogsTable from "@/components/mse/settings/audit-logs/AuditLogsTable";
import BillingSettingsCard from "@/components/mse/settings/billing/BillingSettingsCard";
import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { theme } from "@/styles/theme";

/*
 * ── REAL API (commented for RBAC UI testing) ──────────────────
 * Previously: import { getOrganisationMembers, getOrganisation } from "@/utils/api";
 * Now managed by useSettings hook.
 * ──────────────────────────────────────────────────────────────
 */
import { useSettings } from "@/hooks/useSettings";
import { usePermissions } from "@/security/access-control";

export default function SettingsPage() {
  const { org, orgLoading, members, membersLoading, inviteMember } = useSettings();
  const { canManageOrganisation, canInviteMembers } = usePermissions();

  const [active, setActive] = useState<string>("Organization");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Role guard: only Admin (CLIENT) can access settings ──
  if (!canManageOrganisation) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Access Restricted</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>Only the Organisation Admin can access Settings.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.toolbarWrap}>
        <PageToolbar title="Settings" filters={["System Settings", "Audit Controls"]} primaryActionLabel={dirty ? "Save Changes" : "Saved"} />
        <div style={styles.toolbarActions}>
          {dirty && <span style={styles.unsaved}>Unsaved Changes</span>}
          {saved && <span style={styles.saved}>Changes Saved</span>}
          <button disabled={!dirty} onClick={handleSave} style={{ ...styles.saveBtn, opacity: dirty ? 1 : 0.5 }}>
            Save Settings
          </button>
        </div>
      </div>

      <div style={styles.layout} className="settings-page-layout">
        <SettingsSidebar active={active} setActive={setActive} />

        <div style={styles.content}>
          {active === "Organization" && (
            <div style={styles.grid3} className="settings-grid3">
              <OrganizationProfileCard
                organization={orgLoading ? "Loading…" : (org?.name ?? "—")}
                industry={orgLoading ? "…" : (org?.industry ?? "—")}
                country="—"
              />
              <FiscalYearSettings />
              <CurrencySettings />
            </div>
          )}

          {active === "Users & Roles" && (
            <>
              <div style={styles.headerRow}>
                <div>
                  <h2 style={styles.sectionTitle}>Users & Roles</h2>
                  <p style={styles.sectionText}>Manage auditors, reviewers, and access control.</p>
                </div>
                {/* ── Role guard: only Admin can invite users ── */}
                {canInviteMembers && (
                  <button style={styles.primaryBtn} onClick={() => setInviteOpen(true)}>
                    Invite User
                  </button>
                )}
              </div>
              {membersLoading ? (
                <p style={{ color: "#6b7280", fontSize: 14 }}>Loading members…</p>
              ) : (
                <UsersTable users={members} />
              )}
            </>
          )}

          {active === "Permissions" && <PermissionsMatrix />}
          {active === "Workflow" && (
            <div style={styles.grid3} className="settings-grid3">
              <WorkflowStatusesCard />
              <EscalationRulesCard />
              <AutoAssignmentCard />
            </div>
          )}
          {active === "Compliance" && (
            <div style={styles.grid3} className="settings-grid3">
              <ApprovalLimitsCard />
              <SegregationRulesCard />
              <EvidenceRequirementsCard />
            </div>
          )}
          {active === "Security" && (
            <div style={styles.grid3} className="settings-grid3">
              <SecuritySettingsCard />
              <PasswordPolicyCard />
              <SessionManagementCard />
            </div>
          )}
          {active === "Billing & Plans" && <BillingSettingsCard />}
          {active === "Audit Logs" && <AuditLogsTable />}
        </div>
      </div>

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={(email, role) => { inviteMember(email, role); setInviteOpen(false); }}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: theme.spacing.lg, background: theme.colors.appBackground, minHeight: "100vh" },
  toolbarWrap: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  toolbarActions: { display: "flex", alignItems: "center", gap: 14 },
  unsaved: { fontSize: 13, color: "#b45309", fontWeight: 600 },
  saved: { fontSize: 13, color: "#15803d", fontWeight: 600 },
  saveBtn: { height: 40, padding: "0 18px", borderRadius: 10, border: "none", background: "#1e3a8a", color: "#fff", cursor: "pointer", fontWeight: 600 },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" },
  content: { display: "flex", flexDirection: "column", gap: 20 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" },
  sectionText: { marginTop: 4, color: "#6b7280", fontSize: 14 },
  primaryBtn: { height: 42, padding: "0 18px", border: "none", borderRadius: 10, background: "#1e3a8a", color: "#fff", cursor: "pointer", fontWeight: 600 },
};


