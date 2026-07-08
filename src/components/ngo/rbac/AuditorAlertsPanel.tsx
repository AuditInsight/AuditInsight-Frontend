"use client";

import { Flag, Upload, Clock, CheckCircle2 } from "lucide-react";
import type { NGOFlag, NGOTransaction } from "@/types/ngo";

interface Props {
  flags: NGOFlag[];
  transactions: NGOTransaction[];
  onUploadEvidence: (txn: NGOTransaction) => void;
}

const SEV: Record<string, { dot: string; color: string; bg: string; border: string }> = {
  CRITICAL: { dot: "#334155", color: "#0f172a",  bg: "#f1f5f9",              border: "#cbd5e1"              },
  HIGH:     { dot: "#1e3a8a", color: "#1e3a8a",  bg: "rgba(30,58,138,0.07)", border: "rgba(30,58,138,0.2)" },
  MEDIUM:   { dot: "#2563eb", color: "#2563eb",  bg: "rgba(37,99,235,0.07)", border: "rgba(37,99,235,0.2)" },
  LOW:      { dot: "#94a3b8", color: "#475569",  bg: "#f8fafc",              border: "#e2e8f0"              },
};

export default function AuditorAlertsPanel({ flags, transactions, onUploadEvidence }: Props) {
  const openFlags = flags.filter((f) => f.status === "OPEN");
  const enriched  = openFlags.map((flag) => ({
    flag,
    txn: transactions.find((t) => t.id === flag.transactionId) ?? null,
  }));

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.headerIcon}>
            <Flag size={15} color="#1e3a8a" />
          </div>
          <div>
            <p style={s.headerTitle}>Auditor Alerts</p>
            <p style={s.headerSub}>Files flagged — re-upload required</p>
          </div>
        </div>
        {openFlags.length > 0 && (
          <span style={s.countBadge}>{openFlags.length}</span>
        )}
      </div>

      {openFlags.length === 0 ? (
        <div style={s.emptyWrap}>
          <CheckCircle2 size={28} color="#2563eb" />
          <p style={s.emptyTitle}>No active auditor alerts</p>
          <p style={s.emptySub}>All flagged items have been resolved.</p>
        </div>
      ) : (
        <div style={{ maxHeight: 420, overflowY: "auto" }}>
          {enriched.map(({ flag, txn }) => {
            const sev = SEV[flag.severity] ?? SEV.LOW;
            return (
              <div key={flag.id} style={s.flagRow}>
                {/* Severity + date */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: sev.dot, flexShrink: 0 }} />
                    {flag.severity}
                  </span>
                  <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                    {new Date(flag.flaggedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>{flag.transactionId}</span>
                </div>

                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>{flag.category}</p>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  <span style={{ fontWeight: 600, color: "#475569" }}>{flag.flaggedBy}:</span>{" "}{flag.notes}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{flag.projectName}</span>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1", flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1e3a8a", background: "rgba(30,58,138,0.07)", border: "1px solid rgba(30,58,138,0.18)", padding: "2px 8px", borderRadius: 999 }}>{flag.donor}</span>
                </div>

                {txn ? (
                  <button style={s.uploadBtn} onClick={() => onUploadEvidence(txn)}>
                    <Upload size={13} /> Re-upload Evidence for {flag.transactionId}
                  </button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                    <Clock size={12} /> Transaction not found in current view
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
  header:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9", background: "rgba(30,58,138,0.03)" },
  headerIcon:  { width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  headerSub:   { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" },
  countBadge:  { minWidth: 24, height: 24, padding: "0 6px", borderRadius: 999, background: "#1e3a8a", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  emptyWrap:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 20px", gap: 8 },
  emptyTitle:  { fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0 },
  emptySub:    { fontSize: 12, color: "#94a3b8", margin: 0 },
  flagRow:     { padding: "14px 18px", borderBottom: "1px solid #f8fafc" },
  uploadBtn:   { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "9px", borderRadius: 10, background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" },
};


