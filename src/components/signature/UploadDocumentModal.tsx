"use client";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.production";
import { Evidence } from "@/types/evidence.types";
import { uploadEvidence, signEvidence } from "@/utils/api";
import { X, Paperclip, AlertCircle, CheckCircle2, Upload, FileSignature } from "lucide-react";
import { modalOverlayStyle } from "@/lib/modalOverlay";
import { normalizeOrganisationId } from "@/utils/organisationId";
import { SignaturePad, EMPTY_SIGNATURE, type SignaturePadValue } from "./SignaturePad";

// Any document uploaded here goes into a generic bucket — it isn't filed into the
// transaction-linked folder taxonomy, since it isn't linked to a transaction at all.
const STANDALONE_FOLDER = "Other Supporting Documents";
const STANDALONE_SUBFOLDER = "Miscellaneous";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidence: Evidence) => void;
}

export function UploadDocumentModal({ isOpen, onClose, onSave }: Props) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName]               = useState("");
  const [notes, setNotes]             = useState("");
  const [file, setFile]               = useState<File | null>(null);
  const [fileError, setFileError]     = useState("");
  const [nameError, setNameError]     = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving]           = useState(false);
  const [signNow, setSignNow]         = useState(true);
  const [signaturePad, setSignaturePad] = useState<SignaturePadValue>(EMPTY_SIGNATURE);
  const [signError, setSignError]     = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(""); setNotes(""); setFile(null);
    setFileError(""); setNameError(""); setSubmitError("");
    setSignNow(true); setSignaturePad(EMPTY_SIGNATURE); setSignError("");
  }, [isOpen]);

  if (!isOpen) return null;

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
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) { setNameError("Document name is required."); return; }
    if (!file) { setFileError("Please select a file to upload."); return; }
    if (signNow && !signaturePad.typedName.trim() && !signaturePad.signatureImage) {
      setSignError("Draw or type your signature, or turn off “Sign this document now”.");
      return;
    }

    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      setSubmitError("Unable to upload a document without an organisation.");
      return;
    }

    setSaving(true);
    setSubmitError("");
    setNameError("");
    setSignError("");

    try {
      const { data } = await uploadEvidence(file, {
        organisationId: orgId,
        documentName: trimmedName,
        folder: STANDALONE_FOLDER,
        subfolder: STANDALONE_SUBFOLDER,
        notes: notes || undefined,
      });

      const saved: Evidence = {
        id: data.id,
        organisationId: data.organisationId,
        transactionId: data.transactionId ?? undefined,
        documentName: data.documentName,
        folder: data.folder,
        subfolder: data.subfolder,
        fileUpload: data.fileUpload,
        fileType: data.fileType,
        notes: data.notes,
        uploadedBy: String(data.uploadedBy),
        uploadedAt: data.uploadedAt,
      };

      if (signNow && (signaturePad.typedName.trim() || signaturePad.signatureImage)) {
        try {
          await signEvidence(saved.id, {
            typedName: signaturePad.typedName.trim() || undefined,
            signatureImage: signaturePad.signatureImage ?? undefined,
          });
        } catch (signErr) {
          console.error("Auto-sign after upload failed", signErr);
        }
      }

      onSave(saved);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setSubmitError(message);
      console.error("Standalone document upload failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <p style={s.title}>Upload Document</p>
            <p style={s.sub}>Not linked to any transaction — just a document to sign.</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          <div>
            <label style={s.label}>Document Name <span style={s.req}>*</span></label>
            <input
              placeholder="e.g. Board Resolution, NDA, Policy Document"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              style={inputSt(Boolean(nameError))}
            />
            {nameError && <p style={s.err}><AlertCircle size={11} />{nameError}</p>}
          </div>

          <div>
            <label style={s.label}>Notes <span style={s.optional}>(optional)</span></label>
            <textarea
              placeholder="Any additional context about this document…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...inputSt(false), resize: "vertical" as const, minHeight: 72 }}
              rows={2}
            />
          </div>

          <div>
            <label style={s.label}>Upload File <span style={s.req}>*</span></label>
            <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            <button style={{ ...s.fileBtn, borderColor: fileError ? "#ef4444" : "#cbd5e1" }} onClick={() => fileRef.current?.click()}>
              <Upload size={14} />
              {file ? file.name : "Choose file (PDF, PNG, JPG, XLSX, DOCX — max 10 MB)"}
            </button>
            {fileError && <p style={s.err}><AlertCircle size={11} />{fileError}</p>}
            {file && !fileError && (
              <div style={s.fileChip}>
                <CheckCircle2 size={13} color="#16a34a" />
                <span>{file.name}</span>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
            )}
          </div>

          <div>
            <label style={s.signToggle}>
              <input type="checkbox" checked={signNow} onChange={(e) => { setSignNow(e.target.checked); setSignError(""); }} />
              <FileSignature size={14} />
              Sign this document now
            </label>
            {signNow && (
              <div style={s.signBox}>
                <SignaturePad value={signaturePad} onChange={(v) => { setSignaturePad(v); setSignError(""); }} disabled={saving} />
                {signError && <p style={s.err}><AlertCircle size={11} />{signError}</p>}
              </div>
            )}
          </div>

          {submitError && (
            <div style={s.errSummary}>
              <AlertCircle size={14} /> {submitError}
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            <Paperclip size={13} />
            {saving ? "Saving…" : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputSt = (hasError: boolean): React.CSSProperties => ({
  width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 14,
  border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
  outline: "none", fontFamily: "inherit", color: "#0f172a", background: "#fff",
  boxSizing: "border-box",
});

const s: Record<string, React.CSSProperties> = {
  modal: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 },
  title: { margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#94a3b8" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" },
  body: { padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  req: { color: "#ef4444" },
  optional: { fontSize: 11, color: "#94a3b8", fontWeight: 400 },
  err: { display: "flex", alignItems: "center", gap: 4, margin: "4px 0 0", fontSize: 11.5, color: "#ef4444", fontWeight: 500 },
  errSummary: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#b91c1c" },
  fileBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#475569", fontFamily: "inherit", textAlign: "left" },
  fileChip: { display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 12, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 10px" },
  signToggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" },
  signBox: { marginTop: 10, padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc" },
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa", flexShrink: 0 },
  cancelBtn: { padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" },
  saveBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};

export default UploadDocumentModal;
