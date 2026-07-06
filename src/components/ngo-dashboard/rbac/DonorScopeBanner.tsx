"use client";

import { Lock } from "lucide-react";
import { useRBAC } from "@/context/RBACContext";

export default function DonorScopeBanner() {
  const { user } = useRBAC();
  if (user.role !== "DONOR_REPRESENTATIVE" || !user.assignedDonorId) return null;

  return (
    <div style={s.banner}>
      <div style={s.iconWrap}>
        <Lock size={14} color="#1e3a8a" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={s.title}>Scoped Access — {user.assignedDonorId} Portfolio Only</p>
        <p style={s.sub}>
          You are viewing data exclusively scoped to your organisation&apos;s funding pool.
          Other donors&apos; data is not accessible from this account.
        </p>
      </div>
      <span style={s.badge}>READ-ONLY</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  banner:  { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(30,58,138,0.05)", border: "1px solid rgba(30,58,138,0.18)", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" },
  iconWrap:{ width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title:   { fontSize: 12.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  sub:     { fontSize: 12, color: "#475569", margin: "3px 0 0", lineHeight: 1.5 },
  badge:   { flexShrink: 0, padding: "4px 10px", borderRadius: 999, background: "rgba(30,58,138,0.1)", color: "#1e3a8a", fontSize: 10.5, fontWeight: 700, border: "1px solid rgba(30,58,138,0.2)", letterSpacing: "0.05em" },
};
