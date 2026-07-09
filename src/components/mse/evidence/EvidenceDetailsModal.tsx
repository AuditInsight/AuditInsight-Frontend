"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { statusStyles } from "./EvidenceTable";
import { modalOverlayStyle } from "@/lib/modalOverlay";
import { Download, Eye, X, FileText, ExternalLink } from "lucide-react";

interface Props {
  isOpen: boolean;
  evidence: Evidence | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={detailRow}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value ?? "—"}</span>
    </div>
  );
}

export function EvidenceDetailsModal({ isOpen, evidence, onClose }: Props) {
  const router = useRouter();

  if (!isOpen || !evidence) return null;

  const statusStyle =
    statusStyles[evidence.status as keyof typeof statusStyles] ?? statusStyles.Pending;

  const uploadDate = evidence.uploadedAt ? evidence.uploadedAt.split("T")[0] : "—";

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={docIconWrap}>
              <FileText size={18} color="#1e3a8a" />
            </div>
            <div>
              <h3 style={title}>Evidence Details</h3>
              <p style={titleSub}>{evidence.documentName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={closeBtn} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div style={divider} />

        {/* Body */}
        <div style={body}>
          {/* Status banner */}
          <div style={{ ...statusBanner, background: statusStyle.background }}>
            <span style={{ ...statusDot, background: statusStyle.color }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: statusStyle.color }}>
              {evidence.status ?? "Pending"}
            </span>
            <span style={{ fontSize: 12, color: statusStyle.color, opacity: 0.7, marginLeft: 4 }}>
              verification status
            </span>
          </div>

          {/* Details grid */}
          <div style={grid}>
            <DetailRow label="Evidence ID" value={<code style={codeStyle}>{evidence.id}</code>} />
            <DetailRow label="Category" value={evidence.folder} />
            <DetailRow label="Subcategory" value={evidence.subfolder} />
            <DetailRow label="Amount" value={evidence.amount != null ? `RWF ${evidence.amount.toLocaleString()}` : "—"} />
            <DetailRow label="Counterparty" value={evidence.counterparty} />
            <DetailRow label="Upload Date" value={uploadDate} />
            <DetailRow label="File Type" value={evidence.fileType?.toUpperCase()} />
            <DetailRow label="Uploaded By" value={evidence.uploadedBy} />
            <DetailRow
              label="Linked Transaction"
              value={
                evidence.transactionId ? (
                  <button
                    type="button"
                    style={linkBtn}
                    onClick={() => { onClose(); router.push(`/transactions?transactionId=${evidence.transactionId}`); }}
                  >
                    {evidence.transactionId} <ExternalLink size={11} />
                  </button>
                ) : "—"
              }
            />
            {evidence.notes && (
              <div style={{ gridColumn: "1 / -1" }}>
                <DetailRow label="Notes" value={evidence.notes} />
              </div>
            )}
          </div>
        </div>

        <div style={divider} />

        {/* Footer */}
        <div style={footer}>
          <button
            type="button"
            onClick={() => evidence.fileUpload && window.open(evidence.fileUpload, "_blank")}
            style={outlineBtn}
          >
            <Eye size={13} /> Preview
          </button>
          <button
            type="button"
            onClick={() => {
              if (!evidence.fileUpload) return;
              const a = document.createElement("a");
              a.href = evidence.fileUpload;
              a.download = evidence.documentName;
              a.target = "_blank";
              a.click();
            }}
            style={downloadBtn}
          >
            <Download size={13} /> Download
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
  width: 540,
  maxWidth: "94%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
  border: `1px solid ${theme.colors.border}`,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "20px 24px 16px",
};

const docIconWrap: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 11,
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: theme.colors.textPrimary,
};

const titleSub: React.CSSProperties = {
  margin: "2px 0 0",
  fontSize: 12,
  color: theme.colors.textMuted,
  maxWidth: 340,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "#f1f5f9",
  borderRadius: 8,
  width: 30,
  height: 30,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.textSecondary,
  flexShrink: 0,
};

const divider: React.CSSProperties = {
  height: 1,
  background: theme.colors.border,
};

const body: React.CSSProperties = {
  padding: "16px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const statusBanner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 10,
};

const statusDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  flexShrink: 0,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px 16px",
};

const detailRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: theme.colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const valueStyle: React.CSSProperties = {
  fontSize: 13,
  color: theme.colors.textPrimary,
  fontWeight: 500,
};

const codeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 11.5,
  background: "#f1f5f9",
  padding: "2px 6px",
  borderRadius: 5,
  color: "#475569",
};

const linkBtn: React.CSSProperties = {
  border: "none",
  background: "none",
  padding: 0,
  color: "#1e3a8a",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const footer: React.CSSProperties = {
  padding: "14px 24px",
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
};

const outlineBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 9,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.textPrimary,
};

const downloadBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 16px",
  borderRadius: 9,
  border: "none",
  background: "#1e3a8a",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const closeButton: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 9,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  color: theme.colors.textSecondary,
};
