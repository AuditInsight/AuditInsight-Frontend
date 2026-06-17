"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { theme } from "@/styles/theme";
import { EvidenceActions } from "./EvidenceActions";

interface Props {
  evidence: Evidence;
  onView: (evidence: Evidence) => void;
  onEdit: (evidence: Evidence) => void;
  onDelete: (evidence: Evidence) => void;
}

export const EvidenceRow = ({
  evidence,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const router = useRouter();

  const goToTransaction = (id?: string | number) => {
    if (!id) return;
    router.push(`/transactions?transactionId=${id}`);
  };

  return (
    <tr style={row}>
      <td style={td}>
        <div style={docCell}>
          {evidence.url && evidence.url !== "#" ? (
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              style={attachmentLink}
              onClick={(e) => e.stopPropagation()}
            >
              {evidence.name || "Untitled"}
            </a>
          ) : (
            <span>{evidence.name || "Untitled"}</span>
          )}
        </div>
      </td>

      <td style={td}>{evidence.category || "—"}</td>

      <td style={td}>
        {evidence.amount != null ? `$${evidence.amount}` : "—"}
      </td>

      <td style={td}>{evidence.counterpartyName || "—"}</td>

      <td style={td}>{evidence.date || "—"}</td>

      <td style={td}>
        <span
          style={link}
          onClick={(e) => {
            e.stopPropagation();
            goToTransaction(evidence.transactionId);
          }}
        >
          {evidence.transactionId ?? "—"}
        </span>
      </td>

      <td style={td}>{evidence.status || "—"}</td>

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

const row: React.CSSProperties = {
  transition: "all 0.2s ease",
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: theme.typography.sm,
  color: theme.colors.textPrimary,
  borderBottom: `1px solid ${theme.colors.border}`,
};

const docCell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const link: React.CSSProperties = {
  color: theme.colors.primary,
  cursor: "pointer",
  fontWeight: 600,
  textDecoration: "underline",
};

const attachmentLink: React.CSSProperties = {
  color: theme.colors.primary,
  cursor: "pointer",
  fontWeight: 600,
  textDecoration: "underline",
};
