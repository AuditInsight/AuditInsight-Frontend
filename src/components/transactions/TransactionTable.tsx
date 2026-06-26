"use client";

import { TransactionWithMeta } from "@/hooks/useTransactions";
import { Paperclip, Copy, Eye, Trash2, Plus } from "lucide-react";

interface Props {
  data: TransactionWithMeta[];
  onView: (t: TransactionWithMeta) => void;
  onDelete?: (t: TransactionWithMeta) => void;
  onAddEvidence?: (t: TransactionWithMeta) => void;
  highlightId?: string;
}

export default function TransactionTable({ data, onView, onDelete, onAddEvidence, highlightId }: Props) {
  if (data.length === 0) {
    return (
      <div style={empty}>
        <LayoutList size={32} color="#94a3b8" />
        <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: 14 }}>No transactions found.</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <table style={table}>
        <thead>
          <tr style={headRow}>
            {["ID", "Name", "Counterparty", "Date", "Amount", "Type", "Payment", "Evidence", "Status", "Actions"].map((h) => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((t) => {
            const isHighlighted = highlightId === t.id;
            return (
              <tr
                key={t.id}
                style={{
                  ...row,
                  background: isHighlighted ? "rgba(30,58,138,0.06)" : "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isHighlighted ? "rgba(30,58,138,0.06)" : "transparent"; }}
              >
                <td style={td}>
                  <span style={idBadge}>{t.id}</span>
                </td>
                <td style={{ ...td, maxWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 500, color: "#0f172a", fontSize: 13 }}>{t.name}</span>
                    {t.isDuplicate && (
                      <span style={dupeBadge} title="Possible duplicate">
                        <Copy size={10} /> DUP
                      </span>
                    )}
                  </div>
                  {t.notes && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{t.notes}</div>}
                </td>
                <td style={td}>{t.counterparty}</td>
                <td style={td}>{t.date}</td>
                <td style={{ ...td, fontWeight: 600, color: t.type === "INCOME" ? "#16a34a" : "#dc2626" }}>
                  {t.type === "INCOME" ? "+" : "-"} {t.amount.toLocaleString()}
                </td>
                <td style={td}>
                  <span style={{ ...typeBadge, background: t.type === "INCOME" ? "#f0fdf4" : "#fef2f2", color: t.type === "INCOME" ? "#15803d" : "#b91c1c" }}>
                    {t.type}
                  </span>
                </td>
                <td style={td}>{t.paymentMethod}</td>
                <td style={td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Paperclip size={13} color={t.evidenceCount === 0 ? "#94a3b8" : "#2563eb"} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.evidenceCount === 0 ? "#94a3b8" : "#2563eb" }}>
                      {t.evidenceCount}
                    </span>
                  </div>
                </td>
                <td style={td}>
                  <span style={{ ...statusBadge, ...(t.status === "COMPLETED" ? statusCompleted : statusPending) }}>
                    {t.status}
                  </span>
                </td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={actionBtn} onClick={() => onView(t)} title="View details">
                      <Eye size={13} />
                    </button>
                    {onAddEvidence && (
                      <button style={{ ...actionBtn, background: "#eff6ff", color: "#2563eb" }} onClick={() => onAddEvidence(t)} title="Add evidence">
                        <Plus size={13} />
                      </button>
                    )}
                    {onDelete && (
                      <button style={{ ...actionBtn, background: "#fef2f2", color: "#dc2626" }} onClick={() => onDelete(t)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── missing import ──
import { LayoutList } from "lucide-react";

const wrap: React.CSSProperties = { overflowX: "auto", borderRadius: 14, border: "1px solid #e2e8f0", background: "#fff" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const headRow: React.CSSProperties = { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, whiteSpace: "nowrap" };
const row: React.CSSProperties = { borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.15s" };
const td: React.CSSProperties = { padding: "12px 14px", verticalAlign: "middle" };
const empty: React.CSSProperties = { padding: 48, textAlign: "center" };
const idBadge: React.CSSProperties = { fontFamily: "monospace", fontSize: 12, background: "#f1f5f9", padding: "3px 8px", borderRadius: 6, color: "#475569", fontWeight: 600 };
const dupeBadge: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: 6 };
const typeBadge: React.CSSProperties = { padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 };
const statusBadge: React.CSSProperties = { padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" as const };
const statusCompleted: React.CSSProperties = { background: "#dcfce7", color: "#15803d" };
const statusPending: React.CSSProperties = { background: "#fef9c3", color: "#92400e" };
const actionBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, border: "none", background: "#f1f5f9", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
