"use client";

/**
 * NGORoleSwitcher.tsx — Development-only role switcher for the NGO portal.
 *
 * Renders a floating panel (bottom-right) that lets developers instantly
 * hot-swap between all 4 NGO roles to verify RBAC rendering without
 * logging out and back in.
 *
 * Only rendered when NEXT_PUBLIC_DEV_AUTH=true.
 * Import and place once inside NGOPageLayout or NGODashboard.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.production";
import { ChevronUp, ChevronDown, Zap } from "lucide-react";
import type { NGOUserRole } from "@/types/rbac";

// Maps each NGO role to a dummy account email from devAuth.ts
const ROLE_ACCOUNTS: Record<NGOUserRole, { email: string; password: string; label: string; color: string; bg: string }> = {
  ACCOUNTANT:           { email: "finance@rwandahealth.org",  password: "Password1", label: "Accountant",           color: "#15803d", bg: "#f0fdf4" },
  AUDITOR:              { email: "auditor@rwandahealth.org",  password: "Password1", label: "Auditor",              color: "#b45309", bg: "#fffbeb" },
  ORG_ADMIN:            { email: "director@rwandahealth.org", password: "Password1", label: "Org Admin",            color: "#1e3a8a", bg: "#eff6ff" },
  DONOR_REPRESENTATIVE: { email: "s.mitchell@usaid.gov",      password: "Password1", label: "Donor Representative", color: "#6d28d9", bg: "#f5f3ff" },
};

export default function NGORoleSwitcher() {
  const { login } = useAuth();
  const router    = useRouter();
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState<NGOUserRole | null>(null);

  // Only render in dev mode
  if (process.env.NEXT_PUBLIC_DEV_AUTH !== "true") return null;

  const switchTo = async (role: NGOUserRole) => {
    const account = ROLE_ACCOUNTS[role];
    setLoading(role);
    try {
      await login(account.email, account.password);
      router.refresh();
    } catch {
      // silently ignore — dev tool only
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      }}
    >
      {/* Role buttons — shown when open */}
      {open && (
        <div
          style={{
            background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "10px",
            display: "flex", flexDirection: "column", gap: 6, minWidth: 220,
          }}
        >
          <p style={{ margin: "0 0 6px 4px", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Switch Role (Dev Only)
          </p>
          {(Object.entries(ROLE_ACCOUNTS) as [NGOUserRole, typeof ROLE_ACCOUNTS[NGOUserRole]][]).map(([role, cfg]) => (
            <button
              key={role}
              onClick={() => switchTo(role)}
              disabled={loading !== null}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                border: `1px solid ${cfg.color}22`,
                background: loading === role ? cfg.bg : "#fafafa",
                cursor: loading !== null ? "not-allowed" : "pointer",
                opacity: loading !== null && loading !== role ? 0.5 : 1,
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (!loading) Object.assign(e.currentTarget.style, { background: cfg.bg }); }}
              onMouseLeave={(e) => { if (!loading) Object.assign(e.currentTarget.style, { background: "#fafafa" }); }}
            >
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: cfg.color, flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "left" }}>
                {cfg.label}
              </span>
              {loading === role && (
                <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>Switching…</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderRadius: 12,
          background: "#0f172a", color: "#fff",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(15,23,42,0.3)",
          fontSize: 13, fontWeight: 700, fontFamily: "inherit",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: "#1e293b" })}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "#0f172a" })}
      >
        <Zap size={14} />
        Dev: Switch Role
        {open ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
      </button>
    </div>
  );
}


