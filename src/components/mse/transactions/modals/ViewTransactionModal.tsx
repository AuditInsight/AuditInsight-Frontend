"use client";

import { TransactionWithMeta } from "@/hooks/useTransactions";
import { Evidence } from "@/types/evidence.types";
import { X, Download, Eye, Paperclip, FileText } from "lucide-react";

interface Props {
  transaction: TransactionWithMeta | null;
  evidence: Evidence[];
  onClose: () => void;
}

export default function ViewTransactionModal({ transaction, evidence, onClose }: Props) {
  if (!transaction) return null;

  const linked = evidence.filter((e) => e.transactionId === transaction.id);

  const handleDownload = (e: Evidence) => {
    const a = document.createElement("a");
    a.href = e.fileUpload;
    a.download = e.documentName;
    a.target = "_blank";
    a.click();
  };

  const handlePreview = (e: Evidence) => {
    window.open(e.fileUpload, "_blank");
  };

  return (
    // Overlay — z-index 9000 ensures it always appears above navbar (z-index 100)
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modal} onClick={(ev) => ev.stopPropagation()}>
        {/* Header */}
        <div style={header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={idChip}>{transaction.id}</span>
              <span style={{
                ...statusChip,
                background: transaction.status === "COMPLETED" ? "#dcfce7" : "#fef9c3",
                color: transaction.status === "COMPLETED" ? "#15803d" : "#92400e",
              }}>
                {transaction.status}
              </span>
              {transaction.isDuplicate && (
                <span style={dupeChip}>⚠ Possible Duplicate</span>
              )}
            </div>
            <h2 style={title}>{transaction.name}</h2>
          </div>
          <button style={closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Transaction details grid */}
        <div style={detailsGrid}>
          {[
            { label: "Counterparty", value: transaction.counterparty },
            { label: "Date",         value: transaction.date },
            { label: "Amount",       value: `RWF ${transaction.amount.toLocaleString()}` },
            { label: "Type",         value: transaction.type },
            { label: "Payment",      value: transaction.paymentMethod },
            { label: "Created by",   value: transaction.createdBy ?? "—" },
          ].map((f) => (
            <div key={f.label} style={detailItem}>
              <span style={detailLabel}>{f.label}</span>
              <span style={detailValue}>{f.value}</span>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div style={notesBanner}>
            <span style={{ fontWeight: 600 }}>Note: </span>{transaction.notes}
          </div>
        )}

        {/* Evidence section */}
        <div style={evidenceSection}>
          <div style={evidenceHeader}>
            <Paperclip size={16} color="#2563eb" />
            <span style={evidenceTitle}>
              Attached Evidence ({linked.length} {linked.length === 1 ? "file" : "files"})
            </span>
          </div>

          {linked.length === 0 ? (
            <div style={noEvidence}>
              <FileText size={28} color="#cbd5e1" />
              <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 13 }}>
                No evidence files attached to this transaction.
              </p>
            </div>
          ) : (
            <div style={evidenceList}>
              {linked.map((ev) => (
                <div key={ev.id} style={evidenceRow}>
                  <div style={evidenceInfo}>
                    <div style={evidenceIcon}>
                      <FileText size={14} color="#2563eb" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{ev.documentName}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                        {ev.folder} › {ev.subfolder} • {ev.fileType.toUpperCase()} • {ev.uploadedAt?.split("T")[0]}
                      </div>
                      {ev.status && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 10,
                          background: ev.status === "Verified" ? "#dcfce7" : "#fef9c3",
                          color: ev.status === "Verified" ? "#15803d" : "#92400e",
                          marginTop: 4,
                          display: "inline-block",
                        }}>
                          {ev.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={previewBtn} onClick={() => handlePreview(ev)} title="Preview">
                      <Eye size={13} /> Preview
                    </button>
                    <button style={downloadBtn} onClick={() => handleDownload(ev)} title="Download">
                      <Download size={13} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { modalOverlayStyle } from "@/lib/modalOverlay";

const modal: React.CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  width: "100%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "24px 24px 16px",
  borderBottom: "1px solid #f1f5f9",
  position: "sticky",
  top: 0,
  background: "#fff",
  zIndex: 1,
};

const title: React.CSSProperties = { margin: "8px 0 0", fontSize: 20, fontWeight: 700, color: "#0f172a" };
const idChip: React.CSSProperties = { fontFamily: "monospace", fontSize: 12, background: "#f1f5f9", padding: "3px 9px", borderRadius: 6, fontWeight: 600, color: "#475569" };
const statusChip: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 };
const dupeChip: React.CSSProperties = { padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#fef3c7", color: "#92400e" };
const closeBtn: React.CSSProperties = { width: 34, height: 34, borderRadius: 9, border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 };

const detailsGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 24px" };
const detailItem: React.CSSProperties = { background: "#f8fafc", borderRadius: 10, padding: "10px 14px" };
const detailLabel: React.CSSProperties = { display: "block", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 };
const detailValue: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "#0f172a" };

const notesBanner: React.CSSProperties = { margin: "0 24px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#92400e" };

const evidenceSection: React.CSSProperties = { padding: "0 24px 24px" };
const evidenceHeader: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 };
const evidenceTitle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: "#0f172a" };
const noEvidence: React.CSSProperties = { textAlign: "center", padding: "32px 0", background: "#f8fafc", borderRadius: 12, border: "1px dashed #e2e8f0" };
const evidenceList: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };
const evidenceRow: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #e2e8f0", gap: 12 };
const evidenceInfo: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 };
const evidenceIcon: React.CSSProperties = { width: 36, height: 36, borderRadius: 9, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const previewBtn: React.CSSProperties = { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" };
const downloadBtn: React.CSSProperties = { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" };


