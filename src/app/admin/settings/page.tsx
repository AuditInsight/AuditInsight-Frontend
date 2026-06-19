"use client";

import { useState } from "react";
import { usePermissions } from "@/security/access-control";
import { useAuth } from "@/context/AuthContext";
import {
  Settings, Shield, Bell, CreditCard, Globe, Lock,
  Users, Database, Mail, ChevronRight, Check, AlertCircle,
} from "lucide-react";

type Section =
  | "Platform"
  | "Security"
  | "Notifications"
  | "Billing"
  | "Integrations"
  | "Audit Logs";

const SECTIONS: { id: Section; icon: typeof Settings; desc: string }[] = [
  { id: "Platform",      icon: Globe,     desc: "General platform configuration" },
  { id: "Security",      icon: Shield,    desc: "Authentication & access control" },
  { id: "Notifications", icon: Bell,      desc: "Email and system alert settings" },
  { id: "Billing",       icon: CreditCard,desc: "Subscription plans & invoices" },
  { id: "Integrations",  icon: Database,  desc: "Third-party connections" },
  { id: "Audit Logs",    icon: Lock,      desc: "System-wide audit trail" },
];

const AUDIT_LOGS = [
  { id: 1, action: "User login",           user: "ceo@insightai.rw",        time: "2024-06-20 09:14", ip: "196.12.50.1"  },
  { id: 2, action: "Auditor approved",     user: "admin@auditinsight.com",  time: "2024-06-20 09:02", ip: "196.12.50.4"  },
  { id: 3, action: "Organisation created", user: "admin@auditinsight.com",  time: "2024-06-19 17:45", ip: "196.12.50.4"  },
  { id: 4, action: "User login",           user: "auditor@audit.rw",        time: "2024-06-19 14:33", ip: "41.211.8.22"  },
  { id: 5, action: "Password changed",     user: "accountant@insightai.rw", time: "2024-06-19 11:10", ip: "196.12.50.2"  },
  { id: 6, action: "Organisation blocked", user: "admin@auditinsight.com",  time: "2024-06-18 16:05", ip: "196.12.50.4"  },
];

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24, ...style }}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{children}</h2>;
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{label}</p>
        {desc && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 24 }}>{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: on ? "#1e3a8a" : "#cbd5e1",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 22 : 3, width: 18, height: 18,
        borderRadius: "50%", background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }} />
    </button>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0",
        fontSize: 13.5, color: "#0f172a", outline: "none", fontFamily: "inherit",
        width: 220, background: "#f8fafc", boxSizing: "border-box",
      }}
      onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", background: "#fff" })}
      onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", background: "#f8fafc" })}
    />
  );
}

export default function AdminSettingsPage() {
  const { canViewAdminPanel } = usePermissions();
  const { user } = useAuth();
  const [active, setActive] = useState<Section>("Platform");
  const [saved, setSaved] = useState(false);

  // Platform settings state
  const [platformName, setPlatformName]       = useState("AuditInsight");
  const [supportEmail, setSupportEmail]       = useState("support@auditinsight.com");
  const [defaultCurrency, setDefaultCurrency] = useState("RWF");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security state
  const [mfaRequired, setMfaRequired]         = useState(true);
  const [sessionTimeout, setSessionTimeout]   = useState("60");
  const [ipWhitelist, setIpWhitelist]         = useState(false);
  const [passwordExpiry, setPasswordExpiry]   = useState("90");

  // Notifications state
  const [emailAlerts, setEmailAlerts]             = useState(true);
  const [loginAlerts, setLoginAlerts]             = useState(true);
  const [auditSummary, setAuditSummary]           = useState(true);
  const [fraudAlerts, setFraudAlerts]             = useState(true);

  if (!canViewAdminPanel) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Shield size={40} color="#94a3b8" strokeWidth={1.5} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", margin: 0 }}>Access Restricted</p>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Platform Settings</h1>
          <p style={s.pageSubtitle}>
            Manage global configuration for AuditInsight — logged in as{" "}
            <strong style={{ color: "#0f172a" }}>{user?.fullName}</strong>
          </p>
        </div>
        <button onClick={handleSave} style={s.saveBtn}>
          {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
        </button>
      </div>

      <div style={s.layout}>
        {/* Sidebar */}
        <nav style={s.sidebar}>
          {SECTIONS.map(({ id, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{ ...s.sideItem, ...(active === id ? s.sideItemActive : {}) }}
              onMouseEnter={(e) => { if (active !== id) Object.assign(e.currentTarget.style, s.sideItemHover); }}
              onMouseLeave={(e) => { if (active !== id) Object.assign(e.currentTarget.style, s.sideItem); }}
            >
              <Icon size={16} strokeWidth={active === id ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13.5, fontWeight: active === id ? 700 : 500 }}>{id}</div>
                <div style={{ fontSize: 11, color: active === id ? "rgba(255,255,255,0.65)" : "#94a3b8", marginTop: 1 }}>{desc}</div>
              </div>
              {active === id && <ChevronRight size={14} style={{ flexShrink: 0 }} />}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={s.content}>

          {active === "Platform" && (
            <Card>
              <SectionTitle>Platform Configuration</SectionTitle>
              <p style={s.sectionDesc}>Core settings that apply across the entire AuditInsight platform.</p>
              <FieldRow label="Platform name" desc="Displayed in emails and the browser tab">
                <Input value={platformName} onChange={setPlatformName} placeholder="Platform name" />
              </FieldRow>
              <FieldRow label="Support email" desc="Where users send help requests">
                <Input value={supportEmail} onChange={setSupportEmail} placeholder="support@..." />
              </FieldRow>
              <FieldRow label="Default currency" desc="Used for billing and transaction display">
                <Input value={defaultCurrency} onChange={setDefaultCurrency} placeholder="RWF" />
              </FieldRow>
              <FieldRow label="Maintenance mode" desc="Prevents non-admin logins while enabled">
                <Toggle on={maintenanceMode} onChange={setMaintenanceMode} />
              </FieldRow>
            </Card>
          )}

          {active === "Security" && (
            <Card>
              <SectionTitle>Security & Access</SectionTitle>
              <p style={s.sectionDesc}>Authentication policies and session rules for all users.</p>
              <FieldRow label="Require MFA for all users" desc="Enforces two-factor authentication on every login">
                <Toggle on={mfaRequired} onChange={setMfaRequired} />
              </FieldRow>
              <FieldRow label="IP whitelist" desc="Restrict access to specific IP ranges">
                <Toggle on={ipWhitelist} onChange={setIpWhitelist} />
              </FieldRow>
              <FieldRow label="Session timeout (minutes)" desc="Auto-logout after inactivity">
                <Input value={sessionTimeout} onChange={setSessionTimeout} placeholder="60" />
              </FieldRow>
              <FieldRow label="Password expiry (days)" desc="Force password reset after N days">
                <Input value={passwordExpiry} onChange={setPasswordExpiry} placeholder="90" />
              </FieldRow>
            </Card>
          )}

          {active === "Notifications" && (
            <Card>
              <SectionTitle>Notification Settings</SectionTitle>
              <p style={s.sectionDesc}>Control which system events trigger email or in-app alerts.</p>
              <FieldRow label="Email alerts" desc="Send transactional emails for key events">
                <Toggle on={emailAlerts} onChange={setEmailAlerts} />
              </FieldRow>
              <FieldRow label="Login notifications" desc="Alert users of new sign-ins from unknown devices">
                <Toggle on={loginAlerts} onChange={setLoginAlerts} />
              </FieldRow>
              <FieldRow label="Weekly audit summary" desc="Email digest of audit activity every Monday">
                <Toggle on={auditSummary} onChange={setAuditSummary} />
              </FieldRow>
              <FieldRow label="Fraud alert emails" desc="Immediate notification on high-risk detections">
                <Toggle on={fraudAlerts} onChange={setFraudAlerts} />
              </FieldRow>
            </Card>
          )}

          {active === "Billing" && (
            <Card>
              <SectionTitle>Billing Overview</SectionTitle>
              <p style={s.sectionDesc}>Platform subscription status and active plan details.</p>
              <div style={s.billingGrid}>
                {[
                  { label: "Active subscriptions", value: "3", color: "#1e3a8a" },
                  { label: "Monthly revenue",       value: "RWF 1,240,000", color: "#15803d" },
                  { label: "Unpaid invoices",       value: "2", color: "#b91c1c" },
                  { label: "Trial accounts",        value: "1", color: "#92400e" },
                ].map((item) => (
                  <div key={item.label} style={s.billingCard}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</span>
                    <span style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "14px 18px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertCircle size={16} color="#1d4ed8" />
                  <p style={{ margin: 0, fontSize: 13, color: "#1d4ed8", fontWeight: 500 }}>
                    2 organisations have unpaid invoices older than 30 days.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {active === "Integrations" && (
            <Card>
              <SectionTitle>Integrations</SectionTitle>
              <p style={s.sectionDesc}>Connect AuditInsight to external services and APIs.</p>
              {[
                { name: "Email (SMTP)",   desc: "Transactional email delivery",    status: "Connected"    },
                { name: "Cloud Storage",  desc: "File and evidence document store", status: "Connected"    },
                { name: "Slack",          desc: "Compliance alert notifications",   status: "Disconnected" },
                { name: "Webhook",        desc: "Push events to external systems",  status: "Disconnected" },
              ].map((int) => (
                <div key={int.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{int.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{int.desc}</p>
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: int.status === "Connected" ? "#f0fdf4" : "#f8fafc",
                    color: int.status === "Connected" ? "#15803d" : "#64748b",
                    border: `1px solid ${int.status === "Connected" ? "#bbf7d0" : "#e2e8f0"}`,
                  }}>
                    {int.status}
                  </span>
                </div>
              ))}
            </Card>
          )}

          {active === "Audit Logs" && (
            <Card>
              <SectionTitle>System Audit Logs</SectionTitle>
              <p style={s.sectionDesc}>Full audit trail of administrative actions across the platform.</p>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Action", "User", "Time", "IP Address"].map((h) => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOGS.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{log.action}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>{log.user}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>{log.time}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748b", fontFamily: "monospace" }}>{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:        { padding: 28, background: "#f1f5f9", minHeight: "100vh" },
  pageHeader:  { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 },
  pageTitle:   { margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" },
  pageSubtitle:{ margin: "4px 0 0", fontSize: 14, color: "#64748b" },
  saveBtn: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "10px 20px", borderRadius: 10, border: "none",
    background: "#1e3a8a", color: "#fff", fontWeight: 600, fontSize: 14,
    cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
  },
  layout:  { display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" },
  sidebar: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" },
  sideItem: {
    display: "flex", alignItems: "center", gap: 11,
    padding: "12px 16px", border: "none", background: "transparent",
    cursor: "pointer", color: "#475569", fontFamily: "inherit",
    borderBottom: "1px solid #f1f5f9", transition: "background 0.15s",
  },
  sideItemActive: { background: "#1e3a8a", color: "#fff" },
  sideItemHover:  { background: "#f1f5f9", color: "#0f172a" },
  content:     { display: "flex", flexDirection: "column", gap: 20 },
  sectionDesc: { margin: "4px 0 18px", fontSize: 13.5, color: "#64748b" },
  billingGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  billingCard: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", display: "flex", flexDirection: "column" },
};
