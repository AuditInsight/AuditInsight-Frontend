"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { NGOFlag } from "@/types/ngo";

interface Props {
  flags: NGOFlag[];
  onResolve: (flagId: string) => void;
}

const SEV_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const SEV: Record<string, { bar: string; color: string; bg: string; border: string }> = {
  CRITICAL: { bar: "#334155", color: "#0f172a",  bg: "#f1f5f9",              border: "#cbd5e1"              },
  HIGH:     { bar: "#1e3a8a", color: "#1e3a8a",  bg: "rgba(30,58,138,0.07)", border: "rgba(30,58,138,0.2)" },
  MEDIUM:   { bar: "#2563eb", color: "#2563eb",  bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.2)" },
  LOW:      { bar: "#94a3b8", color: "#475569",  bg: "#f8fafc",              border: "#e2e8f0"              },
};

export default function ExecutiveAlertPanel({ flags, onResolve }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const openFlags = [...flags.filter((f) => f.status === "OPEN")]
    .sort((a, b) => (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9));

  const criticalCount = openFlags.filter((f) => f.severity === "CRITICAL").length;
  const highCount     = openFlags.filter((f) => f.severity === "HIGH").length;

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.headerIcon}>
            <ShieldAlert size={15} color={openFlags.length > 0 ? "#1e3a8a" : "#94a3b8"} />
          </div>
          <div>
            <p style={s.headerTitle}>Management Intervention</p>
            <p style={s.headerSub}>
              {openFlags.length === 0
                ? "No open flags — all clear"
                : `${openFlags.length} open flag${openFlags.length !== 1 ? "s" : ""} across all departments`}
            </p>
          </div>
        </div>
        {openFlags.length > 0 && (
          <div style={{ display: "flex", gap: 6 }}>
            {criticalCount > 0 && (
              <span style={{ ...s.severityPill, background: "#334155", color: "#fff" }}>{criticalCount} CRITICAL</span>
            )}
            {highCount > 0 && (
              <span style={{ ...s.severityPill, background: "#1e3a8a", color: "#fff" }}>{highCount} HIGH</span>
            )}
          </div>
        )}
      </div>

      {openFlags.length === 0 ? (
        <div style={s.emptyWrap}>
          <CheckCircle2 size={28} color="#2563eb" />
          <p style={s.emptyTitle}>No flags requiring intervention</p>
          <p style={s.emptySub}>All audit issues have been resolved.</p>
        </div>
      ) : (
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          {openFlags.map((flag) => {
            const sev  = SEV[flag.severity] ?? SEV.LOW;
            const open = expanded === flag.id;
            return (
              <div key={flag.id} style={{ ...s.flagRow, borderLeft: `3px solid ${sev.bar}`, background: open ? "#f8fafc" : "#fff" }}>
                {/* Summary row */}
                <div style={s.summaryRow} onClick={() => setExpanded(open ? null : flag.id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" as const }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}>
                        {flag.severity}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1e3a8a", background: "rgba(30,58,138,0.07)", border: "1px solid rgba(30,58,138,0.18)", padding: "2px 8px", borderRadius: 999 }}>
                        {flag.donor}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>{flag.transactionId}</span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{flag.category}</p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{flag.projectName} · Flagged by {flag.flaggedBy}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <button
                      style={s.resolveBtn}
                      onClick={(e) => { e.stopPropagation(); onResolve(flag.id); }}
                    >
                      Resolve
                    </button>
                    {open ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {open && (
                  <div style={{ padding: "0 18px 14px" }}>
                    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "14px 16px" }}>
                      <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 8px" }}>Auditor Notes</p>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 10px" }}>{flag.notes}</p>
                      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                        Flagged on {new Date(flag.flaggedAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:        { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  header:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9", background: "rgba(30,58,138,0.02)" },
  headerIcon:  { width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  headerSub:   { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" },
  severityPill:{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 999 },
  emptyWrap:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 20px", gap: 8 },
  emptyTitle:  { fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0 },
  emptySub:    { fontSize: 12, color: "#94a3b8", margin: 0 },
  flagRow:     { borderBottom: "1px solid #f8fafc", transition: "background 0.15s" },
  summaryRow:  { display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", cursor: "pointer" },
  resolveBtn:  { fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" },
};
