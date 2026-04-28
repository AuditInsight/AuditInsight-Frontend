"use client";

import { Evidence } from "@/types/evidence.types";
import { Badge } from "@/components/ui/badge/badge";
import { FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { theme } from "@/styles/theme"; // ✅ ADDED

interface Props {
  evidence: Evidence;
  onOpenTransaction: (id: number) => void;
}

export const EvidenceRow = ({ evidence, onOpenTransaction }: Props) => {
  const [hover, setHover] = useState(false);

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
      {/* 📄 DOCUMENT */}
      <td style={td}>
        <div style={docCell}>
          <FileText size={16} color={theme.colors.textMuted} />
          <span>{evidence.name}</span>
        </div>
      </td>

      {/* CATEGORY */}
      <td style={td}>{evidence.category}</td>

      {/* AMOUNT */}
      <td style={td}>
        {evidence.amount ? `$${evidence.amount}` : "-"}
      </td>

      {/* DATE */}
      <td style={td}>{evidence.date}</td>

      {/* 🔗 LINKED TRANSACTION */}
      <td style={td}>
        <span
          style={link}
          onClick={(e) => {
  e.stopPropagation();

  if (!evidence.transactionId) return;

  onOpenTransaction(evidence.transactionId);
}}
        >
          {evidence.transactionId}
        </span>
      </td>

      {/* STATUS */}
      <td style={td}>
        <Badge
          label={evidence.status}
          variant={
            evidence.status === "Missing"
              ? "danger"
              : evidence.status === "Pending"
              ? "warning"
              : "success"
          }
        />
      </td>

      {/* 🤖 AI FLAG */}
      <td style={td}>
        {evidence.status === "Missing" && (
          <div style={risk}>
            <AlertTriangle size={14} />
            Risk detected
          </div>
        )}
      </td>
    </tr>
  );
};

/* 🎨 STYLES */

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
  alignItems: "center",
  gap: 8,
};

const link: React.CSSProperties = {
  color: theme.colors.primary,
  cursor: "pointer",
  fontWeight: 500,
};

const risk: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: theme.colors.danger,
  fontSize: 12,
  fontWeight: 500,
};