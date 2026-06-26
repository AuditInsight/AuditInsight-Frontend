"use client";

import { useState } from "react";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (flag: {
    transactionId: string;
    type: string;
    severity: string;
    notes: string;
  }) => void;
}

const SEVERITIES = [
  { value: "Critical", color: "#dc2626", bg: "#fee2e2" },
  { value: "Medium",   color: "#d97706", bg: "#fef3c7" },
  { value: "Low",      color: "#16a34a", bg: "#dcfce7" },
];

const ISSUE_TYPES = [
  "Missing Evidence",
  "Compliance Issue",
  "Verification Problem",
  "Control Violation",
  "AI / Risk Flag",
];

export default function FlagIssueModal({ open, onClose, onSubmit }: Props) {
  const [transactionId, setTransactionId] = useState("");
  const [type, setType]         = useState("");
  const [severity, setSeverity] = useState("");
  const [notes, setNotes]       = useState("");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    if (!transactionId.trim()) { setError("Transaction ID is required."); return; }
    if (!type)                 { setError("Please select an issue type."); return; }
    if (!severity)             { setError("Please select a severity level."); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    onSubmit({ transactionId: transactionId.trim(), type, severity, notes: notes.trim() });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false); setTransactionId(""); setType(""); setSeverity(""); setNotes("");
      onClose();
    }, 1400);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    setTransactionId(""); setType(""); setSeverity(""); setNotes(""); setError("");
    onClose();
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={s.modal}>
        {/* header */}
        <div style={s.header}>
          <div style={s.headerIcon}>🚩</div>
          <div>
            <h3 style={s.title}>Flag an Issue</h3>
            <p style={s.sub}>Alert the accountant to a compliance problem</p>
          </div>
          <button style={s.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {success ? (
          <div style={s.successWrap}>
            <div style={s.successIcon}>✓</div>
            <p style={s.successText}>Flag created — accountant has been notified.</p>
          </div>
        ) : (
          <div style={s.body}>
            {error && <div style={s.errBanner}>⚠ {error}</div>}

            {/* Transaction dropdown */}
            <div style={s.field}>
              <label style={s.label}>Transaction <span style={s.req}>*</span></label>
              <select
                style={s.input}
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
              >
                <option value="">— Select a transaction —</option>
                {MOCK_TRANSACTIONS.map((t) => (
                  <option key={String(t.id)} value={String(t.id)}>
                    {t.id} — {t.counterparty ?? t.name ?? ""} ({t.type} · RWF {t.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Type */}
            <div style={s.field}>
              <label style={s.label}>Issue Type <span style={s.req}>*</span></label>
              <div style={s.optionGrid}>
                {ISSUE_TYPES.map(t => (
                  <button
                    key={t}
                    style={{ ...s.optionBtn, ...(type === t ? s.optionBtnActive : {}) }}
                    onClick={() => setType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div style={s.field}>
              <label style={s.label}>Severity <span style={s.req}>*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                {SEVERITIES.map(sv => (
                  <button
                    key={sv.value}
                    style={{
                      ...s.severityBtn,
                      background: severity === sv.value ? sv.bg : "#F8FAFC",
                      color: severity === sv.value ? sv.color : "#64748B",
                      border: `1.5px solid ${severity === sv.value ? sv.color : "#E2E8F0"}`,
                      fontWeight: severity === sv.value ? 700 : 500,
                    }}
                    onClick={() => setSeverity(sv.value)}
                  >
                    {sv.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={s.field}>
              <label style={s.label}>Notes <span style={s.optional}>(optional)</span></label>
              <textarea
                style={s.textarea}
                placeholder="Describe the issue in detail…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                onFocus={e => Object.assign(e.currentTarget.style, { borderColor: "#1e3a8a", boxShadow: "0 0 0 3px rgba(30,58,138,0.10)" })}
                onBlur={e => Object.assign(e.currentTarget.style, { borderColor: "#E2E8F0", boxShadow: "none" })}
              />
            </div>

            <div style={s.infoNote}>
              🔔 The accountant will receive an email notification when this flag is submitted.
            </div>
          </div>
        )}

        {!success && (
          <div style={s.footer}>
            <button style={s.cancelBtn} onClick={handleClose} disabled={submitting}>Cancel</button>
            <button
              style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "🚩 Submit Flag"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.50)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9000, padding: 20 },
  modal:       { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" },
  header:      { padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", gap: 12 },
  headerIcon:  { fontSize: 26, lineHeight: 1, marginTop: 2 },
  title:       { fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub:         { fontSize: 13, color: "#64748B", margin: "3px 0 0" },
  closeBtn:    { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#94A3B8", padding: 4, marginLeft: "auto" },
  body:        { padding: "18px 24px 4px" },
  errBanner:   { background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  field:       { marginBottom: 18 },
  label:       { display: "block", fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 },
  req:         { color: "#ef4444" },
  optional:    { fontSize: 12, color: "#94A3B8", fontWeight: 400 },
  input:       { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" },
  optionGrid:  { display: "flex", flexWrap: "wrap", gap: 7 },
  optionBtn:   { padding: "7px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#F8FAFC", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  optionBtnActive: { border: "1.5px solid #1e3a8a", background: "rgba(30,58,138,0.06)", color: "#1e3a8a", fontWeight: 700 },
  severityBtn: { flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 13, textAlign: "center" as const },
  textarea:    { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", resize: "vertical" as const, lineHeight: 1.5 },
  infoNote:    { background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#92400E", lineHeight: 1.5, marginBottom: 4 },
  footer:      { padding: "14px 24px 22px", display: "flex", gap: 10, borderTop: "1px solid #F1F5F9" },
  cancelBtn:   { flex: "0 0 auto", padding: "11px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  submitBtn:   { flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#b91c1c,#dc2626)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  successWrap: { padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  successIcon: { width: 52, height: 52, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  successText: { fontSize: 15, color: "#374151", textAlign: "center" },
};
