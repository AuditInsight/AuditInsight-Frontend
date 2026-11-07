"use client";

import { useEffect, useState, useCallback } from "react";
import { X, FileSignature, Download, AlertCircle, CheckCircle2, ExternalLink, Eye, Info } from "lucide-react";
import { modalOverlayStyle } from "@/lib/modalOverlay";
import { Evidence } from "@/types/evidence.types";
import {
  getEvidenceSignatures,
  signEvidence,
  type EvidenceSignaturesResponse,
} from "@/utils/api";
import { SignaturePad, EMPTY_SIGNATURE, type SignaturePadValue } from "./SignaturePad";
import { useEvidenceDocumentAccess, isStampable, signErrorMessage, CERTIFICATE_NOTE } from "./documentAccess";
import { SignedDocumentPreviewModal } from "./SignedDocumentPreviewModal";

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
  const [pad, setPad] = useState<SignaturePadValue>(EMPTY_SIGNATURE);
  const docs = useEvidenceDocumentAccess();

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
  // Use the freshly loaded signature list rather than the (possibly stale) count on the evidence row,
  // so the signed version is offered straight after signing here.
  const signatureCount = data?.signatures.length ?? evidence.signatureCount ?? 0;
  const liveDoc = { ...evidence, signatureCount };
  const certificate = !isStampable(evidence.fileType);
  const signedName = certificate ? "signature certificate" : "signed PDF";

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
      setError(`Your signature wasn't saved: ${signErrorMessage(err)}`);
    } finally {
      setSigning(false);
    }
  };

  const downloading = docs.busyId === evidence.id;

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
          <div style={s.linkRow}>
            {signatureCount > 0 && (
              <button type="button" style={s.previewBtn} onClick={() => docs.previewDocument(liveDoc)} disabled={downloading}>
                <Eye size={13} /> {downloading ? "Preparing…" : `Preview ${signedName}`}
              </button>
            )}
            {evidence.fileUpload && (
              <a href={evidence.fileUpload} target="_blank" rel="noopener noreferrer" style={s.viewLink}>
                <ExternalLink size={12} /> {signatureCount > 0 ? "View original (unsigned) file" : "View document"}
              </a>
            )}
          </div>
          {docs.versionLabelFor(evidence.id) && <p style={s.versionLine}>{docs.versionLabelFor(evidence.id)}</p>}

          {certificate && (
            <div style={s.infoBanner}><Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />{CERTIFICATE_NOTE}</div>
          )}

          {error && <div style={s.errBanner}><AlertCircle size={13} />{error}</div>}
          {docs.error && <div style={s.errBanner}><AlertCircle size={13} />{docs.error}</div>}

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
          <button style={s.downloadBtn} onClick={() => docs.downloadDocument(liveDoc)} disabled={downloading || signatureCount === 0}>
            <Download size={14} /> {downloading ? "Preparing…" : `Download ${signedName}`}
          </button>
          {data && !data.signedByMe && (
            <button style={{ ...s.signBtn, opacity: signing ? 0.7 : 1 }} onClick={handleSign} disabled={signing}>
              <FileSignature size={14} /> {signing ? "Signing…" : "Sign Document"}
            </button>
          )}
        </div>
      </div>
      <SignedDocumentPreviewModal url={docs.preview?.url ?? null} title={docs.preview?.title ?? ""} subtitle={docs.preview?.subtitle} onClose={docs.closePreview} />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  linkRow: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  versionLine: { margin: "-8px 0 0", fontSize: 11.5, color: "#64748b", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  previewBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#1e3a8a", cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "inherit" },
  infoBanner: { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, fontSize: 12.5, color: "#1e3a8a", lineHeight: 1.45 },
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
