"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { EvidenceActions } from "./EvidenceActions";
import { FileText } from "lucide-react";

interface Props {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  onEdit?: (evidence: Evidence) => void;
  onDelete?: (evidence: Evidence) => void;
  isEven?: boolean;
}

export const EvidenceRow = ({ evidence, onView, onEdit, onDelete, isEven }: Props) => {
  const router = useRouter();

  const uploadDate = evidence.uploadedAt ? evidence.uploadedAt.split("T")[0] : "—";

  return (
    <tr
      style={{ background: isEven ? "#fff" : "#fafbfc", transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f7ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = isEven ? "#fff" : "#fafbfc")}
    >
      {/* Document */}
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={fileIcon}>
            <FileText size={13} color="#1e3a8a" />
          </div>
          <button type="button" style={docLink} onClick={(e) => { e.stopPropagation(); onView(evidence); }}>
            {evidence.documentName}
          </button>
        </div>
      </td>

      {/* Category */}
      <td style={td}>
        <span style={categoryPill}>{evidence.folder || "—"}</span>
      </td>

      {/* Amount */}
      <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>
        {evidence.amount != null ? (
          <span style={{ fontWeight: 600, color: theme.colors.textPrimary }}>
            RWF {evidence.amount.toLocaleString()}
          </span>
        ) : "—"}
      </td>

      {/* Counterparty */}
      <td style={td}>{evidence.counterparty || "—"}</td>

      {/* Date */}
      <td style={{ ...td, color: theme.colors.textSecondary }}>{uploadDate}</td>

      {/* Linked Transaction */}
      <td style={td}>
        {evidence.transactionId ? (
          <button
            type="button"
            style={txLink}
            onClick={(e) => { e.stopPropagation(); router.push(`/transactions?transactionId=${evidence.transactionId}`); }}
          >
            {evidence.transactionId}
          </button>
        ) : "—"}
      </td>

      {/* Actions */}
      <td style={td}>
        <EvidenceActions evidence={evidence} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
};

const td: React.CSSProperties = {
  padding: "11px 16px",
  fontSize: 13,
  color: theme.colors.textPrimary,
  borderBottom: `1px solid ${theme.colors.border}`,
  verticalAlign: "middle",
};

const fileIcon: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 7,
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const docLink: React.CSSProperties = {
  border: "none",
  background: "none",
  padding: 0,
  color: "#1e3a8a",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  textAlign: "left",
  textDecoration: "none",
  maxWidth: 200,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
};

const categoryPill: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 6,
  background: "#f1f5f9",
  color: theme.colors.textSecondary,
  fontSize: 11.5,
  fontWeight: 500,
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const txLink: React.CSSProperties = {
  border: "none",
  background: "none",
  padding: 0,
  color: theme.colors.primary,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  textDecoration: "underline",
  textDecorationStyle: "dotted",
};
