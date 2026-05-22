"use client";

import { useRouter } from "next/navigation";
import { Evidence } from "@/types/evidence.types";
import { useState } from "react";
import { theme } from "@/styles/theme";

interface Props {
  evidence: Evidence;
}

export const EvidenceRow = ({ evidence }: Props) => {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const goToTransaction = (id?: number) => {
    if (!id) return;

    router.push(`/transactions?transactionId=${id}`);
  };

  return (
    <tr
      style={{
        ...row,
        background: hover
          ? theme.colors.appBackground
          : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* DOCUMENT */}
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
              {evidence.name|| "Untitled"}
            </a>
          ) : (
            <span>{evidence.name || "Untitled"}</span>
          )}
        </div>
      </td>

      {/* CATEGORY */}
      <td style={td}>
        {evidence.category || "-"}
      </td>

      {/* AMOUNT */}
      <td style={td}>
        {evidence.amount
          ? `$${evidence.amount}`
          : "-"}
      </td>

      {/* COUNTERPARTY */}
      <td style={td}>
        {evidence.counterpartyName || "-"}
      </td>

      {/* DATE */}
      <td style={td}>
        {evidence.date || "-"}
      </td>

      {/* LINKED TRANSACTION */}
      <td style={td}>
        <span
          style={link}
          onClick={(e) => {
            e.stopPropagation();

            goToTransaction(
              evidence.transactionId
            );
          }}
        >
          {evidence.transactionId ?? "—"}
        </span>
      </td>

      {/* STATUS */}
      <td style={td}>
        {evidence.status || "-"}
      </td>

      {/* AI FLAGS */}
      <td style={td}></td>
    </tr>
  );
};

/* =========================
   STYLES
========================= */

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