"use client";

import { useState } from "react";
import { Flag, X, AlertCircle, CheckCircle, Bell } from "lucide-react";
import type { NGOTransaction, NGOFlagCategory, FlagSeverity } from "@/types/ngo";

interface Props {
  open: boolean;
  transaction: NGOTransaction | null;
  auditorName: string;
  onClose: () => void;
  onSubmit: (flag: {
    transactionId: string;
    category: NGOFlagCategory;
    severity: FlagSeverity;
    notes: string;
  }) => void;
}

const FLAG_CATEGORIES: NGOFlagCategory[] = [
  "Missing Beneficiary List",
  "Missing Payment Voucher",
  "Unapproved Budget Overrun",
  "Missing Procurement Documents",
  "Missing Signed Attendance Sheets",
  "Unverified Supplier",
  "Missing Bank Reconciliation",
  "Duplicate Transaction",
  "Missing Grant Agreement Reference",
  "Missing Activity Report",
  "Unsupported Cash Payment",
  "Missing Donor Approval",
  "Other",
];

const SEVERITIES: { value: FlagSeverity; label: string; color: string; bg: string; border: string }[] = [
  { value: "CRITICAL", label: "Critical", color: "#0f172a",  bg: "#f1f5f9", border: "#334155" },
  { value: "HIGH",     label: "High",     color: "#1e3a8a",  bg: "rgba(30,58,138,0.07)", border: "#1e3a8a" },
  { value: "MEDIUM",   label: "Medium",   color: "#2563eb",  bg: "rgba(37,99,235,0.07)", border: "#2563eb" },
  { value: "LOW",      label: "Low",      color: "#475569",  bg: "#f8fafc", border: "#94a3b8" },
];

export default function NGOFlagIssueModal({ open, transaction, auditorName, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<NGOFlagCategory | "">("");
  const [severity, setSeverity] = useState<FlagSeverity | "">("");
  const [notes, setNotes]       = useState("");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);

  if (!open || !transaction) return null;

  const handleSubmit = async () => {
    setError("");
    if (!category) { setError("Please select an issue category."); return; }
    if (!severity) { setError("Please select a severity level."); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit({
      transactionId: transaction.id,
      category: category as NGOFlagCategory,
      severity: severity as FlagSeverity,
      notes: notes.trim(),
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false); setCategory(""); setSeverity(""); setNotes(""); setError("");
      onClose();
    }, 1600);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    setCategory(""); setSeverity(""); setNotes(""); setError("");
    onClose();
  };

  return (
    <div style={s.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={s.modal} onMouseDown={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}><Flag size={20} color="#1e3a8a" /></div>
          <div style={{ flex: 1 }}>
            <h3 style={s.title}>Flag Compliance Issue</h3>
            <p style={s.sub}>Flagged by {auditorName}</p>
          </div>
          <button style={s.closeBtn} onClick={handleClose}><X size={16} /></button>
        </div>

        {success ? (
          <div style={s.successWrap}>
            <div style={s.successIcon}><CheckCircle size={28} color="#1e3a8a" /></div>
            <p style={s.successTitle}>Flag submitted</p>
            <p style={s.successSub}>The Finance Officer and Executive Director have been notified.</p>
          </div>
        ) : (
          <>
            {/* Transaction context banner */}
            <div style={s.contextBanner}>
              <div style={s.contextRow}>
                <span style={s.contextLabel}>Transaction</span>
                <span style={s.contextValue}>{transaction.id}</span>
              </div>
              <div style={s.contextRow}>
                <span style={s.contextLabel}>Project</span>
                <span style={s.contextValue}>{transaction.projectName}</span>
              </div>
              <div style={s.contextRow}>
                <span style={s.contextLabel}>Donor</span>
                <span style={{ ...s.contextValue, fontWeight: 700 }}>{transaction.donor}</span>
              </div>
              <div style={s.contextRow}>
                <span style={s.contextLabel}>Amount</span>
                <span style={s.contextValue}>
                  {transaction.currency} {transaction.amount.toLocaleString()}
                </span>
              </div>
              <div style={s.contextRow}>
                <span style={s.contextLabel}>Budget Line</span>
                <span style={s.contextValue}>{transaction.budgetLine}</span>
              </div>
            </div>

            <div style={s.body}>
              {error && <div style={s.errBanner}><AlertCircle size={13} style={{ flexShrink: 0 }} /> {error}</div>}

              {/* Issue category */}
              <div style={s.field}>
                <label style={s.label}>Issue Category <span style={s.req}>*</span></label>
                <div style={s.categoryGrid}>
                  {FLAG_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        ...s.categoryBtn,
                        ...(category === cat ? s.categoryBtnActive : {}),
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div style={s.field}>
                <label style={s.label}>Severity <span style={s.req}>*</span></label>
                <div style={{ display: "flex", gap: 8 }}>
                  {SEVERITIES.map((sv) => (
                    <button
                      key={sv.value}
                      type="button"
                      onClick={() => setSeverity(sv.value)}
                      style={{
                        ...s.severityBtn,
                        background: severity === sv.value ? sv.bg : "#f8fafc",
                        color:      severity === sv.value ? sv.color : "#64748b",
                        border:     `1.5px solid ${severity === sv.value ? sv.border : "#e2e8f0"}`,
                        fontWeight: severity === sv.value ? 700 : 500,
                      }}
                    >
                      {sv.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={s.field}>
                <label style={s.label}>
                  Detailed Notes <span style={s.optional}>(recommended)</span>
                </label>
                <textarea
                  style={s.textarea}
                  rows={3}
                  placeholder="Describe exactly what is missing or incorrect, and reference the relevant donor guideline if applicable…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                  onBlur={(e)  => Object.assign(e.currentTarget.style, { borderColor: "#e2e8f0", boxShadow: "none" })}
                />
              </div>

              <div style={s.infoNote}>
                <Bell size={13} style={{ flexShrink: 0, color: "#1e3a8a" }} />
                The Finance Officer and Executive Director will receive an immediate notification when this flag is submitted.
              </div>
            </div>

            <div style={s.footer}>
              <button style={s.cancelBtn} onClick={handleClose} disabled={submitting}>Cancel</button>
              <button
                style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Flag size={14} />
                {submitting ? "Submitting…" : "Submit Flag"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:          { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9000, padding: 20 },
  modal:            { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.20)" },
  header:           { padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 12, position: "sticky", top: 0, background: "#fff", zIndex: 1 },
  headerIcon:       { width: 40, height: 40, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title:            { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  sub:              { fontSize: 12.5, color: "#64748b", margin: "3px 0 0" },
  closeBtn:         { background: "none", border: "1px solid #e2e8f0", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", flexShrink: 0 },
  contextBanner:    { background: "#f8fafc", borderBottom: "1px solid #f1f5f9", padding: "14px 24px", display: "flex", flexWrap: "wrap" as const, gap: "8px 24px" },
  contextRow:       { display: "flex", flexDirection: "column" as const, gap: 2 },
  contextLabel:     { fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  contextValue:     { fontSize: 13, color: "#0f172a", fontWeight: 500 },
  body:             { padding: "18px 24px 4px" },
  errBanner:        { background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", color: "#1e3a8a", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  field:            { marginBottom: 18 },
  label:            { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 8 },
  req:              { color: "#2563eb" },
  optional:         { fontSize: 12, color: "#94a3b8", fontWeight: 400 },
  categoryGrid:     { display: "flex", flexWrap: "wrap" as const, gap: 7 },
  categoryBtn:      { padding: "6px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" },
  categoryBtnActive:{ border: "1.5px solid #1e3a8a", background: "rgba(30,58,138,0.07)", color: "#1e3a8a", fontWeight: 700 },
  severityBtn:      { flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 13, textAlign: "center" as const, transition: "all 0.12s" },
  textarea:         { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", background: "#fff", resize: "vertical" as const, lineHeight: 1.6 },
  infoNote:         { background: "rgba(30,58,138,0.04)", border: "1px solid rgba(30,58,138,0.12)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#1e3a8a", lineHeight: 1.5, marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 8 },
  footer:           { padding: "14px 24px 22px", display: "flex", gap: 10, borderTop: "1px solid #f1f5f9", position: "sticky", bottom: 0, background: "#fff" },
  cancelBtn:        { padding: "11px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  submitBtn:        { flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  successWrap:      { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  successIcon:      { width: 56, height: 56, borderRadius: "50%", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center" },
  successTitle:     { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  successSub:       { fontSize: 13.5, color: "#64748b", textAlign: "center" as const, margin: 0 },
};


