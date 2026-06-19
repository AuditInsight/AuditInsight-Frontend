"use client";

import { useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock: organisations that have invited this auditor
const AUDITOR_ORGS = [
  { id: "org-001", name: "InsightAI Rwanda Ltd",    industry: "Financial Technology" },
  { id: "org-003", name: "East Africa Logistics",   industry: "Logistics & Transport" },
  { id: "org-002", name: "Kigali Trade Co.",         industry: "Retail & Commerce" },
];

export default function CompanySwitcher() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState(user?.organisationId ?? "org-001");

  if (role !== "AUDITOR") return null;

  const activeOrg = AUDITOR_ORGS.find((o) => o.id === activeOrgId) ?? AUDITOR_ORGS[0];

  const handleSwitch = (orgId: string) => {
    setActiveOrgId(orgId);
    setOpen(false);
    // In production this would reload tenant data; here we just persist the selection
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_org_id", orgId);
      const org = AUDITOR_ORGS.find((o) => o.id === orgId);
      if (org) localStorage.setItem("auth_org_name", org.name);
    }
    // Reload so all hooks re-read localStorage
    window.location.reload();
  };

  return (
    <div style={{ position: "relative" }}>
      <button style={s.trigger} onClick={() => setOpen((v) => !v)} title="Switch company">
        <Building2 size={13} style={{ color: "rgba(148,198,255,0.9)" }} />
        <span style={s.orgName}>{activeOrg.name}</span>
        <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
      </button>

      {open && (
        <>
          <div style={s.overlay} onClick={() => setOpen(false)} />
          <div style={s.menu}>
            <p style={s.menuLabel}>Switch Workspace</p>
            {AUDITOR_ORGS.map((org) => (
              <button
                key={org.id}
                style={{ ...s.menuItem, ...(org.id === activeOrgId ? s.menuItemActive : {}) }}
                onClick={() => handleSwitch(org.id)}
                onMouseEnter={(e) => { if (org.id !== activeOrgId) e.currentTarget.style.background = "#f1f5f9"; }}
                onMouseLeave={(e) => { if (org.id !== activeOrgId) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={s.orgIcon}>{org.name[0]}</div>
                <div style={s.orgInfo}>
                  <span style={s.orgItemName}>{org.name}</span>
                  <span style={s.orgItemSub}>{org.industry}</span>
                </div>
                {org.id === activeOrgId && <Check size={14} color="#1e3a8a" style={{ flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  trigger: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "6px 10px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer", maxWidth: 180,
  },
  orgName: {
    fontSize: 12, fontWeight: 600, color: "#fff",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
  },
  overlay: { position: "fixed", inset: 0, zIndex: 199 },
  menu: {
    position: "absolute", top: 42, right: 0,
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
    zIndex: 200, minWidth: 240, padding: "8px 0", overflow: "hidden",
  },
  menuLabel: { fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 14px 8px" },
  menuItem: {
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", padding: "10px 14px", border: "none",
    background: "transparent", cursor: "pointer", textAlign: "left",
    fontFamily: "inherit", transition: "background 0.15s",
  },
  menuItemActive: { background: "#eff6ff" },
  orgIcon: {
    width: 30, height: 30, borderRadius: 8,
    background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
    color: "#fff", fontSize: 13, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  orgInfo: { display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 },
  orgItemName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  orgItemSub:  { fontSize: 11, color: "#94a3b8" },
};
