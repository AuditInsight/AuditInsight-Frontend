"use client";

import { Upload, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { NGOTransaction } from "@/types/ngo";

interface Props {
  transactions: NGOTransaction[];
  onUploadEvidence: (txn: NGOTransaction) => void;
}

export default function ActionItems({ transactions, onUploadEvidence }: Props) {
  const router  = useRouter();
  const pending = transactions.filter((t) => t.status === "PENDING");
  const flagged = transactions.filter((t) => t.status === "FLAGGED");
  const total   = pending.length + flagged.length;

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.headerIcon}>
            <AlertTriangle size={15} color="#1e3a8a" />
          </div>
          <div>
            <p style={s.headerTitle}>Action Items</p>
            <p style={s.headerSub}>
              {total === 0 ? "All caught up" : `${total} item${total !== 1 ? "s" : ""} need attention`}
            </p>
          </div>
        </div>
        {total > 0 && (
          <span style={s.countBadge}>{total}</span>
        )}
      </div>

      {total === 0 ? (
        <div style={s.emptyWrap}>
          <CheckCircle2 size={28} color="#2563eb" />
          <p style={s.emptyTitle}>All transactions have evidence</p>
          <p style={s.emptySub}>Nothing pending — great work!</p>
        </div>
      ) : (
        <div>
          {pending.length > 0 && (
            <div style={s.section}>
              <p style={s.sectionLabel}>Pending Evidence ({pending.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pending.slice(0, 4).map((txn) => (
                  <div key={txn.id} style={s.itemRow}>
                    <div style={s.itemIcon}>
                      <Upload size={13} color="#1e3a8a" />
                    </div>
                    <div style={s.itemText}>
                      <p style={s.itemTitle}>{txn.projectName}</p>
                      <p style={s.itemSub}>{txn.id} · {txn.budgetLine}</p>
                    </div>
                    <button style={s.actionBtn} onClick={() => onUploadEvidence(txn)}>Upload</button>
                  </div>
                ))}
                {pending.length > 4 && <p style={s.moreText}>+{pending.length - 4} more pending…</p>}
              </div>
            </div>
          )}

          {flagged.length > 0 && (
            <div style={{ ...s.section, borderTop: "1px solid #f1f5f9" }}>
              <p style={s.sectionLabel}>Flagged — Fix Required ({flagged.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {flagged.slice(0, 4).map((txn) => (
                  <div key={txn.id} style={{ ...s.itemRow, background: "rgba(30,58,138,0.04)", borderColor: "rgba(30,58,138,0.15)" }}>
                    <div style={{ ...s.itemIcon, background: "rgba(30,58,138,0.1)" }}>
                      <AlertTriangle size={13} color="#1e3a8a" />
                    </div>
                    <div style={s.itemText}>
                      <p style={s.itemTitle}>{txn.projectName}</p>
                      <p style={s.itemSub}>{txn.id}</p>
                    </div>
                    <button style={s.actionBtn} onClick={() => onUploadEvidence(txn)}>Re-upload</button>
                  </div>
                ))}
                {flagged.length > 4 && <p style={s.moreText}>+{flagged.length - 4} more flagged…</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={s.footer}>
        <button style={s.footerBtn} onClick={() => router.push("/ngo-dashboard/transactions")}>
          View all transactions <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:        { background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.05)" },
  header:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9" },
  headerIcon:  { width: 34, height: 34, borderRadius: 9, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerTitle: { fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 },
  headerSub:   { fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" },
  countBadge:  { width: 24, height: 24, borderRadius: "50%", background: "#1e3a8a", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  emptyWrap:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 20px", gap: 8 },
  emptyTitle:  { fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0 },
  emptySub:    { fontSize: 12, color: "#94a3b8", margin: 0 },
  section:     { padding: "12px 18px" },
  sectionLabel:{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 },
  itemRow:     { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(30,58,138,0.04)", border: "1px solid rgba(30,58,138,0.1)" },
  itemIcon:    { width: 30, height: 30, borderRadius: 8, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemText:    { flex: 1, minWidth: 0 },
  itemTitle:   { fontSize: 12.5, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  itemSub:     { fontSize: 11, color: "#94a3b8", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  actionBtn:   { flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: "#1e3a8a", background: "rgba(30,58,138,0.08)", border: "1px solid rgba(30,58,138,0.18)", padding: "4px 10px", borderRadius: 7, cursor: "pointer", fontFamily: "inherit" },
  moreText:    { fontSize: 11.5, color: "#94a3b8", paddingLeft: 4, margin: "4px 0 0" },
  footer:      { padding: "10px 18px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" },
  footerBtn:   { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#1e3a8a", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 },
};
