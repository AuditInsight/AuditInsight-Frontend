"use client";

import { useState, useRef } from "react";
import { X, Paperclip, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  issueId: string;
  transactionId: string;
  onClose: () => void;
  onSubmit: (id: string, note: string, fileName?: string) => void;
}

export default function ResolveIssueModal({ open, issueId, transactionId, onClose, onSubmit }: Props) {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit(issueId, note.trim(), file?.name);
    setNote("");
    setFile(null);
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <p style={s.title}>Resolve Issue</p>
            <p style={s.sub}>Transaction: <strong>{transactionId}</strong></p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          <label style={s.label}>Resolution Note <span style={{ color: "#dc2626" }}>*</span></label>
          <textarea
            style={s.textarea}
            rows={4}
            placeholder="Describe how the issue was resolved, what documents were uploaded, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <label style={s.label}>Supporting Document (optional)</label>
          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button style={s.fileBtn} onClick={() => fileRef.current?.click()}>
            <Paperclip size={14} /> {file ? file.name : "Attach a document"}
          </button>
          {file && (
            <div style={s.fileChip}>
              <CheckCircle2 size={13} color="#16a34a" /> {file.name}
              <button style={s.removeFile} onClick={() => setFile(null)}>✕</button>
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...s.submitBtn, opacity: (!note.trim() || submitting) ? 0.6 : 1 }}
            disabled={!note.trim() || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting…" : "Submit Resolution"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000 },
  modal: { width: "100%", maxWidth: 520, background: "#fff", borderRadius: 16, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden" },
  header: { padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" },
  sub: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" },
  body: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  fileBtn: { display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 9, border: "1.5px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#475569", fontFamily: "inherit" },
  fileChip: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 10px" },
  removeFile: { marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#94a3b8" },
  footer: { padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { padding: "9px 18px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 },
  submitBtn: { padding: "9px 20px", borderRadius: 9, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};


