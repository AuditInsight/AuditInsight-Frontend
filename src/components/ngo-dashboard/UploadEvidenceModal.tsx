"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import type { NGOTransaction } from "@/types/ngo";

interface Props {
  open: boolean;
  transaction: NGOTransaction | null;
  onClose: () => void;
  onSubmit: (transactionId: string, fileCount: number) => void;
}

export default function UploadEvidenceModal({ open, transaction, onClose, onSubmit }: Props) {
  const [files,      setFiles]      = useState<File[]>([]);
  const [notes,      setNotes]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const [dragOver,   setDragOver]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open || !transaction) return null;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const reset = () => {
    setFiles([]); setNotes(""); setError(""); setSuccess(false); setDragOver(false);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (files.length === 0) { setError("Please attach at least one file."); return; }
    setError(""); setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(transaction.id, files.length);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => { reset(); onClose(); }, 1500);
  };

  const fmt = (b: number) => b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={s.modal}>



        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}><Upload size={17} color="#1e3a8a" /></div>
          <div style={{ flex: 1 }}>
            <h3 style={s.title}>{transaction.status === "FLAGGED" ? "Re-upload Evidence" : "Upload Evidence"}</h3>
            <p style={s.sub}>{transaction.id} · {transaction.projectName}</p>
          </div>
          <button style={s.closeBtn} onClick={handleClose}><X size={16} /></button>
        </div>

        {success ? (
          <div style={s.successWrap}>
            <CheckCircle2 size={36} color="#1e3a8a" />
            <p style={s.successTitle}>Evidence uploaded</p>
            <p style={s.successSub}>Transaction status updated to Complete.</p>
          </div>
        ) : (
          <>
            {/* Context strip */}
            <div style={s.contextBanner}>
              {([
                ["Transaction", transaction.id],
                ["Project",     transaction.projectName],
                ["Donor",       transaction.donor],
                ["Budget Line", transaction.budgetLine],
                ["Amount",      `${transaction.currency} ${transaction.amount.toLocaleString()}`],
              ] as [string, string][]).map(([l, v]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
                  <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={s.body}>
              {error && (
                <div style={s.errBanner}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              {/* Drop zone — input nested directly inside label, most reliable cross-browser */}
              <label
                style={{
                  ...s.dropZone,
                  borderColor: dragOver ? "#2563eb" : "#e2e8f0",
                  background:  dragOver ? "rgba(37,99,235,0.04)" : "#f8fafc",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                  onChange={(e) => addFiles(e.target.files)}
                />
                <Upload size={22} color={dragOver ? "#2563eb" : "#94a3b8"} />
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#475569", margin: "8px 0 4px" }}>
                  Drop files here or <span style={{ color: "#2563eb" }}>click to browse</span>
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>PDF, images, Excel, Word · Max 10 MB each</p>
              </label>

              {/* File list */}
              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                  {files.map((f) => (
                    <div key={f.name} style={s.fileRow}>
                      <FileText size={14} color="#1e3a8a" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>{fmt(f.size)}</p>
                      </div>
                      <button
                        style={s.removeBtn}
                        onClick={(e) => { e.preventDefault(); setFiles((p) => p.filter((x) => x.name !== f.name)); }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div style={{ marginTop: 14 }}>
                <label style={s.label} htmlFor="upload-notes">
                  Notes <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="upload-notes"
                  style={s.textarea}
                  rows={2}
                  placeholder="Any additional context about this evidence…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={s.footer}>
              <button style={s.cancelBtn} onClick={handleClose} disabled={submitting}>Cancel</button>
              <button
                style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Upload size={14} />
                {submitting ? "Uploading…" : `Upload${files.length > 0 ? ` (${files.length})` : ""}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay:      { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9000, padding: 20 },
  modal:        { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" },
  header:       { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "#fff", zIndex: 1 },
  headerIcon:   { width: 38, height: 38, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title:        { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  sub:          { fontSize: 12.5, color: "#64748b", margin: "2px 0 0" },
  closeBtn:     { width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", marginLeft: "auto", flexShrink: 0 },
  contextBanner:{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9", padding: "12px 24px", display: "flex", flexWrap: "wrap", gap: "8px 24px" },
  body:         { padding: "18px 24px" },
  errBanner:    { background: "rgba(30,58,138,0.06)", border: "1px solid rgba(30,58,138,0.2)", color: "#1e3a8a", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
  dropZone:     { display: "flex", flexDirection: "column", alignItems: "center", border: "2px dashed", borderRadius: 12, padding: "28px 20px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" },
  fileRow:      { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, background: "rgba(30,58,138,0.04)", border: "1px solid rgba(30,58,138,0.12)" },
  removeBtn:    { width: 24, height: 24, borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexShrink: 0 },
  label:        { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  textarea:     { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#f8fafc", resize: "vertical" },
  footer:       { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#fff" },
  cancelBtn:    { padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" },
  submitBtn:    { flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 600, fontSize: 13.5, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  successWrap:  { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  successTitle: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  successSub:   { fontSize: 13.5, color: "#64748b", margin: 0 },
};
