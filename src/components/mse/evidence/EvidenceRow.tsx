"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { EvidenceActions } from "./EvidenceActions";
import { Paperclip } from "lucide-react";

interface Props {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  onEdit?: (evidence: Evidence) => void;
  onDelete?: (evidence: Evidence) => void;
}

export const EvidenceRow = ({
  evidence,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const router = useRouter();

  const goToTransaction = (id?: string) => {
    if (!id) return;
    router.push(`/transactions?transactionId=${id}`);
  };

  const uploadDate = evidence.uploadedAt
    ? evidence.uploadedAt.split("T")[0]
    : "—";

  return (
    <tr style={row}>
      <td style={td}>
        <div style={docCell}>
          <button
            type="button"
            style={attachmentLink}
            onClick={(e) => { e.stopPropagation(); onView(evidence); }}
          >
            {evidence.documentName}
          </button>
        </div>
      </td>

      <td style={td}>{evidence.folder || "—"}</td>

      <td style={td}>
        {evidence.amount != null ? `RWF ${evidence.amount.toLocaleString()}` : "—"}
      </td>

      <td style={td}>{evidence.counterparty || "—"}</td>

      <td style={td}>{uploadDate}</td>

      <td style={td}>
        <span
          style={link}
          onClick={(e) => {
            e.stopPropagation();
            goToTransaction(evidence.transactionId);
          }}
        >
          {evidence.transactionId}
        </span>
      </td>

      <td style={td}>
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: evidence.status === "Verified" ? "#dcfce7" : "#fef3c7",
          color: evidence.status === "Verified" ? "#15803d" : "#d97706",
        }}>
          {evidence.status ?? "Pending"}
        </span>
      </td>

      <td style={td}>
        <EvidenceActions
          evidence={evidence}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

const row: React.CSSProperties = { transition: "all 0.2s ease" };
const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: theme.typography.sm,
  color: theme.colors.textPrimary,
  borderBottom: `1px solid ${theme.colors.border}`,
};
const docCell: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const link: React.CSSProperties = {
  color: theme.colors.primary, cursor: "pointer", fontWeight: 600, textDecoration: "underline",
};
const attachmentLink: React.CSSProperties = {
  border: "none", background: "none", padding: 0,
  color: theme.colors.primary, cursor: "pointer", fontWeight: 600, textDecoration: "underline",
  fontSize: theme.typography.sm, textAlign: "left",
};


