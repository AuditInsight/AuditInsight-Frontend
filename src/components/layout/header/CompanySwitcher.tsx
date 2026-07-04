"use client";

import { useState } from "react";
import { Building2, ChevronDown, Check, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext.production";
import { OwnedOrganisation } from "@/types/user";

// Auditor-only: orgs that have invited this auditor
const AUDITOR_ORGS: OwnedOrganisation[] = [
  { id: "org-001", name: "InsightAI Rwanda Ltd",  industry: "Financial Technology"  },
  { id: "org-003", name: "East Africa Logistics", industry: "Logistics & Transport" },
  { id: "org-002", name: "Kigali Trade Co.",       industry: "Retail & Commerce"     },
];

export default function CompanySwitcher() {
  const { user } = useAuth();
  const role = user?.role ?? null;
  // switchOrganisation and addOrganisation are not in the production context.
  // These are UI-only operations that update localStorage and reload the page.
  const [open,       setOpen]       = useState(false);
  const [addOpen,    setAddOpen]    = useState(false);
  const [orgName,    setOrgName]    = useState("");
  const [industry,   setIndustry]   = useState("");
  const [nameErr,    setNameErr]    = useState("");

  if (role !== "ORG_ADMIN" && role !== "AUDITOR") return null;

  const orgs: OwnedOrganisation[] =
    role === "AUDITOR" ? AUDITOR_ORGS : (user?.organisations ?? []);

  const activeOrgId   = user?.organisationId ?? orgs[0]?.id ?? "";
  const activeOrg     = orgs.find((o) => o.id === activeOrgId) ?? orgs[0];

  const handleSwitch = (orgId: string) => {
    // Persist the selected org and reload so all data re-fetches for the new org
    const org = orgs.find((o) => o.id === orgId);
    if (org) {
      localStorage.setItem("auth_org_id",   org.id);
      localStorage.setItem("auth_org_name", org.name);
      window.location.reload();
    }
    setOpen(false);
  };

  const handleAdd = () => {
    if (!orgName.trim()) { setNameErr("Organisation name is required"); return; }
    // In production this would call an API endpoint to create the org.
    // For now, persist locally and reload.
    const newId = `org-${Date.now().toString(36)}`;
    localStorage.setItem("auth_org_id",   newId);
    localStorage.setItem("auth_org_name", orgName.trim());
    setOrgName("");
    setIndustry("");
    setNameErr("");
    setAddOpen(false);
    setOpen(false);
    window.location.reload();
  };

  if (!activeOrg) return null;

  return (
    <div style={{ position: "relative" }}>
      <button style={s.trigger} onClick={() => setOpen((v) => !v)} title="Switch organisation">
        <Building2 size={13} style={{ color: "rgba(148,198,255,0.9)", flexShrink: 0 }} />
        <span style={s.orgName}>{activeOrg.name}</span>
        <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
      </button>

      {open && (
        <>
          <div style={s.overlay} onClick={() => { setOpen(false); setAddOpen(false); }} />
          <div style={s.menu}>
            <p style={s.menuLabel}>
              {role === "ORG_ADMIN" ? "Your Organisations" : "Switch Workspace"}
            </p>

            {orgs.map((org) => (
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
                  {org.industry && <span style={s.orgItemSub}>{org.industry}</span>}
                </div>
                {org.id === activeOrgId && <Check size={14} color="#1e3a8a" style={{ flexShrink: 0 }} />}
              </button>
            ))}

            {/* Add Organisation — ORG_ADMIN only */}
            {role === "ORG_ADMIN" && !addOpen && (
              <>
                <div style={s.divider} />
                <button
                  style={s.addBtn}
                  onClick={() => setAddOpen(true)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Plus size={14} color="#1e3a8a" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a8a" }}>Add Organisation</span>
                </button>
              </>
            )}

            {/* Inline add form */}
            {role === "ORG_ADMIN" && addOpen && (
              <div style={s.addForm}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>New Organisation</span>
                  <button style={s.closeBtn} onClick={() => { setAddOpen(false); setNameErr(""); }}>
                    <X size={13} />
                  </button>
                </div>
                <input
                  style={{ ...s.input, borderColor: nameErr ? "#fca5a5" : "#e2e8f0" }}
                  placeholder="Organisation name *"
                  value={orgName}
                  onChange={(e) => { setOrgName(e.target.value); setNameErr(""); }}
                  autoFocus
                />
                {nameErr && <span style={s.err}>{nameErr}</span>}
                <input
                  style={s.input}
                  placeholder="Industry (optional)"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <button style={s.confirmBtn} onClick={handleAdd}>
                  Create & Switch
                </button>
              </div>
            )}
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
    zIndex: 200, minWidth: 260, padding: "8px 0", overflow: "hidden",
  },
  menuLabel: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.06em",
    padding: "4px 14px 8px",
  },
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
  orgInfo:     { display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 },
  orgItemName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  orgItemSub:  { fontSize: 11, color: "#94a3b8" },
  divider:     { height: 1, background: "#f1f5f9", margin: "6px 0" },
  addBtn: {
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", padding: "10px 14px", border: "none",
    background: "transparent", cursor: "pointer",
    fontFamily: "inherit", transition: "background 0.15s",
  },
  addForm: {
    padding: "12px 14px",
    borderTop: "1px solid #f1f5f9",
    display: "flex", flexDirection: "column", gap: 8,
  },
  input: {
    width: "100%", padding: "8px 10px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    color: "#0f172a",
  },
  err:        { fontSize: 11, color: "#dc2626", marginTop: -4 },
  confirmBtn: {
    padding: "9px 0", borderRadius: 8, border: "none",
    background: "#1e3a8a", color: "#fff",
    fontSize: 13, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit",
  },
  closeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#94a3b8", display: "flex", alignItems: "center", padding: 2,
  },
};
