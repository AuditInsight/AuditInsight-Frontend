"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { statusStyles } from "./EvidenceTable";
import { modalOverlayStyle } from "@/lib/modalOverlay";
import { Download, Eye, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  evidence: Evidence | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value ?? "—"}</span>
    </div>
  );
}

export function EvidenceDetailsModal({ isOpen, evidence, onClose }: Props) {
  const router = useRouter();

  if (!isOpen || !evidence) return null;

  const statusStyle =
    statusStyles[evidence.status as keyof typeof statusStyles] ??
    statusStyles.Pending;

  const handlePreview = () => {
    if (evidence.fileUpload) window.open(evidence.fileUpload, "_blank");
  };

  const handleDownload = () => {
    if (!evidence.fileUpload) return;
    const a = document.createElement("a");
    a.href = evidence.fileUpload;
    a.download = evidence.documentName;
    a.target = "_blank";
    a.click();
  };

  const uploadDate = evidence.uploadedAt
    ? evidence.uploadedAt.split("T")[0]
    : "—";

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h3 style={title}>Evidence Details</h3>
          <button type="button" onClick={onClose} style={closeBtn} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={body}>
          <DetailRow label="Evidence ID" value={evidence.id} />
          <DetailRow label="Document" value={evidence.documentName} />
          <DetailRow
            label="Verification"
            value={
              <span style={{ ...badge, ...statusStyle }}>
                {evidence.status ?? "Pending"}
              </span>
            }
          />
          <DetailRow label="Category" value={evidence.folder} />
          <DetailRow label="Subcategory" value={evidence.subfolder} />
          <DetailRow
            label="Amount"
            value={
              evidence.amount != null
                ? `RWF ${evidence.amount.toLocaleString()}`
                : "—"
            }
          />
          <DetailRow label="Counterparty" value={evidence.counterparty} />
          <DetailRow label="Upload Date" value={uploadDate} />
          <DetailRow label="File Type" value={evidence.fileType?.toUpperCase()} />
          <DetailRow
            label="Linked Transaction"
            value={
              evidence.transactionId ? (
                <button
                  type="button"
                  style={linkBtn}
                  onClick={() => {
                    onClose();
                    router.push(`/transactions?transactionId=${evidence.transactionId}`);
                  }}
                >
                  {evidence.transactionId}
                </button>
              ) : (
                "—"
              )
            }
          />
          <DetailRow label="Uploaded By" value={evidence.uploadedBy} />
          <DetailRow label="Notes" value={evidence.notes || "—"} />
        </div>

        <div style={footer}>
          <button type="button" onClick={handlePreview} style={previewBtn}>
            <Eye size={14} /> Preview
          </button>
          <button type="button" onClick={handleDownload} style={downloadBtn}>
            <Download size={14} /> Download
          </button>
          <button type="button" onClick={onClose} style={closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const modal: React.CSSProperties = {
  width: 520,
  maxWidth: "92%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: theme.colors.Surface,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadows.lg,
  border: `1px solid ${theme.colors.border}`,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing.md,
};

const title: React.CSSProperties = { margin: 0, fontSize: theme.typography.lg, fontWeight: 600 };
const closeBtn: React.CSSProperties = {
  border: "none", background: "#f1f5f9", borderRadius: 8, width: 32, height: 32,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  color: theme.colors.textSecondary,
};

const body: React.CSSProperties = { display: "flex", flexDirection: "column", gap: theme.spacing.sm };
const row: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "140px 1fr", gap: theme.spacing.sm, alignItems: "start",
};
const labelStyle: React.CSSProperties = { fontSize: theme.typography.sm, color: theme.colors.textMuted, fontWeight: 500 };
const valueStyle: React.CSSProperties = { fontSize: theme.typography.sm, color: theme.colors.textPrimary };
const badge: React.CSSProperties = {
  display: "inline-block", padding: "4px 10px", borderRadius: theme.radius.sm, fontSize: 12, fontWeight: 600,
};
const linkBtn: React.CSSProperties = {
  border: "none", background: "none", padding: 0, color: theme.colors.primary,
  textDecoration: "underline", cursor: "pointer", fontSize: theme.typography.sm,
};

const footer: React.CSSProperties = {
  marginTop: theme.spacing.lg, display: "flex", justifyContent: "flex-end", gap: 8,
};
const previewBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
  borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}`,
  background: theme.colors.Surface, cursor: "pointer", fontSize: 13, fontWeight: 600,
};
const downloadBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
  borderRadius: theme.radius.md, border: "none", background: "#1e3a8a",
  color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
};
const closeButton: React.CSSProperties = {
  padding: "8px 16px", borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`, background: theme.colors.Surface, cursor: "pointer",
};


