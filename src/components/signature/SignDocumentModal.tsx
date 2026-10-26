"use client";

import { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { X, FileSignature, Download, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { modalOverlayStyle } from "@/lib/modalOverlay";
import { Evidence } from "@/types/evidence.types";
import {
  getEvidenceSignatures,
  signEvidence,
  downloadSignedEvidence,
  type EvidenceSignaturesResponse,
} from "@/utils/api";
import { SignaturePad, EMPTY_SIGNATURE, type SignaturePadValue } from "./SignaturePad";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function SignDocumentModal({ isOpen, onClose, evidence }: Props) {
  const [data, setData] = useState<EvidenceSignaturesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pad, setPad] = useState<SignaturePadValue>(EMPTY_SIGNATURE);

  const load = useCallback(() => {
    if (!evidence) return;
    setLoading(true);
    setError("");
    getEvidenceSignatures(evidence.id)
      .then(({ data }) => setData(data))
      .catch(() => setError("Failed to load signatures for this document."))
      .finally(() => setLoading(false));
  }, [evidence]);

  useEffect(() => {
    if (isOpen && evidence) {
      setPad(EMPTY_SIGNATURE);
      load();
    }
  }, [isOpen, evidence, load]);

  if (!isOpen || !evidence) return null;

  const hasSignaturePayload = Boolean(pad.typedName.trim() || pad.signatureImage);

  const handleSign = async () => {
    if (!hasSignaturePayload) {
      setError("Draw or type your signature first.");
      return;
    }
    setSigning(true);
    setError("");
    try {
      await signEvidence(evidence.id, {
        typedName: pad.typedName.trim() || undefined,
        signatureImage: pad.signatureImage ?? undefined,
      });
      setPad(EMPTY_SIGNATURE);
      load();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to sign this document.");
      } else {
        setError("Failed to sign this document.");
      }
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      await downloadSignedEvidence(evidence.id, evidence.documentName || "document");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to download the signed document.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.headerIcon}><FileSignature size={17} color="#1e3a8a" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={s.title}>{evidence.documentName}</p>
            <p style={s.sub}>{evidence.folder} / {evidence.subfolder}</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={s.body}>
          {evidence.fileUpload && (
            <a href={evidence.fileUpload} target="_blank" rel="noopener noreferrer" style={s.viewLink}>
              <ExternalLink size={12} /> View original document
            </a>
          )}

          {error && <div style={s.errBanner}><AlertCircle size={13} />{error}</div>}

          <div>
            <p style={s.sectionLabel}>Signatures {data ? `(${data.signatures.length})` : ""}</p>
            {loading ? (
              <p style={s.muted}>Loading…</p>
            ) : data && data.signatures.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.signatures.map((sig) => (
                  <div key={sig.id} style={s.sigRow}>
                    {sig.signatureImage ? (
                      <img src={sig.signatureImage} alt={sig.signerName} style={s.sigImg} />
                    ) : (
                      <span style={s.sigTyped}>{sig.typedName || sig.signerName}</span>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={s.sigName}>{sig.signerName}{sig.signerTitle ? ` — ${sig.signerTitle}` : ""}</p>
                      <p style={s.sigDate}>{fmtDate(sig.signedAt)}</p>
                    </div>
                    <CheckCircle2 size={15} color="#16a34a" />
                  </div>
                ))}
              </div>
            ) : (
              <p style={s.muted}>Nobody has signed this document yet.</p>
            )}
          </div>

          {data && !data.signedByMe && (
            <div>
              <p style={s.sectionLabel}>Add your signature</p>
              <SignaturePad value={pad} onChange={setPad} disabled={signing} />
            </div>
          )}
          {data?.signedByMe && (
            <div style={s.signedBanner}>
              <CheckCircle2 size={14} color="#16a34a" /> You have already signed this document.
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.downloadBtn} onClick={handleDownload} disabled={downloading || !data?.signatures.length}>
            <Download size={14} /> {downloading ? "Preparing…" : "Download signed PDF"}
          </button>
          {data && !data.signedByMe && (
            <button style={{ ...s.signBtn, opacity: signing ? 0.7 : 1 }} onClick={handleSign} disabled={signing}>
              <FileSignature size={14} /> {signing ? "Signing…" : "Sign Document"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  modal: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "flex-start", flexShrink: 0 },
  headerIcon: { width: 38, height: 38, borderRadius: 10, background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#94a3b8" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", flexShrink: 0 },
  body: { padding: "18px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 },
  viewLink: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#1e3a8a", fontWeight: 600, textDecoration: "none", width: "fit-content" },
  sectionLabel: { fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" },
  muted: { fontSize: 13, color: "#94a3b8", margin: 0 },
  sigRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, border: "1px solid #f1f5f9", background: "#f8fafc" },
  sigImg: { height: 32, maxWidth: 110, objectFit: "contain", flexShrink: 0 },
  sigTyped: { fontFamily: "'Brush Script MT', cursive", fontSize: 18, color: "#0f172a", flexShrink: 0, minWidth: 70 },
  sigName: { margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" },
  sigDate: { margin: "2px 0 0", fontSize: 11.5, color: "#94a3b8" },
  signedBanner: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13, color: "#15803d" },
  errBanner: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#b91c1c" },
  footer: { padding: "14px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, background: "#fafafa", flexShrink: 0 },
  downloadBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", color: "#374151" },
  signBtn: { display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
};

export default SignDocumentModal;
