"use client";

import { useEffect, useRef, useState } from "react";
import { Evidence } from "@/types/evidence.types";
import { Transaction } from "@/types/transaction.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { X, Paperclip, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { modalOverlayStyle } from "@/lib/modalOverlay";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Evidence) => void;
  sections: { title: string; items: string[] }[];
  mode?: "add" | "edit";
  evidence?: Evidence | null;
}

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function validate(fields: {
  name: string; transactionId: string; category: string; subCategory: string; file: File | null; isEdit: boolean;
}) {
  const e: Record<string, string> = {};
  if (!fields.name.trim()) e.name = "Document name is required.";
  if (!fields.transactionId) e.transactionId = "Please link this to a transaction.";
  if (!fields.category) e.category = "Category is required.";
  if (!fields.subCategory) e.subCategory = "Subcategory is required.";
  if (!fields.isEdit && !fields.file) e.file = "Please select a file to upload.";
  return e;
}

export const EvidenceUploadModal = ({ isOpen, onClose, onSave, sections, mode = "add", evidence = null }: Props) => {
  const isEdit = mode === "edit";
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName]                 = useState("");
  const [category, setCategory]         = useState("");
  const [subCategory, setSubCategory]   = useState("");
  const [notes, setNotes]               = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount]             = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [file, setFile]                 = useState<File | null>(null);
  const [fileError, setFileError]       = useState("");
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [touched, setTouched]           = useState<Record<string, boolean>>({});
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && evidence) {
      setName(evidence.documentName ?? "");
      setCategory(evidence.folder ?? "");
      setSubCategory(evidence.subfolder ?? "");
      setNotes(evidence.notes ?? "");
      setTransactionId(evidence.transactionId ? String(evidence.transactionId) : "");
      setAmount(evidence.amount != null ? String(evidence.amount) : "");
      setCounterparty(evidence.counterparty ?? "");
      setFile(null);
    } else {
      setName(""); setCategory(""); setSubCategory(""); setNotes("");
      setTransactionId(""); setAmount(""); setCounterparty(""); setFile(null);
    }
    setErrors({}); setTouched({}); setFileError("");
  }, [isOpen, mode, evidence]);

  if (!isOpen) return null;

  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const handleTransactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setTransactionId(id);
    touch("transactionId");
    const tx = MOCK_TRANSACTIONS.find((t) => String(t.id) === id);
    if (tx) { setAmount(String(tx.amount)); setCounterparty(tx.counterparty ?? tx.name ?? ""); }
    else { setAmount(""); setCounterparty(""); }
    const e2 = validate({ name, transactionId: id, category, subCategory, file, isEdit });
    setErrors(e2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES[f.type]) {
      setFileError("Unsupported file type. Allowed: PDF, PNG, JPG, XLSX, DOCX.");
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError("File exceeds 10 MB limit.");
      setFile(null);
      return;
    }
    setFileError("");
    setFile(f);
    touch("file");
    const e2 = validate({ name, transactionId, category, subCategory, file: f, isEdit });
    setErrors(e2);
  };

  const handleField = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    touch(field);
    const current = { name, transactionId, category, subCategory, file, isEdit, [field]: value };
    setErrors(validate(current as any));
  };

  const handleSave = async () => {
    const allTouched = { name: true, transactionId: true, category: true, subCategory: true, file: true };
    setTouched(allTouched);
    const errs = validate({ name, transactionId, category, subCategory, file, isEdit });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const tx = MOCK_TRANSACTIONS.find((t) => String(t.id) === transactionId);
    const inheritedAmount = tx?.amount ?? (amount ? Number(amount) : undefined);
    const inheritedCounterparty = tx?.counterparty ?? counterparty;

    const saved: Evidence = isEdit && evidence
      ? {
          ...evidence,
          documentName: name,
          folder: category,
          subfolder: subCategory,
          notes,
          transactionId,
          amount: inheritedAmount,
          counterparty: inheritedCounterparty,
        }
      : {
          id: `ev-${Date.now()}`,
          organisationId: "org-001",
          transactionId,
          documentName: name,
          folder: category,
          subfolder: subCategory,
          fileUpload: file ? URL.createObjectURL(file) : "",
          fileType: file ? (ALLOWED_TYPES[file.type] ?? "pdf") : "pdf",
          status: "Pending",
          uploadedBy: "Eric Bizimana",
          uploadedAt: new Date().toISOString(),
          notes: notes || undefined,
          amount: inheritedAmount,
          counterparty: inheritedCounterparty,
        };

    onSave(saved);
    setSaving(false);
    onClose();
  };

  const selectedSection = sections.find((s) => s.title === category);
  const inputSt = (field: string): React.CSSProperties => ({
    width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 14,
    border: `1.5px solid ${touched[field] && errors[field] ? "#ef4444" : "#e2e8f0"}`,
    outline: "none", fontFamily: "inherit", color: "#0f172a", background: "#fff",
    boxSizing: "border-box",
  });

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <p style={s.title}>{isEdit ? "Update Evidence" : "Upload Evidence"}</p>
            <p style={s.sub}>Fields marked * are required</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          {/* Document name */}
          <div>
            <label style={s.label}>Document Name <span style={s.req}>*</span></label>
            <input
              placeholder="e.g. Invoice ABC Ltd June 2024"
              value={name}
              onChange={(e) => handleField("name", e.target.value, setName)}
              style={inputSt("name")}
            />
            {touched.name && errors.name && <p style={s.err}><AlertCircle size={11} />{errors.name}</p>}
          </div>

          {/* Transaction link */}
          <div>
            <label style={s.label}>Link to Transaction <span style={s.req}>*</span></label>
            <select value={transactionId} onChange={handleTransactionChange} style={inputSt("transactionId")}>
              <option value="">— Select transaction —</option>
              {MOCK_TRANSACTIONS.map((t) => (
                <option key={String(t.id)} value={String(t.id)}>
                  {t.id} — {t.counterparty ?? t.name ?? ""} ({new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(t.amount)})
                </option>
              ))}
            </select>
            {touched.transactionId && errors.transactionId && <p style={s.err}><AlertCircle size={11} />{errors.transactionId}</p>}
          </div>

          {/* Auto-filled info */}
          {transactionId && (
            <div style={s.autoFill}>
              <span style={s.autoLabel}>Auto-filled from transaction:</span>
              <span style={s.autoValue}>{counterparty} — RWF {Number(amount).toLocaleString()}</span>
            </div>
          )}

          {/* Category + Subcategory */}
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Category <span style={s.req}>*</span></label>
              <select value={category} onChange={(e) => { handleField("category", e.target.value, setCategory); setSubCategory(""); }} style={inputSt("category")}>
                <option value="">— Select category —</option>
                {sections.map((sec) => <option key={sec.title} value={sec.title}>{sec.title}</option>)}
              </select>
              {touched.category && errors.category && <p style={s.err}><AlertCircle size={11} />{errors.category}</p>}
            </div>
            <div>
              <label style={s.label}>Subcategory <span style={s.req}>*</span></label>
              <select value={subCategory} onChange={(e) => handleField("subCategory", e.target.value, setSubCategory)} style={inputSt("subCategory")} disabled={!category}>
                <option value="">— Select subcategory —</option>
                {selectedSection?.items.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {touched.subCategory && errors.subCategory && <p style={s.err}><AlertCircle size={11} />{errors.subCategory}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={s.label}>Notes <span style={s.optional}>(optional)</span></label>
            <textarea
              placeholder="Any additional context about this document…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputSt("notes"), resize: "vertical" as const, minHeight: 72 }}
              rows={2}
            />
          </div>

          {/* File upload */}
          {!isEdit && (
            <div>
              <label style={s.label}>Upload File <span style={s.req}>*</span></label>
              <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx" onChange={handleFileChange} style={{ display: "none" }} />
              <button
                style={{ ...s.fileBtn, borderColor: touched.file && errors.file ? "#ef4444" : "#cbd5e1" }}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={14} />
                {file ? file.name : "Choose file (PDF, PNG, JPG, XLSX, DOCX — max 10 MB)"}
              </button>
              {fileError && <p style={s.err}><AlertCircle size={11} />{fileError}</p>}
              {touched.file && errors.file && !fileError && <p style={s.err}><AlertCircle size={11} />{errors.file}</p>}
              {file && !fileError && (
                <div style={s.fileChip}>
                  <CheckCircle2 size={13} color="#16a34a" />
                  <span>{file.name}</span>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
              )}
            </div>
          )}

          {Object.keys(errors).length > 0 && Object.values(touched).some(Boolean) && (
            <div style={s.errSummary}>
              <AlertCircle size={14} /> Fix {Object.keys(errors).length} error(s) before saving.
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            <Paperclip size={13} />
            {saving ? "Saving…" : isEdit ? "Update Evidence" : "Upload Evidence"}
          </button>
        </div>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay: { display: "none" },
  modal: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 },
  title: { margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#94a3b8" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" },
  body: { padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req: { color: "#ef4444" },
  optional: { fontSize: 11, color: "#94a3b8", fontWeight: 400 },
  err: { display: "flex", alignItems: "center", gap: 4, margin: "4px 0 0", fontSize: 11.5, color: "#ef4444", fontWeight: 500 },
  errSummary: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#b91c1c" },
  autoFill: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9 },
  autoLabel: { fontSize: 11, fontWeight: 600, color: "#15803d" },
  autoValue: { fontSize: 12, color: "#0f172a", fontWeight: 600 },
  fileBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#475569", fontFamily: "inherit", textAlign: "left" },
  fileChip: { display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 12, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 10px" },
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa", flexShrink: 0 },
  cancelBtn: { padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" },
  saveBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};
