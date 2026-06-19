"use client";

import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { X, Paperclip, ShieldAlert, Calendar, Building2, CreditCard, Hash, User, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  evidences: Evidence[];
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 80 ? "#dc2626" : score >= 50 ? "#d97706" : "#16a34a";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 36, textAlign: "right" }}>{score}/100</span>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value?: string | number | null; icon?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 5 }}>
        {icon}{label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{value ?? "—"}</span>
    </div>
  );
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  COMPLETED:         { bg: "#dcfce7", color: "#15803d" },
  PENDING:           { bg: "#fef3c7", color: "#d97706" },
  PENDING_APPROVAL:  { bg: "#eff6ff", color: "#1d4ed8" },
  FLAGGED:           { bg: "#fee2e2", color: "#dc2626" },
  default:           { bg: "#f1f5f9", color: "#475569" },
};

export const TransactionDetailsModal = ({ isOpen, onClose, transaction, evidences }: Props) => {
  if (!isOpen || !transaction) return null;

  const statusStyle = STATUS_COLORS[transaction.status] ?? STATUS_COLORS.default;
  const typeColor   = transaction.type === "INCOME" ? { bg: "#dcfce7", color: "#15803d" } : { bg: "#fee2e2", color: "#dc2626" };
  const amountFormatted = new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(transaction.amount);

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={s.idBadge}>{transaction.id}</div>
            <div>
              <p style={s.txName}>{transaction.name ?? transaction.counterparty}</p>
              <p style={s.txSub}>View Details — Read Only</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...s.badge, background: statusStyle.bg, color: statusStyle.color }}>{transaction.status.replace("_", " ")}</span>
            <span style={{ ...s.badge, background: typeColor.bg, color: typeColor.color }}>{transaction.type}</span>
            <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Amount Hero */}
        <div style={s.amountHero}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Transaction Amount</span>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{amountFormatted}</span>
          {transaction.riskFlags && transaction.riskFlags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
              {transaction.riskFlags.map((f) => (
                <span key={f} style={{ fontSize: 11, background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                  ⚡ {f.replace("_", " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={s.body}>
          {/* Core details grid */}
          <div style={s.grid2}>
            <Field label="Counterparty" value={transaction.counterparty} icon={<Building2 size={11} />} />
            <Field label="Date" value={transaction.date} icon={<Calendar size={11} />} />
            <Field label="Payment Method" value={transaction.paymentMethod ?? transaction.source} icon={<CreditCard size={11} />} />
            <Field label="Chart of Account" value={transaction.chartOfAccount} icon={<Hash size={11} />} />
            <Field label="Department" value={transaction.department} icon={<Building2 size={11} />} />
            <Field label="Created By" value={transaction.createdBy} icon={<User size={11} />} />
            {transaction.approvedBy && (
              <Field label="Approved By" value={`${transaction.approvedBy} — ${transaction.approvedAt ? new Date(transaction.approvedAt).toLocaleDateString() : ""}`} icon={<CheckCircle2 size={11} />} />
            )}
            <Field label="Evidence Status" value={transaction.evidenceStatus} icon={<Paperclip size={11} />} />
          </div>

          {/* Risk score */}
          <div style={s.section}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <ShieldAlert size={14} color="#64748b" />
              <span style={s.sectionTitle}>Risk Score</span>
            </div>
            <RiskBar score={transaction.riskScore ?? 0} />
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div style={s.noteBox}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>⚠ Audit Note</p>
              <p style={{ margin: 0, fontSize: 13, color: "#78350f", lineHeight: 1.55 }}>{transaction.notes}</p>
            </div>
          )}

          {/* Evidence */}
          <div style={s.section}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Paperclip size={14} color="#64748b" />
              <span style={s.sectionTitle}>Attached Evidence ({evidences.length})</span>
            </div>
            {evidences.length === 0 ? (
              <div style={s.emptyEvidence}>No evidence documents attached</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {evidences.map((e) => {
                  const eStatus = e.status === "Verified"
                    ? { bg: "#dcfce7", color: "#15803d" }
                    : e.status === "Missing"
                    ? { bg: "#fee2e2", color: "#dc2626" }
                    : { bg: "#fef3c7", color: "#d97706" };
                  return (
                    <div key={e.id} style={s.evidenceRow}>
                      <Paperclip size={13} color="#94a3b8" />
                      <span style={{ flex: 1, fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{e.name ?? e.documentName}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{e.subCategory}</span>
                      <span style={{ ...s.badge, background: eStatus.bg, color: eStatus.color, fontSize: 11 }}>{e.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer — read-only lock indicator */}
        <div style={s.footer}>
          <div style={s.lockNote}>🔒 This record is view-only. No edits are permitted for your role.</div>
          <button style={s.closeButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { width: "100%", maxWidth: 580, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 },
  idBadge: { background: "#eff6ff", color: "#1d4ed8", fontFamily: "monospace", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8 },
  txName: { margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" },
  txSub: { margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 },
  badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center", flexShrink: 0 },
  amountHero: { background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 },
  body: { padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" },
  section: { background: "#f8fafc", borderRadius: 12, padding: "14px 16px" },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#374151" },
  noteBox: { background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px" },
  emptyEvidence: { fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "12px 0" },
  evidenceRow: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px" },
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", flexShrink: 0 },
  lockNote: { fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 },
  closeButton: { padding: "9px 22px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};
