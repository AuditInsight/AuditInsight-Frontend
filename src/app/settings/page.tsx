"use client";

import { useState } from "react";

import SettingsSidebar from "@/components/settings/SettingsSidebar";

// ORGANIZATION
import OrganizationProfileCard from "@/components/settings/organization/OrganizationProfileCard";
import FiscalYearSettings from "@/components/settings/organization/FiscalYearSettings";
import CurrencySettings from "@/components/settings/organization/CurrencySettings";

// USERS
import UsersTable from "@/components/settings/users/UsersTable";
import InviteUserModal from "@/components/settings/users/InviteUserModal";

// PERMISSIONS
import PermissionsMatrix from "@/components/settings/permissions/PermissionsMetrix";

// WORKFLOW
import WorkflowStatusesCard from "@/components/settings/workflow/WorkflowStatusesCard";
import EscalationRulesCard from "@/components/settings/workflow/EscalationRulesCard";
import AutoAssignmentCard from "@/components/settings/workflow/AutoAssignmentCard";

// COMPLIANCE
import ApprovalLimitsCard from "@/components/settings/compliance/ApprovalLimitsCard";
import SegregationRulesCard from "@/components/settings/compliance/SegregationRulesCard";
import EvidenceRequirementsCard from "@/components/settings/compliance/EvidenceRequirementsCard";

// SECURITY
import SecuritySettingsCard from "@/components/settings/security/SecuritySettingsCard";
import PasswordPolicyCard from "@/components/settings/security/PasswordPolicyCard";
import SessionManagementCard from "@/components/settings/security/SessionManagmentCard";

// AUDIT LOGS
import AuditLogsTable from "@/components/settings/audit-logs/AuditLogsTable";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";

import { theme } from "@/styles/theme";

export default function SettingsPage() {
  const [active, setActive] =
    useState<string>("Organization");

  const [inviteOpen, setInviteOpen] =
    useState<boolean>(false);

  const [dirty, setDirty] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  /* =========================
     MOCK USERS
  ========================= */
  const users = [
  {
    id: 1,
    name: "Diana Buyinza",
    email: "diana@auditinsight.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 mins ago",
  },
  {
    id: 2,
    name: "Samuel Kane",
    email: "samuel@auditinsight.com",
    role: "Auditor",
    status: "Suspended",
    lastLogin: "1 hour ago",
  },
  {
    id: 3,
    name: "Grace Uwase",
    email: "grace@auditinsight.com",
    role: "Reviewer",
    status: "Pending",
    lastLogin: "Yesterday",
  },
];

  /* =========================
     MOCK AUDIT LOGS
  ========================= */
  const logs = [
    {
      id: 1,
      user: "Diana Buyinza",
      action:
        "Changed approval limit settings",
      timestamp: "2026-05-11 09:42",
    },
    {
      id: 2,
      user: "Samuel Kane",
      action:
        "Resolved critical review issue",
      timestamp: "2026-05-11 08:10",
    },
    {
      id: 3,
      user: "Grace Uwase",
      action:
        "Uploaded supporting evidence",
      timestamp: "2026-05-10 18:32",
    },
  ];

  const handleSave = () => {
    setSaved(true);
    setDirty(false);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div style={styles.page}>
      {/* =========================
          TOOLBAR
      ========================= */}

      <div style={styles.toolbarWrap}>
        <PageToolbar
          title="Settings"
          filters={[
            "System Settings",
            "Audit Controls",
          ]}
          primaryActionLabel={
            dirty
              ? "Save Changes"
              : "Saved"
          }
        />

        <div style={styles.toolbarActions}>
          {dirty && (
            <span style={styles.unsaved}>
              Unsaved Changes
            </span>
          )}

          {saved && (
            <span style={styles.saved}>
              Changes Saved
            </span>
          )}

          <button
            disabled={!dirty}
            onClick={handleSave}
            style={{
              ...styles.saveBtn,

              opacity: dirty ? 1 : 0.5,
            }}
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* =========================
          MAIN LAYOUT
      ========================= */}
      <div style={styles.layout}>
        {/* =========================
            SIDEBAR
        ========================= */}
        <SettingsSidebar
          active={active}
          setActive={setActive}
        />

        {/* =========================
            CONTENT
        ========================= */}
        <div style={styles.content}>
          {/* =====================================
              ORGANIZATION
          ===================================== */}
          {active === "Organization" && (
            <>
              <div style={styles.grid3}>
                <OrganizationProfileCard
                  organization="AuditInsight"
                  industry="Financial Technology"
                  country="Rwanda"
                />

                <FiscalYearSettings />

                <CurrencySettings />
              </div>
            </>
          )}

          {/* =====================================
              USERS & ROLES
          ===================================== */}
          {active === "Users & Roles" && (
            <>
              <div style={styles.headerRow}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Users & Roles
                  </h2>

                  <p style={styles.sectionText}>
                    Manage auditors,
                    reviewers, and access
                    control.
                  </p>
                </div>

                <button
                  style={styles.primaryBtn}
                  onClick={() =>
                    setInviteOpen(true)
                  }
                >
                  Invite User
                </button>
              </div>

              <UsersTable users={users} />
            </>
          )}

          {/* =====================================
              PERMISSIONS
          ===================================== */}
          {active === "Permissions" && (
            <PermissionsMatrix />
          )}

          {/* =====================================
              WORKFLOW
          ===================================== */}
          {active === "Workflow" && (
            <div style={styles.grid3}>
              <WorkflowStatusesCard />

              <EscalationRulesCard />

              <AutoAssignmentCard />
            </div>
          )}

          {/* =====================================
              COMPLIANCE
          ===================================== */}
          {active === "Compliance" && (
            <div style={styles.grid3}>
              <ApprovalLimitsCard />

              <SegregationRulesCard />

              <EvidenceRequirementsCard />
            </div>
          )}

          {/* =====================================
              SECURITY
          ===================================== */}
          {active === "Security" && (
            <div style={styles.grid3}>
              <SecuritySettingsCard />

              <PasswordPolicyCard />

              <SessionManagementCard />
            </div>
          )}

          {/* =====================================
              AUDIT LOGS
          ===================================== */}
          {active === "Audit Logs" && (
            <AuditLogsTable logs={logs} />
          )}
        </div>
      </div>

      {/* =========================
          INVITE MODAL
      ========================= */}
      <InviteUserModal
        open={inviteOpen}
        onClose={() =>
          setInviteOpen(false)
        }
      />
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    padding: theme.spacing.lg,
    background:
      theme.colors.appBackground,
    minHeight: "100vh",
  },

  toolbarWrap: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  unsaved: {
    fontSize: 13,
    color: "#b45309",
    fontWeight: 600,
  },

  saved: {
    fontSize: 13,
    color: "#15803d",
    fontWeight: 600,
  },

  saveBtn: {
    height: 40,
    padding: "0 18px",
    borderRadius: 10,
    border: "none",
    background: "#1e3a8a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 20,
    alignItems: "start",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  grid3: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 20,
    alignItems: "start",
  },

  headerRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },

  sectionText: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 14,
  },

  primaryBtn: {
    height: 42,
    padding: "0 18px",
    border: "none",
    borderRadius: 10,
    background: "#1e3a8a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};